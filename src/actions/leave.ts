// src/actions/leave.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { differenceInDays } from 'date-fns';

const createLeaveRequestSchema = z.object({
  leaveType: z.enum(['ANNUAL', 'SICK', 'UNPAID']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
});

export async function createLeaveRequestAction(data: unknown, userId: string) {
  try {
    const validated = createLeaveRequestSchema.parse(data);

    if (validated.endDate <= validated.startDate) {
      return { error: 'End date must be after start date' };
    }

    const totalDays = differenceInDays(validated.endDate, validated.startDate) + 1;

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId,
        leaveType: validated.leaveType,
        startDate: validated.startDate,
        endDate: validated.endDate,
        totalDays,
        reason: validated.reason,
        status: 'PENDING',
      },
      include: {
        user: true,
      },
    });

    return { success: true, leaveRequest };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to create leave request' };
  }
}

export async function updateLeaveRequestAction(
  leaveRequestId: string,
  data: unknown,
  userId: string
) {
  try {
    const validated = createLeaveRequestSchema.parse(data);

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
    });

    if (!leaveRequest) {
      return { error: 'Leave request not found' };
    }

    if (leaveRequest.userId !== userId) {
      return { error: 'Unauthorized' };
    }

    if (leaveRequest.status !== 'PENDING') {
      return { error: 'Cannot modify approved or rejected requests' };
    }

    const totalDays = differenceInDays(validated.endDate, validated.startDate) + 1;

    const updated = await prisma.leaveRequest.update({
      where: { id: leaveRequestId },
      data: {
        leaveType: validated.leaveType,
        startDate: validated.startDate,
        endDate: validated.endDate,
        totalDays,
        reason: validated.reason,
      },
      include: { user: true },
    });

    return { success: true, leaveRequest: updated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to update leave request' };
  }
}

export async function cancelLeaveRequestAction(leaveRequestId: string, userId: string) {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
    });

    if (!leaveRequest) {
      return { error: 'Leave request not found' };
    }

    if (leaveRequest.userId !== userId) {
      return { error: 'Unauthorized' };
    }

    const updated = await prisma.leaveRequest.update({
      where: { id: leaveRequestId },
      data: { status: 'CANCELLED' },
      include: { user: true },
    });

    return { success: true, leaveRequest: updated };
  } catch {
    return { error: 'Failed to cancel leave request' };
  }
}

export async function approveLeaveRequestAction(
  leaveRequestId: string,
  approverId: string,
  comment?: string
) {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
    });

    if (!leaveRequest) {
      return { error: 'Leave request not found' };
    }

    // Update leave balance
    const year = new Date().getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
      where: { userId_year: { userId: leaveRequest.userId, year } },
    });

    if (leaveRequest.leaveType === 'ANNUAL' && balance) {
      if (balance.annualUsed + leaveRequest.totalDays > balance.annualEntitled) {
        return { error: 'Insufficient annual leave balance' };
      }
    }

    const [updated] = await Promise.all([
      prisma.leaveRequest.update({
        where: { id: leaveRequestId },
        data: { status: 'APPROVED' },
        include: { user: true },
      }),
      prisma.approval.create({
        data: {
          approverUserId: approverId,
          leaveRequestId,
          type: 'LEAVE_REQUEST',
          approved: true,
          comment,
          approvedAt: new Date(),
        },
      }),
      leaveRequest.leaveType === 'ANNUAL' && balance
        ? prisma.leaveBalance.update({
            where: { id: balance.id },
            data: { annualUsed: balance.annualUsed + leaveRequest.totalDays },
          })
        : null,
    ]);

    return { success: true, leaveRequest: updated };
  } catch {
    return { error: 'Failed to approve leave request' };
  }
}

export async function rejectLeaveRequestAction(
  leaveRequestId: string,
  approverId: string,
  comment: string
) {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
    });

    if (!leaveRequest) {
      return { error: 'Leave request not found' };
    }

    const [updated] = await Promise.all([
      prisma.leaveRequest.update({
        where: { id: leaveRequestId },
        data: { status: 'REJECTED' },
        include: { user: true },
      }),
      prisma.approval.create({
        data: {
          approverUserId: approverId,
          leaveRequestId,
          type: 'LEAVE_REQUEST',
          approved: false,
          comment,
          approvedAt: new Date(),
        },
      }),
    ]);

    return { success: true, leaveRequest: updated };
  } catch {
    return { error: 'Failed to reject leave request' };
  }
}

export async function getLeaveRequestsByUser(userId: string) {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { userId },
      include: {
        approvals: {
          include: { approverUser: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return { success: true, leaveRequests };
  } catch {
    return { error: 'Failed to fetch leave requests' };
  }
}

export async function getLeaveBalance(userId: string, year: number) {
  try {
    let balance = await prisma.leaveBalance.findUnique({
      where: { userId_year: { userId, year } },
    });

    if (!balance) {
      balance = await prisma.leaveBalance.create({
        data: {
          userId,
          year,
          annualEntitled: 20,
          annualUsed: 0,
          sickUsed: 0,
        },
      });
    }

    return { success: true, balance };
  } catch {
    return { error: 'Failed to fetch leave balance' };
  }
}
