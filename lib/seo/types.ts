/**
 * SEO Types — Luxury Real Estate Website
 *
 * Type definitions for SEO inputs and outputs.
 * Used by metadata, JSON-LD, sitemap, and robots generators.
 */

import type { Metadata } from 'next';

import type {
  Organization,
  WebSite,
  WebPage,
  Residence,
  BreadcrumbList,
} from 'schema-dts';

/**
 * SEO input for pages
 */
export interface SeoInput {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Open Graph image */
  ogImage?: string;
  /** Canonical URL (absolute) */
  canonical?: string;
  /** No-index flag */
  noIndex?: boolean;
  /** No-follow flag */
  noFollow?: boolean;
}

/**
 * Site settings for SEO
 */
export interface SiteSettingsSeo {
  /** Site name */
  siteName: string;
  /** Site title */
  title: string;
  /** Site description */
  description: string;
  /** Site URL */
  url: string;
  /** Default OG image */
  ogImage: string;
  /** Twitter handle */
  twitterHandle?: string;
}

/**
 * JSON-LD context types
 */
export interface JsonLdData {
  organization: Organization;
  website: WebSite;
}

/**
 * Page-specific JSON-LD
 */
export type PageJsonLd = WebPage | Residence | BreadcrumbList;

/**
 * Alternate URLs for i18n support
 */
export interface AlternateUrls {
  /** Languages and their URLs */
  languages?: Record<string, string>;
}

/**
 * Metadata result from builder
 */
export interface SeoMetadata extends Metadata {
  /** Alternates for i18n */
  alternates?: {
    canonical: string;
    languages?: Record<string, string>;
  };
}

/**
 * Sitemap entry
 */
export interface SitemapEntry {
  /** URL */
  url: string;
  /** Last modified */
  lastModified?: string | Date;
  /** Change frequency */
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** Priority */
  priority?: number;
}

/**
 * Static route for sitemap
 */
export interface StaticRoute {
  /** Route path */
  path: string;
  /** Priority (0.0-1.0) */
  priority?: number;
  /** Change frequency */
  changeFrequency?: SitemapEntry['changeFrequency'];
}

/**
 * Robots directive
 */
export interface RobotsDirective {
  /** Allow crawling */
  allow?: string[];
  /** Disallow crawling */
  disallow?: string[];
  /** Crawl delay in seconds */
  crawlDelay?: number;
}
