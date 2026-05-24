// src/app/dashboard/page.tsx
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
  Clock,
  AlertCircle,
  Calendar,
  Briefcase,
  ArrowRight,
  Plus,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data for the dashboard
  const stats = [
    {
      title: 'Hours This Week',
      value: '38.5h',
      description: 'Standard: 40h',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Pending Approvals',
      value: '3',
      description: 'Timesheets requiring review',
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Active Projects',
      value: '5',
      description: 'Assigned jobs',
      icon: Briefcase,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Leave Balance',
      value: '14.5 days',
      description: 'Annual leave remaining',
      icon: Calendar,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ];

  const recentEntries = [
    {
      id: 1,
      date: 'May 24, 2026',
      project: 'Ridgewell HQ Rewiring',
      hours: '8.0h',
      status: 'APPROVED',
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    },
    {
      id: 2,
      date: 'May 23, 2026',
      project: 'Ridgewell HQ Rewiring',
      hours: '8.5h',
      status: 'APPROVED',
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    },
    {
      id: 3,
      date: 'May 22, 2026',
      project: 'Main Street Commercial',
      hours: '9.0h',
      status: 'PENDING',
      statusColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    },
    {
      id: 4,
      date: 'May 21, 2026',
      project: 'Residential Solar Install',
      hours: '8.0h',
      status: 'APPROVED',
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    },
    {
      id: 5,
      date: 'May 20, 2026',
      project: 'Residential Solar Install',
      hours: '5.0h',
      status: 'REJECTED',
      statusColor: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 8.0 },
    { day: 'Tue', hours: 8.5 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 5.0 },
  ];

  return (
    <DashboardLayout userRole="ADMIN" userName="Dave Ridgewell" userEmail="dave@ridgewellelectrical.com">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, Dave</h1>
            <p className="text-slate-500 mt-1">Here is a summary of your team's timesheets, active jobs, and status reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-9">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Entry
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border border-slate-200 dark:border-slate-800 shadow-xs">
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
          <Card className="md:col-span-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Recent Timesheet Entries</CardTitle>
                <CardDescription>A list of your latest timesheet submissions.</CardDescription>
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
                    {recentEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{entry.date}</td>
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">{entry.project}</td>
                        <td className="px-6 py-3.5 text-right font-medium text-slate-800 dark:text-slate-200">{entry.hours}</td>
                        <td className="px-6 py-3.5 text-center">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${entry.statusColor}`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Charts - 3 Columns Wide on Desktop */}
          <div className="md:col-span-3 space-y-6">
            {/* Visual Stats (Weekly Hours Trend) */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">Hours Logged Trend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </div>
                <CardDescription>Mon, May 20 - Fri, May 24</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {/* SVG Mock Chart with Premium Look */}
                <div className="relative h-[150px] w-full flex items-end justify-between px-2 pt-6">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">10h</div>
                  <div className="absolute inset-x-0 top-[50px] border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">5h</div>
                  <div className="absolute inset-x-0 top-[100px] border-t border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 pt-1">0h</div>
                  
                  {/* Bars */}
                  {weeklyActivity.map((dayData, idx) => {
                    const heightPercent = (dayData.hours / 10) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 z-10 flex-1">
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">{dayData.hours}h</span>
                        <div
                          className="w-8 bg-blue-600 dark:bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-700 dark:hover:bg-blue-400 cursor-pointer"
                          style={{ height: `${heightPercent}px` }}
                          title={`${dayData.day}: ${dayData.hours} hours`}
                        />
                        <span className="text-xs text-slate-500">{dayData.day}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                <CardDescription>Common operations and shortcuts.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="w-full justify-start text-left text-sm" render={<Link href="/timesheets" />}>
                  <Clock className="h-4 w-4 mr-2.5 text-blue-600 dark:text-blue-400" />
                  <span>Submit Daily Timesheet</span>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left text-sm" render={<Link href="/leave" />}>
                  <Calendar className="h-4 w-4 mr-2.5 text-amber-600 dark:text-amber-400" />
                  <span>Request Annual/Sick Leave</span>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left text-sm" render={<Link href="/projects" />}>
                  <Briefcase className="h-4 w-4 mr-2.5 text-emerald-600 dark:text-emerald-400" />
                  <span>View Project Hours</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
