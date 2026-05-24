// src/actions/project.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  client: z.string().min(2, 'Client name must be at least 2 characters'),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

// Helper to check for ADMIN or MANAGER role (allowed to manage projects)
async function ensureManagerOrAdmin() {
  const session = await getSession();
  if (!session?.user?.role || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    throw new Error('Unauthorized');
  }
  return session;
}

// Helper to verify user is logged in
async function ensureLoggedIn() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getProjectsAction(
  search?: string,
  status?: string,
  page = 1,
  pageSize = 10
) {
  try {
    await ensureLoggedIn();

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'ACTIVE') {
      where.active = true;
    } else if (status === 'INACTIVE') {
      where.active = false;
    }

    const skip = (page - 1) * pageSize;

    // Fetch projects and sum up their total hours
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { timesheets: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Aggregate hours for the fetched projects
    const projectIds = projects.map((p) => p.id);
    const hoursAggregation = await prisma.timesheet.groupBy({
      by: ['projectId'],
      where: {
        projectId: { in: projectIds },
      },
      _sum: {
        totalHours: true,
      },
    });

    const hoursMap = new Map<string, number>();
    hoursAggregation.forEach((agg) => {
      hoursMap.set(agg.projectId, agg._sum.totalHours || 0);
    });

    const projectsWithHours = projects.map((project) => ({
      ...project,
      totalHoursLogged: hoursMap.get(project.id) || 0,
    }));

    return {
      success: true,
      projects: projectsWithHours,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch projects' };
  }
}

export async function getProjectByIdAction(id: string) {
  try {
    await ensureLoggedIn();

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return { error: 'Project not found' };
    }

    return { success: true, project };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch project' };
  }
}

export async function createProjectAction(data: unknown) {
  try {
    await ensureManagerOrAdmin();
    const validated = projectSchema.parse(data);

    // Check if project name already exists to prevent duplicate entries
    const existingProject = await prisma.project.findFirst({
      where: { name: validated.name },
    });

    if (existingProject) {
      return { error: 'A project with this name already exists' };
    }

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        client: validated.client,
        description: validated.description || '',
        active: validated.active,
      },
    });

    revalidatePath('/projects');
    return { success: true, project };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to create project' };
  }
}

export async function updateProjectAction(id: string, data: unknown) {
  try {
    await ensureManagerOrAdmin();
    const validated = projectSchema.parse(data);

    const existingProject = await prisma.project.findFirst({
      where: {
        name: validated.name,
        NOT: { id },
      },
    });

    if (existingProject) {
      return { error: 'Another project with this name already exists' };
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name: validated.name,
        client: validated.client,
        description: validated.description || '',
        active: validated.active,
      },
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    return { success: true, project };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update project' };
  }
}

export async function toggleProjectStatusAction(id: string) {
  try {
    await ensureManagerOrAdmin();

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return { error: 'Project not found' };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        active: !project.active,
      },
    });

    revalidatePath('/projects');
    return { success: true, project: updated };
  } catch (error: any) {
    return { error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to toggle project status' };
  }
}

export async function getProjectHoursSummaryAction(id: string) {
  try {
    await ensureLoggedIn();

    const aggregation = await prisma.timesheet.aggregate({
      where: { projectId: id },
      _sum: {
        totalHours: true,
        overtimeHours: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      success: true,
      totalHours: aggregation._sum.totalHours || 0,
      overtimeHours: aggregation._sum.overtimeHours || 0,
      timesheetsCount: aggregation._count.id || 0,
    };
  } catch {
    return { error: 'Failed to fetch project hours summary' };
  }
}
