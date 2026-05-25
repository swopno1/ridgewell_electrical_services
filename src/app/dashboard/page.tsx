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
  weeklyTimesheets.forEach((entry: any) => {
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

  // 4. Process Monthly Data
  const monthHoursSum = monthlyTimesheets.reduce((acc: number, entry: any) => acc + entry.totalHours, 0);
  const monthOvertimeSum = monthlyTimesheets.reduce((acc: number, entry: any) => acc + entry.overtimeHours, 0);

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

  const leaveRequestsParsed = recentLeaveRequests.map((l: any) => ({
    id: l.id,
    employeeName: l.user.name,
    type: l.leaveType,
    startDate: format(l.startDate, 'MMM dd'),
    endDate: format(l.endDate, 'MMM dd'),
    totalDays: l.totalDays,
    status: l.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
  }));

  // 7. Pending Approvals Queue
  let pendingApprovalsItems: any[] = [];
  if (isAdminOrManager) {
    const [pTimesheets, pLeave] = await Promise.all([
      prisma.timesheet.findMany({
        where: { status: 'PENDING' },
        take: 5,
        include: { user: true, project: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leaveRequest.findMany({
        where: { status: 'PENDING' },
        take: 5,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
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

  // 8. Stats for the Metrics Bar
  const dashboardMetrics = {
    totalEmployees,
    activeProjects,
    pendingTimesheets: pendingTimesheetsCount,
    pendingLeaveRequests: pendingLeaveRequestsCount,
    totalHoursWeek: weekHoursSum,
    totalHoursMonth: monthHoursSum,
    overtimeHoursMonth: monthOvertimeSum,
  };

  // 9. Employee with Most Hours (Admin only)
  let topEmployee = { name: 'N/A', hours: 0 };
  if (isAdminOrManager && monthlyTimesheets.length > 0) {
    const userHoursMap: Record<string, number> = {};
    monthlyTimesheets.forEach((t: any) => {
      userHoursMap[t.userId] = (userHoursMap[t.userId] || 0) + t.totalHours;
    });
    const sortedEntries = Object.entries(userHoursMap).sort((a: any, b: any) => b[1] - a[1]);
    if (sortedEntries.length > 0) {
      const [topUserId, hours] = sortedEntries[0];
      const topUserData = await prisma.user.findUnique({ where: { id: topUserId }, select: { name: true } });
      if (topUserData) {
        topEmployee = { name: topUserData.name, hours };
      }
    }
  }

  // 10. Project Summary
  let projectSummary: { name: string, hours: number }[] = [];
  if (monthlyTimesheets.length > 0) {
    const projectHoursMap: Record<string, number> = {};
    monthlyTimesheets.forEach((t: any) => {
      projectHoursMap[t.projectId] = (projectHoursMap[t.projectId] || 0) + t.totalHours;
    });
    const sortedProjects = Object.entries(projectHoursMap).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);
    const projectDetails = await prisma.project.findMany({
      where: { id: { in: sortedProjects.map(p => p[0]) } },
      select: { id: true, name: true }
    });
    projectSummary = sortedProjects.map(sp => ({
      name: projectDetails.find((pd: any) => pd.id === sp[0])?.name || 'Unknown',
      hours: sp[1]
    }));
  }

  return (
    <DashboardClientPage
      user={{ name: session.user.name || 'User', role: userRole, email: session.user.email || '' }}
      metrics={dashboardMetrics}
      recentEntries={recentEntriesParsed}
      leaveRequests={leaveRequestsParsed}
      pendingApprovals={pendingApprovalsItems}
      weeklyActivity={weeklyActivity}
      topEmployee={topEmployee}
      projectSummary={projectSummary}
    />
  );
}
