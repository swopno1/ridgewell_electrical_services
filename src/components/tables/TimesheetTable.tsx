// src/components/tables/TimesheetTable.tsx
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
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface Timesheet {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  project: {
    name: string;
    client: string;
  };
  date: string;
  totalHours: number;
  overtimeHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string | null;
}

interface TimesheetTableProps {
  timesheets: Timesheet[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isManagerOrAdmin?: boolean;
}

export function TimesheetTable({
  timesheets,
  totalCount,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onStatusFilter,
  onDelete,
  onApprove,
  onReject,
  isManagerOrAdmin,
}: TimesheetTableProps) {
  const [searchVal, setSearchVal] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isPending] = React.useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10 dark:bg-emerald-900/20 dark:text-emerald-400">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10 dark:bg-red-900/20 dark:text-red-400">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10 dark:bg-amber-900/20 dark:text-amber-400">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder={
              isManagerOrAdmin
                ? 'Search by employee or project...'
                : 'Search by project name or client...'
            }
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
                {isManagerOrAdmin && <th scope="col" className="px-6 py-4 font-medium">Employee</th>}
                <th scope="col" className="px-6 py-4 font-medium">Project</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Hours</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Overtime</th>
                <th scope="col" className="px-6 py-4 font-medium">Notes</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {timesheets.length === 0 ? (
                <tr>
                  <td colSpan={isManagerOrAdmin ? 8 : 7} className="text-center py-8 text-slate-500">
                    No timesheets found matching the filters.
                  </td>
                </tr>
              ) : (
                timesheets.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {entry.date}
                    </td>
                    {isManagerOrAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {entry.user.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">{entry.project.name}</span>
                        <span className="text-xs text-slate-500">{entry.project.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900 dark:text-white">
                      {entry.totalHours.toFixed(1)}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600 dark:text-slate-400">
                      {entry.overtimeHours > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          +{entry.overtimeHours.toFixed(1)}h
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-slate-500" title={entry.notes || ''}>
                      {entry.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Manager quick approvals */}
                        {isManagerOrAdmin && entry.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              disabled={isPending}
                              title="Approve Entry"
                              onClick={() => {
                                if (onApprove) {
                                  onApprove(entry.id);
                                }
                              }}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              disabled={isPending}
                              title="Reject Entry"
                              onClick={() => {
                                if (onReject) {
                                  onReject(entry.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* Edit and Delete action for employees (only when status is PENDING) */}
                        {entry.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              render={<Link href={`/timesheets/${entry.id}`} />}
                              className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                disabled={isPending}
                                title="Delete Entry"
                                onClick={() => onDelete(entry.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
            <span className="text-xs text-slate-500">
              Showing page <strong className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</strong> of <strong className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</strong> ({totalCount} entries total)
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
