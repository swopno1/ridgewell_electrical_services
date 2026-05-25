'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { startOfMonth, endOfMonth } from 'date-fns';
import Papa from 'papaparse';

export async function generatePayrollSummary(startDate?: Date, endDate?: Date) {
  try {
    const session = await getSession();
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return { error: 'Unauthorized' };
    }

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const employees = await prisma.user.findMany({
      where: { active: true },
      include: {
        timesheets: {
          where: {
            date: { gte: start, lte: end },
            status: 'APPROVED',
          },
        },
        leaveRequests: {
          where: {
            startDate: { lte: end },
            endDate: { gte: start },
            status: 'APPROVED',
          },
        },
      },
    });

    const report = employees.map((emp: any) => {
      const totalRegularHours = emp.timesheets.reduce((sum: number, ts: any) => sum + (ts.totalHours - ts.overtimeHours), 0);
      const totalOvertimeHours = emp.timesheets.reduce((sum: number, ts: any) => sum + ts.overtimeHours, 0);

      let totalLeaveDays = 0;
      emp.leaveRequests.forEach((lr: any) => {
        const lrStart = lr.startDate < start ? start : lr.startDate;
        const lrEnd = lr.endDate > end ? end : lr.endDate;
        const diffTime = Math.abs(lrEnd.getTime() - lrStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        totalLeaveDays += diffDays;
      });

      return {
        'Employee Name': emp.name,
        'Email': emp.email,
        'Regular Hours': totalRegularHours.toFixed(2),
        'Overtime Hours': totalOvertimeHours.toFixed(2),
        'Total Hours': (totalRegularHours + totalOvertimeHours).toFixed(2),
        'Leave Days': totalLeaveDays,
      };
    });

    return { success: true, data: report };
  } catch (error) {
    console.error('Error generating payroll summary:', error);
    return { error: 'Failed to generate payroll summary' };
  }
}

export async function generateHoursSummary(startDate?: Date, endDate?: Date) {
  try {
    const session = await getSession();
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return { error: 'Unauthorized' };
    }

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const timesheets = await prisma.timesheet.findMany({
      where: {
        date: { gte: start, lte: end },
        status: 'APPROVED',
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const summaryMap: Record<string, any> = {};

    timesheets.forEach((ts: any) => {
      if (!summaryMap[ts.userId]) {
        summaryMap[ts.userId] = {
          'Employee Name': ts.user.name,
          'Regular Hours': 0,
          'Overtime Hours': 0,
          'Total Hours': 0,
        };
      }
      summaryMap[ts.userId]['Regular Hours'] += (ts.totalHours - ts.overtimeHours);
      summaryMap[ts.userId]['Overtime Hours'] += ts.overtimeHours;
      summaryMap[ts.userId]['Total Hours'] += ts.totalHours;
    });

    const data = Object.values(summaryMap).map((item: any) => ({
      ...item,
      'Regular Hours': item['Regular Hours'].toFixed(2),
      'Overtime Hours': item['Overtime Hours'].toFixed(2),
      'Total Hours': item['Total Hours'].toFixed(2),
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Error generating hours summary:', error);
    return { error: 'Failed to generate hours summary' };
  }
}

export async function generateProjectReport(startDate?: Date, endDate?: Date) {
  try {
    const session = await getSession();
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return { error: 'Unauthorized' };
    }

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const projects = await prisma.project.findMany({
      include: {
        timesheets: {
          where: {
            date: { gte: start, lte: end },
            status: 'APPROVED',
          },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    const report = projects.map((project: any) => {
      const totalHours = project.timesheets.reduce((sum: number, ts: any) => sum + ts.totalHours, 0);
      const employeesMap: Record<string, string> = {};
      project.timesheets.forEach((ts: any) => {
        employeesMap[ts.userId] = ts.user.name;
      });

      return {
        'Project Name': project.name,
        'Client': project.client,
        'Total Hours': totalHours.toFixed(2),
        'Employee Count': Object.keys(employeesMap).length,
        'Employees': Object.values(employeesMap).join(', '),
      };
    });

    return { success: true, data: report };
  } catch (error) {
    console.error('Error generating project report:', error);
    return { error: 'Failed to generate project report' };
  }
}

export async function exportToCSV(data: any[]) {
  try {
    const csv = Papa.unparse(data);
    return { success: true, data: csv };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { error: 'Failed to export to CSV' };
  }
}

export async function exportToPDF(data: any[]) {
  try {
    return { success: true, data };
  } catch (error) {
    console.error('Error preparing PDF data:', error);
    return { error: 'Failed to prepare PDF data' };
  }
}
