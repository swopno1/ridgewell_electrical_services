'use client';

import Link from 'next/link';
import { appConfig } from '@/lib/config';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
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
          {appConfig.footer.showLinks && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Quick Links
              </h4>
              <nav className="space-y-1">
                {appConfig.footer.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 block"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

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
                <Link
                  href={appConfig.developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Website
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href={appConfig.developer.contact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Contact
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <p>
              © {currentYear} {appConfig.company.name}. All rights reserved.
            </p>
            {appConfig.footer.showVersion && (
              <p>
                {appConfig.app.name} v{appConfig.app.version}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
