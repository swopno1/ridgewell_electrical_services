// src/app/timesheets/approvals/ApprovalsClientPage.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TimesheetTable } from '@/components/tables/TimesheetTable';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Users, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { approveTimesheetAction, rejectTimesheetAction } from '@/actions/timesheet';
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

interface ApprovalsClientPageProps {
  timesheets: Timesheet[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentUserId: string;
  stats: {
    pendingCount: number;
    pendingHours: number;
    submittingEmployees: number;
  };
}

export function ApprovalsClientPage({
  timesheets,
  totalCount,
  totalPages,
  currentPage,
  currentUserId,
  stats,
}: ApprovalsClientPageProps) {
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-xs"
              render={<Link href="/timesheets" />}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-slate-500">Back to Timesheets</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">Approvals Queue</h1>
          <p className="text-slate-500 mt-1">
            Review staff timesheets, inspect logged hours, and approve or reject submissions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Pending Reviews */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Submissions</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.pendingCount}</h3>
          </div>
        </div>

        {/* Pending Hours */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Hours Pending</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {stats.pendingHours.toFixed(1)}h
            </h3>
          </div>
        </div>

        {/* Submitting staff count */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Employees Submitting</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.submittingEmployees}</h3>
          </div>
        </div>
      </div>

      {/* Pending Timesheets List */}
      <TimesheetTable
        timesheets={timesheets}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onStatusFilter={() => {}} // Hardcoded filter on page level
        onApprove={handleApproveQuick}
        onReject={handleRejectTrigger}
        isManagerOrAdmin={true}
      />

      {/* Rejection Review Modal */}
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
