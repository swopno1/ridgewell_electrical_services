# Release Notes

Welcome to the official release notes for **TimesheetPro** (v1.0.0). Below you will find details about the initial MVP features, the deployment and hosting architecture, and the proposed support plan.

---

## 1. Version 1.0.0 (MVP Release)

The initial version of TimesheetPro delivers a fully-functional, secure, and production-ready workforce management system tailored for small-to-medium teams.

### Key Features Delivered
* **Core Workforce Directory**: Centralized employee tracking with Role-Based Access Control (RBAC) supporting `Admin`, `Manager`, and `Employee` tiers.
* **Smart Timesheet Logger**: Daily time entry logs featuring automatic break calculations and overtime detection (applying a standard 1.25x multiplier above 8 hours).
* **Leave Management Portal**: Streamlined lifecycle for submitting and tracking Annual, Sick, and Unpaid leave requests with live balance counters.
* **Approval Queues**: Dedicated queues allowing Managers and Admins to approve, reject, and leave feedback on timesheets and leave requests.
* **Reporting Engine**: Labor tracking by project, payroll summary logs, and employee working-hour statistics, exportable directly to PDF or CSV format.
* **In-App Documentation**: Centralized help center for quick onboarding of new users.

---

## 2. Infrastructure & Hosting Architecture

To guarantee 99.9% uptime, rapid page loads, and zero-downtime deployments, the system is configured to run on top of modern cloud services:

* **Frontend & Backend Hosting**: **Vercel** (standard edge layer routing) for fast static and dynamic server response times in the UK.
* **Database Layer**: **Render PostgreSQL** database cluster ensuring isolated transaction boundaries, high safety levels, and reliable data persistence.
* **CI/CD Integration**: Automatic git-based deployments for seamless rolling updates.

---

## 3. Maintenance & Support Proposal

To ensure the long-term health, security, and stability of the platform, we recommend enrolling in the **Steady-State Maintenance Plan**.

### Service Overview
* **Investment**: `$100 / month`
* **Security & Audits**: Monthly dependency updates (npm packages, security patches) and database schema optimization.
* **Automated Backups**: Daily database dumps stored offsite with a 14-day retention cycle.
* **Priority Bug Fixes**: Guaranteed 48-hour response/resolution time for any critical production issues.
* **Minor Enhancements**: Up to 2 hours of development time per month for UI styling tweaks, copy updates, or minor report layouts.
* **Availability Checks**: Proactive uptime alerts via UptimeRobot to resolve any network issues before users are affected.

### Service Workflow
1. **Submit Request**: Send support tickets or modification requests via the designated channel.
2. **Review & Triage**: Tasks are classified as standard maintenance (covered under SLA) or feature requests (scoped separately).
3. **Stage & Deploy**: Changes are validated on a test server before rolling out to the production system.

---

**Prepared for**: Ridgewell Electrical Services LTD  
**Release Date**: May 27, 2026
