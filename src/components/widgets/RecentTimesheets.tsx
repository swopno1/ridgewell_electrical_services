import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RecentEntry {
  id: string;
  date: string;
  project: string;
  employeeName?: string;
  hours: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  statusColor: string;
}

interface RecentTimesheetsProps {
  entries: RecentEntry[];
  isAdminOrManager: boolean;
}

export function RecentTimesheets({ entries, isAdminOrManager }: RecentTimesheetsProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-bold">
            {isAdminOrManager ? 'Recent Submissions' : 'Your Recent Timesheets'}
          </CardTitle>
          <CardDescription>
            {isAdminOrManager
              ? 'A list of timesheets recently submitted by staff.'
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
                {isAdminOrManager && <th scope="col" className="px-6 py-3 font-medium">Employee</th>}
                <th scope="col" className="px-6 py-3 font-medium">Project</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Hours</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrManager ? 5 : 4} className="text-center py-8 text-slate-500">
                    No recent timesheet entries found.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {entry.date}
                    </td>
                    {isAdminOrManager && (
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
  );
}
