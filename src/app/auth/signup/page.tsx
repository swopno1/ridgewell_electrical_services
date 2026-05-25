// src/app/auth/signup/page.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { signUpAction } from '@/actions/auth';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { appConfig } from '@/lib/config';

const signUpFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
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

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null);
  const [isAutoVerified, setIsAutoVerified] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: SignUpFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await signUpAction(data);
      if (response && response.error) {
        setError(response.error);
      } else {
        setRegisteredEmail(data.email);
        if (response && 'verified' in response && response.verified) {
          setIsAutoVerified(true);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If registered successfully, display verification pending or verified success view
  if (registeredEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
        <Card className="max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            {isAutoVerified ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <Mail className="h-6 w-6" />
              </div>
            )}
            <CardTitle className="text-2xl font-bold">
              {isAutoVerified ? 'Account Activated!' : 'Check Your Email'}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {isAutoVerified
                ? `Welcome! Your super admin account (${registeredEmail}) is verified and active.`
                : `We have sent a verification email to ${registeredEmail}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            {isAutoVerified ? (
              <p>You can now log in directly and access the system with full Admin controls.</p>
            ) : (
              <>
                <p>
                  Please click the link in that email to activate your account. The link is valid for 24 hours.
                </p>
                <div className="p-3 text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="text-left leading-normal">
                    <strong>Note:</strong> During local development, the email won't send over SMTP. 
                    Please check the <strong>terminal console log</strong> of your dev server to copy and paste the verification link!
                  </span>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-6 mt-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push('/auth/signin')}
            >
              Go to Sign In
            </Button>
            {!isAutoVerified && (
              <Link
                href={`/auth/verify-email/resend?email=${encodeURIComponent(registeredEmail)}`}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline font-medium"
              >
                Didn't get the email? Request another
              </Link>
            )}
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
            Create an employee account to start tracking time.
          </p>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Register</CardTitle>
            <CardDescription>Create a password-secured timesheet account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-md">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Jane Doe"
                  disabled={isLoading}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

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

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
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
                  placeholder="Re-enter password"
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
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/50 pt-4">
            <p>
              Already have an account?{' '}
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
