/**
 * Robots Builder — Luxury Real Estate Website
 *
 * Generates robots.txt configuration.
 */

import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Build robots.txt configuration
 */
export function buildRobots(): MetadataRoute.Robots {
  const baseUrl = env.siteUrl;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/_next/'],
      },
    ],
    sitemap: [sitemapUrl],
    host: baseUrl,
  };
}

export default buildRobots;
