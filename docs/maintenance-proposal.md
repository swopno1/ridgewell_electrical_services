# Maintenance & Hosting Proposal

To ensure TimesheetPro continues to run smoothly and scales with Ridgewell ES, we propose the following hosting and maintenance plan.

## 1. Hosting Options

### Option A: Vercel (Recommended for Launch)
*   **Plan**: Hobby / Pro
*   **Cost**: $0 - $20/month
*   **Pros**: Fastest performance, seamless deployments, automatic SSL, global CDN.
*   **Cons**: Managed platform (less control over the server environment).

### Option B: Hostinger VPS
*   **Plan**: KVM 2 or higher
*   **Cost**: Approx. $5 - $12/month
*   **Pros**: Dedicated resources, full control, fixed costs, lower long-term price for database + app.
*   **Cons**: Requires manual setup, security hardening, and ongoing OS updates.

**Recommendation**: Start with **Vercel Hobby** for the first 1-2 months to verify the app in production. If the team grows or you hit platform limits, migrate to **Hostinger VPS** for cost efficiency.

## 2. Maintenance System (Retainer)

We suggest a monthly maintenance system to keep the application secure and up-to-date.

### The "Steady-State" Plan - $150/month
*   **Security Updates**: Monthly patching of dependencies and Prisma schema audits.
*   **Database Backups**: Automated daily backups with off-site storage.
*   **Bug Support**: 48-hour response time for any critical issues.
*   **Small Tweaks**: Up to 2 hours of development time for minor UI changes or report adjustments.
*   **Health Monitoring**: Setting up UptimeRobot/Render alerts to ensure 99.9% availability.

## 3. Regular Service Workflow

To manage requests efficiently, we will implement a simple "Service Portal" or Shared Document:
1.  **Request**: Client submits a feature request or bug report via a dedicated email/form.
2.  **Review**: We categorize the request (Maintenance vs. New Feature).
3.  **Execution**: Maintenance items are handled within the retainer. New features are quoted separately at a discounted hourly rate for retainer clients.
4.  **Deployment**: All changes are tested in a 'Staging' environment before being pushed to the live Ridgewell ES production site.

## 4. Next Steps
1.  Confirm hosting preference (Vercel vs. Hostinger).
2.  Approve the maintenance retainer.
3.  Finalize the "Time and a Quarter" multiplier adjustment.
