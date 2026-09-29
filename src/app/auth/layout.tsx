export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <span>Explore WorkRoster: </span>
        <a
          href="https://www.workroster.net"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300"
        >
          workforce SaaS
        </a>
        <span className="px-2" aria-hidden="true">
          |
        </span>
        <a
          href="https://play.google.com/store/apps/details?id=net.workroster.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300"
        >
          Android app on Google Play
        </a>
      </footer>
    </div>
  );
}
