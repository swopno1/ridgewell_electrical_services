// src/app/employees/new/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { createEmployeeAction } from '@/actions/employee';
import { redirect } from 'next/navigation';

export default async function NewEmployeePage() {
  const session = await getSession();

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const handleCreateEmployee = async (data: any) => {
    'use server';
    return createEmployeeAction(data);
  };

  return (
    <DashboardLayout userRole={session.user.role as any} userName={session.user.name || ''} userEmail={session.user.email || ''}>
      <div className="py-4">
        <EmployeeForm onSubmit={handleCreateEmployee} />
      </div>
    </DashboardLayout>
  );
}
