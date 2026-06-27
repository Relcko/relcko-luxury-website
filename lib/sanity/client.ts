/**
 * Sanity Client — Luxury Real Estate Website
 *
 * Centralized Sanity client configuration.
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Environment variables (must be set in .env.local)
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

/**
 * Sanity client configuration
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Preview client (with real-time updates)
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
});

/**
 * Image URL builder
 */
const builder = imageUrlBuilder(sanityClient);

/**
 * Build image URLs from Sanity image documents
 */
export const imageUrl = (source: SanityImageSource) => builder.image(source);

/**
 * Get client based on preview mode
 */
export function getClient(preview = false) {
  return preview ? previewClient : sanityClient;
}

/**
 * Sanity configuration export
 */
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};
