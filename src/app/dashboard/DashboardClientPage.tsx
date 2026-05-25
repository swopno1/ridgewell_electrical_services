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
import { DashboardMetrics } from '@/components/widgets/DashboardMetrics';
import { RecentTimesheets } from '@/components/widgets/RecentTimesheets';
import { PendingApprovals } from '@/components/widgets/PendingApprovals';
import { LeaveRequests } from '@/components/widgets/LeaveRequests';

interface DashboardClientPageProps {
  user: {
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  };
  metrics: {
    totalEmployees: number;
    activeProjects: number;
    pendingTimesheets: number;
    pendingLeaveRequests: number;
    totalHoursWeek: number;
    totalHoursMonth: number;
    overtimeHoursMonth: number;
  };
  recentEntries: any[];
  leaveRequests: any[];
  pendingApprovals: any[];
  weeklyActivity: any[];
  topEmployee: { name: string, hours: number };
  projectSummary: { name: string, hours: number }[];
}

export function DashboardClientPage({
  user,
  metrics,
  recentEntries,
  leaveRequests,
  pendingApprovals,
  weeklyActivity,
  topEmployee,
  projectSummary,
}: DashboardClientPageProps) {
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || 'User';
  };

  const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(user.role);

  return (
    <DashboardLayout userRole={user.role} userName={user.name} userEmail={user.email}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {getFirstName(user.name)}
            </h1>
            <p className="text-slate-500 mt-1">
              {isAdminOrManager
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
        <DashboardMetrics metrics={metrics} role={user.role} />

        {/* Main Grid Section */}
        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-4 space-y-6">
            <RecentTimesheets entries={recentEntries} isAdminOrManager={isAdminOrManager} />
            <LeaveRequests requests={leaveRequests} />
          </div>

          <div className="md:col-span-3 space-y-6">
            {isAdminOrManager && <PendingApprovals items={pendingApprovals} />}

            {/* Admin/Manager Summary Cards */}
            {isAdminOrManager && (
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Managerial Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Top Contributor (Month)</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{topEmployee.name} ({topEmployee.hours.toFixed(1)}h)</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Project Distribution</p>
                    <div className="space-y-2">
                      {projectSummary.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{p.name}</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{p.hours.toFixed(1)}h</span>
                        </div>
                      ))}
                      {projectSummary.length === 0 && <p className="text-sm text-slate-500 italic text-center">No data available for projects this month.</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                <div className="relative h-[150px] w-full flex items-end justify-between px-2 pt-6">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">12h</div>
                  <div className="absolute inset-x-0 top-[50px] border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">6h</div>
                  <div className="absolute inset-x-0 top-[100px] border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">0h</div>
                  
                  {/* Bars */}
                  {weeklyActivity.map((dayData, idx) => {
                    const heightPercent = Math.min((dayData.hours / 12) * 150, 150);
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
