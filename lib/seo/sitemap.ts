/**
 * Sitemap Builder — Luxury Real Estate Website
 *
 * Generates sitemap.xml configuration.
 */

import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getAllProjects } from '@/lib/projects';

/**
 * Build sitemap.xml entries
 */
export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/communities`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lifestyle`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/innovation`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic project routes
  try {
    const projects = await getAllProjects();

    const projectRoutes: MetadataRoute.Sitemap = projects.map(project => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.timestamp?.updatedAt ?? project.timestamp?.createdAt ?? now),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes];
  } catch {
    // If we can't fetch projects, just return static routes
    return staticRoutes;
  }
}

export default buildSitemap;
