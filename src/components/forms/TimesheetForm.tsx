// src/components/forms/TimesheetForm.tsx
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
import { format } from 'date-fns';

const clientTimesheetSchema = z
  .object({
    projectId: z.string().min(1, 'Please select a project'),
    date: z.string().min(1, 'Date is required'),
    timeOn: z.string().min(1, 'Start time is required'),
    timeOff: z.string().min(1, 'End time is required'),
    breakDuration: z.coerce.number().min(0, 'Break duration cannot be negative'),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const [onH, onM] = data.timeOn.split(':').map(Number);
      const [offH, offM] = data.timeOff.split(':').map(Number);
      const minutesOn = onH * 60 + onM;
      const minutesOff = offH * 60 + offM;
      return minutesOff > minutesOn;
    },
    {
      message: 'End time must be after start time',
      path: ['timeOff'],
    }
  );

type TimesheetFormValues = z.infer<typeof clientTimesheetSchema>;

interface TimesheetFormProps {
  projects: {
    id: string;
    name: string;
    client: string;
  }[];
  initialData?: {
    id: string;
    projectId: string;
    date: Date;
    timeOn: Date;
    timeOff: Date;
    breakDuration: number;
    notes?: string | null;
  };
  onSubmit: (data: any) => Promise<{ success?: boolean; error?: string }>;
}

export function TimesheetForm({ projects, initialData, onSubmit }: TimesheetFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Helper to format date/time into HTML input formats (YYYY-MM-DD and HH:MM)
  const defaultDate = initialData ? format(initialData.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
  const defaultTimeOn = initialData ? format(initialData.timeOn, 'HH:mm') : '08:00';
  const defaultTimeOff = initialData ? format(initialData.timeOff, 'HH:mm') : '16:30';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TimesheetFormValues>({
    resolver: zodResolver(clientTimesheetSchema),
    defaultValues: {
      projectId: initialData?.projectId || '',
      date: defaultDate,
      timeOn: defaultTimeOn,
      timeOff: defaultTimeOff,
      breakDuration: initialData?.breakDuration ?? 30,
      notes: initialData?.notes || '',
    },
  });

  const handleFormSubmit = async (data: TimesheetFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Combine date and times into full Date objects in the local timezone
      const dateStr = data.date;
      const timeOnDate = new Date(`${dateStr}T${data.timeOn}`);
      const timeOffDate = new Date(`${dateStr}T${data.timeOff}`);

      const formattedData = {
        projectId: data.projectId,
        date: new Date(dateStr),
        timeOn: timeOnDate,
        timeOff: timeOffDate,
        breakDuration: data.breakDuration,
        notes: data.notes,
      };

      const response = await onSubmit(formattedData);
      if (response.error) {
        setError(response.error);
      } else {
        router.push('/timesheets');
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
        <CardTitle>{initialData ? 'Edit Timesheet Entry' : 'Log Daily Time'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Update your worked hours and project details.'
            : 'Enter your hours, project, and any optional notes for this work shift.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
              {error}
            </div>
          )}

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="projectId">Project / Job</Label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="projectId" className="w-full h-10 border border-input bg-white dark:bg-slate-950">
                    <SelectValue placeholder="Select active project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} ({project.client})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.projectId && (
              <p className="text-xs text-red-500 font-medium">{errors.projectId.message}</p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              disabled={isLoading}
              className={errors.date ? 'border-red-500 focus-visible:ring-red-500' : ''}
              {...register('date')}
            />
            {errors.date && (
              <p className="text-xs text-red-500 font-medium">{errors.date.message}</p>
            )}
          </div>

          {/* Time On and Off */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeOn">Time On (Start)</Label>
              <Input
                id="timeOn"
                type="time"
                disabled={isLoading}
                className={errors.timeOn ? 'border-red-500 focus-visible:ring-red-500' : ''}
                {...register('timeOn')}
              />
              {errors.timeOn && (
                <p className="text-xs text-red-500 font-medium">{errors.timeOn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeOff">Time Off (End)</Label>
              <Input
                id="timeOff"
                type="time"
                disabled={isLoading}
                className={errors.timeOff ? 'border-red-500 focus-visible:ring-red-500' : ''}
                {...register('timeOff')}
              />
              {errors.timeOff && (
                <p className="text-xs text-red-500 font-medium">{errors.timeOff.message}</p>
              )}
            </div>
          </div>

          {/* Break Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="breakDuration">Break Duration</Label>
            <Controller
              name="breakDuration"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={isLoading}
                >
                  <SelectTrigger id="breakDuration" className="w-full h-10 border border-input bg-white dark:bg-slate-950">
                    <SelectValue placeholder="Select break duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Break (0 mins)</SelectItem>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour (60 mins)</SelectItem>
                    <SelectItem value="90">1.5 Hours (90 mins)</SelectItem>
                    <SelectItem value="120">2 Hours (120 mins)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.breakDuration && (
              <p className="text-xs text-red-500 font-medium">{errors.breakDuration.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Scope of Work</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Detail specific tasks performed, e.g. Rough-in wiring in Unit 3..."
              disabled={isLoading}
              className={`w-full rounded-lg border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.notes ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-xs text-red-500 font-medium">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => router.push('/timesheets')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Saving...' : initialData ? 'Update Entry' : 'Log Time'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
