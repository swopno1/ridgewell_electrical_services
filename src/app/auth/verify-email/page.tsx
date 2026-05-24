// src/app/auth/verify-email/page.tsx
'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmailAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { appConfig } from '@/lib/config';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function verify() {
      if (!token || !email) {
        setStatus('error');
        setErrorMessage('Verification parameters are missing. The verification link is invalid.');
        return;
      }

      try {
        const response = await verifyEmailAction(token, email);
        if (response && response.error) {
          setStatus('error');
          setErrorMessage(response.error);
        } else {
          setStatus('success');
        }
      } catch {
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
    verify();
  }, [token, email]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {appConfig.app.name}
          </h2>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 text-center p-4">
          <CardHeader className="flex flex-col items-center">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            )}
            {status === 'success' && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <XCircle className="h-6 w-6" />
              </div>
            )}

            <CardTitle className="text-xl font-bold">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified Success!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            
            <CardDescription className="text-slate-500">
              {status === 'loading' && 'Checking verification token structure.'}
              {status === 'success' && 'Your account has been verified and activated.'}
              {status === 'error' && (errorMessage || 'The link may have expired or is invalid.')}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-sm text-slate-600 dark:text-slate-400 py-2">
            {status === 'loading' && (
              <p>Please wait while we verify your activation token with the database...</p>
            )}
            {status === 'success' && (
              <p>Thank you! Your email is verified. You can now log into your employee dashboard.</p>
            )}
            {status === 'error' && (
              <p>Please request a new email verification link to activate your account.</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-2">
            {status === 'success' && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" render={<Link href="/auth/signin" />}>
                Go to Sign In
              </Button>
            )}
            {status === 'error' && (
              <>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" render={<Link href={`/auth/verify-email/resend?email=${encodeURIComponent(email)}`} />}>
                  Resend Verification Link
                </Button>
                <Link
                  href="/auth/signin"
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium pt-2"
                >
                  Return to login
                </Link>
              </>
            )}
            {status === 'loading' && (
              <Button disabled className="w-full bg-blue-600/50 text-white cursor-not-allowed">
                Processing...
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
