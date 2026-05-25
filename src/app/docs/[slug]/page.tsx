import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

const slugToFilename: Record<string, string> = {
  'getting-started': 'Phase 1: Onboarding, Account Setup & Role Scopes.md',
  'timesheet': 'Phase 2: Timesheet Logging & Daily Entries.md',
  'leave-balances': 'Phase 3: Leave Requests & Balance Management.md',
  'manager-approvals': 'Phase 4: Manager Approvals Queue & Project Tracking.md',
  'administrator-console': 'Phase 5: Administrator Console, Directory & Reports.md',
};

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const filename = slugToFilename[slug];

  if (!filename) {
    notFound();
  }

  const filePath = path.join(process.cwd(), 'docs', filename);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const htmlContent = marked(fileContent);

  // Extract title from slug for breadcrumb
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link href="/docs" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          Documentation
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-white font-bold">{title}</span>
      </nav>

      {/* Markdown Content */}
      <article
        className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:mb-8
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-7 prose-p:mb-4
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
          prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic
          prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:font-mono prose-code:text-sm
          prose-table:w-full prose-table:border-collapse prose-table:my-8
          prose-th:border prose-th:border-slate-200 dark:prose-th:border-slate-800 prose-th:p-3 prose-th:bg-slate-50 dark:prose-th:bg-slate-900 prose-th:text-left
          prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-800 prose-td:p-3
        "
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Navigation Footer */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        {slug !== 'getting-started' ? (
          <Link
            href={`/docs/phase-${parseInt(slug.split('-')[1]) - 1}`}
            className="flex flex-col gap-1 text-left group"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Previous</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Phase {parseInt(slug.split('-')[1]) - 1}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {slug !== 'administrator-console' ? (
          <Link
            href={`/docs/phase-${parseInt(slug.split('-')[1]) + 1}`}
            className="flex flex-col gap-1 text-right group"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Next</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
              Phase {parseInt(slug.split('-')[1]) + 1}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'getting-started' },
    { slug: 'timesheet' },
    { slug: 'leave-balances' },
    { slug: 'manager-approvals' },
    { slug: 'administrator-console' },
  ];
}
