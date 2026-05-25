import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Plus, ArrowRight, AlertCircle, CalendarClock } from "lucide-react";
import Link from "next/link";
import { LeaveBalance } from "./LeaveBalance";

interface EmployeeDashboardProps {
  user: {
    name: string;
    role: string;
  };
  leaveBalance: {
    annualEntitled: number;
    annualUsed: number;
    sickUsed: number;
    year: number;
  };
  recentTimesheets: Array<{
    id: string;
    date: string;
    project: string;
    hours: string;
    status: string;
    statusColor: string;
  }>;
  pendingLeaveRequests: Array<{
    id: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    leaveType: string;
    status: string;
  }>;
  monthHours: number;
  upcomingLeave: Array<{
    id: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    leaveType: string;
  }>;
}

export function EmployeeDashboard({
  user,
  leaveBalance,
  recentTimesheets,
  pendingLeaveRequests,
  monthHours,
  upcomingLeave
}: EmployeeDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user.name}. Here's an overview of your work and leave.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/timesheets/new" />}>
            <Plus className="h-4 w-4 mr-2" />
            Submit Timesheet
          </Button>
          <Button size="sm" variant="outline" className="h-9" render={<Link href="/leave/new" />}>
            <Calendar className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hours Tracked (This Month)
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{monthHours.toFixed(1)}h</div>
            <p className="text-xs text-slate-500 mt-1">Total hours logged this month</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Leave Balance
            </span>
            <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {(leaveBalance.annualEntitled - leaveBalance.annualUsed).toFixed(1)} days
            </div>
            <p className="text-xs text-slate-500 mt-1">Remaining annual leave for {leaveBalance.year}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{pendingLeaveRequests.length}</div>
            <p className="text-xs text-slate-500 mt-1">Leave requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance Detail */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          Leave Entitlements
        </h2>
        <LeaveBalance balance={leaveBalance} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Timesheets */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Your Recent Timesheets</CardTitle>
              <CardDescription>Your latest 5 submissions.</CardDescription>
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
                    <th scope="col" className="px-6 py-3 font-medium">Project</th>
                    <th scope="col" className="px-6 py-3 font-medium text-right">Hours</th>
                    <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {recentTimesheets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-500">
                        No recent timesheet entries found.
                      </td>
                    </tr>
                  ) : (
                    recentTimesheets.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 max-w-[120px] truncate">
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

        <div className="space-y-6">
          {/* Upcoming Leave */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Upcoming Leave</CardTitle>
              <CardDescription>Your upcoming approved leave periods.</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingLeave.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full mb-2">
                    <Calendar className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">No upcoming leave scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLeave.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md">
                          <CalendarClock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {leave.leaveType} Leave
                          </p>
                          <p className="text-xs text-slate-500">
                            {leave.startDate} - {leave.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {leave.totalDays}
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Days</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Leave Requests */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Pending Requests
              </CardTitle>
              <CardDescription>Awaiting manager approval.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLeaveRequests.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No pending leave requests.</p>
              ) : (
                <div className="space-y-3">
                  {pendingLeaveRequests.map((request) => (
                    <div key={request.id} className="flex flex-col gap-1 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {request.leaveType} Leave
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400 uppercase">
                          {request.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>{request.startDate} - {request.endDate}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{request.totalDays} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
