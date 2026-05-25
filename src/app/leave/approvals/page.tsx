// src/app/leave/approvals/page.tsx
import { getLeaveRequestsAction } from '@/actions/leave';
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ApprovalsClientPage } from './ApprovalsClientPage';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function LeaveApprovalsPage({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const currentUserId = session.user.id;
  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

  if (!['ADMIN', 'MANAGER'].includes(userRole)) {
    redirect('/leave');
  }

  const params = await searchParams;
  const search = params.search || '';
  const page = parseInt(params.page || '1', 10);

  // Fetch only pending requests for the approval queue
  const { leaveRequests = [], totalCount = 0, totalPages = 1 } = await getLeaveRequestsAction(
    search,
    'PENDING',
    page
  );

  // Aggregate pending stats across all pending leave requests (unpaginated)
  const pendingRequests = await prisma.leaveRequest.findMany({
    where: {
      status: 'PENDING',
    },
    select: {
      userId: true,
      totalDays: true,
    },
  });

  const pendingCount = pendingRequests.length;
  const pendingDays = pendingRequests.reduce((sum: number, req: any) => sum + req.totalDays, 0);
  const uniqueUsers = new Set(pendingRequests.map((req: any) => req.userId));
  const submittingEmployees = uniqueUsers.size;

  const stats = {
    pendingCount,
    pendingDays,
    submittingEmployees,
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <ApprovalsClientPage
        leaveRequests={leaveRequests as any}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        currentUserId={currentUserId}
        stats={stats}
      />
    </DashboardLayout>
  );
}
