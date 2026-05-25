'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { AppSidebar } from '@/components/dashboard/app-sidebar';

export function DashboardLayout({
  children,
  userRole = 'EMPLOYEE',
  userName = 'Employee User',
  userEmail = 'employee@example.com',
}: {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();

  // Build breadcrumb items based on path
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <AppSidebar userRole={userRole} userName={userName} userEmail={userEmail} />

        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <SidebarSeparator className="mx-2 h-4" />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={breadcrumb.href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                              {breadcrumb.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden md:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
