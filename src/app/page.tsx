'use client';

import Image from 'next/image';
import { appConfig } from '@/lib/config';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Ridgewell ES",
            "applicationCategory": "BusinessApplication",
            "description": appConfig.app.description,
            "url": "https://ridgewell-electrical.vercel.app",
            "screenshot": "https://ridgewell-electrical.vercel.app/banner_ridgewell_es.png",
            "author": {
              "@type": "Organization",
              "name": "ViveScript Solutions",
              "url": "https://www.vivescriptsolutions.com",
              "description": "Leading software development and digital transformation company specializing in custom web applications and enterprise solutions",
              "sameAs": [
                "https://www.vivescriptsolutions.com/en/services",
                "https://www.vivescriptsolutions.com/en/contact"
              ]
            },
            "features": [
              "Employee Time Entry & Timesheet Management",
              "Leave Request Management",
              "Interactive Calendar View",
              "Project & Client Management",
              "Advanced Reporting & Analytics",
              "Role-Based Access Control",
              "Email Notifications",
              "Progressive Web App (PWA)"
            ],
            "offers": {
              "@type": "Offer",
              "price": "Contact for pricing",
              "priceCurrency": "USD"
            },
            "operatingSystem": "Web (PWA Ready)"
          })
        }}
      />
      <div className="min-h-screen flex flex-col bg-slate-950">
        <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner_ridgewell_es.png"
              alt="Ridgewell ES - Employee Timesheet & Leave Management System"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/50" />
          </div>

          {/* Landing Card */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-2xl backdrop-blur-md">
            {/* Logo Container */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-sm">
              <Image
                src={appConfig.company.logo}
                alt={appConfig.company.name}
                width={80}
                height={80}
                priority
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Brand Information */}
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {appConfig.company.name}
            </h1>
            <p className="mb-4 text-sm font-medium text-slate-400">
              {appConfig.app.description}
            </p>
            <p className="mb-8 text-xs text-slate-500">
              Built by <a href="https://www.vivescriptsolutions.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">ViveScript Solutions</a>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="flex h-10 items-center justify-center rounded-xl bg-slate-800/50">
                  <span className="text-xs text-slate-400">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <a
                  href="/dashboard"
                  className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200"
                >
                  Go to Dashboard
                </a>
              ) : (
                <a
                  href="/auth/signin"
                  className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200"
                >
                  Sign In
                </a>
              )}
            </div>

            {/* Decorative Grid Accent */}
            <div className="mt-8 border-t border-white/5 pt-6 text-[11px] text-slate-500">
              <p>© {new Date().getFullYear()} {appConfig.company.name}.</p>
              <p className="mt-1">All rights reserved.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} {appConfig.company.name}. All rights reserved.
              </p>
              <nav className="flex items-center gap-6">
                <Link
                  href="/tos"
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact"
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Contact & Credits
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
