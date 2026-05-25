// src/app/projects/page.tsx
import { getProjectsAction } from '@/actions/project';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ProjectClientPage } from './ProjectClientPage';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || 'ALL';
  const page = parseInt(params.page || '1', 10);

  // Fetch projects list
  const { projects = [], totalCount = 0, totalPages = 1 } = await getProjectsAction(
    search,
    status,
    page
  );

  // Fetch metrics for widgets
  const [total, active, totalHoursAggregation] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { active: true } }),
    prisma.timesheet.aggregate({
      _sum: {
        totalHours: true,
      },
    }),
  ]);

  const stats = {
    total,
    active,
    inactive: total - active,
    totalHours: totalHoursAggregation._sum.totalHours || 0,
  };

  const isManagerOrAdmin = ['ADMIN', 'MANAGER'].includes(session.user.role || '');

  return (
    <DashboardLayout userRole={session.user.role as string} userName={session.user.name || ''} userEmail={session.user.email || ''}>
      <ProjectClientPage
        projects={projects as any}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        isManagerOrAdmin={isManagerOrAdmin}
        stats={stats}
      />
    </DashboardLayout>
  );
}
