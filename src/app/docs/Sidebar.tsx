'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { docsConfig } from '@/lib/docs-config';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-28 space-y-1">
      <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        Documentation
      </p>

      <Link
        href="/docs"
        className={cn(
          "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname === '/docs'
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        )}
      >
        <span>Overview</span>
        <ChevronRight className={cn(
          "h-3 w-3 transition-opacity",
          pathname === '/docs' ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />
      </Link>

      {docsConfig.map((item) => {
        const href = `/docs/${item.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={item.slug}
            href={href}
            className={cn(
              "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            )}
          >
            <span>{item.title}</span>
            <ChevronRight className={cn(
              "h-3 w-3 transition-opacity",
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
          </Link>
        );
      })}
    </nav>
  );
}
