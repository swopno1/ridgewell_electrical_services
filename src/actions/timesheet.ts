// src/actions/timesheet.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { differenceInMinutes } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { notifyTimesheetSubmission, notifyTimesheetStatusChange } from '@/lib/notifications';

const createTimesheetSchema = z.object({
  projectId: z.string().uuid(),
  date: z.coerce.date(),
  timeOn: z.coerce.date(),
  timeOff: z.coerce.date(),
  breakDuration: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export async function createTimesheetAction(data: unknown, userId: string) {
  try {
    const validated = createTimesheetSchema.parse(data);

    // Calculate total hours
    const totalMinutes = differenceInMinutes(validated.timeOff, validated.timeOn);
    const breakMinutes = validated.breakDuration;
    const workMinutes = totalMinutes - breakMinutes;
    const totalHours = workMinutes / 60;

    // Calculate overtime
    const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

    // Check for existing entry
    const existingEntry = await prisma.timesheet.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(validated.date.toDateString()),
        },
      },
    });

    if (existingEntry) {
      return { error: 'Timesheet entry already exists for this date' };
    }

    const timesheet = await prisma.timesheet.create({
      data: {
        userId,
        projectId: validated.projectId,
        date: new Date(validated.date.toDateString()),
        timeOn: validated.timeOn,
        timeOff: validated.timeOff,
        breakDuration: validated.breakDuration,
        totalHours,
        overtimeHours,
        notes: validated.notes,
        status: 'PENDING',
      },
      include: {
        project: true,
        user: true,
      },
    });

    // Send notification
    await notifyTimesheetSubmission(timesheet);

    revalidatePath('/timesheets');
    revalidatePath('/dashboard');
    return { success: true, timesheet };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to create timesheet' };
  }
}

export async function updateTimesheetAction(
  timesheetId: string,
  data: unknown,
  userId: string
) {
  try {
    const validated = createTimesheetSchema.parse(data);

    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
    });

    if (!timesheet) {
      return { error: 'Timesheet not found' };
    }

    // Check ownership or admin/manager role
    const session = await getSession();
    if (
      timesheet.userId !== userId &&
      !['ADMIN', 'MANAGER'].includes(session?.user?.role || '')
    ) {
      return { error: 'Unauthorized' };
    }

    const totalMinutes = differenceInMinutes(validated.timeOff, validated.timeOn);
    const workMinutes = totalMinutes - validated.breakDuration;
    const totalHours = workMinutes / 60;
    const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

    const updated = await prisma.timesheet.update({
      where: { id: timesheetId },
      data: {
        projectId: validated.projectId,
        date: new Date(validated.date.toDateString()),
        timeOn: validated.timeOn,
        timeOff: validated.timeOff,
        breakDuration: validated.breakDuration,
        totalHours,
        overtimeHours,
        notes: validated.notes,
      },
      include: { project: true, user: true },
    });

    revalidatePath('/timesheets');
    revalidatePath('/dashboard');
    return { success: true, timesheet: updated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to update timesheet' };
  }
}

export async function deleteTimesheetAction(timesheetId: string, userId: string) {
  try {
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
    });

    if (!timesheet) {
      return { error: 'Timesheet not found' };
    }

    if (timesheet.userId !== userId) {
      return { error: 'Unauthorized' };
    }

    if (timesheet.status !== 'PENDING') {
      return { error: 'Cannot delete approved or rejected timesheets' };
    }

    await prisma.timesheet.delete({
      where: { id: timesheetId },
    });

    revalidatePath('/timesheets');
    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'Failed to delete timesheet' };
  }
}

export async function approveTimesheetAction(
  timesheetId: string,
  approverId: string,
  comment?: string
) {
  try {
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
    });

    if (!timesheet) {
      return { error: 'Timesheet not found' };
    }

    const [updated] = await Promise.all([
      prisma.timesheet.update({
        where: { id: timesheetId },
        data: { status: 'APPROVED' },
        include: { project: true, user: true },
      }),
      prisma.approval.create({
        data: {
          approverUserId: approverId,
          timesheetId,
          type: 'TIMESHEET',
          approved: true,
          comment,
          approvedAt: new Date(),
        },
      }),
    ]);

    // Send notification
    await notifyTimesheetStatusChange(updated, true, comment);

    revalidatePath('/timesheets');
    revalidatePath('/dashboard');
    return { success: true, timesheet: updated };
  } catch {
    return { error: 'Failed to approve timesheet' };
  }
}

export async function rejectTimesheetAction(
  timesheetId: string,
  approverId: string,
  comment: string
) {
  try {
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
    });

    if (!timesheet) {
      return { error: 'Timesheet not found' };
    }

    const [updated] = await Promise.all([
      prisma.timesheet.update({
        where: { id: timesheetId },
        data: { status: 'REJECTED' },
        include: { project: true, user: true },
      }),
      prisma.approval.create({
        data: {
          approverUserId: approverId,
          timesheetId,
          type: 'TIMESHEET',
          approved: false,
          comment,
          approvedAt: new Date(),
        },
      }),
    ]);

    // Send notification
    await notifyTimesheetStatusChange(updated, false, comment);

    revalidatePath('/timesheets');
    revalidatePath('/dashboard');
    return { success: true, timesheet: updated };
  } catch {
    return { error: 'Failed to reject timesheet' };
  }
}

export async function getTimesheetsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const timesheets = await prisma.timesheet.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        project: true,
        approvals: {
          include: { approverUser: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    return { success: true, timesheets };
  } catch {
    return { error: 'Failed to fetch timesheets' };
  }
}

export async function getTimesheetsAction(
  search?: string,
  status?: string,
  page = 1,
  pageSize = 10
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { error: 'Unauthorized' };
    }

    const userId = session.user.id;
    const role = session.user.role;

    const where: any = {};

    // Role-based scoping
    if (role === 'EMPLOYEE') {
      where.userId = userId;
    }

    // Search filter
    if (search) {
      const searchConditions: any[] = [
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { project: { client: { contains: search, mode: 'insensitive' } } },
      ];
      if (role !== 'EMPLOYEE') {
        searchConditions.push({
          user: { name: { contains: search, mode: 'insensitive' } },
        });
      }
      where.OR = searchConditions;
    }

    // Status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const skip = (page - 1) * pageSize;

    const [timesheets, totalCount] = await Promise.all([
      prisma.timesheet.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true },
          },
          project: {
            select: { name: true, client: true },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.timesheet.count({ where }),
    ]);

    return {
      success: true,
      timesheets: timesheets.map((t: any) => ({
        ...t,
        date: t.date.toISOString().split('T')[0], // format date for client table
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch timesheets' };
  }
}
