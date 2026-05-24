// src/app/timesheets/approvals/page.tsx
import { getTimesheetsAction } from '@/actions/timesheet';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ApprovalsClientPage } from './ApprovalsClientPage';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function ApprovalsPage({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const currentUserId = session.user.id;
  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

  // Guard: Only ADMIN or MANAGER roles can access this queue
  if (!['ADMIN', 'MANAGER'].includes(userRole)) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const search = params.search || '';
  const page = parseInt(params.page || '1', 10);

  // Fetch only PENDING timesheets for approval
  const { timesheets = [], totalCount = 0, totalPages = 1 } = await getTimesheetsAction(
    search,
    'PENDING',
    page
  );

  // Fetch pending review counts and stats
  const [hoursAggregate, distinctUsers] = await Promise.all([
    prisma.timesheet.aggregate({
      where: { status: 'PENDING' },
      _sum: {
        totalHours: true,
      },
    }),
    prisma.timesheet.groupBy({
      by: ['userId'],
      where: { status: 'PENDING' },
    }),
  ]);

  const stats = {
    pendingCount: totalCount,
    pendingHours: hoursAggregate._sum.totalHours || 0,
    submittingEmployees: distinctUsers.length,
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <ApprovalsClientPage
        timesheets={timesheets as any}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        currentUserId={currentUserId}
        stats={stats}
      />
    </DashboardLayout>
  );
}
