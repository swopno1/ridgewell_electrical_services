# Development Guidelines

## Code Standards

### TypeScript

1. **Always use types explicitly:**
   ```typescript
   // ✅ Good
   interface TimesheetData {
     projectId: string;
     date: Date;
     totalHours: number;
   }

   // ❌ Avoid
   const data: any = {};
   ```

2. **Use `satisfies` for config validation:**
   ```typescript
   // ✅ Good
   export const config = { ... } satisfies Config;

   // ❌ Avoid
   export const config: Config = { ... };
   ```

3. **Export types explicitly:**
   ```typescript
   // ✅ Good
   export type TimesheetStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
   export interface Timesheet { ... }

   // ❌ Avoid
   type TimesheetStatus = ...;
   interface Timesheet { ... }
   ```

### React Components

1. **Functional components with typed props:**
   ```typescript
   // ✅ Good
   interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary';
     loading?: boolean;
   }

   export function Button({ variant = 'primary', loading, ...props }: ButtonProps) {
     return <button {...props} />;
   }

   // ❌ Avoid
   function Button(props) {
     return <button {...props} />;
   }
   ```

2. **Client/Server component boundaries:**
   ```typescript
   // ✅ Good - Server component fetches, client renders
   // page.tsx (Server)
   export default async function Page() {
     const data = await fetchData();
     return <ClientComponent data={data} />;
   }

   // ClientComponent.tsx (Client)
   'use client';
   export function ClientComponent({ data }) {
     return <div>{data}</div>;
   }

   // ❌ Avoid - Mixing concerns
   export default async function Page() {
     const data = await fetchData();
     return <InteractiveComponent data={data} />;
   }
   ```

### Server Actions

1. **Validation + type safety:**
   ```typescript
   // ✅ Good
   const schema = z.object({ email: z.string().email() });
   
   export async function createUserAction(data: unknown) {
     const validated = schema.parse(data);
     // ... operation
     return { success: true, data };
   }

   // ❌ Avoid
   export async function createUserAction(data: any) {
     // ... operation without validation
   }
   ```

2. **Error handling pattern:**
   ```typescript
   // ✅ Good
   try {
     const result = await operation();
     return { success: true, result };
   } catch (error) {
     if (error instanceof ZodError) {
       return { error: error.errors[0].message };
     }
     return { error: 'Operation failed' };
   }

   // ❌ Avoid
   try {
     return await operation();
   } catch (error) {
     console.log(error);
   }
   ```

### Styling

1. **Use Tailwind classes (not inline styles):**
   ```typescript
   // ✅ Good
   <div className="flex items-center gap-4 p-6 bg-white rounded-lg">
   
   // ❌ Avoid
   <div style={{ display: 'flex', padding: '24px' }}>
   ```

2. **Use `cn()` for conditional classes:**
   ```typescript
   // ✅ Good
   <div className={cn(
     'p-4 rounded',
     isActive && 'bg-blue-600 text-white',
     isDisabled && 'opacity-50 cursor-not-allowed'
   )}>
   
   // ❌ Avoid
   <div className={isActive ? 'p-4 rounded bg-blue-600 text-white' : 'p-4 rounded'}>
   ```

## File Organization

### Page Structure
```
src/app/[feature]/
├── page.tsx           # Main page
├── layout.tsx         # Layout (optional)
└── loading.tsx        # Loading UI (optional)
```

### Component Structure
```typescript
// 1. Imports
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export function Component({ title }: Props) {
  const [state, setState] = useState('');
  
  return <div>{title}</div>;
}

// 4. Exports
// (already exported above)
```

## Testing

### Unit Test Pattern
```typescript
// timesheet.test.ts
import { calculateOvertimeHours } from '@/lib/timesheet';

describe('calculateOvertimeHours', () => {
  it('returns 0 for 8 hours or less', () => {
    expect(calculateOvertimeHours(8)).toBe(0);
  });

  it('returns correct overtime for more than 8 hours', () => {
    expect(calculateOvertimeHours(10)).toBe(2);
  });
});
```

### Integration Test Pattern
```typescript
// timesheet.integration.test.ts
import { createTimesheetAction } from '@/actions/timesheet';

describe('createTimesheetAction', () => {
  it('creates timesheet with correct calculations', async () => {
    const result = await createTimesheetAction({
      projectId: 'test-123',
      date: new Date(),
      timeOn: new Date('2024-01-15T09:00:00'),
      timeOff: new Date('2024-01-15T17:30:00'),
      breakDuration: 30,
    }, 'user-123');

    expect(result.success).toBe(true);
    expect(result.timesheet.totalHours).toBe(8.5);
  });
});
```

## Database Changes

### Creating Migrations
```bash
# Make change to schema.prisma
npm run db:migrate -- add_new_field

# Review migration file in prisma/migrations/
# Then apply:
npm run db:push
```

### Schema Change Checklist
- [ ] Update `schema.prisma`
- [ ] Create migration
- [ ] Update TypeScript types if needed
- [ ] Update related actions/queries
- [ ] Update tests
- [ ] Update documentation

## Git Workflow

### Branch Naming
```
feature/timesheet-approval
bugfix/password-validation
docs/architecture
refactor/database-queries
```

### Commit Messages
```
feat: add timesheet approval workflow
fix: correct overtime calculation
docs: update database schema
refactor: simplify timesheet calculations
test: add timesheet action tests
```

### Pull Request Checklist
- [ ] Branch from `main`
- [ ] Tests passing
- [ ] Types checked (`npm run build`)
- [ ] Code formatted
- [ ] Documentation updated
- [ ] No console.logs in production code

## Performance Tips

### Database Queries
```typescript
// ✅ Good - Use include to avoid N+1 queries
const timesheet = await prisma.timesheet.findUnique({
  where: { id },
  include: {
    project: true,
    user: true,
    approvals: { include: { approverUser: true } },
  },
});

// ❌ Avoid - Multiple queries
const timesheet = await prisma.timesheet.findUnique({ where: { id } });
const project = await prisma.project.findUnique({ where: { id: timesheet.projectId } });
```

### React Rendering
```typescript
// ✅ Good - Memoize when needed
export const TimesheetRow = memo(function TimesheetRow({ data }) {
  return <tr>{/* ... */}</tr>;
});

// ❌ Avoid - Unnecessary memoization
export function TimesheetRow({ data }) {
  return <tr>{/* ... */}</tr>;
}
```

### API Caching
```typescript
// ✅ Good - Revalidate on demand
export async function fetchTimesheets(userId: string) {
  const data = await fetch(`/api/timesheets/${userId}`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  return data.json();
}
```

## Debugging

### Enable Debug Logging
```env
DEBUG=next-auth:*
```

### Common Issues

**1. Type Error in Server Action:**
```typescript
// Problem: Client passing wrong type
await action(data); // data doesn't match expected type

// Solution: Add type validation
const schema = z.object({ ... });
const validated = schema.parse(data);
await action(validated);
```

**2. Database Connection Error:**
```
Error: getaddrinfo ENOTFOUND db.host
→ Check DATABASE_URL in .env.local
→ Verify PostgreSQL is running
```

**3. NextAuth Session Not Found:**
```
Problem: session is null
→ Check NEXTAUTH_URL matches your domain
→ Check NEXTAUTH_SECRET is set
→ Clear cookies and retry
```

## Code Review Checklist

When reviewing PRs, check:

- [ ] **Types**: All functions have proper types
- [ ] **Validation**: Zod schemas for inputs
- [ ] **Error Handling**: Try/catch with meaningful messages
- [ ] **Security**: No hardcoded secrets, SQL injection prevention
- [ ] **Performance**: No N+1 queries, efficient selectors
- [ ] **Testing**: New features have tests
- [ ] **Documentation**: Comments for complex logic
- [ ] **Naming**: Clear variable/function names
- [ ] **Consistency**: Follows existing patterns

## Documentation

### When to Add Comments
```typescript
// ✅ Good - Explains "why"
// We use a debounce here because rapid submissions cause race conditions
const debouncedSave = useCallback(
  debounce((data) => saveAction(data), 500),
  []
);

// ❌ Avoid - States the obvious
// Save the data
await saveData(data);
```

### README Updates
Update README when:
- Adding new features
- Changing configuration
- Updating dependencies
- Changing deployment process

## Tools & Scripts

```bash
# Format code
npm run lint

# Type check
npm run build

# Database management
npm run db:studio      # Visual DB explorer
npm run db:push        # Push schema changes
npm run db:seed        # Seed sample data

# Development
npm run dev            # Start dev server
```

---

**Last Updated**: 2024
