/**
 * Site Map Builder — Luxury Real Estate Website
 *
 * Generates sitemap entries with static routes + CMS project routes.
 */

import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getProjectSlugs } from '@/lib/projects';

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

/**
 * Build sitemap entries
 */
export function buildSitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.siteUrl;

  // Static routes
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic project routes (fetch from CMS or mock)
  // In Phase 08A+ this would use: await getProjectSlugs()
  const projectSlugs = getProjectSlugs();
  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...projectEntries];
}

export default buildSitemap;
