// src/app/auth/forgot-password/page.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { forgotPasswordAction } from '@/actions/auth';
import Link from 'next/link';
import Image from 'next/image';
import { Send, AlertTriangle } from 'lucide-react';
import { appConfig } from '@/lib/config';

const forgotFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotFormValues = z.infer<typeof forgotFormSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: ForgotFormValues) => {
    setError(null);
    setIsLoading(true);
    setSubmittedEmail(data.email);

    try {
      const response = await forgotPasswordAction(data);
      if (response && response.error) {
        setError(response.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
        <Card className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <Send className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-slate-500">
              If an account is registered to {submittedEmail}, we have sent a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <p>
              Please click the link in that email to choose a new password. The link is valid for 1 hour.
            </p>
            <div className="p-3 text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg text-amber-700 dark:text-amber-400 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="text-left leading-normal">
                <strong>Note:</strong> In development mode, check the <strong>terminal console log</strong> of your dev server to copy and paste the password reset link!
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800/50 pt-6 mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/auth/signin" />}>
              Return to Login
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
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 ring-1 ring-slate-200 dark:ring-slate-800 shadow-md mb-4">
            <Image
              src={appConfig.company.logo}
              alt="Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {appConfig.app.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Reset your password.
          </p>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  disabled={isLoading}
                  className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                {isLoading ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/50 pt-4">
            <p>
              Remembered your password?{' '}
              <Link
                href="/auth/signin"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
