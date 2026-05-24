import { appConfig } from '@/lib/config';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-slate-200">
        <h1 className="text-3xl font-bold mb-2">{appConfig.app.name}</h1>
        <p className="text-slate-600 mb-6">{appConfig.app.description}</p>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Welcome to the entry page. The application is set up with Next.js 16.
          </p>
          <a
            href="/dashboard"
            className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-sm transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
