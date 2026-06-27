/**
 * Sanity Environment — Luxury Real Estate Website
 *
 * Validates and provides environment-based configuration.
 */

/**
 * Sanity environment variables
 */
export const sanityEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  perspective: process.env.NEXT_PUBLIC_SANITY_PERSPECTIVE || 'published',
} as const;

/**
 * Get validated environment config
 * Throws if required vars missing
 */
export function getSanityEnv() {
  const projectId = sanityEnv.projectId;

  if (!projectId) {
    throw new Error(`
Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID

Add to .env.local:
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
    `.trim());
  }

  return {
    projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    token: sanityEnv.token,
    perspective: sanityEnv.perspective,
  };
}

/**
 * Check if running in preview mode
 */
export function isPreview(): boolean {
  return !!sanityEnv.token && sanityEnv.perspective === 'previewDrafts';
}

/**
 * Required env vars for validation
 */
export const requiredEnvVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
] as const;

export type RequiredEnvVar = (typeof requiredEnvVars)[number];

export const env = sanityEnv;
export default sanityEnv;
