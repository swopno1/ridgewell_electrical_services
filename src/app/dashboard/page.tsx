// src/app/dashboard/page.tsx
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { startOfWeek, endOfWeek, format, startOfToday, startOfMonth, endOfMonth } from 'date-fns';
import { DashboardClientPage } from './DashboardClientPage';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const currentUserId = session.user.id;
  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  const isManagerOrAdmin = ['ADMIN', 'MANAGER'].includes(userRole);

  // 1. Setup Dates
  const today = startOfToday();
  const startW = startOfWeek(today, { weekStartsOn: 1 });
  const endW = endOfWeek(today, { weekStartsOn: 1 });
  const startM = startOfMonth(today);
  const endM = endOfMonth(today);

  // 2. Fetch Base Metrics & Data
  const currentYear = new Date().getFullYear();
  const [
    totalEmployees,
    activeProjects,
    pendingTimesheetsCount,
    pendingLeaveRequestsCount,
    weeklyTimesheets,
    leaveBalance,
  ] = await Promise.all([
    ['ADMIN', 'MANAGER'].includes(userRole) ? prisma.user.count({ where: { active: true } }) : Promise.resolve(0),
    prisma.project.count({ where: { active: true } }),
    isManagerOrAdmin
      ? prisma.timesheet.count({ where: { status: 'PENDING' } })
      : prisma.timesheet.count({ where: { userId: currentUserId, status: 'PENDING' } }),
    isManagerOrAdmin
      ? prisma.leaveRequest.count({ where: { status: 'PENDING' } })
      : prisma.leaveRequest.count({ where: { userId: currentUserId, status: 'PENDING' } }),
    prisma.timesheet.findMany({
      where: {
        userId: userRole === 'EMPLOYEE' ? currentUserId : undefined,
        date: { gte: startW, lte: endW },
      },
      select: { date: true, totalHours: true },
    }),
    prisma.leaveBalance.findUnique({
      where: { userId_year: { userId: currentUserId, year: currentYear } },
    }),
  ]);

  // 3. Process Weekly Activity
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dailyHoursMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };
  
  weeklyTimesheets.forEach((entry: { date: Date; totalHours: number }) => {
    const dayName = format(entry.date, 'EEE');
    if (dayName in dailyHoursMap) {
      dailyHoursMap[dayName] += entry.totalHours;
    }
  });

  const weeklyActivity = daysOfWeek.map((day) => ({
    day,
    hours: dailyHoursMap[day] || 0,
  }));

  const weekHoursSum = weeklyTimesheets.reduce((acc: number, entry: any) => acc + entry.totalHours, 0);

  // 4. Fetch Recent Timesheets (Last 10)
  const recentTimesheets = await prisma.timesheet.findMany({
    where: isManagerOrAdmin ? {} : { userId: currentUserId },
    orderBy: { date: 'desc' },
    take: 10,
    include: { project: true, user: true },
  });

  const recentEntriesParsed = recentTimesheets.map((e: any) => ({
    id: e.id,
    date: format(e.date, 'MMM dd, yyyy'),
    project: e.project.name,
    employeeName: e.user.name,
    hours: `${e.totalHours.toFixed(1)}h`,
    status: e.status as 'PENDING' | 'APPROVED' | 'REJECTED',
    statusColor: e.status === 'APPROVED'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
      : e.status === 'PENDING'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
      : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  }));

  // 5. Setup Leave Balance Data
  const leaveBalanceData = {
    annualEntitled: leaveBalance?.annualEntitled ?? 20,
    annualUsed: leaveBalance?.annualUsed ?? 0,
    sickUsed: leaveBalance?.sickUsed ?? 0,
    year: currentYear,
  };

  const remainingLeave = Math.max(0, leaveBalanceData.annualEntitled - leaveBalanceData.annualUsed);

  // 6. Calculate pending approvals count
  const pendingApprovalsCount = pendingTimesheetsCount + pendingLeaveRequestsCount;

  // 7. Fetch additional data for Employee Dashboard if needed
  let employeeData: {
    monthHours: number;
    pendingLeaveRequests: Array<{
      id: string;
      startDate: string;
      endDate: string;
      totalDays: number;
      leaveType: string;
      status: string;
    }>;
    upcomingLeave: Array<{
      id: string;
      startDate: string;
      endDate: string;
      totalDays: number;
      leaveType: string;
    }>;
  } | null = null;

  if (userRole === 'EMPLOYEE') {
    const [monthTimesheets, pendingRequests, upcomingLeave] = await Promise.all([
      prisma.timesheet.aggregate({
        where: {
          userId: currentUserId,
          date: { gte: startM, lte: endM }
        },
        _sum: { totalHours: true }
      }),
      prisma.leaveRequest.findMany({
        where: { userId: currentUserId, status: 'PENDING' },
        orderBy: { startDate: 'asc' },
        take: 3
      }),
      prisma.leaveRequest.findMany({
        where: {
          userId: currentUserId,
          status: 'APPROVED',
          startDate: { gte: today }
        },
        orderBy: { startDate: 'asc' },
        take: 3
      })
    ]);

    employeeData = {
      monthHours: monthTimesheets._sum.totalHours || 0,
      pendingLeaveRequests: pendingRequests.map((r: any) => ({
        id: r.id,
        startDate: format(r.startDate, 'MMM dd'),
        endDate: format(r.endDate, 'MMM dd'),
        totalDays: r.totalDays,
        leaveType: r.leaveType,
        status: r.status
      })),
      upcomingLeave: upcomingLeave.map((r: any) => ({
        id: r.id,
        startDate: format(r.startDate, 'MMM dd'),
        endDate: format(r.endDate, 'MMM dd'),
        totalDays: r.totalDays,
        leaveType: r.leaveType
      }))
    };
  }

  // 8. Format Stats array to pass down to Client
  const stats = [
    {
      title: 'Hours This Week',
      value: `${weekHoursSum.toFixed(1)}h`,
      description: 'Standard: 40h',
      iconType: 'Clock' as const,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovalsCount.toString(),
      description: isManagerOrAdmin
        ? 'Pending timesheets & leave'
        : 'Your pending submissions',
      iconType: 'AlertCircle' as const,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Active Projects',
      value: activeProjects.toString(),
      description: 'Jobs currently tracking',
      iconType: 'Briefcase' as const,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    isManagerOrAdmin
      ? {
          title: 'Total Employees',
          value: totalEmployees.toString(),
          description: 'Active personnel in system',
          iconType: 'Calendar' as const,
          color: 'text-violet-650 dark:text-violet-400',
          bgColor: 'bg-violet-50 dark:bg-violet-955/30',
        }
      : {
          title: 'Leave Balance',
          value: `${remainingLeave.toFixed(1)} days`,
          description: 'Remaining annual leave',
          iconType: 'Calendar' as const,
          color: 'text-violet-650 dark:text-violet-400',
          bgColor: 'bg-violet-50 dark:bg-violet-955/30',
        },
  ];

  return (
    <DashboardClientPage
      user={{ name: session.user.name || 'User', role: userRole, email: session.user.email || '' }}
      stats={stats}
      recentEntries={recentEntriesParsed}
      weeklyActivity={weeklyActivity}
      leaveBalance={leaveBalanceData}
      employeeData={employeeData}
    />
  );
}
