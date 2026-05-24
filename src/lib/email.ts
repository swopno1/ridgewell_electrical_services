// src/lib/email.ts
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const appName = 'TimesheetPro';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    if (resend) {
      const response = await resend.emails.send({
        from: `${appName} <${fromEmail}>`,
        to,
        subject,
        html,
        text,
      });

      if (response.error) {
        console.error('Resend email sending error:', response.error);
        return { success: false, error: response.error.message };
      }

      return { success: true, messageId: response.data?.id };
    } else {
      // Dev mode console fallback
      console.log('\n==================================================');
      console.log(`✉️  [DEV EMAIL FALLBACK] Sending email to: ${to}`);
      console.log(`📌 Subject: ${subject}`);
      console.log('--------------------------------------------------');
      console.log(`📝 Text Content:\n${text}`);
      console.log('==================================================\n');
      return { success: true, devMode: true };
    }
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message || 'Unknown email sending error' };
  }
}
