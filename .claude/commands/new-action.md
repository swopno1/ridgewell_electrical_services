Create a new server action in `src/actions/` following the project's established pattern.

Steps:
1. Add the action to the relevant file in `src/actions/` (timesheet.ts, leave.ts, employee.ts, project.ts, or create a new file)
2. Mark the file with `'use server'` at the top
3. Import `getSession` from `@/lib/session` and `prisma` from `@/lib/prisma`
4. Validate input with a Zod schema
5. Check session and role before any DB operation
6. Return `{ success: true, data? }` on success or `{ error: string }` on failure — never throw
7. Call `revalidatePath('/relevant-path')` after mutations

Template:
```ts
export async function myAction(input: unknown) {
  const session = await getSession();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const parsed = mySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const result = await prisma.model.create({ data: parsed.data });
    revalidatePath('/path');
    return { success: true, item: result };
  } catch (error: any) {
    return { error: error.message || 'Operation failed' };
  }
}
```

$ARGUMENTS
