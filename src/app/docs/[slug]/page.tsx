import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { docsConfig, getDocBySlug } from '@/lib/docs-config';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const filePath = path.join(process.cwd(), 'docs', doc.filename);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const htmlContent = marked(fileContent);

  // Find index for pagination
  const currentIndex = docsConfig.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? docsConfig[currentIndex - 1] : null;
  const nextDoc = currentIndex < docsConfig.length - 1 ? docsConfig[currentIndex + 1] : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link href="/docs" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          Documentation
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-white font-bold">{doc.title}</span>
      </nav>

      {/* Markdown Content */}
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Navigation Footer */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        {prevDoc ? (
          <Link
            href={`/docs/${prevDoc.slug}`}
            className="flex w-full sm:w-auto items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-blue-700 dark:hover:bg-slate-900/50 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Previous</span>
              <span className="text-slate-900 dark:text-white font-semibold">{prevDoc.title}</span>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextDoc ? (
          <Link
            href={`/docs/${nextDoc.slug}`}
            className="flex w-full sm:w-auto items-center justify-end gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-blue-700 dark:hover:bg-slate-900/50 group text-right"
          >
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Next</span>
              <span className="text-slate-900 dark:text-white font-semibold">{nextDoc.title}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
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
  return docsConfig.map((doc) => ({
    slug: doc.slug,
  }));
}
