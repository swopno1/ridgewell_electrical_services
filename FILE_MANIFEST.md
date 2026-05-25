# File Manifest

Detailed list of key files and their purposes in the TimesheetPro project.

## Core Application

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Root page (redirects to dashboard). |
| `src/app/dashboard/page.tsx` | Main dashboard entry point. |
| `src/app/dashboard/DashboardClientPage.tsx` | Client-side logic for the dashboard. |
| `src/auth.ts` | Main authentication entry point. |
| `src/auth/config.ts` | NextAuth.js strategy and provider configuration. |
| `proxy.ts` | Custom middleware for routing and protection. |

## Server Actions (`src/actions/`)

| File | Description |
|------|-------------|
| `auth.ts` | Handles sign in, sign up, and password resets. |
| `employee.ts` | CRUD operations for managing employee profiles. |
| `leave.ts` | Manages leave requests, balances, and approvals. |
| `project.ts` | Handles project creation and management. |
| `report.ts` | Fetches data for payroll and hours reports. |
| `timesheet.ts` | Manages daily timesheet entries and approval workflows. |

## Components (`src/components/`)

### Forms
- `EmployeeForm.tsx`: Reusable form for employee creation/editing.
- `ProjectForm.tsx`: Form for project management.
- `TimesheetForm.tsx`: Form for daily time entry.
- `LeaveRequestForm.tsx`: Form for requesting leave.

### Tables
- `EmployeeTable.tsx`: List view for employees with filters.
- `ProjectTable.tsx`: List view for projects.
- `TimesheetTable.tsx`: List view for timesheet entries.
- `LeaveTable.tsx`: List view for leave requests.

### Widgets
- `Calendar.tsx`: Calendar widget for the dashboard.
- `DashboardMetrics.tsx`: Summary statistics for admins/managers.
- `LeaveBalance.tsx`: Display of user leave entitlements.
- `PendingApprovals.tsx`: Actionable list of items awaiting approval.

## Libraries & Utilities (`src/lib/`)

| File | Description |
|------|-------------|
| `config.ts` | Centralized configuration for navigation, branding, and roles. |
| `prisma.ts` | Singleton instance of the Prisma client. |
| `email.ts` | Integration with Resend for transactional emails. |
| `auth-utils.ts` | Password hashing and authentication helpers. |
| `utils.ts` | General-purpose helper functions. |

## Database (`prisma/`)

- `schema.prisma`: Defines the 13 models including User, Timesheet, LeaveRequest, Project, etc.

## Verification (`verification/`)

- `reports-verification.spec.ts`: Playwright tests for reporting features.
- `verify_auth_pages.py`: Automated script for checking auth flows.

---
**Last Updated**: 2024
