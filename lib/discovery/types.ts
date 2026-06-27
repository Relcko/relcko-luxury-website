/**
 * Discovery Types — Luxury Real Estate Website
 *
 * TypeScript types for the Discovery & Filtering system.
 */

import type { SanityProject } from '@/lib/sanity/types';

// =============================================================================
// Filter Types
// =============================================================================

/**
 * Filter field identifiers
 */
export type FilterField = 'category' | 'status' | 'ownershipModel' | 'city' | 'country';

/**
 * Filter definition
 */
export interface FilterDefinition {
  id: FilterField;
  label: string;
  options: FilterOption[];
}

/**
 * Filter option
 */
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// =============================================================================
// Sort Types
// =============================================================================

/**
 * Sort field identifiers
 */
export type SortField = 'featured' | 'newest' | 'alphabetical' | 'status';

/**
 * Sort option
 */
export interface SortOption {
  value: SortField;
  label: string;
}

/**
 * Sort configuration
 */
export const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'status', label: 'Status' },
];

// =============================================================================
// Search Types
// =============================================================================

/**
 * Search configuration
 */
export interface SearchConfig {
  placeholder: string;
  debounceMs: number;
  fields: SearchField[];
}

/**
 * Search field identifiers
 */
export type SearchField = 'title' | 'description' | 'location' | 'category';

/**
 * Search configuration
 */
export const SEARCH_CONFIG: SearchConfig = {
  placeholder: 'Search projects...',
  debounceMs: 300,
  fields: ['title', 'description', 'location', 'category'],
};

// =============================================================================
// State Types
// =============================================================================

/**
 * Discovery state
 */
export interface DiscoveryState {
  query: string;
  filters: FilterValues;
  sort: SortField;
}

/**
 * Filter values (active filter selections)
 */
export type FilterValues = Partial<Record<FilterField, string[]>>;

/**
 * Initial discovery state
 */
export const INITIAL_DISCOVERY_STATE: DiscoveryState = {
  query: '',
  filters: {},
  sort: 'featured',
};

// =============================================================================
// Result Types
// =============================================================================

/**
 * Discovery result metadata
 */
export interface DiscoveryResults<T> {
  items: T[];
  total: number;
  filtered: number;
}

/**
 * Filter statistics (for dynamic filter options)
 */
export interface FilterStats {
  categories: FilterOption[];
  statuses: FilterOption[];
  ownershipModels: FilterOption[];
  cities: FilterOption[];
  countries: FilterOption[];
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract unique categories from projects
 */
export function extractCategories(projects: SanityProject[]): FilterOption[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    if (project.category) {
      const current = counts.get(project.category) || 0;
      counts.set(project.category, current + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: formatLabel(value),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extract unique statuses from projects
 */
export function extractStatuses(projects: SanityProject[]): FilterOption[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    if (project.status) {
      const current = counts.get(project.status) || 0;
      counts.set(project.status, current + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: formatLabel(value),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extract unique ownership models from projects
 */
export function extractOwnershipModels(projects: SanityProject[]): FilterOption[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    if (project.ownershipModel) {
      const current = counts.get(project.ownershipModel) || 0;
      counts.set(project.ownershipModel, current + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: formatLabel(value),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extract unique cities from projects
 */
export function extractCities(projects: SanityProject[]): FilterOption[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    if (project.location?.city) {
      const current = counts.get(project.location.city) || 0;
      counts.set(project.location.city, current + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extract unique countries from projects
 */
export function extractCountries(projects: SanityProject[]): FilterOption[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    if (project.location?.country) {
      const current = counts.get(project.location.country) || 0;
      counts.set(project.location.country, current + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Format filter value to label
 */
function formatLabel(value: string): string {
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get all filter statistics from projects
 */
export function getFilterStats(projects: SanityProject[]): FilterStats {
  return {
    categories: extractCategories(projects),
    statuses: extractStatuses(projects),
    ownershipModels: extractOwnershipModels(projects),
    cities: extractCities(projects),
    countries: extractCountries(projects),
  };
}
