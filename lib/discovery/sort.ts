/**
 * Sort Engine — Luxury Real Estate Website
 *
 * Client-side sorting with reusable sort strategies.
 */

import type { SanityProject } from '@/lib/sanity/types';
import type { SortField } from './types';

/**
 * Sort projects by field
 *
 * Supports multiple sort strategies:
 * - featured (default): Featured first, then by newest
 * - newest: Newest first by launch date
 * - alphabetical: A-Z by title
 * - status: By status (completed > under-construction > planning)
 */
export function sortProjects(
  projects: SanityProject[],
  sort: SortField
): SanityProject[] {
  const sorted = [...projects];

  switch (sort) {
    case 'featured':
      return sorted.sort(sortByFeatured);

    case 'newest':
      return sorted.sort(sortByNewest);

    case 'alphabetical':
      return sorted.sort(sortByAlphabetical);

    case 'status':
      return sorted.sort(sortByStatus);

    default:
      return sorted;
  }
}

/**
 * Sort by featured (default): Featured first, then by newest
 */
function sortByFeatured(a: SanityProject, b: SanityProject): number {
  // If we had a "featured" flag, we'd use it here
  // For now, just sort by newest
  return sortByNewest(a, b);
}

/**
 * Sort by newest: By launch date (newest first)
 */
function sortByNewest(a: SanityProject, b: SanityProject): number {
  const aDate = a.timestamp?.launchDate ?? a.timestamp?.createdAt ?? '';
  const bDate = b.timestamp?.launchDate ?? b.timestamp?.createdAt ?? '';

  if (!aDate && !bDate) return 0;
  if (!aDate) return 1;
  if (!bDate) return -1;

  return bDate.localeCompare(aDate);
}

/**
 * Sort alphabetically: A-Z by title
 */
function sortByAlphabetical(a: SanityProject, b: SanityProject): number {
  const aTitle = a.title ?? '';
  const bTitle = b.title ?? '';

  return aTitle.localeCompare(bTitle);
}

/**
 * Sort by status
 * Status order: completed > under-construction > planning > others
 */
function sortByStatus(a: SanityProject, b: SanityProject): number {
  const statusOrder: Record<string, number> = {
    'completed': 0,
    'under-construction': 1,
    'planning': 2,
  };

  const aOrder = statusOrder[a.status ?? ''] ?? 3;
  const bOrder = statusOrder[b.status ?? ''] ?? 3;

  return aOrder - bOrder;
}

/**
 * Get sort label for display
 */
export function getSortLabel(sort: SortField): string {
  const labels: Record<SortField, string> = {
    'featured': 'Featured',
    'newest': 'Newest',
    'alphabetical': 'A-Z',
    'status': 'Status',
  };

  return labels[sort] ?? 'Featured';
}
