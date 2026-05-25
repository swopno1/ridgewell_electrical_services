// src/app/projects/new/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { createProjectAction } from '@/actions/project';
import { redirect } from 'next/navigation';

export default async function NewProjectPage() {
  const session = await getSession();

  // Project management restricted to managers and admins
  if (!session?.user?.role || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/projects');
  }

  const handleCreateProject = async (data: any) => {
    'use server';
    return createProjectAction(data);
  };

  return (
    <DashboardLayout userRole={session.user.role as string} userName={session.user.name || ''} userEmail={session.user.email || ''}>
      <div className="py-4">
        <ProjectForm onSubmit={handleCreateProject} />
      </div>
    </DashboardLayout>
  );
}
