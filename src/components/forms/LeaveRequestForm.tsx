// src/components/forms/LeaveRequestForm.tsx
'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';

const leaveRequestSchema = z
  .object({
    leaveType: z.enum(['ANNUAL', 'SICK', 'UNPAID']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

type LeaveFormValues = z.infer<typeof leaveRequestSchema>;

interface LeaveRequestFormProps {
  onSubmit: (data: any) => Promise<{ success?: boolean; error?: string }>;
}

export function LeaveRequestForm({ onSubmit }: LeaveRequestFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leaveType: 'ANNUAL',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
    },
  });

  const startDateVal = watch('startDate');
  const endDateVal = watch('endDate');

  const calculatedDays = React.useMemo(() => {
    if (!startDateVal || !endDateVal) return 0;
    const start = new Date(startDateVal);
    const end = new Date(endDateVal);
    if (end < start) return 0;
    return differenceInDays(end, start) + 1;
  }, [startDateVal, endDateVal]);

  const handleFormSubmit = async (data: LeaveFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedData = {
        leaveType: data.leaveType,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
      };

      const response = await onSubmit(formattedData);
      if (response?.error) {
        setError(response.error);
      } else {
        router.push('/leave');
        router.refresh();
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-xl w-full mx-auto border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader>
        <CardTitle>Request Leave</CardTitle>
        <CardDescription>
          Submit a new request for leave. Your manager will be notified to review and approve it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
              {error}
            </div>
          )}

          {/* Leave Type */}
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Controller
              name="leaveType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="leaveType" className="w-full h-10 border border-input bg-white dark:bg-slate-950">
                    <SelectValue placeholder="Select leave type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.leaveType && (
              <p className="text-xs text-red-500 font-medium">{errors.leaveType.message}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                disabled={isLoading}
                className={errors.startDate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500 font-medium">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                disabled={isLoading}
                className={errors.endDate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500 font-medium">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Calculated Duration */}
          {calculatedDays > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg text-sm text-blue-750 dark:text-blue-300 font-medium flex justify-between items-center">
              <span>Total requested days:</span>
              <span className="text-base font-bold">{calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}</span>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason / Comments</Label>
            <textarea
              id="reason"
              rows={4}
              placeholder="Please describe why you are requesting leave during these dates..."
              disabled={isLoading}
              className={`w-full rounded-lg border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.reason ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 font-medium">{errors.reason.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => router.push('/leave')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
