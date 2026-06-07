import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { docsConfig, getDocBySlug } from '@/lib/docs-config';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) notFound();

  const filePath = path.join(process.cwd(), 'docs', doc.filename);
  if (!fs.existsSync(filePath)) notFound();

  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Strip the leading H1 — it is shown in the hero header instead
  const contentWithoutTitle = fileContent.replace(/^#\s+.+\n+/, '');

  let htmlContent = await marked(contentWithoutTitle) as string;

  // Normalise GFM alert blockquotes for both marked v13+ (adds classes) and older (plain text)
  const alertMap: Record<string, string> = {
    NOTE: 'note',
    TIP: 'tip',
    IMPORTANT: 'important',
    WARNING: 'warning',
    CAUTION: 'caution',
  };
  Object.entries(alertMap).forEach(([tag, cls]) => {
    htmlContent = htmlContent.replace(
      new RegExp(`<blockquote>\\s*<p>\\[!${tag}\\]\\n?`, 'g'),
      `<blockquote class="markdown-alert markdown-alert-${cls}"><p>`
    );
  });

  // Find adjacent docs for prev/next navigation
  const currentIndex = docsConfig.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? docsConfig[currentIndex - 1] : null;
  const nextDoc = currentIndex < docsConfig.length - 1 ? docsConfig[currentIndex + 1] : null;

  const docWithNew = doc as typeof doc & { isNew?: boolean };

  // Dark-mode-safe hero backgrounds keyed to the bgColor token
  const heroDark: Record<string, string> = {
    'bg-blue-100': 'dark:bg-blue-950/30',
    'bg-emerald-100': 'dark:bg-emerald-950/30',
    'bg-purple-100': 'dark:bg-purple-950/30',
    'bg-sky-100': 'dark:bg-sky-950/30',
    'bg-amber-100': 'dark:bg-amber-950/30',
    'bg-slate-100': 'dark:bg-slate-800/40',
    'bg-rose-100': 'dark:bg-rose-950/30',
  };
  const darkBg = heroDark[doc.bgColor] ?? 'dark:bg-slate-800/40';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero header */}
      <div className={`relative overflow-hidden rounded-2xl p-7 ${doc.bgColor} ${darkBg}`}>
        {/* Decorative circle */}
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 ${doc.bgColor.replace('100', '300')}`}
        />
        <div className="relative flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm dark:bg-slate-900/60">
            <doc.icon className={`h-7 w-7 ${doc.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-2">
              <Link
                href="/docs"
                className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Docs
              </Link>
              <span className="text-slate-400 text-xs">›</span>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${doc.color}`}>
                {doc.title}
              </span>
              {docWithNew.isNew && (
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500 text-white leading-none">
                  New
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
              {doc.title}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {doc.description}
            </p>
          </div>
        </div>
      </div>

      {/* Markdown content */}
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Prev / Next navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-stretch gap-4">
        {prevDoc ? (
          <Link
            href={`/docs/${prevDoc.slug}`}
            className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-blue-300 hover:bg-slate-50 dark:hover:border-blue-700 dark:hover:bg-slate-900/50 group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Previous</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{prevDoc.title}</span>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextDoc ? (
          <Link
            href={`/docs/${nextDoc.slug}`}
            className="flex items-center justify-end gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-blue-300 hover:bg-slate-50 dark:hover:border-blue-700 dark:hover:bg-slate-900/50 group text-right"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Next</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{nextDoc.title}</span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowRight className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return docsConfig.map((doc) => ({ slug: doc.slug }));
}
