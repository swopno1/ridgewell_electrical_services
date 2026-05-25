// src/app/leave/new/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { LeaveRequestForm } from '@/components/forms/LeaveRequestForm';
import { createLeaveRequestAction } from '@/actions/leave';
import { redirect } from 'next/navigation';

export default async function NewLeavePage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const handleCreateLeaveRequest = async (data: any) => {
    'use server';
    const s = await getSession();
    if (!s?.user?.id) return { error: 'Unauthorized' };
    return createLeaveRequestAction(data, s.user.id);
  };

  return (
    <DashboardLayout
      userRole={session.user.role as string}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <div className="py-4">
        <LeaveRequestForm onSubmit={handleCreateLeaveRequest} />
      </div>
    </DashboardLayout>
  );
}
