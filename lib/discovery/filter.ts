/**
 * Filter Engine — Luxury Real Estate Website
 *
 * Client-side filtering with support for multiple simultaneous filters.
 */

import type { SanityProject } from '@/lib/sanity/types';
import type { FilterField, FilterValues } from './types';

/**
 * Filter projects by active filter values
 *
 * Supports multiple simultaneous filters:
 * - category
 * - status
 * - ownershipModel
 * - city
 * - country
 *
 * All filters are AND'd together (must match all active filters)
 */
export function filterProjects(
  projects: SanityProject[],
  filters: FilterValues
): SanityProject[] {
  // Get active filter entries
  const activeFilters = Object.entries(filters) as [FilterField, string[]][];

  // If no active filters, return all projects
  if (activeFilters.length === 0) {
    return projects;
  }

  return projects.filter(project => {
    // Check each active filter
    for (const [field, values] of activeFilters) {
      if (values.length === 0) continue;

      if (!matchesFilter(project, field, values)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Check if a project matches a filter
 */
function matchesFilter(
  project: SanityProject,
  field: FilterField,
  values: string[]
): boolean {
  const projectValue = getFilterValue(project, field);

  if (!projectValue) return false;

  // Check if project value is in filter values
  return values.includes(projectValue);
}

/**
 * Get a project's filter value
 */
function getFilterValue(
  project: SanityProject,
  field: FilterField
): string | undefined {
  switch (field) {
    case 'category':
      return project.category;

    case 'status':
      return project.status;

    case 'ownershipModel':
      return project.ownershipModel;

    case 'city':
      return project.location?.city;

    case 'country':
      return project.location?.country;

    default:
      return undefined;
  }
}

/**
 * Toggle a filter value (for multi-select)
 */
export function toggleFilterValue(
  current: string[],
  value: string
): string[] {
  if (current.includes(value)) {
    return current.filter(v => v !== value);
  }
  return [...current, value];
}

/**
 * Clear a filter
 */
export function clearFilter(filters: FilterValues, field: FilterField): FilterValues {
  const next = { ...filters };
  delete next[field];
  return next;
}

/**
 * Clear all filters
 */
export function clearAllFilters(): FilterValues {
  return {};
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: FilterValues): number {
  return Object.values(filters).reduce((sum, values) => sum + values.length, 0);
}

/**
 * Get active filter labels (for display in chips)
 */
export function getActiveFilterLabels(
  filters: FilterValues,
  getLabel: (field: FilterField, value: string) => string
): { field: FilterField; value: string; label: string }[] {
  const labels: { field: FilterField; value: string; label: string }[] = [];

  for (const [field, values] of Object.entries(filters)) {
    for (const value of values) {
      labels.push({
        field: field as FilterField,
        value,
        label: getLabel(field as FilterField, value),
      });
    }
  }

  return labels;
}
