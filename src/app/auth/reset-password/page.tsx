// src/app/auth/reset-password/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { resetPasswordAction } from '@/actions/auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { appConfig } from '@/lib/config';

const resetFormSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof resetFormSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: ResetFormValues) => {
    if (!token || !email) {
      setError('Missing token or email parameter. The password reset link is invalid.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        token,
        email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await resetPasswordAction(payload);
      if (response && response.error) {
        setError(response.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isLinkInvalid = !token || !email;

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
        <Card className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Complete</CardTitle>
            <CardDescription className="text-slate-500">
              Your password has been successfully updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            <p>You can now sign in with your new password to access your account dashboard.</p>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800/50 pt-6 mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/auth/signin" />}>
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {appConfig.app.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Choose your new password.
          </p>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter a strong new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLinkInvalid ? (
              <div className="p-4 text-sm text-red-700 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg flex flex-col items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="text-center font-medium">Invalid Password Reset Link</div>
                <div className="text-xs text-center text-red-600 dark:text-red-400 leading-normal">
                  The password reset parameters are missing from the URL. Please verify you clicked the complete link sent to your inbox.
                </div>
                <Button variant="outline" className="mt-2 text-xs" render={<Link href="/auth/forgot-password" />}>
                  Request another link
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
                    {error}
                  </div>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    disabled={isLoading}
                    className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    {...register('password')}
                  />
                  {errors.password ? (
                    <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500">
                      Min 8 chars, 1 uppercase letter, 1 number, 1 special character.
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
                >
                  {isLoading ? 'Resetting password...' : 'Update Password'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/50 pt-4">
            <Link
              href="/auth/signin"
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
