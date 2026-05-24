// src/components/forms/ProjectForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const projectFormSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  client: z.string().min(2, 'Client name must be at least 2 characters'),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    client: string;
    description?: string | null;
    active: boolean;
  };
  onSubmit: (data: ProjectFormValues) => Promise<{ success?: boolean; error?: string }>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          client: initialData.client,
          description: initialData.description || '',
          active: initialData.active,
        }
      : {
          name: '',
          client: '',
          description: '',
          active: true,
        },
  });

  const handleFormSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await onSubmit(data);
      if (response.error) {
        setError(response.error);
      } else {
        router.push('/projects');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-xl w-full mx-auto border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Project Details' : 'Create New Project'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Modify details and active status for this client project.'
            : 'Scaffold a new project or job to allocate billable timesheets.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
              {error}
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g. Ridgewell HQ Rewiring"
              disabled={isLoading}
              className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client">Client / Company Name</Label>
            <Input
              id="client"
              placeholder="e.g. Ridgewell Electrical Services"
              disabled={isLoading}
              className={errors.client ? 'border-red-500 focus-visible:ring-red-500' : ''}
              {...register('client')}
            />
            {errors.client && (
              <p className="text-xs text-red-500 font-medium">{errors.client.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <textarea
              id="description"
              placeholder="Brief details about the job, milestones, or location."
              disabled={isLoading}
              rows={4}
              className={`flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-950 placeholder:text-slate-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 ${
                errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
            )}
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
                Active project status
              </Label>
              <p className="text-xs text-slate-500">
                Employees can only log timesheets against active projects.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => router.push('/projects')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
