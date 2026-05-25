'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Reports Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-full mb-6">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong!</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We encountered an error while generating your report. This could be due to a network issue or a temporary problem with our service.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/reports'}
        >
          Back to Reports
        </Button>
      </div>
    </div>
  );
}
