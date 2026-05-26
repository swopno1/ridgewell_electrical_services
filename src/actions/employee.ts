'use server';

import { prisma } from '@/lib/prisma';
import * as z from 'zod';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/auth-utils';
import { sendEmail } from '@/lib/email';
import { appConfig } from '@/lib/config';

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
  active: z.boolean().default(true),
  hourlyRate: z.coerce.number().min(0).optional(),
  overtimeRate: z.coerce.number().min(0).optional(),
  annualLeaveQuota: z.coerce.number().min(0).optional(),
  designation: z.string().optional(),
  standardWorkHours: z.coerce.number().min(1).max(24).optional(),
  password: z.string().optional().or(z.literal('')),
});

// Helper to generate a random hex token
function generateToken(): string {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

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

    const employee = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        role: validated.role,
        active: validated.active,
        hourlyRate: validated.hourlyRate || 0,
        overtimeRate: validated.overtimeRate || 0,
        annualLeaveQuota: validated.annualLeaveQuota || 20,
        designation: validated.designation || 'Employee',
        standardWorkHours: validated.standardWorkHours || 8,
      },
    });

    // Generate setup token (using VerificationToken)
    const setupIdentifier = `setup:${validated.email}`;
    const token = generateToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.verificationToken.create({
      data: {
        identifier: setupIdentifier,
        token,
        expires,
      },
    });

    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const setupLink = `${appUrl}/auth/setup-password?token=${token}&email=${encodeURIComponent(validated.email)}`;

    // Send invitation email
    await sendEmail({
      to: validated.email,
      subject: `Invitation to join ${appConfig.app.name}`,
      text: `Hi ${validated.name},\n\nYou have been invited to join ${appConfig.app.name}. Please set up your account password by clicking the following link:\n${setupLink}\n\nThis link is valid for 7 days.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #2563eb;">Welcome to ${appConfig.app.name}</h2>
          <p>Hi ${validated.name},</p>
          <p>You have been invited to join the ${appConfig.app.name} platform. To get started, please click the button below to set up your account password:</p>
          <div style="margin: 24px 0;">
            <a href="${setupLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Set Up Account</a>
          </div>
          <p style="font-size: 14px; color: #475569;">Once you set your password, you will be able to sign in and access your dashboard.</p>
          <p style="font-size: 12px; color: #64748b;">Or copy and paste this link into your browser: <br/> ${setupLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b;">This invitation link is valid for 7 days.</p>
        </div>
      `,
    });

    // Also initialize leave balance for this year
    const year = new Date().getFullYear();
    await prisma.leaveBalance.create({
      data: {
        userId: employee.id,
        year,
        annualEntitled: validated.annualLeaveQuota || 20,
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
      hourlyRate: validated.hourlyRate ?? 0,
      overtimeRate: validated.overtimeRate ?? 0,
      annualLeaveQuota: validated.annualLeaveQuota ?? 20,
      designation: validated.designation ?? 'Employee',
      standardWorkHours: validated.standardWorkHours ?? 8,
    };

    if (validated.password) {
      updateData.password = await hashPassword(validated.password);
    }

    const employee = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Update leave balance if quota changed for current year
    const year = new Date().getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
      where: { userId_year: { userId: id, year } },
    });

    if (balance && validated.annualLeaveQuota !== undefined && balance.annualEntitled !== validated.annualLeaveQuota) {
      await prisma.leaveBalance.update({
        where: { id: balance.id },
        data: { annualEntitled: validated.annualLeaveQuota },
      });
    }

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

    const newStatus = !employee.active;
    const updated = await prisma.user.update({
      where: { id },
      data: {
        active: newStatus,
      },
    });

    // If activated, send notification email
    if (newStatus) {
      await sendEmail({
        to: employee.email,
        subject: `Your ${appConfig.app.name} account has been activated`,
        text: `Hi ${employee.name},\n\nYour account on ${appConfig.app.name} has been activated by an administrator. You can now sign in using your email and password.\n\nSign in here: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
            <h2 style="color: #2563eb;">Account Activated</h2>
            <p>Hi ${employee.name},</p>
            <p>Your account on <strong>${appConfig.app.name}</strong> has been activated by an administrator.</p>
            <p>You can now sign in to your dashboard to manage your timesheets and leave requests.</p>
            <div style="margin: 24px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Sign In Now</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b;">If you have any questions, please contact your manager.</p>
          </div>
        `,
      });
    }

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
