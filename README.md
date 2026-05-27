# TimesheetPro - Employee Timesheet & Leave Management System

A production-ready MVP web application for managing employee timesheets, leave requests, and payroll operations for small businesses (~10 users initially).

## 🎯 Overview

TimesheetPro is a modern SaaS application built with Next.js, Prisma, and PostgreSQL. It provides:

- **Employee Timesheets**: Daily time tracking with automatic hour calculations
- **Leave Management**: Annual, sick, and unpaid leave request workflows
- **Project Tracking**: Assign work to projects and generate reports
- **Payroll Reporting**: Export payroll summaries in CSV/PDF
- **Approval Workflows**: Manager/admin approval of timesheets and leave
- **Dashboard**: Real-time overview of operations and metrics
- **Role-Based Access**: Admin, Manager, and Employee roles

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth/Auth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel-ready

### Folder Structure

```
timesheet-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (signin, signup, etc)
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── timesheets/        # Timesheet pages
│   │   ├── leave/             # Leave management pages
│   │   ├── projects/          # Project management pages
│   │   ├── reports/           # Reporting pages
│   │   ├── employees/         # Employee management (admin only)
│   │   └── settings/          # Settings pages (admin only)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (button, card, input, etc)
│   │   ├── layouts/           # Dashboard layout
│   │   ├── forms/             # Reusable form components
│   │   └── tables/            # Reusable table components
│   ├── lib/
│   │   ├── config.ts          # Centralized app configuration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth-utils.ts      # Authentication utilities
│   │   ├── session.ts         # Session utilities
│   │   ├── utils.ts           # Utility functions
│   │   └── constants.ts       # App constants
│   ├── actions/               # Server actions
│   │   ├── auth.ts            # Auth server actions
│   │   ├── timesheet.ts       # Timesheet CRUD
│   │   └── leave.ts           # Leave CRUD
│   └── auth/
│       └── config.ts          # NextAuth configuration
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 12+ (local or remote)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd timesheet-app
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database URL (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/timesheet_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Default admin credentials
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="Admin@123456"

# Environment
NODE_ENV="development"
```

**Generating NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

Initialize the PostgreSQL database:

```bash
# Option 1: Using Prisma (recommended)
npm run db:push

# Option 2: Using migrations
npm run db:migrate -- init
```

### 4. Seed Initial Data

```bash
npm run db:seed
```

This creates:
- Default admin user (use credentials from .env.local)
- Sample employees, projects, and timesheets

### 5. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

**Default Login:**
- Email: `admin@example.com`
- Password: `Admin@123456` (change immediately in production)

## 📚 User Roles & Permissions

### Admin
- Manage all employees (create, update, deactivate)
- Manage projects
- Approve/reject timesheets and leave requests
- Generate and export reports
- Access system settings
- View audit logs

### Manager
- Approve/reject timesheets
- Approve/reject leave requests
- View team timesheets and reports
- Cannot manage employees

### Employee
- Submit timesheets
- View own timesheets
- Request leave
- View own reports
- Cannot approve or modify others' data

## 🛠️ Development

### Database Changes

1. **Modify schema.prisma**
2. **Create migration:**
   ```bash
   npm run db:migrate -- <migration-name>
   ```
3. **Apply migration:**
   ```bash
   npm run db:push
   ```

### Prisma Studio (Visual DB Manager)

```bash
npm run db:studio
```

Opens database GUI at `http://localhost:5555`

### Server Actions

All backend logic uses Server Actions for type safety:

```typescript
// src/actions/timesheet.ts
export async function createTimesheetAction(data: unknown, userId: string) {
  // Validated, database operation, returns typed response
  return { success: true, timesheet };
}
```

### Adding New Pages

1. Create folder in `src/app/[feature]/`
2. Add `page.tsx`
3. Use DashboardLayout for consistency
4. Implement server actions for data

Example:
```typescript
// src/app/timesheets/page.tsx
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function TimesheetsPage() {
  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

## 🔐 Security

### Authentication Flow

1. User submits email/password
2. Credentials validated against hashed password in DB
3. JWT token created with user role
4. Session persisted (24-hour default)
5. Protected routes check session + role

### Protected Routes

The `authConfig.callbacks.authorized` middleware protects:
- `/dashboard/*`
- `/timesheets/*`
- `/leave/*`
- `/projects/*`
- `/reports/*`
- `/employees/*` (admin only)
- `/settings/*` (admin only)

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

### Sensitive Data

- Passwords hashed with bcryptjs (10 salt rounds)
- No sensitive data logged in production
- SQL injection prevented by Prisma parameterization
- CSRF protection via NextAuth

## 📊 Database Schema

### Key Models

**User**
- id, name, email, password (hashed)
- role (ADMIN, MANAGER, EMPLOYEE)
- active status

**Timesheet**
- userId, projectId, date
- timeOn, timeOff, breakDuration
- totalHours (auto-calculated)
- overtimeHours (auto-calculated)
- status (PENDING, APPROVED, REJECTED)

**LeaveRequest**
- userId, leaveType (ANNUAL, SICK, UNPAID)
- startDate, endDate, totalDays
- reason, status

**Project**
- name, client, description
- active status

**Approval**
- approverUserId, type (TIMESHEET, LEAVE_REQUEST)
- approved, comment, approvedAt

**LeaveBalance**
- userId, year
- annualEntitled, annualUsed, sickUsed

See `prisma/schema.prisma` for complete schema.

## 📋 Configuration

All app settings are centralized in `src/lib/config.ts`:

- App metadata (name, version, logo)
- Company information
- Authentication settings
- Timesheet rules (work hours, overtime threshold, etc)
- Leave settings (entitlements, types)
- Date/currency formatting
- Feature flags
- Email configuration
- Security settings

**Usage:**
```typescript
import { appConfig } from '@/lib/config';

const workdayHours = appConfig.timesheet.workdayHours; // 8
const appName = appConfig.app.name; // "TimesheetPro"
```

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection)
   - `NEXTAUTH_URL` (production URL)
   - `NEXTAUTH_SECRET` (openssl rand -base64 32)
4. Deploy

```bash
# One-click deploy
vercel
```

### Other Platforms (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

Create test files alongside components:

```bash
# Example
src/
├── components/
│   └── Button.tsx
│   └── Button.test.tsx
```

Run tests:
```bash
npm run test
```

## 📈 Performance

- Server-side rendering for faster initial loads
- Incremental Static Regeneration (ISR) for reports
- Image optimization with Next.js Image component
- Database query optimization with Prisma
- Pagination for large datasets

## 🐛 Debugging

### NextAuth Debug Mode

```env
DEBUG=next-auth:*
```

### Prisma Debug

```bash
npm run dev
# View query logs in console
```

### Browser DevTools

- React DevTools extension (inspect components)
- Network tab (check API requests)
- Storage tab (verify session cookies)

## 📞 Support

For issues:

1. Check environment variables
2. Verify database connection
3. Check Prisma logs
4. Review authentication flow

## 📝 License

Commercial use. Contact support for licensing details.

## 🎯 MVP Scope & Future Features

### Currently Implemented ✅
- User authentication (email/password)
- Role-based access control
- Timesheet CRUD + approvals
- Leave request CRUD + approvals
- Project management
- Dashboard overview
- Basic reporting

### NOT in MVP (Future) 🔜
- Mobile native apps
- Real-time WebSocket updates
- Email notifications
- Accounting integrations
- Payment processing
- Multi-company support
- Advanced analytics
- GPS location tracking
- AI-powered features

## 🚀 Next Steps After MVP

1. Email notifications on approvals
2. Mobile app (React Native)
3. Advanced reporting with analytics
4. Integration with accounting software
5. Time tracking via mobile app
6. Slack/Teams integration
7. Automated payroll export
8. Geolocation tracking
9. Team collaboration features

---

**Version**: 0.1.0  
**Status**: ✅ MVP 100% Complete & Production-Ready
**Last Updated**: May 27, 2026
