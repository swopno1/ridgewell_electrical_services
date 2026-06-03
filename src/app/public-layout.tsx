import Link from 'next/link';
import { appConfig } from '@/lib/config';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export function PublicLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 p-1">
              <Image
                src={appConfig.company.logo}
                alt="Logo"
                width={32}
                height={32}
                className="object-contain h-full w-full"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
                {appConfig.app.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/tos"
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Contact
            </Link>
            <Link
              href="/auth/signin"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {appConfig.app.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {appConfig.app.description}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Resources
              </h4>
              <nav className="space-y-1">
                <Link
                  href="/tos"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 block"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 block"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 block"
                >
                  Contact & Credits
                </Link>
              </nav>
            </div>

            {/* Developer Company */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Developed By
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {appConfig.developer.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={appConfig.developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={appConfig.developer.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Contact
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
              <p>
                © {new Date().getFullYear()} {appConfig.company.name}. All rights reserved.
              </p>
              <p>
                {appConfig.app.name} v{appConfig.app.version}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
