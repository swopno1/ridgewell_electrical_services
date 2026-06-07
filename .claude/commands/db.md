Database operations reference for this project.

## Schema changes
1. Edit `prisma/schema.prisma`
2. Run `pnpm db:push` for dev (no migration file) or `pnpm db:migrate -- --name <description>` for a tracked migration
3. Run `pnpm build` (which runs `prisma generate`) or `npx prisma generate` manually

## Prisma Studio
`pnpm db:studio` — opens at http://localhost:5555

## Seed
`pnpm db:seed` — creates default admin and sample data

## Key constraints to know
- `Timesheet`: unique on `(userId, date)` — one per employee per day
- `LeaveBalance`: unique on `(userId, year)`
- `Account`: unique on `(provider, providerAccountId)`
- All IDs are CUIDs (auto-generated)

## Common queries
```ts
import { prisma } from '@/lib/prisma';

// Get user with timesheets
await prisma.user.findUnique({ where: { id }, include: { timesheets: true } });

// Get timesheets in date range (all employees)
await prisma.timesheet.findMany({
  where: { date: { gte: start, lte: end } },
  include: { user: true, project: true }
});

// Approve a timesheet
await prisma.timesheet.update({
  where: { id },
  data: { status: 'APPROVED' }
});
```

$ARGUMENTS
