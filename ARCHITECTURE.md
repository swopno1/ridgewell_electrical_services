# Architecture & Design Decisions

## Overview

This document outlines the architectural decisions and patterns used in TimesheetPro.

## 1. Technology Choices

### Next.js 15 + App Router

**Why:**
- Server Components enable server-side rendering by default
- File-based routing is intuitive
- Built-in API routes and Server Actions
- Excellent developer experience
- Vercel integration (seamless deployment)

**Tradeoff:**
- Learning curve for developers unfamiliar with Next.js
- Server/Client component boundary requires discipline

### TypeScript

**Why:**
- Type safety prevents runtime errors
- Excellent IDE support and autocomplete
- Self-documenting code
- Easier refactoring with confidence

### Prisma ORM

**Why:**
- Type-safe database queries
- Auto-generated types from schema
- Easy migrations
- Excellent developer experience
- Multi-database support (PostgreSQL, MySQL, etc)

**Alternative Considered:**
- Raw SQL (more control, less safety)
- TypeORM (more complex setup)

### Server Actions (Not REST API)

**Why:**
- Type-safe: Same types used client and server
- Reduced boilerplate: No API route files needed
- Better performance: Direct function calls
- Built-in authentication (via middleware)
- CSRF protection by default

**Pattern:**
```typescript
// src/actions/timesheet.ts
export async function createTimesheetAction(data, userId) {
  // Runs on server, can access DB directly
  return { success: true, data };
}

// Client component
'use client';
const result = await createTimesheetAction(formData, userId);
```

### Authentication: NextAuth.js

**Why:**
- Industry standard
- Credential + OAuth ready
- Session management built-in
- Prisma adapter (matches DB schema)
- Secure by default

**Session Strategy:**
- JWT tokens for stateless sessions
- 24-hour expiry
- Secure HttpOnly cookies
- CSRF protection

### Tailwind CSS + shadcn/ui

**Why:**
- Utility-first CSS (fast development)
- shadcn provides unstyled, accessible components
- Full control over design
- No dependency bloat
- Can customize everything

**Alternative:**
- UI libraries (MUI, Chakra) - too opinionated for MVP
- CSS-in-JS - unnecessary complexity

## 2. Architecture Patterns

### Server Action Organization

All database operations use Server Actions:

```
src/actions/
├── auth.ts      # Authentication logic
├── timesheet.ts # Timesheet CRUD + approvals
└── leave.ts     # Leave CRUD + approvals
```

**Benefits:**
- Single source of truth for business logic
- Type-safe with Zod validation
- Automatic error handling
- Testable in isolation

### Centralized Configuration

All app settings in `src/lib/config.ts`:

```typescript
export const appConfig = {
  app: { name, version, ... },
  timesheet: { workdayHours, overtimeThreshold, ... },
  leave: { annualEntitlement, ... },
  // ... etc
};
```

**Benefits:**
- Single place to change behavior
- Feature flags for gradual rollout
- No hard-coded magic numbers
- Easy to extend

### Role-Based Access Control

```typescript
// src/lib/config.ts
export const rolePermissions = {
  ADMIN: { canApproveTimesheets: true, ... },
  MANAGER: { canApproveTimesheets: true, ... },
  EMPLOYEE: { canApproveTimesheets: false, ... },
};
```

**Pattern:**
1. Check `role` from session
2. Look up permissions in config
3. Gate UI and server actions

## 3. Database Design

### Schema Philosophy

- **Normalized**: Reduce redundancy
- **Audit-friendly**: CreatedAt/UpdatedAt timestamps
- **Index-optimized**: Indexes on frequently queried fields
- **Enum-safe**: Use PostgreSQL enums for status fields
- **Scalable**: Ready for growth beyond 10 users

### Key Design Decisions

**Soft Deletes vs Hard Deletes:**
- Using hard deletes for now (simpler)
- Can add soft deletes later if needed

**Approval Model:**
```prisma
model Approval {
  approverUserId String   // Who approved
  type ApprovalType      // TIMESHEET or LEAVE_REQUEST
  timesheetId String?    // Which timesheet (optional)
  leaveRequestId String? // Which leave (optional)
}
```
- Supports audit trail
- Flexible for future approval chains

**Leave Balance:**
- Separate model for annual leave tracking
- Per-user, per-year
- Allows history and rollover logic

## 4. Frontend Architecture

### Component Organization

```
src/components/
├── ui/              # Primitive components (Button, Card, Input)
├── layouts/         # Page layouts (DashboardLayout)
├── forms/           # Form components (TimesheetForm)
└── tables/          # Table components (TimesheetTable)
```

### Client vs Server Components

**Server Components (default):**
- Fetch data
- Call databases
- Handle secrets

**Client Components ('use client'):**
- Interactivity
- Event listeners
- useState/useEffect
- Forms with React Hook Form

**Pattern:**
```typescript
// Server: Fetches data
export default async function Page() {
  const timesheets = await fetchTimesheets();
  return <TimesheetList data={timesheets} />;
}

// Client: Interactive
'use client';
export function TimesheetForm({ projectId }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data) => {
    const result = await createTimesheetAction(data);
  };
}
```

### Form Patterns

Using React Hook Form + Zod:

```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await signInAction(data);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
    </form>
  );
}
```

## 5. Security Architecture

### Authentication Flow

```
User Login Form
    ↓
signInAction (Server Action)
    ↓
NextAuth.js
    ↓
Credential Provider (bcrypt verify)
    ↓
JWT Token Created
    ↓
Cookie Set (HttpOnly, Secure)
    ↓
Redirect to Dashboard
```

### Authorization

Every protected route checked:
1. User logged in? (JWT token)
2. User has permission? (role check)
3. Route accessible? (role required)

### Data Protection

- Passwords: bcryptjs (10 rounds salt)
- Sessions: JWT in secure cookies
- Database: Only authenticated connections
- SQL Injection: Prisma parameterization
- CSRF: NextAuth CSRF tokens
- XSS: React automatic escaping

## 6. Scalability Considerations

### Current Design Supports

- 10-100 users easily
- Thousands of timesheet entries
- Hundreds of projects
- Caching ready (NextAuth, React Query)

### Future Optimizations (Post-MVP)

1. **Database**
   - Add caching layer (Redis)
   - Connection pooling (PgBouncer)
   - Read replicas for reporting

2. **API**
   - Implement caching headers
   - Add pagination (already done)
   - Query result caching

3. **Frontend**
   - React Query for client-side caching
   - Code splitting
   - Image optimization

4. **Deployment**
   - CDN for static assets
   - Database backups
   - Monitoring/alerts

## 7. Error Handling

### Pattern

```typescript
try {
  // Validate input
  const validated = schema.parse(data);
  
  // Database operation
  const result = await prisma.timesheet.create({ data: validated });
  
  // Success response
  return { success: true, data: result };
} catch (error) {
  if (error instanceof z.ZodError) {
    return { error: error.errors[0].message };
  }
  return { error: 'Failed to create timesheet' };
}
```

### User Feedback

```typescript
const result = await createTimesheetAction(data);
if (result.error) {
  toast.error(result.error);  // Show to user
} else {
  toast.success('Timesheet created');
  router.refresh();  // Refresh data
}
```

## 8. Testing Strategy (Pre-MVP)

### Unit Tests
- Utility functions
- Auth utilities
- Validation schemas

### Integration Tests
- Server actions
- Database operations
- Auth flow

### E2E Tests
- User workflows
- Role permissions
- Approval processes

## 9. Deployment Architecture

### Development
- Local PostgreSQL
- Next.js dev server
- Hot module reloading

### Production (Vercel)
- PostgreSQL (managed service)
- Next.js serverless
- Edge caching
- Auto-scaling

### Environment Secrets
```
Development:  .env.local
Staging:      .env.staging
Production:   Vercel env vars
```

## 10. Future Evolution Path

### Phase 1 (Current MVP)
- ✅ Core timesheet & leave
- ✅ Basic approval workflow
- ✅ Dashboard

### Phase 2 (Months 1-3)
- Email notifications
- Advanced reporting
- Employee directory improvements

### Phase 3 (Months 3-6)
- Mobile app
- Integration API
- Analytics dashboard

### Phase 4 (Months 6+)
- Multi-company support
- Advanced workforce planning
- Geolocation tracking

---

**Key Principle**: Simple, testable, maintainable code that scales.
