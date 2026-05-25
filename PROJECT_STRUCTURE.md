# Project Structure

## Directory Tree

```
timesheet-app/                    # Root
├── src/                          # Source code
│   ├── app/                      # Next.js App Router pages
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── signin/           # Sign in page
│   │   │   ├── signup/           # Sign up page
│   │   │   ├── forgot-password/  # Password reset request
│   │   │   ├── reset-password/   # New password entry
│   │   │   └── verify-email/     # Email verification
│   │   ├── dashboard/            # Main dashboard
│   │   ├── timesheets/           # Timesheet management
│   │   │   ├── [id]/             # View/Edit timesheet
│   │   │   ├── approvals/        # Approval queue
│   │   │   └── new/              # Create timesheet
│   │   ├── leave/                # Leave management
│   │   │   ├── [id]/             # View leave request
│   │   │   ├── approvals/        # Approval queue
│   │   │   └── new/              # Create leave request
│   │   ├── projects/             # Project management
│   │   │   ├── [id]/             # Project details
│   │   │   └── new/              # Create project
│   │   ├── reports/              # Reporting dashboard
│   │   │   ├── payroll/          # Payroll reports
│   │   │   ├── hours/            # Hours reports
│   │   │   └── by-project/       # Project reports
│   │   ├── employees/            # Employee management (Admin)
│   │   │   ├── [id]/             # Employee details
│   │   │   └── new/              # Create employee
│   │   ├── calendar/             # Calendar view
│   │   ├── globals.css           # Global styles
│   │   └── layout.tsx            # Root layout
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components (shadcn/ui style)
│   │   ├── layouts/              # Layout components (DashboardLayout)
│   │   ├── forms/                # Feature-specific forms
│   │   ├── tables/               # Feature-specific tables
│   │   ├── dialogs/              # Modals and dialogs
│   │   ├── reports/              # Report-specific components
│   │   └── widgets/              # Dashboard widgets
│   ├── lib/                      # Shared libraries and utilities
│   │   ├── config.ts             # App configuration
│   │   ├── prisma.ts             # Prisma client
│   │   ├── session.ts            # Session management
│   │   ├── auth-utils.ts         # Auth helpers
│   │   ├── email.ts              # Email service (Resend)
│   │   ├── seed.ts               # Database seeding
│   │   └── utils.ts              # General utilities
│   ├── actions/                  # Server Actions (Mutations/Queries)
│   │   ├── auth.ts               # Auth-related actions
│   │   ├── employee.ts           # Employee CRUD
│   │   ├── leave.ts              # Leave CRUD & approvals
│   │   ├── project.ts            # Project CRUD
│   │   ├── report.ts             # Report data fetching
│   │   └── timesheet.ts          # Timesheet CRUD & approvals
│   ├── auth/                     # Auth configuration
│   │   └── config.ts             # NextAuth config
│   └── types/                    # TypeScript type definitions
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Prisma schema
├── public/                       # Static assets
├── verification/                 # Verification scripts and tests
├── proxy.ts                      # Custom middleware/proxy
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies and scripts
```

## Key Directory Purposes

| Directory | Purpose |
|-----------|---------|
| `src/app` | Contains all application routes and page components. |
| `src/components` | Reusable React components organized by type. |
| `src/actions` | Type-safe Server Actions for database operations and business logic. |
| `src/lib` | Core utility functions, configurations, and shared service clients. |
| `src/auth` | NextAuth.js configuration and authentication logic. |
| `prisma` | Database modeling, schema definitions, and migration history. |
| `verification` | Automated tests and verification scripts for quality assurance. |

## Data Flow

1. **User Interaction**: User interacts with a Client Component in `src/app`.
2. **Action Trigger**: The component calls a Server Action from `src/actions`.
3. **Business Logic**: The action validates input with Zod and performs logic.
4. **Database Access**: The action uses Prisma (`src/lib/prisma.ts`) to query/mutate the database.
5. **Response**: The action returns a result (success/error) to the component.
6. **UI Update**: The component updates the UI based on the action response.

---
**Last Updated**: 2024
