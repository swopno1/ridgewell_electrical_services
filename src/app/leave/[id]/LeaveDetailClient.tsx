// src/app/leave/[id]/LeaveDetailClient.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  XOctagon,
  ArrowLeft,
  User,
  MessageSquare,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { cancelLeaveRequestAction, approveLeaveRequestAction, rejectLeaveRequestAction } from '@/actions/leave';
import { ApprovalDialog } from '@/components/dialogs/ApprovalDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';

interface Approval {
  id: string;
  approverUserId: string;
  approverUser: {
    name: string;
    email: string;
  };
  approved: boolean;
  comment: string | null;
  approvedAt: string | null;
}

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
  createdAt: string;
  approvals: Approval[];
}

interface LeaveDetailClientProps {
  leaveRequest: LeaveRequest;
  currentUserId: string;
  isManagerOrAdmin: boolean;
}

export function LeaveDetailClient({
  leaveRequest,
  currentUserId,
  isManagerOrAdmin,
}: LeaveDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [isRejectMode, setIsRejectMode] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const handleCancel = async () => {
    setCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    startTransition(async () => {
      const res = await cancelLeaveRequestAction(leaveRequest.id, currentUserId);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleApproveQuick = async () => {
    startTransition(async () => {
      const res = await approveLeaveRequestAction(leaveRequest.id, currentUserId);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleApprovalSubmit = async (approved: boolean, comment?: string) => {
    try {
      const res = approved
        ? await approveLeaveRequestAction(leaveRequest.id, currentUserId, comment)
        : await rejectLeaveRequestAction(leaveRequest.id, currentUserId, comment || '');

      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } finally {
      setReviewOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-700/10 dark:bg-emerald-900/20 dark:text-emerald-400">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-700/10 dark:bg-red-900/20 dark:text-red-400">
            Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-600/10 dark:bg-slate-800 dark:text-slate-400">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-700/10 dark:bg-amber-900/20 dark:text-amber-400">
            Pending Review
          </span>
        );
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'ANNUAL':
        return 'Annual Leave';
      case 'SICK':
        return 'Sick Leave';
      case 'UNPAID':
        return 'Unpaid Leave';
      default:
        return type;
    }
  };

  const primaryApproval = leaveRequest.approvals[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/leave"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Leave Management
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Card (Left Col) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Leave Request Details
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Request ID: {leaveRequest.id.toUpperCase()}
                  </CardDescription>
                </div>
                {getStatusBadge(leaveRequest.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-slate-500" />
                    Requester
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {leaveRequest.user?.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 ml-6">{leaveRequest.user?.email}</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Leave Type
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
                    {getLeaveTypeLabel(leaveRequest.leaveType)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Duration
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1.5 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {leaveRequest.startDate} to {leaveRequest.endDate}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Workdays
                  </h4>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {leaveRequest.totalDays} {leaveRequest.totalDays === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  Reason / Comment
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50 mt-2 italic leading-relaxed">
                  "{leaveRequest.reason}"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow & History (Right Col) */}
        <div className="space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Status & Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Timeline Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-md">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Requested On
                    </h5>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(leaveRequest.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* If approved/rejected, show review details */}
                {primaryApproval && (
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div
                      className={`mt-0.5 p-1 rounded-md ${
                        primaryApproval.approved
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                          : 'bg-red-50 dark:bg-red-950/30 text-red-600'
                      }`}
                    >
                      {primaryApproval.approved ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Reviewed By
                      </h5>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {primaryApproval.approverUser?.name}
                      </p>
                      {primaryApproval.approvedAt && (
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(primaryApproval.approvedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                      {primaryApproval.comment && (
                        <div className="mt-2 text-xs text-slate-650 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-medium italic">
                          "{primaryApproval.comment}"
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* If pending review */}
                {leaveRequest.status === 'PENDING' && (
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="mt-0.5 p-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Status Details
                      </h5>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                        Awaiting manager review. The requester can cancel this request at any time before review.
                      </p>
                    </div>
                  </div>
                )}

                {/* If cancelled */}
                {leaveRequest.status === 'CANCELLED' && (
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="mt-0.5 p-1 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-md">
                      <XOctagon className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Status Details
                      </h5>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                        This request has been cancelled by the employee. No further actions can be taken.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {leaveRequest.status === 'PENDING' && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {isManagerOrAdmin ? (
                    <>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={isPending}
                        onClick={handleApproveQuick}
                      >
                        Approve Request
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/10"
                        disabled={isPending}
                        onClick={() => {
                          setIsRejectMode(true);
                          setReviewOpen(true);
                        }}
                      >
                        Reject Request
                      </Button>
                    </>
                  ) : (
                    leaveRequest.userId === currentUserId && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={isPending}
                        onClick={handleCancel}
                      >
                        Cancel Request
                      </Button>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      <ApprovalDialog
        isOpen={reviewOpen}
        onClose={() => {
          setReviewOpen(false);
          setIsRejectMode(false);
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
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Leave Request"
        description="Are you sure you want to cancel this leave request? This action cannot be undone."
        confirmText="Cancel Request"
        variant="destructive"
      />
    </div>
  );
}
