# Release Notes & Maintenance Proposal

This document outlines the version 1.0 (MVP) release for Ridgewell Electrical Services LTD (Ridgewell ES) and details the recommended infrastructure and ongoing support strategy to ensure system stability.

## 1. Version 1.0 Release Notes (MVP)

The initial release of TimesheetPro provides a robust foundation for Ridgewell ES's workforce management. Key features delivered in this version include:

*   **Employee Management**: Centralized directory with role-based access control (Admin, Manager, Employee).
*   **Timesheet System**: Daily shift logging with automatic break deductions and overtime calculations (1.25x multiplier).
*   **Leave Management**: Full lifecycle for Annual, Sick, and Unpaid leave with entitlement tracking.
*   **Manager Approvals**: Dedicated queues for timesheet and leave request verification.
*   **Reporting & Analytics**: Project-based labor auditing and individual employee performance summaries.
*   **Integrated Documentation**: In-app user guides and system documentation.

## 2. Finalized Hosting Strategy

To ensure high performance and zero-downtime deployments, we have selected Vercel as the primary hosting provider.

### Hosting Option: Vercel
*   **Plan**: Hobby (Standard)
*   **Estimated Cost**: $0/month (Upgrade to Pro only if team size or bandwidth exceeds Hobby limits)
*   **Key Benefits**:
    *   **Global Edge Network**: Sub-second page loads for all UK-based employees.
    *   **Automated CI/CD**: Seamless updates and instant rollbacks if needed.
    *   **Managed Security**: Automatic SSL certificates and DDoS protection.
    *   **Database**: Integration with Render Postgres for reliable data persistence.

## 3. Maintenance System: The "Steady-State" Plan

To keep the application secure, performant, and up-to-date with evolving web standards, we suggest a monthly maintenance retainer.

### Plan Investment: $100/month

This comprehensive support package ensures your business operations remain uninterrupted:

*   **Security Updates**: Monthly patching of all system dependencies and periodic Prisma schema audits to protect sensitive data.
*   **Database Backups**: Automated daily backups of the production database with off-site storage to ensure data integrity and disaster recovery.
*   **Bug Support**: Priority 48-hour response time for any critical issues or system-level bugs identified in the production environment.
*   **Small Tweaks**: Up to 2 hours of development time per month for minor UI adjustments, text changes, or report refinements.
*   **Health Monitoring**: Implementation of professional monitoring (UptimeRobot/Render alerts) to ensure 99.9% availability and proactive incident response.

## 4. Service Workflow

1.  **Request Submission**: Client submits minor requests or bug reports via the official support channel.
2.  **Triage**: We categorize the request under "Maintenance" (included) or "Feature Enhancement" (quoted separately).
3.  **Deployment**: All updates are validated in a staging environment before being deployed to the live Ridgewell ES production site.

---
**Prepared for**: Ridgewell Electrical Services LTD.
**Date**: May 26, 2026
