import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Clock, Briefcase, FileText, ArrowRight } from 'lucide-react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userRole = session.user.role;
  const isManagerOrAdmin = ['ADMIN', 'MANAGER'].includes(userRole);

  if (!isManagerOrAdmin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-full mb-6">
            <BarChart3 className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h1>
          <p className="text-slate-500 max-w-md">
            Reports are only available for Administrators and Managers. Please contact your supervisor if you believe this is an error.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const reportCards = [
    {
      title: 'Payroll Summary',
      description: 'View total hours, overtime, and leave days per employee for payroll processing.',
      href: '/reports/payroll',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Hours Summary',
      description: 'Detailed breakdown of regular and overtime hours grouped by employee.',
      href: '/reports/hours',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Project Reports',
      description: 'Analyze time allocation across different projects and client jobs.',
      href: '/reports/by-project',
      icon: Briefcase,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Business Intelligence Reports</h1>
          <p className="text-slate-500">Generate and export detailed operational reports.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reportCards.map((card) => (
            <Card key={card.title} className="flex flex-col border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`p-2 w-fit rounded-lg ${card.bgColor} ${card.color} mb-4`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Button variant="outline" className="w-full group" render={<Link href={card.href} />}>
                  Generate Report
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
