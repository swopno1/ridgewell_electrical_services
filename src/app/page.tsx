import Image from 'next/image';
import { appConfig } from '@/lib/config';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner_ridgewell_es.png"
          alt="Ridgewell Background"
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
        <p className="mb-8 text-sm font-medium text-slate-400">
          {appConfig.app.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <a
            href="/dashboard"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200"
          >
            Go to Dashboard
          </a>
          <a
            href="/auth/signin"
            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all duration-200"
          >
            Sign In
          </a>
        </div>

        {/* Decorative Grid Accent */}
        <div className="mt-8 border-t border-white/5 pt-6 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {appConfig.company.name}.</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
