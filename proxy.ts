// proxy.ts
import { auth } from '@/auth';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
}

/**
 * Next.js Request Proxy (previously Middleware)
 * Runs on every request defined in the matcher config below.
 * Controls root-level authentication and role-based routing.
 */
export default auth((req: NextRequest & { auth?: any }) => {
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as SessionUser | undefined;
  const { pathname } = req.nextUrl;

  // Path categorization
  const isEmployeePath = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/timesheets') || 
    pathname.startsWith('/leave');
  
  const isManagerPath = 
    pathname.startsWith('/projects') || 
    pathname.startsWith('/reports');
  
  const isAdminPath = 
    pathname.startsWith('/employees') || 
    pathname.startsWith('/settings');

  const isProtectedRoute = isEmployeePath || isManagerPath || isAdminPath;

  // 1. Authentication Redirect
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Role-Based Authorization
  if (user) {
    const isLimon = user.email?.toLowerCase() === 'amirhossain.limon@gmail.com';
    const role = isLimon ? 'ADMIN' : user.role;

    if (role === 'EMPLOYEE') {
      // Employees are blocked from manager and admin routes
      if (isManagerPath || isAdminPath) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    if (role === 'MANAGER') {
      // Managers are blocked from admin routes
      if (isAdminPath) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
});

// Paths to intercept and validate
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/timesheets/:path*',
    '/leave/:path*',
    '/projects/:path*',
    '/reports/:path*',
    '/employees/:path*',
    '/settings/:path*',
  ],
};

// =========================================================================
// AUTHORIZATION UTILITY HELPERS (FOR PAGES & SERVER ACTIONS)
// =========================================================================

/**
 * Retrieves the current logged-in user from the session.
 * Redirects if requested and user session is missing.
 */
export async function getAuthenticatedUser(options: { redirectOnFail?: boolean } = {}): Promise<SessionUser | null> {
  const session = await getSession();
  const user = session?.user as SessionUser | undefined;

  if (!user || !user.id) {
    if (options.redirectOnFail) {
      redirect('/auth/signin');
    }
    return null;
  }

  if (user.email?.toLowerCase() === 'amirhossain.limon@gmail.com') {
    user.role = 'ADMIN';
  }

  return user;
}

/**
 * Page Guard: Blocks rendering of Server Components if role checks fail.
 */
export async function enforceRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const user = await getAuthenticatedUser({ redirectOnFail: true });
  
  if (!user) {
    redirect('/auth/signin');
  }

  if (!allowedRoles.includes(user.role)) {
    redirect('/dashboard');
  }

  return user;
}

/**
 * UI Visiblity Guard: Conditional checking for rendering UI buttons/cards.
 */
export async function hasRoleAccess(allowedRoles: UserRole[]): Promise<boolean> {
  const session = await getSession();
  const user = session?.user as SessionUser | undefined;

  if (!user || !user.id) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

/**
 * Server Action Guard HOC: Protects database mutations in server actions.
 */
export function secureAction<TArgs extends any[], TResult>(
  actionFn: (user: SessionUser, ...args: TArgs) => Promise<TResult>,
  allowedRoles?: UserRole[]
) {
  return async (...args: TArgs): Promise<{ success?: boolean; error?: string } | TResult> => {
    try {
      const user = await getAuthenticatedUser();
      
      if (!user) {
        return { error: 'You must be signed in to perform this action.' };
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return { error: 'Unauthorized: You do not have the required permissions.' };
      }

      return await actionFn(user, ...args);
    } catch (error: any) {
      console.error('Secure Action authorization error:', error);
      return { error: error.message || 'An authentication error occurred.' };
    }
  };
}
