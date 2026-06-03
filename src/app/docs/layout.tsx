import React from 'react';
import { Sidebar } from './Sidebar';
import { PublicLayout } from '@/components/layouts/PublicLayout';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout title="Documentation">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </PublicLayout>
  );
}
