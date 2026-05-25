import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LeaveRequestItem {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

interface LeaveRequestsProps {
  requests: LeaveRequestItem[];
}

export function LeaveRequests({ requests }: LeaveRequestsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'PENDING': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
      case 'REJECTED': return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-900/50 dark:text-slate-400';
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-bold">Leave Requests</CardTitle>
          <CardDescription>Recent leave activity across the team.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" render={<Link href="/leave" className="text-blue-600 hover:text-blue-700 text-xs font-semibold" />}>
          View all
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Employee</th>
                <th scope="col" className="px-6 py-3 font-medium">Type</th>
                <th scope="col" className="px-6 py-3 font-medium">Dates</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Days</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No recent leave requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {request.employeeName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 capitalize">
                      {request.type.toLowerCase()}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                      {request.startDate} - {request.endDate}
                    </td>
                    <td className="px-6 py-3.5 text-center font-medium text-slate-800 dark:text-slate-200">
                      {request.totalDays}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(request.status)}`}>
                        {request.status}
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
