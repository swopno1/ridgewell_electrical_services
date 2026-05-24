# Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Setup
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed

# Development
npm run dev                    # Start dev server (http://localhost:3000)
npm run db:studio            # Open Prisma Studio

# Building
npm run build                 # Build for production
npm start                     # Start production server

# Database
npm run db:migrate -- name    # Create migration
npm run db:seed              # Seed sample data
```

## 🔐 Default Login Credentials

After seeding, use these to test:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin@123456 |
| Manager | manager@example.com | Manager@123456 |
| Employee | alice@example.com | Employee@123456 |
| Employee | bob@example.com | Employee@123456 |

## 📚 API Reference (Server Actions)

### Authentication

```typescript
// Sign in
import { signInAction } from '@/actions/auth';
const result = await signInAction({
  email: 'user@example.com',
  password: 'password123'
});

// Sign up
import { signUpAction } from '@/actions/auth';
const result = await signUpAction({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Secure@123',
  confirmPassword: 'Secure@123'
});

// Sign out
import { signOutAction } from '@/actions/auth';
await signOutAction();

// Get current session
import { getSession } from '@/lib/session';
const session = await getSession();
console.log(session?.user?.role); // ADMIN, MANAGER, or EMPLOYEE
```

### Timesheets

```typescript
import { 
  createTimesheetAction, 
  updateTimesheetAction, 
  deleteTimesheetAction,
  approveTimesheetAction,
  rejectTimesheetAction,
  getTimesheetsByDateRange
} from '@/actions/timesheet';

// Create timesheet
const result = await createTimesheetAction({
  projectId: 'project-123',
  date: new Date('2024-01-15'),
  timeOn: new Date('2024-01-15T09:00:00'),
  timeOff: new Date('2024-01-15T17:30:00'),
  breakDuration: 30,
  notes: 'Worked on feature X'
}, userId);

// Update timesheet
await updateTimesheetAction(timesheetId, {...}, userId);

// Delete timesheet (only PENDING)
await deleteTimesheetAction(timesheetId, userId);

// Approve (admin/manager only)
await approveTimesheetAction(timesheetId, managerId, 'Looks good');

// Reject (admin/manager only)
await rejectTimesheetAction(timesheetId, managerId, 'Need more details');

// Fetch timesheets
const { timesheets } = await getTimesheetsByDateRange(
  userId, 
  new Date('2024-01-01'), 
  new Date('2024-01-31')
);
```

### Leave Requests

```typescript
import {
  createLeaveRequestAction,
  updateLeaveRequestAction,
  cancelLeaveRequestAction,
  approveLeaveRequestAction,
  rejectLeaveRequestAction,
  getLeaveRequestsByUser,
  getLeaveBalance
} from '@/actions/leave';

// Create leave request
const result = await createLeaveRequestAction({
  leaveType: 'ANNUAL',
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-02-05'),
  reason: 'Family vacation'
}, userId);

// Update leave request (only if PENDING)
await updateLeaveRequestAction(leaveId, {...}, userId);

// Cancel leave request
await cancelLeaveRequestAction(leaveId, userId);

// Approve leave request
await approveLeaveRequestAction(leaveId, managerId, 'Approved');

// Reject leave request
await rejectLeaveRequestAction(leaveId, managerId, 'Need more notice');

// Get user's leave requests
const { leaveRequests } = await getLeaveRequestsByUser(userId);

// Get leave balance
const { balance } = await getLeaveBalance(userId, 2024);
// balance.annualEntitled, balance.annualUsed, balance.sickUsed
```

## 🎨 Component Usage Examples

### Using DashboardLayout

```typescript
// src/app/dashboard/page.tsx
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { getSession } from '@/lib/session';

export default async function Page() {
  const session = await getSession();
  
  return (
    <DashboardLayout userRole={session?.user?.role}>
      <h1>Dashboard Content</h1>
    </DashboardLayout>
  );
}
```

### Using UI Components

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@example.com" />
          </div>
          <Button onClick={() => console.log('clicked')}>Submit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Using React Hook Form + Zod

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTimesheetAction } from '@/actions/timesheet';

const schema = z.object({
  projectId: z.string().uuid('Invalid project'),
  date: z.coerce.date(),
  timeOn: z.coerce.date(),
  timeOff: z.coerce.date(),
});

export function TimesheetForm({ userId }: { userId: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await createTimesheetAction(data, userId);
    
    if (result.error) {
      console.error(result.error);
    } else {
      console.log('Success:', result.timesheet);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🔍 Common Database Queries (Prisma)

```typescript
import { prisma } from '@/lib/prisma';

// Get user with timesheets
const user = await prisma.user.findUnique({
  where: { id: 'user-123' },
  include: {
    timesheets: { include: { project: true } },
    leaveRequests: true,
  },
});

// Get pending timesheets
const pendingTimesheets = await prisma.timesheet.findMany({
  where: { status: 'PENDING' },
  include: { user: true, project: true },
  orderBy: { createdAt: 'desc' },
});

// Get employee's timesheets for date range
const timesheets = await prisma.timesheet.findMany({
  where: {
    userId: 'user-123',
    date: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-01-31'),
    },
  },
  include: { project: true, approvals: true },
  orderBy: { date: 'desc' },
});

// Count approved vs pending
const stats = await prisma.timesheet.groupBy({
  by: ['status'],
  where: { userId: 'user-123' },
  _count: true,
});

// Get total hours by project
const projectHours = await prisma.timesheet.groupBy({
  by: ['projectId'],
  where: { status: 'APPROVED' },
  _sum: { totalHours: true },
});

// Delete user and related data (cascade)
await prisma.user.delete({
  where: { id: 'user-123' },
});
```

## ⚙️ Configuration Customization

```typescript
// src/lib/config.ts - Modify these values

// Change workday hours
appConfig.timesheet.workdayHours = 8;

// Change annual leave entitlement
appConfig.leave.annualLeaveEntitlement = 20;

// Update app name
appConfig.app.name = 'MyCompanyTimesheets';

// Change overtime threshold
appConfig.timesheet.overtimeThreshold = 8;

// Disable features
appConfig.features.notifications = false;
appConfig.features.advancedAnalytics = false;
```

## 🐛 Troubleshooting

### Problem: Database Connection Error
```
Error: getaddrinfo ENOTFOUND db.host
```
**Solution:**
1. Check `DATABASE_URL` in `.env.local`
2. Verify PostgreSQL is running
3. Test connection: `psql postgresql://user:password@host:5432/db`

### Problem: NextAuth Session Not Working
```
Error: session is null
```
**Solution:**
1. Check `NEXTAUTH_URL` matches your domain
2. Check `NEXTAUTH_SECRET` is set and non-empty
3. Generate new secret: `openssl rand -base64 32`
4. Clear browser cookies

### Problem: Type Error in Server Action
```
Error: data does not match schema
```
**Solution:**
```typescript
// Bad: Using data directly without validation
export async function myAction(data: any) { }

// Good: Validate with Zod
const schema = z.object({ ... });
const validated = schema.parse(data);
```

### Problem: Timesheet Total Hours Incorrect
```
// Wrong calculation
const hours = (timeOff - timeOn) / 1000 / 60 / 60;

// Correct: Use date-fns
import { differenceInMinutes } from 'date-fns';
const minutes = differenceInMinutes(timeOff, timeOn);
const hours = (minutes - breakDuration) / 60;
```

### Problem: Prisma Migration Conflicts
```bash
# Reset migrations in development (careful!)
npm run db:push -- --force-reset

# OR create new migration with different name
npm run db:migrate -- resolve_conflict
```

### Problem: Can't Access Protected Routes
**Solution:**
1. Check authentication middleware in `src/auth/config.ts`
2. Verify route is listed in `authConfig.callbacks.authorized`
3. Test with browser DevTools → Application → Cookies
4. Look for `next-auth.session-token` cookie

## 📊 Useful Prisma Commands

```bash
# View/edit database graphically
npm run db:studio

# Show schema
npx prisma db pull

# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Generate client types
npx prisma generate

# Push schema to database
npm run db:push

# Create migration
npm run db:migrate -- name

# List migrations
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset
```

## 📱 Responsive Design Tips

```typescript
// Mobile-first Tailwind
<div className="p-4 md:p-6 lg:p-8">      {/* Padding scales up */}
<div className="flex flex-col md:flex-row"> {/* Stack on mobile, row on desktop */}
<div className="hidden md:block">         {/* Show only on desktop */}
<div className="block md:hidden">         {/* Show only on mobile */}

// Useful breakpoints:
// sm:  640px
// md:  768px
// lg: 1024px
// xl: 1280px
```

## 🔒 Security Checklist

- [ ] No hardcoded secrets (use `.env`)
- [ ] Passwords hashed before storage
- [ ] All inputs validated with Zod
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React escaping)
- [ ] CSRF tokens used (NextAuth)
- [ ] Sensitive data not logged
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Access control enforced (roles)

## 📈 Performance Tips

```typescript
// Bad: N+1 queries
const timesheets = await prisma.timesheet.findMany();
for (const ts of timesheets) {
  const project = await prisma.project.findUnique({...}); // Extra query per timesheet!
}

// Good: Single query with include
const timesheets = await prisma.timesheet.findMany({
  include: { project: true }
});

// Bad: Fetching everything
const users = await prisma.user.findMany();

// Good: Pagination
const users = await prisma.user.findMany({
  take: 10,
  skip: 0,
});
```

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backup tested
- [ ] HTTPS enabled
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Logging configured
- [ ] Security headers enabled
- [ ] Performance optimized
- [ ] Load testing completed
- [ ] Rollback procedure documented
- [ ] Post-deployment verification plan ready

## 📞 Getting Help

1. **Check documentation**
   - `README.md` - Setup and overview
   - `ARCHITECTURE.md` - Design decisions
   - `DEVELOPMENT.md` - Development guidelines
   - `DEPLOYMENT.md` - Deployment guide

2. **Check logs**
   ```bash
   # Next.js
   npm run dev
   
   # Prisma debug
   DEBUG=prisma npm run dev
   
   # NextAuth
   DEBUG=next-auth:* npm run dev
   ```

3. **Check database state**
   ```bash
   npm run db:studio
   ```

4. **Test server action directly**
   ```typescript
   import { createTimesheetAction } from '@/actions/timesheet';
   
   // In a route handler or test
   const result = await createTimesheetAction(data, userId);
   console.log(result);
   ```

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Maintained by**: Development Team
