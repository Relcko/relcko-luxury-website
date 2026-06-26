/**
 * Project Interface — Luxury Real Estate Website
 *
 * This is the canonical interface for all project-related data in the application.
 * All CMS adapters, components, and loaders must conform to this interface.
 *
 * Version: 1.6.0
 * Last Updated: Phase 07A freeze
 */

// =============================================================================
// Enums
// =============================================================================

/**
 * Project category types
 */
export type ProjectCategory =
  | 'residential'
  | 'commercial'
  | 'mixed-use'
  | 'hospitality'
  | 'industrial'
  | 'infrastructure';

/**
 * Project status types
 */
export type ProjectStatus =
  | 'planning'
  | 'under-construction'
  | 'completed'
  | 'sold-out';

/**
 * Ownership model types
 */
export type OwnershipModel =
  | 'freehold'
  | 'leasehold'
  | 'strata'
  | 'co-ownership'
  | 'fractional';

/**
 * Feature flags for optional fields (additive only)
 */
export interface ProjectFeatures {
  hasVirtualTour?: boolean;
  hasSmartHome?: boolean;
  hasInfinityPool?: boolean;
  hasConcierge?: boolean;
  hasPrivateElevator?: boolean;
  hasRooftopAccess?: boolean;
  hasWineCellar?: boolean;
  hasHomeTheater?: boolean;
  hasGym?: boolean;
  hasSpa?: boolean;
  hasEVCharging?: boolean;
  hasHelipad?: boolean;
}

// =============================================================================
// Core Project Interface
// =============================================================================

/**
 * Main project interface — all properties required
 */
export interface Project {
  /** Unique identifier */
  id: string;
  /** URL-friendly slug */
  slug: string;
  /** Display name */
  title: string;
  /** Short tagline */
  tagline: string;
  /** Full description */
  description: string;
  /** Location details */
  location: ProjectLocation;
  /** Category */
  category: ProjectCategory;
  /** Development status */
  status: ProjectStatus;
  /** Ownership model */
  ownershipModel: OwnershipModel;
  /** Pricing information */
  pricing: ProjectPricing;
  /** Media assets */
  media: ProjectMedia;
  /** Key highlights (3-5 bullet points) */
  highlights: string[];
  /** Features list */
  features: ProjectFeatures;
  /** Timestamps */
  timestamp: ProjectTimestamp;
  /** SEO metadata */
  seo: ProjectSeo;
}

/**
 * Location details
 */
export interface ProjectLocation {
  /** Full address */
  address: string;
  /** City */
  city: string;
  /** State/Province */
  state: string;
  /** Country */
  country: string;
  /** Postal code */
  postalCode: string;
  /** Coordinates for map */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Pricing information
 */
export interface ProjectPricing {
  /** Starting price */
  startingPrice: number;
  /** Price currency */
  currency: string;
  /** Price unit (e.g., "sqft", "total") */
  priceUnit: 'sqft' | 'sqm' | 'total';
  /** Price label override */
  priceLabel?: string;
}

/**
 * Media assets
 */
export interface ProjectMedia {
  /** Featured image (main thumbnail) */
  featuredImage: MediaImage;
  /** Gallery images */
  gallery: MediaImage[];
  /** Video walkthrough */
  video?: MediaVideo;
  /** Virtual tour URL */
  virtualTourUrl?: string;
  /** Floor plans */
  floorPlans?: MediaDocument[];
  /** 3D models */
  model3d?: MediaModel;
}

/**
 * Image media
 */
export interface MediaImage {
  /** URL */
  url: string;
  /** Alt text */
  alt: string;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Blur data URL for lazy loading */
  blurDataUrl?: string;
  /** Priority flag for LCP */
  priority?: boolean;
}

/**
 * Video media
 */
export interface MediaVideo {
  /** Poster image */
  poster: MediaImage;
  /** Video sources (multiple for format support) */
  sources: MediaVideoSource[];
  /** Auto-play on load */
  autoplay?: boolean;
  /** Muted by default */
  muted?: boolean;
  /** Loop */
  loop?: boolean;
}

/**
 * Video source format
 */
export interface MediaVideoSource {
  /** URL */
  url: string;
  /** MIME type */
  type: 'video/mp4' | 'video/webm' | 'video/quicktime';
  /** Label for quality (e.g., "1080p", "4K") */
  label?: string;
}

/**
 * Document media (floor plans, brochures)
 */
export interface MediaDocument {
  /** Title */
  title: string;
  /** URL */
  url: string;
  /** File type */
  type: 'pdf' | 'doc' | 'docx';
  /** File size in bytes */
  fileSize: number;
}

/**
 * 3D model
 */
export interface MediaModel {
  /** Model URL (GLB/GLTF) */
  url: string;
  /** Preview image */
  preview: MediaImage;
}

/**
 * Timestamps
 */
export interface ProjectTimestamp {
  /** Creation date */
  createdAt: string;
  /** Last updated */
  updatedAt: string;
  /** Launch date (for announced projects) */
  launchDate?: string;
  /** Completion date */
  completionDate?: string;
}

/**
 * SEO metadata
 */
export interface ProjectSeo {
  /** Meta title */
  title: string;
  /** Meta description */
  description: string;
  /** Open Graph image */
  ogImage: string;
  /** Canonical URL */
  canonicalUrl: string;
}

// =============================================================================
// Additive Optional Fields Registry
// =============================================================================
// DO NOT edit existing fields. Add new optional fields only.
// Registry of all additive optional fields added after v1.6.0 freeze
// ---------------------------------------------------------------------
// | Field | Added In | Description |
// |------|---------|------------|
// | model3d | 07E | 3D model viewer support |
// | virtualTourUrl | 07E | Virtual tour integration |
// =============================================================================

/**
 * Get all project IDs (for static generation)
 */
export function getProjectIds(projects: Project[]): string[] {
  return projects.map((p) => p.slug);
}

/**
 * Get featured projects (status = completed or under-construction)
 */
export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter(
    (p) => p.status === 'completed' || p.status === 'under-construction'
  );
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(
  projects: Project[],
  category: ProjectCategory
): Project[] {
  return projects.filter((p) => p.category === category);
}

/**
 * Get projects by status
 */
export function getProjectsByStatus(
  projects: Project[],
  status: ProjectStatus
): Project[] {
  return projects.filter((p) => p.status === status);
}
