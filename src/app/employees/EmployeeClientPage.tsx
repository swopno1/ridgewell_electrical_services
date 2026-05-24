// src/app/employees/EmployeeClientPage.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { EmployeeTable } from '@/components/tables/EmployeeTable';
import { Button } from '@/components/ui/button';
import { Plus, Users, ShieldAlert, Award, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { toggleEmployeeStatusAction } from '@/actions/employee';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  active: boolean;
  image?: string | null;
}

interface EmployeeClientPageProps {
  employees: Employee[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isAdmin: boolean;
  stats: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    managers: number;
    employees: number;
  };
}

export function EmployeeClientPage({
  employees,
  totalCount,
  totalPages,
  currentPage,
  isAdmin,
  stats,
}: EmployeeClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'ALL' || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // Reset page when filter changes
      if (name !== 'page') {
        params.delete('page');
      }
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString('page', page.toString())}`);
  };

  const handleSearchChange = (search: string) => {
    router.push(`${pathname}?${createQueryString('search', search)}`);
  };

  const handleRoleFilter = (role: string) => {
    router.push(`${pathname}?${createQueryString('role', role)}`);
  };

  const handleStatusFilter = (status: string) => {
    router.push(`${pathname}?${createQueryString('status', status)}`);
  };

  const handleToggleStatus = async (id: string) => {
    const result = await toggleEmployeeStatusAction(id);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Employees Directory</h1>
          <p className="text-slate-500 mt-1">Manage employee information, authorization settings, and status flags.</p>
        </div>
        {isAdmin && (
          <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/employees/new" />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Employees */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.total}</h3>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Staff</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.active}</h3>
          </div>
        </div>

        {/* Managers */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-lg">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Managers</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.managers}</h3>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admins</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.admins}</h3>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <EmployeeTable
        employees={employees}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onToggleStatus={handleToggleStatus}
        isAdmin={isAdmin}
      />
    </div>
  );
}
