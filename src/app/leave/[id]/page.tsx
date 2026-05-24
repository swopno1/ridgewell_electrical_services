// src/app/leave/[id]/page.tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { LeaveDetailClient } from './LeaveDetailClient';

interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeaveDetailPage({ params }: DetailPageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const currentUserId = session.user.id;
  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  const isManagerOrAdmin = ['ADMIN', 'MANAGER'].includes(userRole);

  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true },
      },
      approvals: {
        include: {
          approverUser: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!leaveRequest) {
    notFound();
  }

  // Guards: employees can only view their own leave requests
  if (userRole === 'EMPLOYEE' && leaveRequest.userId !== currentUserId) {
    redirect('/leave');
  }

  const formattedRequest = {
    ...leaveRequest,
    startDate: leaveRequest.startDate.toISOString().split('T')[0],
    endDate: leaveRequest.endDate.toISOString().split('T')[0],
    createdAt: leaveRequest.createdAt.toISOString(),
    approvals: leaveRequest.approvals.map((app) => ({
      ...app,
      approvedAt: app.approvedAt ? app.approvedAt.toISOString() : null,
    })),
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <div className="py-4">
        <LeaveDetailClient
          leaveRequest={formattedRequest as any}
          currentUserId={currentUserId}
          isManagerOrAdmin={isManagerOrAdmin}
        />
      </div>
    </DashboardLayout>
  );
}
