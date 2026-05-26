// src/app/leave/LeaveClientPage.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LeaveBalance } from '@/components/widgets/LeaveBalance';
import { LeaveTable } from '@/components/tables/LeaveTable';
import { Button } from '@/components/ui/button';
import { CalendarRange, ClipboardCheck, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  cancelLeaveRequestAction,
  approveLeaveRequestAction,
  rejectLeaveRequestAction,
} from '@/actions/leave';
import { ApprovalDialog } from '@/components/dialogs/ApprovalDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';

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

interface LeaveClientPageProps {
  leaveRequests: LeaveRequest[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentUserId: string;
  isManagerOrAdmin: boolean;
  balance: {
    annualEntitled: number;
    annualUsed: number;
    sickUsed: number;
    year: number;
  };
}

export function LeaveClientPage({
  leaveRequests,
  totalCount,
  totalPages,
  currentPage,
  currentUserId,
  isManagerOrAdmin,
  balance,
}: LeaveClientPageProps) {
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
      if (name !== 'page') {
        params.delete('page'); // Reset pagination when changing filters
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

  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = React.useState<string | null>(null);
  const [isRejectMode, setIsRejectMode] = React.useState(false);
  const [cancelId, setCancelId] = React.useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancelId(id);
  };

  const handleCancelConfirm = async () => {
    if (!cancelId) return;
    const res = await cancelLeaveRequestAction(cancelId, currentUserId);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
    setCancelId(null);
  };

  const handleApproveClick = async (id: string) => {
    setSelectedLeaveId(id);
    setIsRejectMode(false);
    setReviewOpen(true);
  };

  const handleRejectClick = async (id: string) => {
    setSelectedLeaveId(id);
    setIsRejectMode(true);
    setReviewOpen(true);
  };

  const handleApprovalSubmit = async (approved: boolean, comment?: string) => {
    if (!selectedLeaveId) return;

    try {
      const res = approved
        ? await approveLeaveRequestAction(selectedLeaveId, currentUserId, comment)
        : await rejectLeaveRequestAction(selectedLeaveId, currentUserId, comment || '');

      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } finally {
      setReviewOpen(false);
      setSelectedLeaveId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Leave Management</h1>
          <p className="text-slate-500 mt-1">
            Request leave, view your annual leave balances, and track approval status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isManagerOrAdmin && (
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/leave/approvals" />}
              className="h-9 gap-1.5"
            >
              <ClipboardCheck className="h-4 w-4" />
              Approvals Queue
            </Button>
          )}

          <Button
            size="sm"
            render={<Link href="/leave/new" />}
            className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Balance Widgets */}
      <LeaveBalance balance={balance} />

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Leave History & Requests</h2>
        </div>

        <LeaveTable
          leaveRequests={leaveRequests}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onStatusFilter={handleStatusFilter}
          onCancel={handleCancel}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
          isManagerOrAdmin={isManagerOrAdmin}
        />
      </div>

      <ApprovalDialog
        isOpen={reviewOpen}
        onClose={() => {
          setReviewOpen(false);
          setSelectedLeaveId(null);
        }}
        onSubmit={handleApprovalSubmit}
        title={isRejectMode ? 'Reject Leave Request' : 'Approve Leave Request'}
        description={
          isRejectMode
            ? 'Provide a brief reason explaining why this leave request is being rejected. This comment will be visible to the employee.'
            : 'Add a comment to log with this approval. This is optional.'
        }
      />

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Leave Request"
        description="Are you sure you want to cancel this leave request? This action cannot be undone."
        confirmText="Cancel Request"
        variant="destructive"
      />
    </div>
  );
}
