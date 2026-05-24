// src/app/leave/page.tsx
import { getLeaveRequestsAction, getLeaveBalance } from '@/actions/leave';
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { LeaveClientPage } from './LeaveClientPage';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function LeavePage({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const currentUserId = session.user.id;
  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  const isManagerOrAdmin = ['ADMIN', 'MANAGER'].includes(userRole);

  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || 'ALL';
  const page = parseInt(params.page || '1', 10);

  // Fetch Leave Requests (handles scoping inside action)
  const { leaveRequests = [], totalCount = 0, totalPages = 1 } = await getLeaveRequestsAction(
    search,
    status,
    page
  );

  // Fetch User's Leave Balance for current year
  const year = new Date().getFullYear();
  const { balance } = await getLeaveBalance(currentUserId, year);

  const defaultBalance = balance || {
    annualEntitled: 20,
    annualUsed: 0,
    sickUsed: 0,
    year,
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <LeaveClientPage
        leaveRequests={leaveRequests as any}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        currentUserId={currentUserId}
        isManagerOrAdmin={isManagerOrAdmin}
        balance={defaultBalance}
      />
    </DashboardLayout>
  );
}
