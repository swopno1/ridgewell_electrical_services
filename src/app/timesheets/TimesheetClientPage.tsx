// src/app/timesheets/TimesheetClientPage.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TimesheetTable } from '@/components/tables/TimesheetTable';
import { Button } from '@/components/ui/button';
import { Plus, Clock, FileCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { deleteTimesheetAction, approveTimesheetAction, rejectTimesheetAction } from '@/actions/timesheet';
import { ApprovalDialog } from '@/components/dialogs/ApprovalDialog';

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

interface TimesheetClientPageProps {
  timesheets: Timesheet[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentUserId: string;
  isManagerOrAdmin: boolean;
  stats: {
    totalHours: number;
    pendingCount: number;
    approvedCount: number;
  };
}

export function TimesheetClientPage({
  timesheets,
  totalCount,
  totalPages,
  currentPage,
  currentUserId,
  isManagerOrAdmin,
  stats,
}: TimesheetClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [reviewId, setReviewId] = React.useState<string | null>(null);
  const [isRejectMode, setIsRejectMode] = React.useState(false);

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'ALL' || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
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

  const handleDelete = async (id: string) => {
    const res = await deleteTimesheetAction(id, currentUserId);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  const handleApproveQuick = async (id: string) => {
    const res = await approveTimesheetAction(id, currentUserId);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  const handleRejectTrigger = async (id: string) => {
    setReviewId(id);
    setIsRejectMode(true);
  };

  const handleApprovalSubmit = async (approved: boolean, comment?: string) => {
    if (!reviewId) return;

    if (approved) {
      const res = await approveTimesheetAction(reviewId, currentUserId, comment);
      if (res.error) throw new Error(res.error);
    } else {
      if (!comment) throw new Error('Comment is required for rejection');
      const res = await rejectTimesheetAction(reviewId, currentUserId, comment);
      if (res.error) throw new Error(res.error);
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Timesheets</h1>
          <p className="text-slate-500 mt-1">
            {isManagerOrAdmin
              ? 'Monitor, filter, and approve employee timesheets.'
              : 'Log your shifts, track your weekly hours, and view approval statuses.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isManagerOrAdmin && (
            <Button
              size="sm"
              variant="outline"
              className="h-9"
              render={<Link href="/timesheets/approvals" />}
            >
              Approvals Queue
            </Button>
          )}
          <Button
            size="sm"
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white"
            render={<Link href="/timesheets/new" />}
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Hours
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Hours */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isManagerOrAdmin ? 'Total Tracked Hours' : 'Your Tracked Hours'}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats.totalHours.toFixed(1)}h
            </h3>
          </div>
        </div>

        {/* Pending approvals count */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Reviews</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.pendingCount}</h3>
          </div>
        </div>

        {/* Approved count */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approved Entries</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.approvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Timesheet List Table */}
      <TimesheetTable
        timesheets={timesheets}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onStatusFilter={handleStatusFilter}
        onDelete={handleDelete}
        onApprove={handleApproveQuick}
        onReject={handleRejectTrigger}
        isManagerOrAdmin={isManagerOrAdmin}
      />

      {/* Review Dialog for rejection */}
      <ApprovalDialog
        isOpen={isRejectMode}
        onClose={() => {
          setIsRejectMode(false);
          setReviewId(null);
        }}
        onSubmit={handleApprovalSubmit}
        title="Reject Timesheet Entry"
        description="Please provide a brief reason or comment explaining why this timesheet entry is being rejected. This feedback will be displayed to the employee."
      />
    </div>
  );
}
