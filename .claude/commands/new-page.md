Create a new protected page following the project's server + client component pattern.

Pattern:
- `src/app/<feature>/page.tsx` — Server component: checks auth, fetches data, passes to client
- `src/app/<feature>/<Feature>ClientPage.tsx` — Client component: handles interactivity

Server page template:
```tsx
import { getSession } from '@/lib/session';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { redirect } from 'next/navigation';
import { FeatureClientPage } from './FeatureClientPage';

export default async function FeaturePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/auth/signin');

  const userRole = session.user.role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

  // Fetch data here...

  return (
    <DashboardLayout
      userRole={userRole}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
    >
      <FeatureClientPage data={data} userRole={userRole} />
    </DashboardLayout>
  );
}
```

Also add the route to the middleware matcher in `src/proxy.ts` if it needs to be protected.

$ARGUMENTS
