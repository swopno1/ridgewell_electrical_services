// src/lib/notifications.ts
import { prisma } from './prisma';
import { sendEmail } from './email';
import { appConfig } from './config';
import { format } from 'date-fns';

const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Fetches all active Admins and Managers to notify them of new submissions.
 */
async function getApproverEmails() {
  const approvers = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'MANAGER'] },
      active: true,
    },
    select: { email: true },
  });
  return approvers.map((a) => a.email);
}

/**
 * Notify admins/managers when a new timesheet is submitted.
 */
export async function notifyTimesheetSubmission(timesheet: any) {
  if (!appConfig.email.enableNotifications) return;

  const approverEmails = await getApproverEmails();
  if (approverEmails.length === 0) return;

  const subject = `New Timesheet Submitted: ${timesheet.user.name}`;
  const dateStr = format(new Date(timesheet.date), 'PPP');

  const text = `Hi,

${timesheet.user.name} has submitted a new timesheet for ${dateStr}.

Project: ${timesheet.project.name}
Total Hours: ${timesheet.totalHours}
Overtime: ${timesheet.overtimeHours}

You can review and approve it here: ${appUrl}/dashboard

Regards,
${appConfig.app.name} Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-top: 0;">New Timesheet Submitted</h2>
      <p><strong>${timesheet.user.name}</strong> has submitted a new timesheet.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${dateStr}</p>
        <p style="margin: 5px 0;"><strong>Project:</strong> ${timesheet.project.name}</p>
        <p style="margin: 5px 0;"><strong>Total Hours:</strong> ${timesheet.totalHours}</p>
        <p style="margin: 5px 0;"><strong>Overtime:</strong> ${timesheet.overtimeHours}</p>
      </div>
      <a href="${appUrl}/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Timesheet</a>
      <p style="color: #64748b; font-size: 14px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        This is an automated notification from ${appConfig.app.name}.
      </p>
    </div>
  `;

  return sendEmail({ to: approverEmails, subject, text, html });
}

/**
 * Notify employee when their timesheet is approved or rejected.
 */
export async function notifyTimesheetStatusChange(timesheet: any, approved: boolean, comment?: string) {
  if (!appConfig.email.enableNotifications) return;

  const status = approved ? 'APPROVED' : 'REJECTED';
  const subject = `Timesheet ${status}: ${format(new Date(timesheet.date), 'PPP')}`;

  const text = `Hi ${timesheet.user.name},

Your timesheet for ${format(new Date(timesheet.date), 'PPP')} has been ${status.toLowerCase()}.

Project: ${timesheet.project.name}
${comment ? `Comment: ${comment}` : ''}

You can view your timesheets here: ${appUrl}/timesheets

Regards,
${appConfig.app.name} Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: ${approved ? '#059669' : '#dc2626'}; margin-top: 0;">Timesheet ${status}</h2>
      <p>Hi ${timesheet.user.name}, your timesheet for <strong>${format(new Date(timesheet.date), 'PPP')}</strong> has been ${status.toLowerCase()}.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Project:</strong> ${timesheet.project.name}</p>
        ${comment ? `<p style="margin: 5px 0;"><strong>Comment:</strong> ${comment}</p>` : ''}
      </div>
      <a href="${appUrl}/timesheets" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Timesheets</a>
      <p style="color: #64748b; font-size: 14px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        This is an automated notification from ${appConfig.app.name}.
      </p>
    </div>
  `;

  return sendEmail({ to: timesheet.user.email, subject, text, html });
}

/**
 * Notify admins/managers when a new leave request is submitted.
 */
export async function notifyLeaveSubmission(leaveRequest: any) {
  if (!appConfig.email.enableNotifications) return;

  const approverEmails = await getApproverEmails();
  if (approverEmails.length === 0) return;

  const subject = `New Leave Request: ${leaveRequest.user.name}`;
  const startStr = format(new Date(leaveRequest.startDate), 'PPP');
  const endStr = format(new Date(leaveRequest.endDate), 'PPP');

  const text = `Hi,

${leaveRequest.user.name} has submitted a new leave request.

Type: ${leaveRequest.leaveType}
From: ${startStr}
To: ${endStr}
Total Days: ${leaveRequest.totalDays}
Reason: ${leaveRequest.reason}

You can review and approve it here: ${appUrl}/dashboard

Regards,
${appConfig.app.name} Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-top: 0;">New Leave Request</h2>
      <p><strong>${leaveRequest.user.name}</strong> has submitted a new leave request.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Type:</strong> ${leaveRequest.leaveType}</p>
        <p style="margin: 5px 0;"><strong>Period:</strong> ${startStr} - ${endStr}</p>
        <p style="margin: 5px 0;"><strong>Total Days:</strong> ${leaveRequest.totalDays}</p>
        <p style="margin: 5px 0;"><strong>Reason:</strong> ${leaveRequest.reason}</p>
      </div>
      <a href="${appUrl}/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Request</a>
      <p style="color: #64748b; font-size: 14px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        This is an automated notification from ${appConfig.app.name}.
      </p>
    </div>
  `;

  return sendEmail({ to: approverEmails, subject, text, html });
}

/**
 * Notify employee when their leave request is approved or rejected.
 */
export async function notifyLeaveStatusChange(leaveRequest: any, approved: boolean, comment?: string) {
  if (!appConfig.email.enableNotifications) return;

  const status = approved ? 'APPROVED' : 'REJECTED';
  const subject = `Leave Request ${status}: ${format(new Date(leaveRequest.startDate), 'PPP')}`;

  const text = `Hi ${leaveRequest.user.name},

Your leave request for ${format(new Date(leaveRequest.startDate), 'PPP')} to ${format(new Date(leaveRequest.endDate), 'PPP')} has been ${status.toLowerCase()}.

Type: ${leaveRequest.leaveType}
${comment ? `Comment: ${comment}` : ''}

You can view your leave requests here: ${appUrl}/leave

Regards,
${appConfig.app.name} Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: ${approved ? '#059669' : '#dc2626'}; margin-top: 0;">Leave Request ${status}</h2>
      <p>Hi ${leaveRequest.user.name}, your leave request from <strong>${format(new Date(leaveRequest.startDate), 'PPP')}</strong> to <strong>${format(new Date(leaveRequest.endDate), 'PPP')}</strong> has been ${status.toLowerCase()}.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Type:</strong> ${leaveRequest.leaveType}</p>
        ${comment ? `<p style="margin: 5px 0;"><strong>Comment:</strong> ${comment}</p>` : ''}
      </div>
      <a href="${appUrl}/leave" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Requests</a>
      <p style="color: #64748b; font-size: 14px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        This is an automated notification from ${appConfig.app.name}.
      </p>
    </div>
  `;

  return sendEmail({ to: leaveRequest.user.email, subject, text, html });
}
