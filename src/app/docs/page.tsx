import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import { docsConfig } from '@/lib/docs-config';

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Documentation
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Everything you need to know about using TimesheetPro for time tracking and leave management.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {docsConfig.map((category) => (
          <Link
            key={category.slug}
            href={`/docs/${category.slug}`}
            className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor} ${category.color}`}>
              <category.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {category.description}
              </p>
            </div>
            <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
              Read More
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl bg-slate-900 p-8 text-white dark:bg-blue-900/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">Need more help?</h2>
            <p className="text-slate-300">
              If you can't find what you're looking for in the documentation, please reach out to your system administrator or the IT support team.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="mailto:support@ridgewelles.co.uk"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
              <BookOpen className="h-16 w-16 text-blue-400" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
