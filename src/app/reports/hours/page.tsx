import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReportClient } from '@/components/reports/ReportClient';
import { generateHoursSummary } from '@/actions/report';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HoursSummaryPage() {
  const session = await getSession();
  if (!session?.user || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/reports');
  }

  return (
    <DashboardLayout>
      <ReportClient
        title="Hours Summary Report"
        description="Detailed breakdown of regular and overtime hours by employee."
        fetchAction={generateHoursSummary}
      />
    </DashboardLayout>
  );
}
