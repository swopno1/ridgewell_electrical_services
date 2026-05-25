import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <DashboardLayout
      userRole={session.user.role as string}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-slate-500">Manage your account settings and preferences.</p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400">Profile management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
