/**
 * Search Engine — Luxury Real Estate Website
 *
 * Client-side search with keyword matching across multiple fields.
 */

import type { SanityProject } from '@/lib/sanity/types';
import type { SearchField } from './types';

/**
 * Search projects by query string
 *
 * Performs case-insensitive search across multiple fields:
 * - title
 * - description
 * - location (address, city, state, country)
 * - category
 */
export function searchProjects(
  projects: SanityProject[],
  query: string,
  fields: SearchField[]
): SanityProject[] {
  if (!query.trim()) {
    return projects;
  }

  const lowerQuery = query.toLowerCase().trim();

  return projects.filter(project => {
    for (const field of fields) {
      if (matchesField(project, field, lowerQuery)) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Check if a project matches a search field
 */
function matchesField(
  project: SanityProject,
  field: SearchField,
  query: string
): boolean {
  switch (field) {
    case 'title':
      return project.title?.toLowerCase().includes(query) ?? false;

    case 'description':
      return (
        project.description?.toLowerCase().includes(query) ??
        project.tagline?.toLowerCase().includes(query) ??
        false
      );

    case 'location': {
      const location = project.location;
      if (!location) return false;
      return (
        location.address?.toLowerCase().includes(query) ??
        location.city?.toLowerCase().includes(query) ??
        location.state?.toLowerCase().includes(query) ??
        location.country?.toLowerCase().includes(query) ??
        false
      );
    }

    case 'category':
      return project.category?.toLowerCase().includes(query) ?? false;

    default:
      return false;
  }
}

/**
 * Highlight search matches (for display)
 */
export function highlightMatches(
  text: string,
  query: string
): { value: string; highlight: boolean }[] {
  if (!query.trim() || !text) {
    return [{ value: text || '', highlight: false }];
  }

  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const parts: { value: string; highlight: boolean }[] = [];

  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    // Add text before match
    if (index > lastIndex) {
      parts.push({
        value: text.slice(lastIndex, index),
        highlight: false,
      });
    }

    // Add highlighted match
    parts.push({
      value: text.slice(index, index + query.length),
      highlight: true,
    });

    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      value: text.slice(lastIndex),
      highlight: false,
    });
  }

  return parts.length > 0 ? parts : [{ value: text, highlight: false }];
}
