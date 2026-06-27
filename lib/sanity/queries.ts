/**
 * GROQ Queries — Luxury Real Estate Website
 *
 * Reusable GROQ queries for fetching content from Sanity.
 */

import groq from 'groq';

// =============================================================================
// Document Queries
// =============================================================================

/**
 * All projects (published)
 */
export const projectsQuery = groq`*[_type == "project" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  tagline,
  description,
  category,
  status,
  ownershipModel,
  pricing,
  location,
  "media": {
    "featuredImage": media.featuredImage,
    "gallery": media.gallery[]{
      ...,
      "asset": media.asset->{
        ...,
        "metadata": metadata
      }
    },
    "video": media.video,
    "virtualTourUrl": media.virtualTourUrl,
    "floorPlans": media.floorPlans
  },
  highlights,
  features,
  timestamp,
  seo
}`;

/**
 * Single project by slug
 */
export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  _type,
  title,
  slug,
  tagline,
  description,
  category,
  status,
  ownershipModel,
  pricing,
  location,
  "media": {
    "featuredImage": media.featuredImage,
    "gallery": media.gallery[]{
      ...,
      "asset": media.asset->{
        ...,
        "metadata": metadata
      }
    },
    "video": media.video,
    "virtualTourUrl": media.virtualTourUrl,
    "floorPlans": media.floorPlans
  },
  highlights,
  features,
  timestamp,
  seo,
  "relatedProjects": relatedProjects[]->{
    _id,
    title,
    slug,
    "featuredImage": media.featuredImage,
    tagline
  }
}`;

/**
 * Featured projects (completed or under-construction)
 */
export const featuredProjectsQuery = groq`*[_type == "project" && status in ["completed", "under-construction"] && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  tagline,
  category,
  status,
  pricing,
  "featuredImage": media.featuredImage,
  location,
  timestamp
}`;

/**
 * Projects by category
 */
export const projectsByCategoryQuery = groq`*[_type == "project" && category == $category && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  tagline,
  category,
  status,
  pricing,
  "featuredImage": media.featuredImage,
  location
}`;

/**
 * All communities
 */
export const communitiesQuery = groq`*[_type == "community" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  tagline,
  description,
  "featuredImage": media.featuredImage,
  location,
  status
}`;

/**
 * Single community by slug
 */
export const communityBySlugQuery = groq`*[_type == "community" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  slug,
  tagline,
  description,
  "media": {
    "featuredImage": media.featuredImage,
    "gallery": media.gallery[]{
      ...,
      "asset": media.asset->{
        ...,
        "metadata": metadata
      }
    }
  },
  location,
  amenities,
  status,
  seo
}`;

/**
 * All news posts
 */
export const newsQuery = groq`*[_type == "newsPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  "featuredImage": media.featuredImage,
  author,
  publishedAt,
  categories
}`;

/**
 * Single news post by slug
 */
export const newsPostBySlugQuery = groq`*[_type == "newsPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  slug,
  excerpt,
  body,
  "featuredImage": media.featuredImage,
  author,
  publishedAt,
  categories,
  seo
}`;

/**
 * About content
 */
export const aboutQuery = groq`*[_type == "about" && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero,
  mission,
  vision,
  values,
  team,
  "featuredImage": media.featuredImage
}`;

/**
 * Homepage content
 */
export const homepageQuery = groq`*[_type == "homepage" && !(_id in path("drafts.**"))][0] {
  _id,
  hero,
  featuredProjects,
  about,
  cta
}`;

// =============================================================================
// Metadata Queries
// =============================================================================

/**
 * All slugs for static generation
 */
export const allSlugsQuery = groq`*[_type in ["project", "community", "newsPost"] && !(_id in path("drafts.**"))].slug.current`;

/**
 * Project slugs only
 */
export const projectSlugsQuery = groq`*[_type == "project" && !(_id in path("drafts.**"))].slug.current`;

/**
 * Community slugs only
 */
export const communitySlugsQuery = groq`*[_type == "community" && !(_id in path("drafts.**"))].slug.current`;

/**
 * News post slugs only
 */
export const newsSlugsQuery = groq`*[_type == "newsPost" && !(_id in path("drafts.**"))].slug.current`;

// =============================================================================
// Query Parameters Type
// =============================================================================

/**
 * Query parameter types
 */
export interface QueryParams {
  slug?: string;
  category?: string;
  limit?: number;
}

/**
 * Default query parameters
 */
export const defaultParams: QueryParams = {
  limit: 100,
};
