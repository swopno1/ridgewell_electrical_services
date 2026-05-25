import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReportClient } from '@/components/reports/ReportClient';
import { generatePayrollSummary } from '@/actions/report';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function PayrollReportPage() {
  const session = await getSession();
  if (!session?.user || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/reports');
  }

  return (
    <DashboardLayout>
      <ReportClient
        title="Payroll Summary Report"
        description="Overview of employee hours, overtime, and leave for the selected period."
        fetchAction={generatePayrollSummary}
      />
    </DashboardLayout>
  );
}
