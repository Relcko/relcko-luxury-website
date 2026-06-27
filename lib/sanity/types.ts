/**
 * Sanity Types — Luxury Real Estate Website
 *
 * TypeScript types for Sanity documents (CMS schema types).
 * These represent the raw Sanity document structure.
 *
 * Note: In production, these would be generated from Sanity schemas.
 */

// =============================================================================
// Enums (must match Sanity schema)
// =============================================================================

/**
 * Project category types
 */
export type SanityProjectCategory =
  | 'residential'
  | 'commercial'
  | 'mixed-use'
  | 'hospitality'
  | 'industrial'
  | 'infrastructure';

/**
 * Project status types
 */
export type SanityProjectStatus =
  | 'planning'
  | 'under-construction'
  | 'completed'
  | 'sold-out';

/**
 * Ownership model types
 */
export type SanityOwnershipModel =
  | 'freehold'
  | 'leasehold'
  | 'strata'
  | 'co-ownership'
  | 'fractional';

// =============================================================================
// Base Types
// =============================================================================

/**
 * Basic Sanity image reference (simplified)
 */
export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

/**
 * Location object
 */
export interface SanityLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Pricing object
 */
export interface SanityPricing {
  startingPrice: number;
  currency: string;
  priceUnit: 'sqft' | 'sqm' | 'total';
  priceLabel?: string;
}

/**
 * Project features object
 */
export interface SanityFeatures {
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

/**
 * Timestamp object
 */
export interface SanityTimestamp {
  createdAt: string;
  updatedAt: string;
  launchDate?: string;
  completionDate?: string;
}

/**
 * SEO object
 */
export interface SanitySeo {
  title: string;
  description: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
}

/**
 * Media object
 */
export interface SanityProjectMedia {
  featuredImage?: SanityImage;
  gallery?: SanityImage[];
  video?: {
    url?: string;
    poster?: SanityImage;
  };
  virtualTourUrl?: string;
  floorPlans?: {
    title: string;
    url: string;
    type: 'pdf' | 'doc' | 'docx';
    fileSize: number;
  }[];
}

// =============================================================================
// Document Types
// =============================================================================

/**
 * Project document (Sanity schema)
 */
export interface SanityProject {
  _id: string;
  _type: 'project';
  title: string;
  slug: { current: string };
  tagline?: string;
  description?: string;
  category?: SanityProjectCategory;
  status?: SanityProjectStatus;
  ownershipModel?: SanityOwnershipModel;
  location?: SanityLocation;
  pricing?: SanityPricing;
  media?: SanityProjectMedia;
  highlights?: string[];
  features?: SanityFeatures;
  timestamp?: SanityTimestamp;
  seo?: SanitySeo;
  relatedProjects?: { _ref: string }[];
}

/**
 * Community document (Sanity schema)
 */
export interface SanityCommunity {
  _id: string;
  _type: 'community';
  title: string;
  slug: { current: string };
  tagline?: string;
  description?: string;
  media?: {
    featuredImage?: SanityImage;
    gallery?: SanityImage[];
  };
  location?: SanityLocation;
  amenities?: string[];
  status?: SanityProjectStatus;
  seo?: SanitySeo;
}

/**
 * News post document (Sanity schema)
 */
export interface SanityNewsPost {
  _id: string;
  _type: 'newsPost';
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: unknown;
  media?: {
    featuredImage?: SanityImage;
  };
  author?: {
    name: string;
    image?: SanityImage;
  };
  publishedAt?: string;
  categories?: string[];
  seo?: SanitySeo;
}

/**
 * About document (Sanity schema)
 */
export interface SanityAbout {
  _id: string;
  _type: 'about';
  title: string;
  hero?: {
    eyebrow?: string;
    heading?: string;
  };
  mission?: string;
  vision?: string;
  values?: { title: string; description: string }[];
  team?: { name: string; role: string; image?: SanityImage }[];
  media?: {
    featuredImage?: SanityImage;
  };
}

/**
 * Homepage document (Sanity schema)
 */
export interface SanityHomepage {
  _id: string;
  _type: 'homepage';
  hero?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
  featuredProjects?: { _ref: string }[];
  about?: { _ref: string }[];
  cta?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
}

// =============================================================================
// Union Types
// =============================================================================

/**
 * All Sanity document types
 */
export type SanityDocument =
  | SanityProject
  | SanityCommunity
  | SanityNewsPost
  | SanityAbout
  | SanityHomepage;

/**
 * Query result types
 */
export interface QueryResults<T> {
  result: T[];
  total: number;
}
