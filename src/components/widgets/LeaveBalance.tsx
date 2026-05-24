// src/components/widgets/LeaveBalance.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, HeartPulse, ShieldAlert } from 'lucide-react';

interface LeaveBalanceProps {
  balance: {
    annualEntitled: number;
    annualUsed: number;
    sickUsed: number;
    year: number;
  };
}

export function LeaveBalance({ balance }: LeaveBalanceProps) {
  const annualRemaining = Math.max(0, balance.annualEntitled - balance.annualUsed);
  const annualUsedPercent = Math.min(
    100,
    (balance.annualUsed / balance.annualEntitled) * 100
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Annual Leave Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
        <CardHeader className="pb-2 pl-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Annual Leave
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardDescription className="text-xs text-slate-400">
            For year {balance.year}
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-6 pt-0">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {annualRemaining}
            </span>
            <span className="text-sm text-slate-500 font-medium">days left</span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${annualUsedPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>{balance.annualUsed} days used</span>
              <span>{balance.annualEntitled} days entitled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sick Leave Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />
        <CardHeader className="pb-2 pl-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Sick Leave
            </CardTitle>
            <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardDescription className="text-xs text-slate-400">
            For year {balance.year}
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-6 pt-0">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {balance.sickUsed}
            </span>
            <span className="text-sm text-slate-500 font-medium">days used</span>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Sick leave is taken as needed and logged against your annual tracking records.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unpaid Leave Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600" />
        <CardHeader className="pb-2 pl-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Unpaid Leave
            </CardTitle>
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <CardDescription className="text-xs text-slate-400">
            For year {balance.year}
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-6 pt-0">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              -
            </span>
            <span className="text-sm text-slate-500 font-medium">unlimited</span>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Unpaid leave can be requested and is approved at management discretion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
