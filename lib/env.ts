/**
 * Centralized, type-safe environment access. Keeping reads in one module means
 * later phases validate new CMS/server keys here rather than scattering
 * process.env lookups across the codebase.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const env = {
  siteUrl,
  isProduction: process.env.NODE_ENV === "production",
} as const;

export type Env = typeof env;
