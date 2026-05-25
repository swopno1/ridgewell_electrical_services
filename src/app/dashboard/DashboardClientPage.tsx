'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  FileSpreadsheet,
  TrendingUp,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { EmployeeDashboard } from '@/components/widgets/EmployeeDashboard';

interface StatBlock {
  title: string;
  value: string;
  description: string;
  iconType: 'Clock' | 'AlertCircle' | 'Briefcase' | 'Calendar';
  color: string;
  bgColor: string;
}

interface RecentEntry {
  id: string;
  date: string;
  project: string;
  employeeName?: string;
  hours: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  statusColor: string;
}

interface WeeklyActivity {
  day: string;
  hours: number;
}

interface DashboardClientPageProps {
  user: {
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  };
  stats: StatBlock[];
  recentEntries: RecentEntry[];
  weeklyActivity: WeeklyActivity[];
  leaveBalance?: {
    annualEntitled: number;
    annualUsed: number;
    sickUsed: number;
    year: number;
  };
  employeeData?: {
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
  } | null;
}

export function DashboardClientPage({
  user,
  metrics,
  recentEntries,
  leaveRequests,
  pendingApprovals,
  weeklyActivity,
  leaveBalance,
  employeeData
}: DashboardClientPageProps) {
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || 'User';
  };

  const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(user.role);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {user.role === 'EMPLOYEE' && employeeData && leaveBalance ? (
          <EmployeeDashboard
            user={user}
            leaveBalance={leaveBalance}
            recentTimesheets={recentEntries}
            pendingLeaveRequests={employeeData.pendingLeaveRequests}
            monthHours={employeeData.monthHours}
            upcomingLeave={employeeData.upcomingLeave}
          />
        ) : (
          <>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {getFirstName(user.name)}
                </h1>
                <p className="text-slate-500 mt-1">
                  {isManagerOrAdmin
                    ? "Here is a summary of your team's timesheets, active projects, and pending approvals."
                    : "Here is a summary of your timesheets, logged hours, and leave status."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-9">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/timesheets/new" />}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Entry
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => {
                const Icon = iconMap[stat.iconType] || Clock;
                return (
                  <Card key={idx} className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {stat.title}
                      </span>
                      <div className={`p-1.5 rounded-lg ${stat.bgColor} ${stat.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                      <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Grid Section */}
            <div className="grid gap-6 md:grid-cols-7">
              {/* Recent Entries - 4 Columns Wide on Desktop */}
              <Card className="md:col-span-4 border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {isManagerOrAdmin ? 'Recent Submissions' : 'Your Recent Timesheets'}
                    </CardTitle>
                    <CardDescription>
                      {isManagerOrAdmin
                        ? 'A list of timesheets recently submitted by your staff.'
                        : 'A list of your latest timesheet submissions.'}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" render={<Link href="/timesheets" className="text-blue-600 hover:text-blue-700 text-xs font-semibold" />}>
                    View all
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 font-medium">Date</th>
                          {isManagerOrAdmin && <th scope="col" className="px-6 py-3 font-medium">Employee</th>}
                          <th scope="col" className="px-6 py-3 font-medium">Project</th>
                          <th scope="col" className="px-6 py-3 font-medium text-right">Hours</th>
                          <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {recentEntries.length === 0 ? (
                          <tr>
                            <td colSpan={isManagerOrAdmin ? 5 : 4} className="text-center py-8 text-slate-500">
                              No recent timesheet entries found.
                            </td>
                          </tr>
                        ) : (
                          recentEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                              <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                {entry.date}
                              </td>
                              {isManagerOrAdmin && (
                                <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                  {entry.employeeName || 'Unknown'}
                                </td>
                              )}
                              <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                                {entry.project}
                              </td>
                              <td className="px-6 py-3.5 text-right font-medium text-slate-800 dark:text-slate-200">
                                {entry.hours}
                              </td>
                              <td className="px-6 py-3.5 text-center">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${entry.statusColor}`}>
                                  {entry.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions & Charts - 3 Columns Wide on Desktop */}
              <div className="md:col-span-3 space-y-6">
                {/* Visual Stats (Weekly Hours Trend) */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">Hours Logged Trend</CardTitle>
                      <TrendingUp className="h-4 w-4 text-slate-400" />
                    </div>
                    <CardDescription>Weekly activity (Mon - Fri)</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* SVG Mock Chart with Premium Look */}
                    <div className="relative h-[150px] w-full flex items-end justify-between px-2 pt-6">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">12h</div>
                      <div className="absolute inset-x-0 top-[50px] border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">6h</div>
                      <div className="absolute inset-x-0 top-[100px] border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">0h</div>

                      {/* Bars */}
                      {weeklyActivity.map((dayData, idx) => {
                        const heightPercent = Math.min((dayData.hours / 12) * 100, 100);
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 z-10 flex-1">
                            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                              {dayData.hours.toFixed(1)}h
                            </span>
                            <div
                              className="w-8 bg-blue-600 dark:bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-700 dark:hover:bg-blue-400 cursor-pointer"
                              style={{ height: `${heightPercent}px` }}
                              title={`${dayData.day}: ${dayData.hours.toFixed(1)} hours`}
                            />
                            <span className="text-xs text-slate-500">{dayData.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                    <CardDescription>Common operations and shortcuts.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button variant="outline" className="w-full justify-start text-left text-sm" render={<Link href="/timesheets" />}>
                      <Clock className="h-4 w-4 mr-2.5 text-blue-600 dark:text-blue-400" />
                      <span>View All Timesheets</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left text-sm" render={<Link href="/leave" />}>
                      <Calendar className="h-4 w-4 mr-2.5 text-amber-600 dark:text-amber-400" />
                      <span>Request Annual/Sick Leave</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left text-sm" render={<Link href="/projects" />}>
                      <Briefcase className="h-4 w-4 mr-2.5 text-emerald-600 dark:text-emerald-400" />
                      <span>View Project Details</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
