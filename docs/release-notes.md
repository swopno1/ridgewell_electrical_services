# Release Notes

Official release notes for **Ridgewell ES** — the timesheet and leave management system for Ridgewell Electrical Services, developed by ViveScript Solutions.

---

## Version 1.1.0 — Calendar View Update

**Released:** June 2026

### New Features

- **Calendar View** — A full month-by-month visual calendar showing all timesheet entries and leave requests in a colour-coded grid. Admin and Manager views display the entire team; Employee views show personal data only.
- **Day Detail Panel** — Clicking any calendar day with entries opens an inline detail panel showing every timesheet and leave request for that date, with full status, time range, project, and employee name (admin/manager).
- **Entry Count Badges** — Each day cell shows a count badge and a "+N more" indicator when entries exceed the visible limit, so no data is ever silently hidden.
- **Legend** — A persistent colour key below the calendar grid explains all status colours at a glance.

---

## Version 1.0.0 — MVP Release

**Released:** May 2026

### Key Features Delivered

- **Core Workforce Directory** — Centralised employee tracking with Role-Based Access Control (RBAC) supporting Admin, Manager, and Employee tiers.
- **Smart Timesheet Logger** — Daily time-entry logging with automatic break calculations and overtime detection (1.25× multiplier above 8 hours standard).
- **Leave Management Portal** — Full lifecycle for Annual, Sick, and Unpaid leave requests with live balance counters.
- **Approval Queues** — Dedicated queues for Managers and Admins to approve, reject, and comment on timesheets and leave requests.
- **Reporting Engine** — Labour tracking by project, payroll summaries, and employee hour statistics, exportable to PDF or CSV.
- **In-App Documentation** — Centralised help centre for onboarding new users.

---

## Infrastructure & Hosting

| Layer | Service |
| :--- | :--- |
| **Frontend & Backend** | Vercel (edge network, UK region) |
| **Database** | Render PostgreSQL — isolated transactions, high durability |
| **CI/CD** | Git-based automatic deployments |

---

## Maintenance & Support Plan

### Steady-State Plan — £100 / month

| Item | Detail |
| :--- | :--- |
| **Security & Dependency Audits** | Monthly npm package updates and database schema optimisation |
| **Automated Backups** | Daily database dumps, 14-day offsite retention |
| **Priority Bug Fixes** | 48-hour response/resolution SLA for critical production issues |
| **Minor Enhancements** | Up to 2 hours of development time per month for UI tweaks, copy updates, or minor report adjustments |
| **Uptime Monitoring** | Proactive alerts via UptimeRobot to catch and resolve network issues before users are affected |

### Support Workflow

1. **Submit a Request** — via the designated support channel.
2. **Review & Triage** — classified as standard maintenance (covered under SLA) or a feature request (scoped separately).
3. **Stage & Deploy** — validated on a staging environment before rolling out to production.

---

**Prepared for:** Ridgewell Electrical Services LTD
**Developed by:** ViveScript Solutions
