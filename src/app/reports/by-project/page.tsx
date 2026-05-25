import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReportClient } from '@/components/reports/ReportClient';
import { generateProjectReport } from '@/actions/report';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ProjectReportPage() {
  const session = await getSession();
  if (!session?.user || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/reports');
  }

  return (
    <DashboardLayout userRole={session.user.role as string} userName={session.user.name || ""} userEmail={session.user.email || ""}>
      <ReportClient
        title="Project Hours Report"
        description="Analysis of time allocation and personnel assigned across projects."
        fetchAction={generateProjectReport}
      />
    </DashboardLayout>
  );
}
