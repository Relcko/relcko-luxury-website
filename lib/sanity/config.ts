/**
 * Sanity Configuration — Luxury Real Estate Website
 *
 * Shared configuration for Sanity client and image builder.
 */

import { getSanityEnv } from './env';

/**
 * Get Sanity configuration (validates env vars)
 */
export function getSanityConfig() {
  const env = getSanityEnv();

  return {
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
  };
}

/**
 * Static config (does not validate)
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
} as const;

/**
 * Default dataset
 */
export const dataset = sanityConfig.dataset;

/**
 * API version
 */
export const apiVersion = sanityConfig.apiVersion;

export default sanityConfig;
