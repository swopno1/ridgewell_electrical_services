import React from 'react';
import { Sidebar } from './Sidebar';
import { PublicLayout } from '@/components/layouts/PublicLayout';

export const metadata = {
  title: "Documentation | Ridgewell ES - Built by ViveScript Solutions",
  description: "Complete documentation and guides for Ridgewell ES, an enterprise timesheet and leave management system created by ViveScript Solutions.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ridgewell-electrical.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Documentation",
                "item": "https://ridgewell-electrical.vercel.app/docs"
              }
            ]
          })
        }}
      />
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
    </>
  );
}
