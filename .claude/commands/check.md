Run type checking and linting to verify code quality before committing.

Run these checks:
1. `npx tsc --noEmit` — TypeScript type check (no output = clean)
2. `pnpm lint` — ESLint with next/core-web-vitals rules

Fix any errors found before declaring the task complete.

Common issues to watch for:
- Missing `'use client'` on components using hooks or browser APIs
- Missing `'use server'` on server actions
- Using `any` type unnecessarily (prefer proper typing)
- Unused imports (tsconfig has `noUnusedLocals: true`)
- Tailwind class name warnings: use canonical names (`shrink-0` not `flex-shrink-0`, `min-h-25` not `min-h-[100px]`)

$ARGUMENTS
