import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Double check admin role here since this is a sensitive page
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <DashboardLayout
      userRole={session.user.role as string}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
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
