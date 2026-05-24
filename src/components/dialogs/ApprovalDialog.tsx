// src/components/dialogs/ApprovalDialog.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (approved: boolean, comment?: string) => Promise<void>;
  title?: string;
  description?: string;
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onSubmit,
  title = 'Review Submission',
  description = 'Add an optional comment to log with this review. A comment is required if you reject this entry.',
}: ApprovalDialogProps) {
  const [comment, setComment] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setComment('');
      setError(null);
    }
  }, [isOpen]);

  const handleAction = async (approved: boolean) => {
    setError(null);
    if (!approved && !comment.trim()) {
      setError('A comment is required when rejecting a submission.');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(approved, comment.trim() || undefined);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during review.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">{title}</DialogTitle>
          <DialogDescription className="text-slate-500">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-slate-800 dark:text-slate-200 font-medium">
              Comment
            </Label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Approved. Good job! or Rejected. Missing details..."
              disabled={isLoading}
              className="w-full rounded-lg border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction(false)}
            disabled={isLoading}
          >
            Reject
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleAction(true)}
            disabled={isLoading}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
