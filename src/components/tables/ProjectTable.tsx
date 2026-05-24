// src/components/tables/ProjectTable.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Edit,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatHours } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  client: string;
  description?: string | null;
  active: boolean;
  totalHoursLogged: number;
}

interface ProjectTableProps {
  projects: Project[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onToggleStatus: (id: string) => Promise<void>;
  isManagerOrAdmin?: boolean;
}

export function ProjectTable({
  projects,
  totalCount,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onStatusFilter,
  onToggleStatus,
  isManagerOrAdmin = false,
}: ProjectTableProps) {
  const [searchVal, setSearchVal] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isPending, startTransition] = React.useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects by name, client, description..."
            className="pl-9 h-10 w-full bg-white dark:bg-slate-950"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              const cleaned = val || 'ALL';
              setStatusFilter(cleaned);
              onStatusFilter(cleaned);
            }}
          >
            <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-950">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active Only</SelectItem>
              <SelectItem value="INACTIVE">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="h-10 bg-slate-900 text-white hover:bg-slate-800">
            Search
          </Button>
        </div>
      </form>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Project / Client</th>
                <th scope="col" className="px-6 py-4 font-medium">Description</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Hours Logged</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Status</th>
                {isManagerOrAdmin && <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={isManagerOrAdmin ? 5 : 4} className="text-center py-8 text-slate-500">
                    No projects found matching the filters.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">{project.name}</span>
                        <span className="text-xs text-slate-500">{project.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[240px] truncate text-slate-600 dark:text-slate-400">
                      {project.description || 'No description provided.'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                      {formatHours(project.totalHoursLogged)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {project.active ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    {isManagerOrAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Status Button */}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={isPending}
                            title={project.active ? 'Deactivate Project' : 'Activate Project'}
                            onClick={() => {
                              startTransition(async () => {
                                await onToggleStatus(project.id);
                              });
                            }}
                            className={
                              project.active
                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                            }
                          >
                            {project.active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          {/* Edit Button */}
                          <Button variant="ghost" size="icon-xs" render={<Link href={`/projects/${project.id}`} />} className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info & Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
            <span className="text-xs text-slate-500">
              Showing page <strong className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</strong> of <strong className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</strong> ({totalCount} projects total)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-8"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
