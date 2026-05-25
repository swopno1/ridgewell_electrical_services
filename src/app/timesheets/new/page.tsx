// src/app/timesheets/new/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { TimesheetForm } from '@/components/forms/TimesheetForm';
import { createTimesheetAction } from '@/actions/timesheet';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function NewTimesheetPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch only active projects for time assignment
  const projects = await prisma.project.findMany({
    where: { active: true },
    select: { id: true, name: true, client: true },
    orderBy: { name: 'asc' },
  });

  const handleCreateTimesheet = async (data: any) => {
    'use server';
    const s = await getSession();
    if (!s?.user?.id) return { error: 'Unauthorized' };
    return createTimesheetAction(data, s.user.id);
  };

  return (
    <DashboardLayout
      userRole={session.user.role as string}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <div className="py-4">
        <TimesheetForm projects={projects} onSubmit={handleCreateTimesheet} />
      </div>
    </DashboardLayout>
  );
}
