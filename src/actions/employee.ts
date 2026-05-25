// src/actions/employee.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { hashPassword } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
  active: z.boolean().default(true),
  password: z.string().optional().or(z.literal('')),
});

// Helper to enforce admin authorization
async function ensureAdmin() {
  const session = await getSession();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

// Helper to enforce manager or admin authorization
async function ensureManagerOrAdmin() {
  const session = await getSession();
  if (!session?.user?.role || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getEmployeesAction(
  search?: string,
  role?: string,
  status?: string,
  page = 1,
  pageSize = 10
) {
  try {
    await ensureManagerOrAdmin();

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && role !== 'ALL') {
      where.role = role;
    }

    if (status === 'ACTIVE') {
      where.active = true;
    } else if (status === 'INACTIVE') {
      where.active = false;
    }

    const skip = (page - 1) * pageSize;

    const [employees, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      employees,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch employees' };
  }
}

export async function getEmployeeByIdAction(id: string) {
  try {
    await ensureManagerOrAdmin();

    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee) {
      return { error: 'Employee not found' };
    }

    return { success: true, employee };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch employee' };
  }
}

export async function createEmployeeAction(data: unknown) {
  try {
    await ensureAdmin();
    const validated = employeeSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    // Password for newly created employees
    const hashedPassword = await hashPassword(validated.password || 'Employee@123456');

    const employee = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
        active: validated.active,
      },
    });

    // Also initialize leave balance for this year
    const year = new Date().getFullYear();
    await prisma.leaveBalance.create({
      data: {
        userId: employee.id,
        year,
        annualEntitled: 20,
        annualUsed: 0,
        sickUsed: 0,
      },
    });

    revalidatePath('/employees');
    return { success: true, employee };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to create employee' };
  }
}

export async function updateEmployeeAction(id: string, data: unknown) {
  try {
    await ensureAdmin();
    const validated = employeeSchema.parse(data);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: validated.email,
        NOT: { id },
      },
    });

    if (existingUser) {
      return { error: 'Email already registered to another user' };
    }

    const updateData: any = {
      name: validated.name,
      email: validated.email,
      role: validated.role,
      active: validated.active,
    };

    if (validated.password) {
      updateData.password = await hashPassword(validated.password);
    }

    const employee = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/employees');
    revalidatePath(`/employees/${id}`);
    return { success: true, employee };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update employee' };
  }
}

export async function toggleEmployeeStatusAction(id: string) {
  try {
    await ensureAdmin();

    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee) {
      return { error: 'Employee not found' };
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        active: !employee.active,
      },
    });

    revalidatePath('/employees');
    return { success: true, employee: updated };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to toggle employee status' };
  }
}

export async function deleteEmployeeAction(id: string) {
  try {
    await ensureAdmin();

    // Check if employee has timesheets or leave requests
    const [timesheetsCount, leaveCount] = await Promise.all([
      prisma.timesheet.count({ where: { userId: id } }),
      prisma.leaveRequest.count({ where: { userId: id } }),
    ]);

    if (timesheetsCount > 0 || leaveCount > 0) {
      // If employee has data, perform soft delete (deactivate)
      const updated = await prisma.user.update({
        where: { id },
        data: { active: false },
      });
      revalidatePath('/employees');
      return { success: true, type: 'soft', employee: updated };
    }

    // Otherwise, perform hard delete
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/employees');
    return { success: true, type: 'hard' };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to delete employee' };
  }
}
