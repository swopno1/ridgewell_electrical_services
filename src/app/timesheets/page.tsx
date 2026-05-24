// src/app/timesheets/page.tsx
import { getTimesheetsAction } from '@/actions/timesheet';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { TimesheetClientPage } from './TimesheetClientPage';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function TimesheetsPage({ searchParams }: PageProps) {
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

  // Fetch timesheets list
  const { timesheets = [], totalCount = 0, totalPages = 1 } = await getTimesheetsAction(
    search,
    status,
    page
  );

  // Fetch aggregate counts and stats
  const statsWhere: any = {};
  if (!isManagerOrAdmin) {
    statsWhere.userId = currentUserId;
  }

  const [hoursAggregate, pendingCount, approvedCount] = await Promise.all([
    prisma.timesheet.aggregate({
      where: statsWhere,
      _sum: {
        totalHours: true,
      },
    }),
    prisma.timesheet.count({
      where: {
        ...statsWhere,
        status: 'PENDING',
      },
    }),
    prisma.timesheet.count({
      where: {
        ...statsWhere,
        status: 'APPROVED',
      },
    }),
  ]);

  const stats = {
    totalHours: hoursAggregate._sum.totalHours || 0,
    pendingCount,
    approvedCount,
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <TimesheetClientPage
        timesheets={timesheets as any}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        currentUserId={currentUserId}
        isManagerOrAdmin={isManagerOrAdmin}
        stats={stats}
      />
    </DashboardLayout>
  );
}
