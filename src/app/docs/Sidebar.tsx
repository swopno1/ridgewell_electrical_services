'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { docsConfig } from '@/lib/docs-config';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-28 space-y-0.5">
      <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Documentation
      </p>

      {/* Overview link */}
      <Link
        href="/docs"
        className={cn(
          'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          pathname === '/docs'
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
        )}
      >
        <Home
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            pathname === '/docs'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
          )}
        />
        <span className="flex-1">Overview</span>
        <ChevronRight
          className={cn(
            'h-3 w-3 transition-opacity',
            pathname === '/docs' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        />
      </Link>

      <div className="pt-2 pb-1">
        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3" />
      </div>

      {docsConfig.map((item) => {
        const href = `/docs/${item.slug}`;
        const isActive = pathname === href;
        const itemWithNew = item as typeof item & { isNew?: boolean };

        return (
          <Link
            key={item.slug}
            href={href}
            className={cn(
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? `bg-slate-50 dark:bg-slate-800/60 ${item.color}`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            )}
          >
            <item.icon
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                isActive
                  ? item.color
                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              )}
            />
            <span className="flex-1 truncate">{item.title}</span>
            {itemWithNew.isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 leading-none">
                New
              </span>
            )}
            <ChevronRight
              className={cn(
                'h-3 w-3 shrink-0 transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
