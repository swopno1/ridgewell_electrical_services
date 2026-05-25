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
  const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(userRole);

  // 1. Setup Dates
  const today = startOfToday();
  const startW = startOfWeek(today, { weekStartsOn: 1 });
  const endW = endOfWeek(today, { weekStartsOn: 1 });
  const startM = startOfMonth(today);
  const endM = endOfMonth(today);

  // 2. Fetch Base Metrics
  const [
    totalEmployees,
    activeProjects,
    pendingTimesheetsCount,
    pendingLeaveRequestsCount,
    weeklyTimesheets,
    monthlyTimesheets,
  ] = await Promise.all([
    userRole === 'ADMIN' ? prisma.user.count({ where: { active: true } }) : Promise.resolve(0),
    prisma.project.count({ where: { active: true } }),
    isAdminOrManager
      ? prisma.timesheet.count({ where: { status: 'PENDING' } })
      : prisma.timesheet.count({ where: { userId: currentUserId, status: 'PENDING' } }),
    isAdminOrManager
      ? prisma.leaveRequest.count({ where: { status: 'PENDING' } })
      : prisma.leaveRequest.count({ where: { userId: currentUserId, status: 'PENDING' } }),
    prisma.timesheet.findMany({
      where: {
        userId: userRole === 'EMPLOYEE' ? currentUserId : undefined,
        date: { gte: startW, lte: endW },
      },
      select: { date: true, totalHours: true },
    }),
    prisma.timesheet.findMany({
      where: {
        userId: userRole === 'EMPLOYEE' ? currentUserId : undefined,
        date: { gte: startM, lte: endM },
      },
      select: { totalHours: true, overtimeHours: true, userId: true, projectId: true },
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

  // 4. Calculate total hours logged this week
  const weekHoursSum = weeklyTimesheets.reduce((acc: number, entry: { totalHours: number }) => acc + entry.totalHours, 0);

  // 5. Fetch Recent Timesheets (Last 10)
  const recentTimesheets = await prisma.timesheet.findMany({
    where: isAdminOrManager ? {} : { userId: currentUserId },
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

  // 6. Fetch Recent Leave Requests (Last 5)
  const recentLeaveRequests = await prisma.leaveRequest.findMany({
    where: isAdminOrManager ? {} : { userId: currentUserId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true },
  });

  const leaveBalanceData = {
    annualEntitled: leaveBalance?.annualEntitled ?? 20,
    annualUsed: leaveBalance?.annualUsed ?? 0,
    sickUsed: leaveBalance?.sickUsed ?? 0,
    year: currentYear,
  };

  const remainingLeave = leaveBalanceData.annualEntitled - leaveBalanceData.annualUsed;

  // 7. Query pending approvals count based on role
  let pendingApprovalsCount = 0;
  if (['ADMIN', 'MANAGER'].includes(userRole)) {
    const [pendingTimesheets, pendingLeave] = await Promise.all([
      prisma.timesheet.count({ where: { status: 'PENDING' } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    ]);
    pendingApprovalsCount = pendingTimesheets + pendingLeave;
  } else {
    const [pendingTimesheets, pendingLeave] = await Promise.all([
      prisma.timesheet.count({ where: { userId: currentUserId, status: 'PENDING' } }),
      prisma.leaveRequest.count({ where: { userId: currentUserId, status: 'PENDING' } }),
    ]);

    pendingApprovalsItems = [
      ...pTimesheets.map((t: any) => ({
        id: t.id,
        type: 'TIMESHEET' as const,
        title: t.user.name,
        subtitle: t.project.name,
        value: `${t.totalHours.toFixed(1)}h`,
        date: format(t.date, 'MMM dd'),
        createdAt: t.createdAt,
      })),
      ...pLeave.map((l: any) => ({
        id: l.id,
        type: 'LEAVE' as const,
        title: l.user.name,
        subtitle: l.leaveType.toLowerCase(),
        value: `${l.totalDays} days`,
        date: format(l.startDate, 'MMM dd'),
        createdAt: l.createdAt,
      }))
    ].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
  }

  // 8. Query recent entries
  let recentEntriesParsed: any[] = [];
  if (['ADMIN', 'MANAGER'].includes(userRole)) {
    const entries = await prisma.timesheet.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        project: true,
        user: true,
      },
    });
    recentEntriesParsed = entries.map((e: any) => ({
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
  } else {
    const entries = await prisma.timesheet.findMany({
      where: { userId: currentUserId },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        project: true,
      },
    });
    recentEntriesParsed = entries.map((e: any) => ({
      id: e.id,
      date: format(e.date, 'MMM dd, yyyy'),
      project: e.project.name,
      hours: `${e.totalHours.toFixed(1)}h`,
      status: e.status as 'PENDING' | 'APPROVED' | 'REJECTED',
      statusColor: e.status === 'APPROVED' 
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
        : e.status === 'PENDING'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
        : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    }));
  }

  // 9. Fetch additional data for Employee Dashboard if needed
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
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const [monthTimesheets, pendingRequests, upcomingLeave] = await Promise.all([
      prisma.timesheet.aggregate({
        where: {
          userId: currentUserId,
          date: { gte: monthStart, lte: monthEnd }
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

  // 10. Format Stats array to pass down to Client
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
      description: ['ADMIN', 'MANAGER'].includes(userRole)
        ? 'Pending timesheets & leave'
        : 'Your pending submissions',
      iconType: 'AlertCircle' as const,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Active Projects',
      value: activeProjectsCount.toString(),
      description: 'Jobs currently tracking',
      iconType: 'Briefcase' as const,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Leave Balance',
      value: `${remainingLeave.toFixed(1)} days`,
      description: 'Remaining annual leave',
      iconType: 'Calendar' as const,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ];

  return (
    <DashboardClientPage
      user={{ name: session.user.name || 'User', role: userRole, email: session.user.email || '' }}
      metrics={dashboardMetrics}
      recentEntries={recentEntriesParsed}
      leaveRequests={leaveRequestsParsed}
      pendingApprovals={pendingApprovalsItems}
      weeklyActivity={weeklyActivity}
      leaveBalance={leaveBalanceData}
      employeeData={employeeData}
    />
  );
}
