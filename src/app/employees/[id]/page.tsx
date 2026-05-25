// src/app/employees/[id]/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { getEmployeeByIdAction, updateEmployeeAction } from '@/actions/employee';
import { redirect, notFound } from 'next/navigation';

interface EditEmployeePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  const session = await getSession();

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const { id } = await params;
  const response = await getEmployeeByIdAction(id);

  if (response.error || !response.employee) {
    notFound();
  }

  const employee = response.employee;

  const handleUpdateEmployee = async (data: any) => {
    'use server';
    return updateEmployeeAction(id, data);
  };

  return (
    <DashboardLayout userRole={session.user.role as string} userName={session.user.name || ''} userEmail={session.user.email || ''}>
      <div className="py-4">
        <EmployeeForm
          initialData={{
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role as any,
            active: employee.active,
          }}
          onSubmit={handleUpdateEmployee}
        />
      </div>
    </DashboardLayout>
  );
}
