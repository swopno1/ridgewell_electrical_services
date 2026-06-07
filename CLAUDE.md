# Ridgewell Electrical Services — Timesheet & Leave Management

A Next.js 15 (App Router) web app for managing employee timesheets, leave requests, approvals, and reporting. Multi-role: ADMIN, MANAGER, EMPLOYEE.

---

## Commands

```bash
pnpm dev            # Start dev server on :3000
pnpm build          # prisma generate + next build
pnpm lint           # ESLint (next/core-web-vitals)

pnpm db:push        # Push schema changes to DB (no migration file)
pnpm db:migrate -- --name <name>   # Create named migration
pnpm db:studio      # Prisma Studio on :5555
pnpm db:seed        # Seed initial admin + sample data
```

Package manager is **pnpm** (not npm/yarn).

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15, React 19, TypeScript 5 |
| Database | PostgreSQL + Prisma 6 ORM |
| Auth | NextAuth.js v5 (beta), credentials + bcryptjs |
| UI | shadcn/ui (Radix), Tailwind CSS v4, lucide-react |
| Forms | React Hook Form + Zod |
| Email | Resend |
| Dates | date-fns v4 |
| Exports | jsPDF, PapaParse |
| Deploy | Vercel |

---

## Environment Variables

Copy `.env.example` → `.env.local`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/timesheet_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin@123456
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev
```

---

## Project Structure

```
src/
├── app/              # Next.js App Router — pages & layouts
│   ├── auth/         # Sign in, sign up, password reset
│   ├── dashboard/    # Role-aware dashboard
│   ├── timesheets/   # Timesheet CRUD + approval
│   ├── leave/        # Leave requests + approvals
│   ├── projects/     # Project management
│   ├── employees/    # Admin: manage users
│   ├── reports/      # Exports (PDF, CSV)
│   ├── calendar/     # Calendar view (timesheets + leave)
│   ├── settings/     # Admin settings
│   └── api/          # Only NextAuth handler (/api/auth/[...nextauth])
├── actions/          # ALL backend logic — server actions only
│   ├── auth.ts       # signUp, signIn, forgotPassword, resetPassword
│   ├── timesheet.ts  # CRUD + approve/reject + date-range fetch
│   ├── leave.ts      # CRUD + approve/reject + date-range fetch
│   ├── employee.ts   # User management
│   ├── project.ts    # Project CRUD
│   └── report.ts     # Report generation
├── components/
│   ├── ui/           # shadcn primitives (button, dialog, input…)
│   ├── forms/        # Feature forms (LeaveRequestForm, etc.)
│   ├── tables/       # Data tables
│   ├── widgets/      # Dashboard widgets, Calendar
│   ├── dialogs/      # Confirmation modals
│   └── layouts/      # DashboardLayout
├── lib/
│   ├── config.ts     # appConfig: feature flags, rolePermissions, rules
│   ├── prisma.ts     # Singleton PrismaClient with pg pool
│   ├── session.ts    # getSession() helper
│   ├── auth-utils.ts # hashPassword, comparePasswords
│   ├── email.ts      # Resend email helper
│   └── date-utils.ts # formatTime, calculateBusinessDays, etc.
├── auth/config.ts    # NextAuth credentials provider config
├── auth.ts           # NextAuth handlers
└── proxy.ts          # Middleware matcher for protected routes
prisma/
└── schema.prisma     # Single source of truth for DB schema
```

---

## Database Schema (Key Models)

**Enums:** `UserRole` (ADMIN | MANAGER | EMPLOYEE), `TimesheetStatus` (PENDING | APPROVED | REJECTED), `LeaveType` (ANNUAL | SICK | UNPAID), `LeaveStatus` (PENDING | APPROVED | REJECTED | CANCELLED)

**User** — id, name, email (unique), password (bcrypt), role, active, hourlyRate, overtimeRate, annualLeaveQuota, designation, standardWorkHours

**Timesheet** — userId, projectId, date, timeOn, timeOff, breakDuration (minutes), totalHours, overtimeHours, notes, status. Unique constraint on `(userId, date)` — one timesheet per employee per day.

**LeaveRequest** — userId, leaveType, startDate, endDate, totalDays, reason, status

**Approval** — links to either a Timesheet or a LeaveRequest (one per record), stores approved (bool|null), comment, approvedAt

**LeaveBalance** — per user per year: annualEntitled, annualUsed, sickUsed. Unique on `(userId, year)`.

**AuditLog** — userId, action, entity, entityId, changes, ipAddress

---

## Architecture Patterns

### Server Actions (not API routes)
All backend mutations live in `src/actions/`. No REST endpoints except NextAuth.

```ts
'use server';
export async function createFooAction(input: unknown) {
  const session = await getSession();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const parsed = fooSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.message };

  const result = await prisma.foo.create({ data: parsed.data });
  revalidatePath('/foo');
  return { success: true, foo: result };
}
```

Return shape: `{ success: true, data? }` or `{ error: string }`. Never throw from actions.

### Role-Based Access
Three roles: ADMIN > MANAGER > EMPLOYEE.

```ts
const session = await getSession();
const role = session?.user?.role; // 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
```

- Check `src/lib/config.ts` → `rolePermissions` for what each role can do.
- Always re-check role in server actions — never trust client-side role gating alone.
- ADMIN and MANAGER see all employees' data; EMPLOYEE sees only their own.
- The email `amirhossain.limon@gmail.com` is hardcoded to ADMIN in `src/auth/config.ts`.

### Auth & Session
```ts
import { getSession } from '@/lib/session';
const session = await getSession(); // server-side only
// session.user.id, session.user.role, session.user.email
```

Protected routes declared in `src/proxy.ts` matcher. All `/dashboard/**`, `/timesheets/**`, `/leave/**`, `/projects/**`, `/reports/**`, `/employees/**`, `/settings/**` are protected.

### Feature Flags
Managed in `src/lib/config.ts` → `appConfig`:
```ts
appConfig.features.timesheets   // boolean
appConfig.features.leave        // boolean
appConfig.features.approvals    // boolean
appConfig.features.calendar     // boolean
```

### Page Pattern (Server Component + Client Component)
```
app/feature/page.tsx         ← Server: fetch data, check auth, pass to client
app/feature/FeatureClientPage.tsx  ← Client: interactivity, forms, state
```

---

## UI Conventions

- Use components from `src/components/ui/` (shadcn) for all primitives.
- Toast notifications via `sonner`: `import { toast } from 'sonner'` — use `toast.success()`, `toast.error()`.
- Icons from `lucide-react` only.
- Tailwind v4 — prefer canonical class names (e.g. `shrink-0` not `flex-shrink-0`, `min-h-25` not `min-h-[100px]`).
- Dark mode supported throughout — always include `dark:` variants.
- `DashboardLayout` wraps every protected page and requires `userRole`, `userName`, `userEmail`.

---

## Form Pattern

```tsx
'use client';
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

async function onSubmit(values) {
  const result = await createFooAction(values);
  if (result.error) { toast.error(result.error); return; }
  toast.success('Created!');
  router.refresh();
}
```

---

## Common Pitfalls

- **One timesheet per user per day** — Prisma unique constraint `@@unique([userId, date])`. Creating a second one will throw; update instead.
- **Date handling** — Always use `date-fns`. Timesheets store dates as `DateTime` (UTC midnight). Compare with `format(day, 'yyyy-MM-dd')` and split on `T` for ISO strings.
- **pnpm only** — The repo has `pnpm-lock.yaml`. Don't use npm or yarn.
- **Prisma client** — Import from `@/lib/prisma` (singleton), not directly from `@prisma/client`.
- **Leave date range** — A leave entry spans multiple days. Filter with `dayStr >= startStr && dayStr <= endStr`, not exact match.
- **Email sending** — Requires `RESEND_API_KEY`. In dev without the key, email actions will silently fail but not crash.
- **`active` flag on users** — New users default to `active: false`. Admin must activate before they can log in.

---

## Key File Locations

| Need | File |
|---|---|
| Role permissions | `src/lib/config.ts` → `rolePermissions` |
| Feature flags | `src/lib/config.ts` → `appConfig.features` |
| Auth config | `src/auth/config.ts` |
| Session helper | `src/lib/session.ts` |
| Prisma client | `src/lib/prisma.ts` |
| Date utilities | `src/lib/date-utils.ts` |
| Email helper | `src/lib/email.ts` |
| DB schema | `prisma/schema.prisma` |
| Middleware | `src/proxy.ts` |
