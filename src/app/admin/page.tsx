'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function AdminPage() {
  return (
    <DashboardLayout userRole="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Console</h1>
          <p className="text-slate-500">Manage system-level configurations and users.</p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400">Admin features coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
