/**
 * Sanity — Luxury Real Estate Website
 *
 * Centralized exports for all Sanity-related functionality.
 */

export { sanityClient, previewClient, getClient, imageUrl, sanityConfig } from './client';
export {
  projectsQuery,
  projectBySlugQuery,
  featuredProjectsQuery,
  projectsByCategoryQuery,
  communitiesQuery,
  communityBySlugQuery,
  newsQuery,
  newsPostBySlugQuery,
  aboutQuery,
  homepageQuery,
  allSlugsQuery,
  projectSlugsQuery,
  communitySlugsQuery,
  newsSlugsQuery
} from './queries';

export type {
  SanityProject,
  SanityCommunity,
  SanityNewsPost,
  SanityAbout,
  SanityHomepage,
  SanityDocument,
  SanityProjectCategory,
  SanityProjectStatus,
  SanityOwnershipModel,
  SanityLocation,
  SanityPricing,
  SanityFeatures,
  SanityTimestamp,
  SanitySeo,
  SanityProjectMedia,
  SanityImage,
  QueryResults
} from './types';
