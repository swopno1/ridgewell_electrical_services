// src/app/projects/ProjectClientPage.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProjectTable } from '@/components/tables/ProjectTable';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { toggleProjectStatusAction } from '@/actions/project';
import { formatHours } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  client: string;
  description?: string | null;
  active: boolean;
  totalHoursLogged: number;
}

interface ProjectClientPageProps {
  projects: Project[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isManagerOrAdmin: boolean;
  stats: {
    total: number;
    active: number;
    inactive: number;
    totalHours: number;
  };
}

export function ProjectClientPage({
  projects,
  totalCount,
  totalPages,
  currentPage,
  isManagerOrAdmin,
  stats,
}: ProjectClientPageProps) {
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

  const handleStatusFilter = (status: string) => {
    router.push(`${pathname}?${createQueryString('status', status)}`);
  };

  const handleToggleStatus = async (id: string) => {
    const result = await toggleProjectStatusAction(id);
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Client Projects</h1>
          <p className="text-slate-500 mt-1">Track company jobs, log billable hours, and manage project lifecycles.</p>
        </div>
        {isManagerOrAdmin && (
          <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/projects/new" />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Projects</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.total}</h3>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Jobs</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.active}</h3>
          </div>
        </div>

        {/* Inactive Projects */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg">
            <CheckCircle className="h-6 w-6 opacity-40" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Jobs</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.inactive}</h3>
          </div>
        </div>

        {/* Total Hours Logged */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Hours Tracked</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{formatHours(stats.totalHours)}</h3>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <ProjectTable
        projects={projects}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onStatusFilter={handleStatusFilter}
        onToggleStatus={handleToggleStatus}
        isManagerOrAdmin={isManagerOrAdmin}
      />
    </div>
  );
}
