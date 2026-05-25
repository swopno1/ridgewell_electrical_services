// src/app/projects/[id]/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { getProjectByIdAction, updateProjectAction } from '@/actions/project';
import { redirect, notFound } from 'next/navigation';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getSession();

  if (!session?.user?.role || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/projects');
  }

  const { id } = await params;
  const response = await getProjectByIdAction(id);

  if (response.error || !response.project) {
    notFound();
  }

  const project = response.project;

  const handleUpdateProject = async (data: any) => {
    'use server';
    return updateProjectAction(id, data);
  };

  return (
    <DashboardLayout userRole={session.user.role as string} userName={session.user.name || ''} userEmail={session.user.email || ''}>
      <div className="py-4">
        <ProjectForm
          initialData={{
            id: project.id,
            name: project.name,
            client: project.client,
            description: project.description,
            active: project.active,
          }}
          onSubmit={handleUpdateProject}
        />
      </div>
    </DashboardLayout>
  );
}
