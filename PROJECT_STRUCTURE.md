# Project Structure

## Full Directory Tree

```
timesheet-app/
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Auth layout group
│   │   │   ├── signin/
│   │   │   │   └── page.tsx         # Sign in page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx         # Sign up page
│   │   │   └── layout.tsx           # Auth layout
│   │   │
│   │   ├── dashboard/                # Dashboard pages
│   │   │   ├── page.tsx             # Main dashboard
│   │   │   └── layout.tsx           # Dashboard layout
│   │   │
│   │   ├── timesheets/               # Timesheet management
│   │   │   ├── page.tsx             # List timesheets
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx         # Edit timesheet
│   │   │   │   └── approvals/
│   │   │   │       └── page.tsx     # Approval workflow
│   │   │   └── new/
│   │   │       └── page.tsx         # Create timesheet
│   │   │
│   │   ├── leave/                    # Leave management
│   │   │   ├── page.tsx             # List requests
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # View request
│   │   │   ├── approvals/
│   │   │   │   └── page.tsx         # Approval queue
│   │   │   └── new/
│   │   │       └── page.tsx         # New request
│   │   │
│   │   ├── projects/                 # Project management
│   │   │   ├── page.tsx             # List projects
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # Project detail
│   │   │   └── new/
│   │   │       └── page.tsx         # Create project
│   │   │
│   │   ├── reports/                  # Reporting
│   │   │   ├── page.tsx             # Report dashboard
│   │   │   ├── payroll/
│   │   │   │   └── page.tsx         # Payroll report
│   │   │   ├── hours/
│   │   │   │   └── page.tsx         # Hours report
│   │   │   └── by-project/
│   │   │       └── page.tsx         # Project hours report
│   │   │
│   │   ├── employees/                # Employee management (admin only)
│   │   │   ├── page.tsx             # List employees
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # Employee detail
│   │   │   └── new/
│   │   │       └── page.tsx         # Create employee
│   │   │
│   │   ├── settings/                 # Settings (admin only)
│   │   │   ├── page.tsx             # Settings dashboard
│   │   │   ├── general/
│   │   │   │   └── page.tsx         # General settings
│   │   │   ├── users/
│   │   │   │   └── page.tsx         # User management
│   │   │   └── audit/
│   │   │       └── page.tsx         # Audit logs
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Root redirect to dashboard
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── card.tsx             # Card component
│   │   │   ├── input.tsx            # Input component
│   │   │   ├── label.tsx            # Label component
│   │   │   ├── dialog.tsx           # Dialog/Modal
│   │   │   ├── table.tsx            # Table
│   │   │   ├── select.tsx           # Select dropdown
│   │   │   ├── textarea.tsx         # Textarea
│   │   │   └── badge.tsx            # Badge
│   │   │
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx  # Main dashboard layout
│   │   │   └── AuthLayout.tsx       # Auth pages layout
│   │   │
│   │   ├── forms/
│   │   │   ├── TimesheetForm.tsx    # Timesheet form
│   │   │   ├── LeaveRequestForm.tsx # Leave request form
│   │   │   ├── ProjectForm.tsx      # Project form
│   │   │   ├── EmployeeForm.tsx     # Employee form
│   │   │   └── SettingsForm.tsx     # Settings form
│   │   │
│   │   ├── tables/
│   │   │   ├── TimesheetTable.tsx   # Timesheet list table
│   │   │   ├── LeaveTable.tsx       # Leave requests table
│   │   │   ├── ProjectTable.tsx     # Projects table
│   │   │   ├── EmployeeTable.tsx    # Employees table
│   │   │   └── DataTable.tsx        # Generic data table
│   │   │
│   │   └── shared/
│   │       ├── Header.tsx            # Page header
│   │       ├── Navigation.tsx        # Navigation bar
│   │       ├── Sidebar.tsx           # Sidebar
│   │       ├── Footer.tsx            # Footer
│   │       ├── LoadingSpinner.tsx   # Loading indicator
│   │       └── ErrorBoundary.tsx    # Error handling
│   │
│   ├── lib/                          # Utilities and helpers
│   │   ├── config.ts                # Centralized configuration
│   │   ├── prisma.ts                # Prisma client
│   │   ├── session.ts               # Session utilities
│   │   ├── auth-utils.ts            # Auth helper functions
│   │   ├── utils.ts                 # General utilities
│   │   ├── constants.ts             # App constants
│   │   ├── seed.ts                  # Database seeding
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth hook
│   │   │   ├── useRole.ts           # Role check hook
│   │   │   └── useSession.ts        # Session hook
│   │   └── services/
│   │       ├── timesheet.ts         # Timesheet service
│   │       ├── leave.ts             # Leave service
│   │       ├── project.ts           # Project service
│   │       └── employee.ts          # Employee service
│   │
│   ├── actions/                      # Server actions
│   │   ├── auth.ts                  # Auth actions (signin, signup)
│   │   ├── timesheet.ts             # Timesheet CRUD + approvals
│   │   ├── leave.ts                 # Leave CRUD + approvals
│   │   ├── project.ts               # Project CRUD
│   │   ├── employee.ts              # Employee CRUD
│   │   └── report.ts                # Report generation
│   │
│   ├── auth/
│   │   └── config.ts                # NextAuth configuration
│   │
│   └── types/
│       ├── index.ts                 # Type exports
│       ├── timesheet.ts             # Timesheet types
│       ├── leave.ts                 # Leave types
│       ├── user.ts                  # User types
│       └── common.ts                # Common types
│
├── prisma/
│   ├── schema.prisma                # Database schema (models, enums, relations)
│   ├── seed.ts                      # Seed script
│   └── migrations/                  # Database migrations (auto-generated)
│       ├── migration_lock.toml
│       └── [timestamp]_init/
│           └── migration.sql
│
├── public/                          # Static assets
│   ├── logo.svg                    # App logo
│   ├── favicon.ico                 # Favicon
│   ├── images/
│   │   ├── hero.jpg
│   │   └── placeholder.png
│   └── fonts/                       # Custom fonts (optional)
│
├── .env.example                     # Environment variables template
├── .env.local                       # Environment variables (local only, git-ignored)
├── .gitignore                       # Git ignore rules
├── .prettierrc                      # Code formatter config (optional)
├── .eslintrc.json                   # ESLint config
│
├── next.config.js                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
│
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Locked dependencies
│
├── README.md                        # Project overview
├── ARCHITECTURE.md                  # Architecture decisions
├── DEVELOPMENT.md                   # Development guidelines
├── DEPLOYMENT.md                    # Deployment guide
│
└── docker/                          # Docker configuration (optional)
    ├── Dockerfile                   # Production Dockerfile
    └── docker-compose.yml           # Docker compose for local dev
```

## File Purposes

### Configuration Files

| File | Purpose |
|------|---------|
| `src/lib/config.ts` | Centralized app configuration (name, theme, settings) |
| `.env.example` | Template for environment variables |
| `.env.local` | Local environment variables (git-ignored) |
| `next.config.js` | Next.js build configuration |
| `tsconfig.json` | TypeScript compilation options |
| `tailwind.config.js` | Tailwind CSS theme and plugins |
| `postcss.config.js` | PostCSS processor configuration |

### Core Application

| Directory | Purpose |
|-----------|---------|
| `src/app` | Next.js pages and routes |
| `src/components` | Reusable React components |
| `src/lib` | Utility functions and helpers |
| `src/actions` | Server actions for data operations |
| `src/auth` | Authentication configuration |
| `prisma` | Database schema and migrations |
| `public` | Static assets (images, fonts) |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview and setup instructions |
| `ARCHITECTURE.md` | Design decisions and architectural patterns |
| `DEVELOPMENT.md` | Development guidelines and best practices |
| `DEPLOYMENT.md` | Deployment procedures and guides |

## Key Relationships

```
User (Authentication)
  ↓
Session (NextAuth.js)
  ↓
Server Actions (Type-safe database operations)
  ↓
Prisma (ORM queries)
  ↓
PostgreSQL (Data storage)

Components
  ↓
Server Actions
  ↓
Database Operations
```

## Common Workflows

### Adding a New Feature

1. **Define database model**
   ```
   prisma/schema.prisma → Add model
   ```

2. **Create migration**
   ```bash
   npm run db:migrate -- feature_name
   ```

3. **Create server actions**
   ```
   src/actions/feature.ts → CRUD operations
   ```

4. **Create components**
   ```
   src/components/forms/FeatureForm.tsx
   src/components/tables/FeatureTable.tsx
   ```

5. **Create pages**
   ```
   src/app/features/page.tsx → List
   src/app/features/new/page.tsx → Create
   src/app/features/[id]/page.tsx → View/Edit
   ```

6. **Add tests**
   ```
   src/actions/feature.test.ts
   ```

### Making Database Changes

1. Edit `prisma/schema.prisma`
2. `npm run db:migrate -- description`
3. Review migration in `prisma/migrations/`
4. `npm run db:push`
5. Update related code/tests

## Deployment Structure

```
Development
└── Local: Node.js dev server + PostgreSQL

Staging
└── Vercel: staging.yourdomain.com + Staging DB

Production
└── Vercel: yourdomain.com + Production DB
```

---

**Last Updated**: 2024
