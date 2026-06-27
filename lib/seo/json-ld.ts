/**
 * JSON-LD Generators — Luxury Real Estate Website
 *
 * Type-safe structured data generators using schema-dts.
 */

import type {
  WithContext,
  Organization,
  WebSite,
  WebPage,
  BreadcrumbList,
  ListItem,
  Thing,
  PostalAddress,
  GeoCoordinates,
} from 'schema-dts';

import { env } from '@/lib/env';
import { siteConfig } from '@/lib/site';
import type { Project } from '@/lib/project';

/**
 * Organization JSON-LD
 */
export function buildOrganizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${env.siteUrl}#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: env.siteUrl,
    logo: `${env.siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/lumiereestates',
      'https://instagram.com/lumiereestates',
      'https://linkedin.com/company/lumiereestates',
    ],
  };
}

/**
 * Website JSON-LD
 */
export function buildWebsiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${env.siteUrl}#website`,
    name: siteConfig.name,
    url: env.siteUrl,
    publisher: {
      '@id': `${env.siteUrl}#organization`,
    },
  };
}

/**
 * WebPage JSON-LD
 */
export function buildWebPageJsonLd(
  title: string,
  description: string,
  path = ''
): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${env.siteUrl}${path}`,
    isPartOf: {
      '@id': `${env.siteUrl}#website`,
    },
    publisher: {
      '@id': `${env.siteUrl}#organization`,
    },
  };
}

/**
 * RealEstateListing JSON-LD for projects
 * Uses Thing as base to allow flexible properties including offers
 */
export function buildResidenceJsonLd(
  project: Project
): WithContext<Thing> & Record<string, unknown> {
  const { title, description, location, media, pricing } = project;

  const address: PostalAddress = {
    '@type': 'PostalAddress',
    streetAddress: location.address,
    addressLocality: location.city,
    addressRegion: location.state,
    addressCountry: location.country,
    postalCode: location.postalCode,
  };

  const images: string[] = [media.featuredImage.url];
  if (media.gallery?.length) {
    images.push(...media.gallery.slice(0, 4).map((img) => img.url));
  }

  const geo: GeoCoordinates | undefined = location.coordinates
    ? {
        '@type': 'GeoCoordinates',
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng,
      }
    : undefined;

  const base: WithContext<Thing> & Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description || title,
    url: `${env.siteUrl}/projects/${project.slug}`,
    image: images,
    address,
  };

  if (geo) {
    base.geo = geo;
  }

  // Add offers (available on RealEstateListing schema)
  base.offers = {
    '@type': 'Offer',
    price: pricing.startingPrice,
    priceCurrency: pricing.currency,
    availability:
      project.status === 'sold-out'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
    url: `${env.siteUrl}/projects/${project.slug}`,
  };

  return base;
}

/**
 * BreadcrumbList JSON-LD
 */
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  const listItems: ListItem[] = items.map((item, index) => ({
    '@type': 'ListItem',
    name: item.name,
    position: index + 1,
    item: item.url,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}

/**
 * Get canonical path from project slug
 */
export function getProjectCanonical(project: Project): string {
  return `${env.siteUrl}/projects/${project.slug}`;
}

export default {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  buildWebPageJsonLd,
  buildResidenceJsonLd,
  buildBreadcrumbJsonLd,
  getProjectCanonical,
};
