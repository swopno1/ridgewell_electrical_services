import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Calendar } from '@/components/widgets/Calendar';
import { getTimesheetsByDateRange } from '@/actions/timesheet';
import { getLeaveRequestsByDateRange } from '@/actions/leave';
import { redirect } from 'next/navigation';
import { startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

export default async function CalendarPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

  // We fetch a 3-month window centered on the current month to handle simple navigation
  // though the client component handles its own state, initial data should cover common ranges.
  const today = new Date();
  const rangeStart = startOfMonth(subMonths(today, 1));
  const rangeEnd = endOfMonth(addMonths(today, 1));

  const [timesheetsResult, leaveResult] = await Promise.all([
    getTimesheetsByDateRange(userId, rangeStart, rangeEnd),
    getLeaveRequestsByDateRange(userId, rangeStart, rangeEnd),
  ]);

  const timesheets = timesheetsResult.success ? timesheetsResult.timesheets || [] : [];
  const leaveRequests = leaveResult.success ? leaveResult.leaveRequests || [] : [];

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || 'User'}
      userEmail={session.user.email || ''}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calendar</h1>
          <p className="text-slate-500">Track your time and leave visually.</p>
        </div>

        <Calendar
          timesheets={timesheets as any}
          leaveRequests={leaveRequests as any}
        />
      </div>
    </DashboardLayout>
  );
}
