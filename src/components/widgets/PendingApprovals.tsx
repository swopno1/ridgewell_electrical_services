import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PendingItem {
  id: string;
  type: 'TIMESHEET' | 'LEAVE';
  title: string;
  subtitle: string;
  value: string;
  date: string;
}

interface PendingApprovalsProps {
  items: PendingItem[];
}

export function PendingApprovals({ items }: PendingApprovalsProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-bold">Pending Approvals</CardTitle>
          <CardDescription>Items requiring your review and action.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" render={<Link href="/approvals" className="text-blue-600 hover:text-blue-700 text-xs font-semibold" />}>
          Manage all
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {items.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No pending approvals at this time.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.type === 'TIMESHEET' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
                    {item.type === 'TIMESHEET' ? <Clock className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.subtitle} • {item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.value}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
