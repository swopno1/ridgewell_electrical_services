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

const employeeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
  active: z.boolean().default(true),
  hourlyRate: z.coerce.number().min(0).optional(),
  overtimeRate: z.coerce.number().min(0).optional(),
  annualLeaveQuota: z.coerce.number().min(0).optional(),
  designation: z.string().optional(),
  standardWorkHours: z.coerce.number().min(1).max(24).optional(),
  password: z.string().optional().or(z.literal('')),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    active: boolean;
    hourlyRate?: number | null;
    overtimeRate?: number | null;
    annualLeaveQuota?: number | null;
    designation?: string | null;
    standardWorkHours?: number | null;
  };
  onSubmit: (data: EmployeeFormValues) => Promise<{ success?: boolean; error?: string }>;
}

export function EmployeeForm({ initialData, onSubmit }: EmployeeFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'EMPLOYEE',
      active: initialData?.active ?? true,
      hourlyRate: initialData?.hourlyRate ?? 0,
      overtimeRate: initialData?.overtimeRate ?? 0,
      annualLeaveQuota: initialData?.annualLeaveQuota ?? 20,
      designation: initialData?.designation ?? 'Employee',
      standardWorkHours: initialData?.standardWorkHours ?? 8,
    },
  });

  const handleFormSubmit = async (data: EmployeeFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await onSubmit(data);
      if (response.error) {
        setError(response.error);
      } else {
        router.push('/employees');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl w-full mx-auto border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Employee Details' : 'Create New Employee'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Modify details, salary, and permissions for this employee.'
            : 'Register a new employee with their salary and work hour details.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. Alice Johnson"
                disabled={isLoading}
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. alice@company.com"
                disabled={isLoading}
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Designation Field */}
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="e.g. Software Engineer"
                disabled={isLoading}
                {...register('designation')}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">App Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="role" className="w-full h-10 border border-input">
                      <SelectValue placeholder="Select employee role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Employee (Timesheet Submission)</SelectItem>
                      <SelectItem value="MANAGER">Manager (Approval Workflow)</SelectItem>
                      <SelectItem value="ADMIN">Admin (Full System Permissions)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Salary & Work Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hourly Rate */}
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Regular Pay Rate (/hr)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isLoading}
                  {...register('hourlyRate')}
                />
              </div>

              {/* Overtime Rate */}
              <div className="space-y-2">
                <Label htmlFor="overtimeRate">Overtime Pay Rate (/hr)</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isLoading}
                  {...register('overtimeRate')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Annual Leave Quota */}
              <div className="space-y-2">
                <Label htmlFor="annualLeaveQuota">Yearly Leave Quota (Days)</Label>
                <Input
                  id="annualLeaveQuota"
                  type="number"
                  placeholder="20"
                  disabled={isLoading}
                  {...register('annualLeaveQuota')}
                />
              </div>

              {/* Standard Work Hours */}
              <div className="space-y-2">
                <Label htmlFor="standardWorkHours">Daily Work Hours</Label>
                <Input
                  id="standardWorkHours"
                  type="number"
                  step="0.5"
                  placeholder="8"
                  disabled={isLoading}
                  {...register('standardWorkHours')}
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">{initialData ? 'New Password (Optional)' : 'Password (Optional)'}</Label>
            <Input
              id="password"
              type="password"
              placeholder={initialData ? "Leave blank to keep current" : "Leave blank for invitation email"}
              disabled={isLoading}
              className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
              {...register('password')}
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center space-x-3 py-2 border-t border-slate-100 dark:border-slate-800">
            <input
              id="active"
              type="checkbox"
              disabled={isLoading}
              className="h-4 w-4 rounded-sm border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
              {...register('active')}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="active" className="cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                Active status
              </Label>
              <p className="text-xs text-slate-500">
                Inactive employees cannot log in or submit timesheets.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => router.push('/employees')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {isLoading ? 'Saving...' : initialData ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
