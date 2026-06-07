import Link from "next/link";
import { ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { docsConfig } from "@/lib/docs-config";

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          <BookOpen className="h-4 w-4" />
          <span>Help Centre</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Documentation
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Everything you need to use Ridgewell ES — from setting up your account
          to approving timesheets and generating payroll reports.
        </p>
      </section>

      {/* Doc cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {docsConfig.map((category) => {
          const catWithNew = category as typeof category & { isNew?: boolean };
          return (
            <Link
              key={category.slug}
              href={`/docs/${category.slug}`}
              className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              {/* New badge */}
              {catWithNew.isNew && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Sparkles className="h-2.5 w-2.5" />
                  New
                </div>
              )}

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.bgColor} ${category.color}`}
              >
                <category.icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>

              <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                Read guide
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Support CTA */}
      <section className="rounded-2xl bg-slate-900 p-8 text-white dark:bg-blue-900/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              If the documentation doesn't cover your question, reach out to
              your system administrator or the support team directly.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="mailto:info@vivescriptsolutions.com"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
          <div className="hidden md:flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
            <BookOpen className="h-14 w-14 text-blue-400" />
          </div>
        </div>
      </section>
    </div>
  );
}
