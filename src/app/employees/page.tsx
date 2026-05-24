// src/app/employees/page.tsx
import { getEmployeesAction } from '@/actions/employee';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { EmployeeClientPage } from './EmployeeClientPage';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function EmployeesPage({ searchParams }: PageProps) {
  const session = await getSession();
  
  if (!session?.user?.role || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const search = params.search || '';
  const role = params.role || 'ALL';
  const status = params.status || 'ALL';
  const page = parseInt(params.page || '1', 10);

  // Fetch employees list
  const { employees = [], totalCount = 0, totalPages = 1 } = await getEmployeesAction(
    search,
    role,
    status,
    page
  );

  // Fetch stats for the directory widgets
  const [total, active, admins, managers, employeesCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { active: true } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'MANAGER' } }),
    prisma.user.count({ where: { role: 'EMPLOYEE' } }),
  ]);

  const stats = {
    total,
    active,
    inactive: total - active,
    admins,
    managers,
    employees: employeesCount,
  };

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <DashboardLayout userRole={session.user.role as any} userName={session.user.name || ''} userEmail={session.user.email || ''}>
      <EmployeeClientPage
        employees={employees as any}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        isAdmin={isAdmin}
        stats={stats}
      />
    </DashboardLayout>
  );
}
