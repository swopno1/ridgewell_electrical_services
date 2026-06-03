import { MetadataRoute } from 'next';
import { docsConfig } from '@/lib/docs-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ridgewell-es.com';
  const lastBuildDate = new Date();

  // Public routes with their priority and change frequency
  const publicRoutes: MetadataRoute.Sitemap = [
    // Landing page - highest priority, updated daily
    {
      url: baseUrl,
      lastModified: lastBuildDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // Legal and informational pages - updated monthly
    {
      url: `${baseUrl}/tos`,
      lastModified: lastBuildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastBuildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastBuildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Documentation pages - updated weekly
    {
      url: `${baseUrl}/docs`,
      lastModified: lastBuildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Add documentation articles
  const docsRoutes: MetadataRoute.Sitemap = docsConfig.map((doc) => {
    // Priority varies by content type and importance
    let priority = 0.7;
    let changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'weekly';

    // Higher priority for commonly accessed docs
    if (doc.slug === 'onboarding' || doc.slug === 'timesheets' || doc.slug === 'leave') {
      priority = 0.8;
    }

    // Release notes updated less frequently
    if (doc.slug === 'maintenance') {
      changeFrequency = 'monthly';
    }

    return {
      url: `${baseUrl}/docs/${doc.slug}`,
      lastModified: lastBuildDate,
      changeFrequency,
      priority,
    };
  });

  // Combine all routes
  const allRoutes = [...publicRoutes, ...docsRoutes];

  return allRoutes;
}
