// src/components/tables/LeaveTable.tsx
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  XOctagon,
} from 'lucide-react';
import Link from 'next/link';

interface LeaveRequest {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  leaveType: 'ANNUAL' | 'SICK' | 'UNPAID';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

interface LeaveTableProps {
  leaveRequests: LeaveRequest[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onCancel?: (id: string) => Promise<void>;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  isManagerOrAdmin?: boolean;
}

export function LeaveTable({
  leaveRequests,
  totalCount,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onStatusFilter,
  onCancel,
  onApprove,
  onReject,
  isManagerOrAdmin = false,
}: LeaveTableProps) {
  const [searchVal, setSearchVal] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isPending, startTransition] = React.useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <XOctagon className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  const getLeaveTypeBadge = (type: LeaveRequest['leaveType']) => {
    switch (type) {
      case 'ANNUAL':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400">
            Annual
          </span>
        );
      case 'SICK':
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10 dark:bg-emerald-900/20 dark:text-emerald-400">
            Sick
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10 dark:bg-amber-900/20 dark:text-amber-400">
            Unpaid
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
                ? 'Search leave requests by employee name...'
                : 'Search leave requests...'
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
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                {isManagerOrAdmin && <th scope="col" className="px-6 py-4 font-medium">Employee</th>}
                <th scope="col" className="px-6 py-4 font-medium">Type</th>
                <th scope="col" className="px-6 py-4 font-medium">Start Date</th>
                <th scope="col" className="px-6 py-4 font-medium">End Date</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Days</th>
                <th scope="col" className="px-6 py-4 font-medium">Reason</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={isManagerOrAdmin ? 8 : 7} className="text-center py-8 text-slate-500">
                    No leave requests found matching the filters.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors">
                    {isManagerOrAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                        {entry.user?.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLeaveTypeBadge(entry.leaveType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-650 dark:text-slate-300">
                      {entry.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-650 dark:text-slate-300">
                      {entry.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-slate-900 dark:text-white">
                      {entry.totalDays}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-slate-500" title={entry.reason}>
                      {entry.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick approval for managers */}
                        {isManagerOrAdmin && entry.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              disabled={isPending}
                              title="Approve Leave"
                              onClick={() => {
                                if (onApprove) {
                                  startTransition(async () => {
                                    await onApprove(entry.id);
                                  });
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
                              title="Reject Leave"
                              onClick={() => {
                                if (onReject) {
                                  startTransition(async () => {
                                    await onReject(entry.id);
                                  });
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* Cancel request for employees */}
                        {!isManagerOrAdmin && entry.status === 'PENDING' && onCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            title="Cancel Leave Request"
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this leave request?')) {
                                startTransition(async () => {
                                  await onCancel(entry.id);
                                });
                              }
                            }}
                            className="text-red-650 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold px-2 h-7"
                          >
                            Cancel
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          render={<Link href={`/leave/${entry.id}`} />}
                          title="View Details"
                          className="text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
