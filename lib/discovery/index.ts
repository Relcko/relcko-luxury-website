/**
 * Discovery Engine — Luxury Real Estate Website
 *
 * Unified discovery API combining search, filter, and sort.
 *
 * This is the main entry point for the Discovery & Filtering system.
 */

import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import type { SanityProject } from '@/lib/sanity/types';
import type { DiscoveryState, FilterValues, SortField, DiscoveryResults } from './types';
import { INITIAL_DISCOVERY_STATE, SEARCH_CONFIG, getFilterStats } from './types';
import { searchProjects } from './search';
import { filterProjects, toggleFilterValue, clearFilter, countActiveFilters } from './filter';
import { sortProjects } from './sort';

/**
 * Main discovery function
 *
 * Combines search, filter, and sort in one optimized pass.
 * Memoized for performance.
 */
export function discover(
  projects: SanityProject[],
  state: DiscoveryState
): DiscoveryResults<SanityProject> {
  const { query, filters, sort } = state;
  const total = projects.length;

  // Step 1: Search
  const searched = query
    ? searchProjects(projects, query, SEARCH_CONFIG.fields)
    : projects;

  // Step 2: Filter
  const filtered = filterProjects(searched, filters);

  // Step 3: Sort
  const sorted = sortProjects(filtered, sort);

  return {
    items: sorted,
    total,
    filtered: sorted.length,
  };
}

/**
 * useDiscovery hook
 *
 * Client-side discovery with memoization and debouncing.
 */
export function useDiscovery(
  projects: SanityProject[]
) {
  const [state, setState] = useState<DiscoveryState>(INITIAL_DISCOVERY_STATE);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Compute filter statistics (static, computed once)
  const filterStats = useMemo(
    () => getFilterStats(projects),
    [projects]
  );

  // Memoize results
  const results = useMemo(
    () => discover(projects, state),
    [projects, state]
  );

  // Debounced search setter
  const setQuery = useCallback((query: string) => {
    setIsSearching(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, query }));
      setIsSearching(false);
    }, SEARCH_CONFIG.debounceMs);
  }, []);

  // Filter setters
  const setFilter = useCallback((field: keyof FilterValues, values: string[]) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [field]: values },
    }));
  }, []);

  const toggleFilter = useCallback((field: keyof FilterValues, value: string) => {
    setState(prev => {
      const current = prev.filters[field] ?? [];
      return {
        ...prev,
        filters: {
          ...prev.filters,
          [field]: toggleFilterValue(current, value),
        },
      };
    });
  }, []);

  const clearFilterField = useCallback((field: keyof FilterValues) => {
    setState(prev => ({
      ...prev,
      filters: clearFilter(prev.filters, field),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState(INITIAL_DISCOVERY_STATE);
  }, []);

  // Sort setter
  const setSort = useCallback((sort: SortField) => {
    setState(prev => ({ ...prev, sort }));
  }, []);

  // Active filter count
  const activeFilterCount = useMemo(
    () => countActiveFilters(state.filters),
    [state.filters]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    // State
    query: state.query,
    filters: state.filters,
    sort: state.sort,

    // Results
    results: results.items,
    total: results.total,
    filtered: results.filtered,

    // Statistics
    filterStats,
    activeFilterCount,

    // Loading
    isSearching,

    // Actions
    setQuery,
    setFilter,
    toggleFilter,
    clearFilterField,
    clearAll,
    setSort,
  };
}

// Export types and utilities
export * from './types';
export { SEARCH_CONFIG } from './types';
export { searchProjects } from './search';
export { filterProjects, toggleFilterValue, clearFilter, countActiveFilters } from './filter';
export { sortProjects, getSortLabel } from './sort';
