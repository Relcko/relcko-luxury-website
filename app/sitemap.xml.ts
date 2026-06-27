/**
 * Sitemap — Luxury Real Estate Website
 *
 * Next.js route handler for /sitemap.xml
 */

import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getProjectSlugs } from '@/lib/projects';

export const dynamic = 'force-dynamic';

/**
 * Static routes for sitemap
 */
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/projects', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/communities', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/lifestyle', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/innovation', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/news', priority: 0.8, changeFrequency: 'daily' as const },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
] as const;

export async function GET(): Promise<Response> {
  const baseUrl = env.siteUrl;
  const lastModified = new Date();

  // Static routes
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic project routes
  const projectSlugs = getProjectSlugs();
  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const sitemap = [...staticEntries, ...projectEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((entry) => {
  const lastMod = typeof entry.lastModified === 'string'
    ? entry.lastModified
    : (entry.lastModified as Date).toISOString();
  return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
