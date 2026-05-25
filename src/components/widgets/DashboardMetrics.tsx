import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Briefcase, Clock, Calendar, TrendingUp } from 'lucide-react';

interface MetricProps {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  color: string;
  bgColor: string;
}

function MetricCard({ title, value, description, icon: Icon, color, bgColor }: MetricProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg ${bgColor} ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface DashboardMetricsProps {
  metrics: {
    totalEmployees: number;
    activeProjects: number;
    pendingTimesheets: number;
    pendingLeaveRequests: number;
    totalHoursWeek: number;
    totalHoursMonth: number;
    overtimeHoursMonth: number;
  };
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

export function DashboardMetrics({ metrics, role }: DashboardMetricsProps) {
  const isAdminOrManager = role === 'ADMIN' || role === 'MANAGER';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {isAdminOrManager && (
        <MetricCard
          title="Total Employees"
          value={metrics.totalEmployees}
          description="Active staff members"
          icon={Users}
          color="text-indigo-600 dark:text-indigo-400"
          bgColor="bg-indigo-50 dark:bg-indigo-950/30"
        />
      )}
      <MetricCard
        title="Active Projects"
        value={metrics.activeProjects}
        description="Ongoing client work"
        icon={Briefcase}
        color="text-emerald-600 dark:text-emerald-400"
        bgColor="bg-emerald-50 dark:bg-emerald-950/30"
      />
      <MetricCard
        title="Pending Timesheets"
        value={metrics.pendingTimesheets}
        description={isAdminOrManager ? "Awaiting review" : "Your submissions"}
        icon={Clock}
        color="text-amber-600 dark:text-amber-400"
        bgColor="bg-amber-50 dark:bg-amber-950/30"
      />
      <MetricCard
        title="Pending Leave"
        value={metrics.pendingLeaveRequests}
        description="Request queue"
        icon={Calendar}
        color="text-violet-600 dark:text-violet-400"
        bgColor="bg-violet-50 dark:bg-violet-950/30"
      />
      <MetricCard
        title="Hours This Week"
        value={`${metrics.totalHoursWeek.toFixed(1)}h`}
        description="Standard: 40h"
        icon={TrendingUp}
        color="text-blue-600 dark:text-blue-400"
        bgColor="bg-blue-50 dark:bg-blue-950/30"
      />
      <MetricCard
        title="Hours This Month"
        value={`${metrics.totalHoursMonth.toFixed(1)}h`}
        description={`Overtime: ${metrics.overtimeHoursMonth.toFixed(1)}h`}
        icon={Clock}
        color="text-cyan-600 dark:text-cyan-400"
        bgColor="bg-cyan-50 dark:bg-cyan-950/30"
      />
    </div>
  );
}
