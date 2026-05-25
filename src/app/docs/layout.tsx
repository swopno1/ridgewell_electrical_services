import React from 'react';
import Link from 'next/link';
import { appConfig } from '@/lib/config';
import { ChevronLeft, BookOpen, ChevronRight } from 'lucide-react';

const docsNavigation = [
  { title: 'Overview', href: '/docs', slug: '' },
  { title: 'Phase 1: Onboarding', href: '/docs/getting-started', slug: 'getting-started' },
  { title: 'Phase 2: Timesheets', href: '/docs/timesheet', slug: 'timesheet' },
  { title: 'Phase 3: Leave', href: '/docs/leave-balances', slug: 'leave-balances' },
  { title: 'Phase 4: Approvals', href: '/docs/manager-approvals', slug: 'manager-approvals' },
  { title: 'Phase 5: Admin', href: '/docs/administrator-console', slug: 'administrator-console' },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Back to App</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <Link href="/docs" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-blue-600 p-1.5">
                <BookOpen className="h-full w-full text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{appConfig.app.name} Docs</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-10 py-8 lg:py-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="sticky top-28 space-y-1">
              <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Documentation
              </p>
              {docsNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <span>{item.title}</span>
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {appConfig.company.name}. Documentation for {appConfig.app.name} v{appConfig.app.version}
          </p>
        </div>
      </footer>
    </div>
  );
}
