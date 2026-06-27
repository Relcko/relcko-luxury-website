/**
 * Project Data — Luxury Real Estate Website
 *
 * Server-side data fetching for projects.
 * Uses Sanity client with adapter layer.
 */

import { sanityClient as client } from '@/lib/sanity/client';
import { projectBySlugQuery, projectsQuery } from '@/lib/sanity/queries';
import type { SanityProject } from '@/lib/sanity/types';
import { adaptProject } from '@/lib/adapters/project';
import type { Project } from '@/lib/project';

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  const docs = await client.fetch<SanityProject[]>(projectsQuery);
  return docs.map(adaptProject).filter(Boolean) as Project[];
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await client.fetch<SanityProject | null>(projectBySlugQuery, { slug });
  return adaptProject(doc);
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const allProjects = await getProjects();
  return allProjects.filter(
    (p) => p.status === 'completed' || p.status === 'under-construction'
  );
}

export default {
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
};
