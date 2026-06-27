/**
 * Robots — Luxury Real Estate Website
 *
 * Next.js route handler for /robots.txt
 */

import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const baseUrl = env.siteUrl;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const text = [
    `User-Agent: *`,
    `Allow: /`,
    `Disallow: /studio/`,
    `Disallow: /api/`,
    `Disallow: /_next/`,
    ``,
    `Sitemap: ${sitemapUrl}`,
  ].join('\n');

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
