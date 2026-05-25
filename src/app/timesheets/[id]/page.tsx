// src/app/timesheets/[id]/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { TimesheetForm } from '@/components/forms/TimesheetForm';
import { updateTimesheetAction } from '@/actions/timesheet';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';

interface EditTimesheetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTimesheetPage({ params }: EditTimesheetPageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const currentUserId = session.user.id;
  const userRole = session.user.role;

  // Retrieve the timesheet
  const timesheet = await prisma.timesheet.findUnique({
    where: { id },
  });

  if (!timesheet) {
    notFound();
  }

  // Guards:
  // 1. Employees cannot edit other users' timesheets
  if (userRole === 'EMPLOYEE' && timesheet.userId !== currentUserId) {
    redirect('/timesheets');
  }

  // 2. Employees cannot edit timesheets that are not PENDING
  if (userRole === 'EMPLOYEE' && timesheet.status !== 'PENDING') {
    redirect('/timesheets');
  }

  // Fetch active projects to fill the project dropdown
  const projects = await prisma.project.findMany({
    where: { active: true },
    select: { id: true, name: true, client: true },
    orderBy: { name: 'asc' },
  });

  const handleUpdateTimesheet = async (data: any) => {
    'use server';
    const s = await getSession();
    if (!s?.user?.id) return { error: 'Unauthorized' };
    return updateTimesheetAction(id, data, s.user.id);
  };

  return (
    <DashboardLayout
      userRole={session.user.role as string}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <div className="py-4">
        <TimesheetForm
          projects={projects}
          initialData={timesheet}
          onSubmit={handleUpdateTimesheet}
        />
      </div>
    </DashboardLayout>
  );
}
