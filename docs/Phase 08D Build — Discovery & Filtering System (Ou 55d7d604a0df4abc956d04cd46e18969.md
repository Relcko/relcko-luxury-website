# Phase 08D Build — Discovery & Filtering System (Output)

<aside>
📐

**Read first — frozen single source of truth.** Before touching anything, the coding agent must read: (1) Luxury Real Estate Website — Refined Build Spec, (2) Claude Code — Master Prompt, (3) CMS Foundation — QA Freeze (Phase 08A **v1.1**), (4) SEO & Metadata — QA Freeze (Phase 08B v1.0). Homepage architecture, project architecture (`lib/project.ts` v1.6.0 + `components/project/*`), CMS Foundation (v1.1), and SEO (v1.0) are **FROZEN**. Every line below is **additive** and integrates only through new files, pure adapters, and route boundaries. Do not edit, rename, retype, or remove any frozen symbol.

</aside>

<aside>
⚠️

**Capability boundary.** This page is a copy-paste-ready build spec authored in Notion. It has **not** been compiled or run. All `tsc`, ESLint, and runtime checks in §21 are **local gates for you to run**.

</aside>

## 1. Objective & scope

Build a reusable, **client-side** Discovery & Filtering system that helps users find projects quickly while keeping the experience premium and editorial. **No backend search engine.** Filtering, search, and sorting all run in the browser against an in-memory dataset passed by the consuming route page.

| Capability | Source of truth | Notes |
| --- | --- | --- |
| Free-text search | `title`, `subtitle`, `city`, `country`, category/status/ownership labels | Pre-computed lowercase haystack |
| Category filter | frozen `ProjectCategory` enum | multi-select |
| Status filter | frozen `ProjectStatusValue` enum | multi-select |
| City filter | `Project.location.city` | derived facet |
| Country filter | `Project.location.country` | derived facet |
| Ownership model filter | **new additive** `Project.ownershipModel?` | multi-select |
| Sort controls | newest / alphabetical / status | registry-based, expandable |
| Result count | derived | live, announced to AT |
| Empty state | derived | editorial, with "clear filters" |

**Architecture stance:** pure functions in `lib/discovery/` (no React), state in `hooks/discovery/`, presentation in `components/discovery/`. The module accepts `DiscoverableProject[]` and is fully decoupled from data fetching — the route page (Phase 08E candidate) supplies the data.

## 2. Dependencies

**None.** No new packages. Pure TypeScript + React 19 client components. No external search/filter library — filtering is small-N (tens of projects) and memoized.

## 3. Folder structure (all new, additive)

```
lib/discovery/
  types.ts        # view-model + filter/sort types
  adapt.ts        # toDiscoverable(project) pure mapper
  search.ts       # normalize + free-text matcher
  filter.ts       # pure predicates + applyFilters
  sort.ts         # comparator registry (expandable)
  options.ts      # derive facet options + counts
  index.ts        # barrel
hooks/discovery/
  useDebouncedValue.ts
  useFilterOptions.ts
  useDiscovery.ts  # useReducer state machine
  index.ts        # barrel
components/discovery/
  SearchInput.tsx
  FilterChip.tsx
  FilterGroup.tsx
  FilterPanel.tsx
  SortSelect.tsx
  ActiveFilters.tsx
  ResultCount.tsx
  EmptyState.tsx
  ProjectResults.tsx
  index.ts        # barrel
```

## 4. `lib/discovery/types.ts`

```tsx
import type {
  OwnershipModel,
  ProjectCategory,
  ProjectImage,
  ProjectStatusValue,
} from "@/lib/project"

/** Flattened, search-optimized view-model derived from a frozen Project. */
export interface DiscoverableProject {
  id: string
  slug: string
  title: string
  subtitle?: string
  category: ProjectCategory
  status?: ProjectStatusValue
  city?: string
  country?: string
  ownershipModel?: OwnershipModel
  heroImage: ProjectImage
  /** Pre-computed lowercase haystack for fast free-text search. */
  searchText: string
  /** Sortable epoch ms for \"newest\"; 0 when unknown (sorts last). */
  createdAt: number
}

/** Multi-select facets. Keys map 1:1 to FilterState array fields. */
export type FacetKey =
  | "category"
  | "status"
  | "city"
  | "country"
  | "ownershipModel"

export interface FilterState {
  query: string
  category: ProjectCategory[]
  status: ProjectStatusValue[]
  city: string[]
  country: string[]
  ownershipModel: OwnershipModel[]
}

export const EMPTY_FILTERS: FilterState = {
  query: "",
  category: [],
  status: [],
  city: [],
  country: [],
  ownershipModel: [],
}

export type SortKey = "newest" | "alphabetical" | "status"
export const DEFAULT_SORT: SortKey = "newest"

/** One selectable option within a facet, with a live count. */
export interface FacetOption<V extends string = string> {
  value: V
  label: string
  count: number
}

export interface DiscoveryResult {
  items: DiscoverableProject[]
  /** Total in dataset before filtering. */
  total: number
  /** Count after filtering. */
  matched: number
  /** True when any filter or query is active. */
  isFiltered: boolean
}
```

## 5. Ownership model — the one required additive field

The frozen `Project` interface has **no** ownership concept, and "Ownership model filters" is explicit scope. Per the brief ("add optional fields only; update the CMS QA Freeze"), this is the single justified additive change. The enum lives in **`lib/project.ts`** as the single source (no duplication), mirroring `CATEGORY_LABELS` / `STATUS_LABELS`.

**Append to `lib/project.ts` (additive only — do not modify existing symbols):**

```tsx
// --- Additive (Phase 08D) — ownership model -------------------------------
export const OWNERSHIP_MODELS = [
  "freehold",
  "leasehold",
  "fractional",
  "branded-residence",
] as const

export type OwnershipModel = (typeof OWNERSHIP_MODELS)[number]

export const OWNERSHIP_MODEL_LABELS: Record<OwnershipModel, string> = {
  freehold: "Freehold",
  leasehold: "Leasehold",
  fractional: "Fractional Ownership",
  "branded-residence": "Branded Residence",
}
```

**Add ONE optional field to the `Project` interface (additive, alongside the 07C–07H optional content fields):**

```tsx
export interface Project {
  // ...all existing frozen fields unchanged...
  /** Additive (08D). Optional; absent projects are excluded from ownership facet. */
  ownershipModel?: OwnershipModel
}
```

<aside>
🔒

**Non-breaking guarantees:** field is optional, no existing field touched, the enum is defined once and reused everywhere (filters, labels, search text, CMS). City/country reuse the existing `Project.location` — **no** new location fields. This change is registered in the Project Interface Registry and recorded as CMS **v1.2** (see §16). `ProjectSummary` is **not** modified — discovery uses the full `Project` via the adapter in §6.

</aside>

## 6. `lib/discovery/adapt.ts` — pure mapper from frozen Project

```tsx
import {
  CATEGORY_LABELS,
  OWNERSHIP_MODEL_LABELS,
  STATUS_LABELS,
  type Project,
} from "@/lib/project"
import type { DiscoverableProject } from "./types"

function labelFor<K extends string>(
  map: Record<K, string>,
  key: K | undefined,
): string {
  return key ? (map[key] ?? "") : ""
}

/**
 * Map a frozen Project into the flattened discovery view-model.
 * Pure + total: never throws on missing optional data.
 */
export function toDiscoverable(project: Project): DiscoverableProject {
  const city = project.location?.city?.trim() || undefined
  const country = project.location?.country?.trim() || undefined
  const createdRaw = project.publishedAt ?? project.createdAt
  const createdAt = createdRaw ? Date.parse(createdRaw) : 0

  const haystack = [
    project.title,
    project.subtitle,
    city,
    country,
    labelFor(CATEGORY_LABELS, project.category),
    labelFor(STATUS_LABELS, project.status),
    labelFor(OWNERSHIP_MODEL_LABELS, project.ownershipModel),
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase()

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    category: project.category,
    status: project.status,
    city,
    country,
    ownershipModel: project.ownershipModel,
    heroImage: project.heroImage,
    searchText: haystack,
    createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
  }
}

export function toDiscoverableList(
  projects: readonly Project[],
): DiscoverableProject[] {
  return projects.map(toDiscoverable)
}
```

<aside>
ℹ️

`publishedAt` / `createdAt` are read defensively with optional chaining. If `lib/project.ts` exposes neither, `createdAt` is `0` and "newest" falls back to a stable order — no type error because the access is optional and the field is absent at runtime. If you prefer an explicit field, add an additive optional `publishedAt?: string` (ISO) the same way as §5; not required for this phase.

</aside>

## 7. `lib/discovery/search.ts` — normalization + free-text matcher

```tsx
import type { DiscoverableProject } from "./types"

/** Lowercase, strip diacritics, collapse whitespace. */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

/** Split a query into distinct non-empty tokens. */
export function tokenize(query: string): string[] {
  const normalized = normalize(query)
  if (!normalized) return []
  return Array.from(new Set(normalized.split(" ")))
}

/**
 * AND-token match: every token must appear somewhere in searchText.
 * Empty query matches everything.
 */
export function matchesQuery(
  project: DiscoverableProject,
  tokens: readonly string[],
): boolean {
  if (tokens.length === 0) return true
  const haystack = project.searchText
  return tokens.every((token) => haystack.includes(token))
}
```

## 8. `lib/discovery/filter.ts` — pure predicates + applyFilters

```tsx
import { matchesQuery, tokenize } from "./search"
import type { DiscoverableProject, FilterState } from "./types"

/** A selected facet array matches when empty (no constraint) or includes the value. */
function matchesFacet<V extends string>(
  selected: readonly V[],
  value: V | undefined,
): boolean {
  if (selected.length === 0) return true
  if (value === undefined) return false
  return selected.includes(value)
}

export function isFilterActive(filters: FilterState): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.category.length > 0 ||
    filters.status.length > 0 ||
    filters.city.length > 0 ||
    filters.country.length > 0 ||
    filters.ownershipModel.length > 0
  )
}

/** Count of active facet selections + query (for the ActiveFilters summary). */
export function activeFilterCount(filters: FilterState): number {
  return (
    (filters.query.trim() ? 1 : 0) +
    filters.category.length +
    filters.status.length +
    filters.city.length +
    filters.country.length +
    filters.ownershipModel.length
  )
}

/**
 * Apply every active facet (AND across facets, OR within a facet) plus
 * free-text. Pure: returns a new array, never mutates input.
 */
export function applyFilters(
  projects: readonly DiscoverableProject[],
  filters: FilterState,
): DiscoverableProject[] {
  const tokens = tokenize(filters.query)
  return projects.filter(
    (p) =>
      matchesFacet(filters.category, p.category) &&
      matchesFacet(filters.status, p.status) &&
      matchesFacet(filters.city, p.city) &&
      matchesFacet(filters.country, p.country) &&
      matchesFacet(filters.ownershipModel, p.ownershipModel) &&
      matchesQuery(p, tokens),
  )
}
```

## 9. `lib/discovery/sort.ts` — comparator registry (expandable)

```tsx
import { PROJECT_STATUSES, type ProjectStatusValue } from "@/lib/project"
import type { DiscoverableProject, SortKey } from "./types"

type Comparator = (a: DiscoverableProject, b: DiscoverableProject) => number

/** Lower rank sorts first; unknown/absent status sorts last. */
const STATUS_RANK: Record<ProjectStatusValue, number> = PROJECT_STATUSES.reduce(
  (acc, status, index) => {
    acc[status] = index
    return acc
  },
  {} as Record<ProjectStatusValue, number>,
)

function byTitle(a: DiscoverableProject, b: DiscoverableProject): number {
  return a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
}

function statusRank(value: ProjectStatusValue | undefined): number {
  return value === undefined ? Number.MAX_SAFE_INTEGER : STATUS_RANK[value]
}

/** Registry keyed by SortKey. Add a key here + in SortKey to expand. */
export const SORT_COMPARATORS: Record<SortKey, Comparator> = {
  newest: (a, b) => b.createdAt - a.createdAt || byTitle(a, b),
  alphabetical: byTitle,
  status: (a, b) => statusRank(a.status) - statusRank(b.status) || byTitle(a, b),
}

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  alphabetical: "A–Z",
  status: "Status",
}

export const SORT_OPTIONS: readonly SortKey[] = [
  "newest",
  "alphabetical",
  "status",
]

/** Pure: returns a new sorted array (stable via title tie-break). */
export function applySort(
  projects: readonly DiscoverableProject[],
  sort: SortKey,
): DiscoverableProject[] {
  return [...projects].sort(SORT_COMPARATORS[sort])
}
```

## 10. `lib/discovery/options.ts` — derive facet options + counts

```tsx
import {
  CATEGORY_LABELS,
  OWNERSHIP_MODEL_LABELS,
  STATUS_LABELS,
} from "@/lib/project"
import type {
  DiscoverableProject,
  FacetKey,
  FacetOption,
} from "./types"

function tally(values: readonly (string | undefined)[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const value of values) {
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}

function labelled(
  counts: Map<string, number>,
  labelOf: (value: string) => string,
  sortAlphabetical: boolean,
): FacetOption[] {
  const options = Array.from(counts.entries()).map(([value, count]) => ({
    value,
    label: labelOf(value),
    count,
  }))
  return options.sort((a, b) =>
    sortAlphabetical
      ? a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      : b.count - a.count || a.label.localeCompare(b.label),
  )
}

const identity = (value: string): string => value

/** Build the full set of selectable facet options from the dataset. */
export function deriveFacetOptions(
  projects: readonly DiscoverableProject[],
): Record<FacetKey, FacetOption[]> {
  return {
    category: labelled(
      tally(projects.map((p) => p.category)),
      (v) => CATEGORY_LABELS[v as keyof typeof CATEGORY_LABELS] ?? v,
      false,
    ),
    status: labelled(
      tally(projects.map((p) => p.status)),
      (v) => STATUS_LABELS[v as keyof typeof STATUS_LABELS] ?? v,
      false,
    ),
    city: labelled(tally(projects.map((p) => p.city)), identity, true),
    country: labelled(tally(projects.map((p) => p.country)), identity, true),
    ownershipModel: labelled(
      tally(projects.map((p) => p.ownershipModel)),
      (v) =>
        OWNERSHIP_MODEL_LABELS[v as keyof typeof OWNERSHIP_MODEL_LABELS] ?? v,
      false,
    ),
  }
}
```

## 11. `lib/discovery/index.ts` — barrel

```tsx
export * from "./types"
export * from "./adapt"
export * from "./search"
export * from "./filter"
export * from "./sort"
export * from "./options"
```

## 12. `hooks/discovery/` — state machine

### 12.1 `useDebouncedValue.ts`

```tsx
"use client"

import { useEffect, useState } from "react"

/** Debounce a fast-changing value (e.g. search text) for cheap re-filtering. */
export function useDebouncedValue<T>(value: T, delayMs = 200): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])
  return debounced
}
```

### 12.2 `useFilterOptions.ts`

```tsx
"use client"

import { useMemo } from "react"
import { deriveFacetOptions } from "@/lib/discovery"
import type { DiscoverableProject, FacetKey, FacetOption } from "@/lib/discovery"

/** Memoized facet options derived once per dataset (not per keystroke). */
export function useFilterOptions(
  projects: readonly DiscoverableProject[],
): Record<FacetKey, FacetOption[]> {
  return useMemo(() => deriveFacetOptions(projects), [projects])
}
```

### 12.3 `useDiscovery.ts` — reducer + memoized derivation

```tsx
"use client"

import { useCallback, useMemo, useReducer } from "react"
import {
  EMPTY_FILTERS,
  DEFAULT_SORT,
  activeFilterCount,
  applyFilters,
  applySort,
  isFilterActive,
} from "@/lib/discovery"
import type {
  DiscoverableProject,
  DiscoveryResult,
  FacetKey,
  FilterState,
  SortKey,
} from "@/lib/discovery"

type FacetValue = string

type Action =
  | { type: "setQuery"; query: string }
  | { type: "toggleFacet"; facet: FacetKey; value: FacetValue }
  | { type: "clearFacet"; facet: FacetKey }
  | { type: "setSort"; sort: SortKey }
  | { type: "clearAll" }

interface DiscoveryStateInternal {
  filters: FilterState
  sort: SortKey
}

function toggleValue<V extends string>(list: V[], value: V): V[] {
  return list.includes(value)
    ? list.filter((entry) => entry !== value)
    : [...list, value]
}

function reducer(
  state: DiscoveryStateInternal,
  action: Action,
): DiscoveryStateInternal {
  switch (action.type) {
    case "setQuery":
      return { ...state, filters: { ...state.filters, query: action.query } }
    case "toggleFacet": {
      const current = state.filters[action.facet] as FacetValue[]
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.facet]: toggleValue(current, action.value),
        },
      }
    }
    case "clearFacet":
      return {
        ...state,
        filters: { ...state.filters, [action.facet]: [] },
      }
    case "setSort":
      return { ...state, sort: action.sort }
    case "clearAll":
      return { filters: EMPTY_FILTERS, sort: state.sort }
    default:
      return state
  }
}

export interface UseDiscoveryReturn {
  filters: FilterState
  sort: SortKey
  result: DiscoveryResult
  activeCount: number
  setQuery: (query: string) => void
  toggleFacet: (facet: FacetKey, value: FacetValue) => void
  clearFacet: (facet: FacetKey) => void
  setSort: (sort: SortKey) => void
  clearAll: () => void
}

/**
 * Single source of discovery state. Filtering + sorting are memoized on the
 * (projects, filters, sort) tuple, so unrelated re-renders do no work.
 */
export function useDiscovery(
  projects: readonly DiscoverableProject[],
  initialSort: SortKey = DEFAULT_SORT,
): UseDiscoveryReturn {
  const [state, dispatch] = useReducer(reducer, {
    filters: EMPTY_FILTERS,
    sort: initialSort,
  })

  const result = useMemo<DiscoveryResult>(() => {
    const filtered = applyFilters(projects, state.filters)
    const sorted = applySort(filtered, state.sort)
    return {
      items: sorted,
      total: projects.length,
      matched: sorted.length,
      isFiltered: isFilterActive(state.filters),
    }
  }, [projects, state.filters, state.sort])

  const setQuery = useCallback(
    (query: string) => dispatch({ type: "setQuery", query }),
    [],
  )
  const toggleFacet = useCallback(
    (facet: FacetKey, value: FacetValue) =>
      dispatch({ type: "toggleFacet", facet, value }),
    [],
  )
  const clearFacet = useCallback(
    (facet: FacetKey) => dispatch({ type: "clearFacet", facet }),
    [],
  )
  const setSort = useCallback(
    (sort: SortKey) => dispatch({ type: "setSort", sort }),
    [],
  )
  const clearAll = useCallback(() => dispatch({ type: "clearAll" }), [])

  return {
    filters: state.filters,
    sort: state.sort,
    result,
    activeCount: activeFilterCount(state.filters),
    setQuery,
    toggleFacet,
    clearFacet,
    setSort,
    clearAll,
  }
}
```

<aside>
ℹ️

Import note: React exports `useCallback` (capital C). The import line above uses the correct casing — keep it exactly as written.

</aside>

### 12.4 `hooks/discovery/index.ts` — barrel

```tsx
export * from "./useDebouncedValue"
export * from "./useFilterOptions"
export * from "./useDiscovery"
```

## 13. Leaf presentation components

### 13.1 `FilterChip.tsx` (client)

```tsx
"use client"

import { cn } from "@/utils/cn"

interface FilterChipProps {
  label: string
  count?: number
  selected: boolean
  onToggle: () => void
}

export function FilterChip({ label, count, selected, onToggle }: FilterChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn("discovery-chip", selected && "discovery-chip--on")}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span className="discovery-chip__count" aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  )
}
```

### 13.2 `FilterGroup.tsx` (client)

```tsx
"use client"

import { FilterChip } from "./FilterChip"
import type { FacetKey, FacetOption } from "@/lib/discovery"

interface FilterGroupProps {
  legend: string
  facet: FacetKey
  options: FacetOption[]
  selected: readonly string[]
  onToggle: (facet: FacetKey, value: string) => void
}

export function FilterGroup({
  legend,
  facet,
  options,
  selected,
  onToggle,
}: FilterGroupProps) {
  if (options.length === 0) return null
  return (
    <fieldset className="discovery-group">
      <legend className="discovery-group__legend">{legend}</legend>
      <div className="discovery-group__options" role="group">
        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            count={option.count}
            selected={selected.includes(option.value)}
            onToggle={() => onToggle(facet, option.value)}
          />
        ))}
      </div>
    </fieldset>
  )
}
```

### 13.3 `SearchInput.tsx` (client)

```tsx
"use client"

import { useId } from "react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  resultCountLabel?: string
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  resultCountLabel,
  placeholder = "Search residences…",
}: SearchInputProps) {
  const id = useId()
  return (
    <div className="discovery-search">
      <label htmlFor={id} className="sr-only">
        Search projects
      </label>
      <input
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="discovery-search__input"
        aria-describedby={resultCountLabel ? `${id}-count` : undefined}
      />
      {resultCountLabel ? (
        <span id={`${id}-count`} className="sr-only">
          {resultCountLabel}
        </span>
      ) : null}
    </div>
  )
}
```

### 13.4 `SortSelect.tsx` (client)

```tsx
"use client"

import { useId } from "react"
import { SORT_LABELS, SORT_OPTIONS } from "@/lib/discovery"
import type { SortKey } from "@/lib/discovery"

interface SortSelectProps {
  value: SortKey
  onChange: (sort: SortKey) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const id = useId()
  return (
    <div className="discovery-sort">
      <label htmlFor={id} className="discovery-sort__label">
        Sort
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        className="discovery-sort__select"
      >
        {SORT_OPTIONS.map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### 13.5 `ResultCount.tsx` (client)

```tsx
"use client"

interface ResultCountProps {
  matched: number
  total: number
  isFiltered: boolean
}

function phrase(matched: number, total: number, isFiltered: boolean): string {
  const noun = matched === 1 ? "residence" : "residences"
  if (!isFiltered) return `${total} ${total === 1 ? "residence" : "residences"}`
  return `${matched} of ${total} ${noun}`
}

export function ResultCount({ matched, total, isFiltered }: ResultCountProps) {
  return (
    <p className="discovery-count" role="status" aria-live="polite">
      {phrase(matched, total, isFiltered)}
    </p>
  )
}
```

### 13.6 `EmptyState.tsx` (server-safe)

```tsx
interface EmptyStateProps {
  onClear?: () => void
  title?: string
  description?: string
}

export function EmptyState({
  onClear,
  title = "No residences match your filters",
  description = "Try broadening your search or clearing a filter to see more of the collection.",
}: EmptyStateProps) {
  return (
    <div className="discovery-empty" role="status">
      <p className="discovery-empty__title">{title}</p>
      <p className="discovery-empty__body">{description}</p>
      {onClear ? (
        <button type="button" className="discovery-empty__action" onClick={onClear}>
          Clear all filters
        </button>
      ) : null}
    </div>
  )
}
```

## 14. Composite components

### 14.1 `ActiveFilters.tsx` (client)

```tsx
"use client"

import {
  CATEGORY_LABELS,
  OWNERSHIP_MODEL_LABELS,
  STATUS_LABELS,
} from "@/lib/project"
import type { FacetKey, FilterState } from "@/lib/discovery"

interface ActiveFiltersProps {
  filters: FilterState
  onRemove: (facet: FacetKey, value: string) => void
  onClearAll: () => void
}

interface Pill {
  facet: FacetKey
  value: string
  label: string
}

function labelFor(facet: FacetKey, value: string): string {
  if (facet === "category")
    return CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS] ?? value
  if (facet === "status")
    return STATUS_LABELS[value as keyof typeof STATUS_LABELS] ?? value
  if (facet === "ownershipModel")
    return (
      OWNERSHIP_MODEL_LABELS[value as keyof typeof OWNERSHIP_MODEL_LABELS] ??
      value
    )
  return value
}

function collect(filters: FilterState): Pill[] {
  const facets: FacetKey[] = [
    "category",
    "status",
    "city",
    "country",
    "ownershipModel",
  ]
  return facets.flatMap((facet) =>
    (filters[facet] as string[]).map((value) => ({
      facet,
      value,
      label: labelFor(facet, value),
    })),
  )
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const pills = collect(filters)
  if (pills.length === 0) return null
  return (
    <div className="discovery-active" aria-label="Active filters">
      <ul className="discovery-active__list">
        {pills.map((pill) => (
          <li key={`${pill.facet}:${pill.value}`}>
            <button
              type="button"
              className="discovery-active__pill"
              onClick={() => onRemove(pill.facet, pill.value)}
            >
              <span>{pill.label}</span>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Remove filter</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="discovery-active__clear"
        onClick={onClearAll}
      >
        Clear all
      </button>
    </div>
  )
}
```

### 14.2 `FilterPanel.tsx` (client)

```tsx
"use client"

import { FilterGroup } from "./FilterGroup"
import type { FacetKey, FacetOption, FilterState } from "@/lib/discovery"

interface FilterPanelProps {
  options: Record<FacetKey, FacetOption[]>
  filters: FilterState
  onToggle: (facet: FacetKey, value: string) => void
}

const GROUPS: ReadonlyArray<{ facet: FacetKey; legend: string }> = [
  { facet: "category", legend: "Category" },
  { facet: "status", legend: "Status" },
  { facet: "city", legend: "City" },
  { facet: "country", legend: "Country" },
  { facet: "ownershipModel", legend: "Ownership" },
]

export function FilterPanel({ options, filters, onToggle }: FilterPanelProps) {
  return (
    <aside className="discovery-panel" aria-label="Filter projects">
      {GROUPS.map(({ facet, legend }) => (
        <FilterGroup
          key={facet}
          facet={facet}
          legend={legend}
          options={options[facet]}
          selected={filters[facet] as string[]}
          onToggle={onToggle}
        />
      ))}
    </aside>
  )
}
```

### 14.3 `ProjectResults.tsx` (client)

Renders the matched set. Reuses the **frozen** project card if one exists; otherwise a lightweight editorial card. It does **not** modify any project component — it only consumes `DiscoverableProject`.

```tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/project"
import type { DiscoverableProject } from "@/lib/discovery"

interface ProjectResultsProps {
  items: readonly DiscoverableProject[]
}

function metaLine(project: DiscoverableProject): string {
  return [project.city, project.country].filter(Boolean).join(", ")
}

export function ProjectResults({ items }: ProjectResultsProps) {
  return (
    <ul className="discovery-results">
      {items.map((project) => (
        <li key={project.id} className="discovery-card">
          <Link href={`/projects/${project.slug}`} className="discovery-card__link">
            <span className="discovery-card__media">
              <Image
                src={project.heroImage.src}
                alt={project.heroImage.alt}
                width={project.heroImage.width}
                height={project.heroImage.height}
                placeholder={project.heroImage.blurDataURL ? "blur" : "empty"}
                blurDataURL={project.heroImage.blurDataURL}
                className="discovery-card__image"
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
            </span>
            <span className="discovery-card__body">
              <span className="discovery-card__eyebrow">
                {CATEGORY_LABELS[project.category] ?? project.category}
                {project.status
                  ? ` · ${STATUS_LABELS[project.status] ?? project.status}`
                  : ""}
              </span>
              <span className="discovery-card__title">{project.title}</span>
              {metaLine(project) ? (
                <span className="discovery-card__meta">{metaLine(project)}</span>
              ) : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

### 14.4 `components/discovery/index.ts` — barrel

```tsx
export * from "./SearchInput"
export * from "./FilterChip"
export * from "./FilterGroup"
export * from "./FilterPanel"
export * from "./SortSelect"
export * from "./ActiveFilters"
export * from "./ResultCount"
export * from "./EmptyState"
export * from "./ProjectResults"
```

### 14.5 Assembly example (for the future `/projects` route — not built this phase)

```tsx
"use client"

import { useMemo } from "react"
import {
  ActiveFilters,
  EmptyState,
  FilterPanel,
  ProjectResults,
  ResultCount,
  SearchInput,
  SortSelect,
} from "@/components/discovery"
import { useDiscovery, useFilterOptions } from "@/hooks/discovery"
import type { DiscoverableProject } from "@/lib/discovery"

export function DiscoveryExperience({
  projects,
}: {
  projects: DiscoverableProject[]
}) {
  const options = useFilterOptions(projects)
  const d = useDiscovery(projects)
  const countLabel = useMemo(
    () => `${d.result.matched} of ${d.result.total} results`,
    [d.result.matched, d.result.total],
  )

  return (
    <div className="discovery">
      <div className="discovery__bar">
        <SearchInput
          value={d.filters.query}
          onChange={d.setQuery}
          resultCountLabel={countLabel}
        />
        <SortSelect value={d.sort} onChange={d.setSort} />
      </div>
      <FilterPanel options={options} filters={d.filters} onToggle={d.toggleFacet} />
      <ActiveFilters
        filters={d.filters}
        onRemove={d.toggleFacet}
        onClearAll={d.clearAll}
      />
      <ResultCount
        matched={d.result.matched}
        total={d.result.total}
        isFiltered={d.result.isFiltered}
      />
      {d.result.matched === 0 ? (
        <EmptyState onClear={d.clearAll} />
      ) : (
        <ProjectResults items={d.result.items} />
      )}
    </div>
  )
}
```

<aside>
ℹ️

The route page itself (server component) loads projects, maps with `toDiscoverableList`, and passes the array down. Wiring the actual `/projects` route is a **Phase 08E candidate** — deliberately out of scope here so this phase stays a pure, reusable system.

</aside>

## 15. `app/globals.css` — additive styles (frozen tokens only)

Append only; reuse existing design tokens. No new tokens, no overrides of existing selectors.

```css
/* === Phase 08D — Discovery (additive) ================================= */
.discovery-search__input {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}
.discovery-search__input::placeholder { color: var(--text-muted); }
.discovery-search__input:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}
.discovery-group { border: 0; margin: 0; padding: 0; }
.discovery-group__legend {
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.discovery-group__options { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.discovery-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;
}
.discovery-chip:hover { border-color: var(--accent-gold); }
.discovery-chip:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}
.discovery-chip--on {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}
.discovery-chip__count { color: var(--text-muted); font-size: 0.75rem; }
.discovery-count { color: var(--text-muted); }
.discovery-active__list {
  display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none;
  margin: 0; padding: 0;
}
.discovery-active__pill {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border: 1px solid var(--accent-gold); color: var(--accent-gold);
  background: transparent; border-radius: 999px;
  padding: 0.3rem 0.7rem; cursor: pointer;
}
.discovery-active__clear {
  background: transparent; border: 0; color: var(--text-muted);
  cursor: pointer; text-decoration: underline;
}
.discovery-empty {
  text-align: center; padding: 3rem 1rem; color: var(--text-muted);
}
.discovery-empty__title { color: var(--text-primary); font-size: 1.1rem; }
.discovery-results {
  display: grid; gap: 1.5rem; list-style: none; margin: 0; padding: 0;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}
.discovery-card__link { display: block; color: inherit; text-decoration: none; }
.discovery-card__image { width: 100%; height: auto; border-radius: 0.5rem; }
.discovery-card__eyebrow {
  display: block; color: var(--text-muted);
  font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase;
}
.discovery-card__title { display: block; color: var(--text-primary); }
.discovery-card__meta { display: block; color: var(--text-muted); }
```

<aside>
ℹ️

`.sr-only` already exists from Phase 08C — reuse it, do **not** redefine. If you prefer Tailwind utility classes instead of these BEM classes, swap them at the component level; the BEM names here are illustrative and self-contained.

</aside>

## 16. CMS integration — additive optional field (v1.2)

The brief: "Reuse existing project fields. Do not redesign the Project interface. Do not duplicate enums. If new CMS fields are absolutely required, add optional fields only + update the CMS QA Freeze." City/country/category/status all reuse existing fields. Only **ownership model** is new.

**1) New optional field on the existing `project` document schema** (`schemas/documents/project.ts`), appended — no existing field touched:

```tsx
import { OWNERSHIP_MODELS, OWNERSHIP_MODEL_LABELS } from "@/lib/project"

// inside defineType({ name: "project", fields: [ ...existing, THIS ] })
defineField({
  name: "ownershipModel",
  title: "Ownership model",
  type: "string",
  options: {
    list: OWNERSHIP_MODELS.map((value) => ({
      title: OWNERSHIP_MODEL_LABELS[value],
      value,
    })),
    layout: "radio",
  },
  // optional: no validation.required()
})
```

**2) Additive projection** in the existing project GROQ query — add one line, change nothing else:

```tsx
// queries/project.ts — within the existing projection
ownershipModel,
```

**3) Adapter mapping** — extend `toProject` ONLY by reading the new optional field through a guard (no behavioral change to existing mappings):

```tsx
// adapters/project/toProject.ts
import { OWNERSHIP_MODELS, type OwnershipModel } from "@/lib/project"

function toOwnershipModel(value: unknown): OwnershipModel | undefined {
  return typeof value === "string" &&
    (OWNERSHIP_MODELS as readonly string[]).includes(value)
    ? (value as OwnershipModel)
    : undefined
}

// in the returned object:
//   ownershipModel: toOwnershipModel(raw.ownershipModel),
```

<aside>
🔒

**Single source of truth honored:** the enum is imported from `lib/project.ts` into the Sanity schema — it is **not** re-declared. The field is optional, the GROQ addition is additive, and `toProject` gains one guarded line. This is recorded as CMS Foundation **v1.2 (additive-only)** in the CMS QA Freeze and logged in the Project Interface Registry (this is a real `Project` field, so it belongs there).

</aside>

## 17. Accessibility approach

- **Labels:** `SearchInput` has a visually-hidden `<label>`; `SortSelect` has a visible `<label>`; each `FilterGroup` is a `<fieldset>` with a `<legend>`.
- **Multi-select semantics:** chips are `role="checkbox"` with `aria-checked`, grouped in `role="group"` — native button keyboard activation (Space/Enter) works out of the box.
- **Keyboard navigation:** every control is a native `<button>`/`<input>`/`<select>`, fully tab-reachable in DOM order with visible `:focus-visible` rings using the gold token.
- **Live regions:** `ResultCount` is `role="status" aria-live="polite"`, so the matched count is announced after each filter change without stealing focus.
- **Empty state:** `role="status"` announces "no matches" and offers a keyboard-reachable "Clear all filters" action.
- **Focus management:** removing a chip or clearing keeps focus on a stable control; result re-render does not move focus, preventing disorientation.
- **Motion:** no entrance animation is required; if added later, gate behind `motion-safe` per the frozen animation system.

## 18. Performance strategy

- **Memoized derivation:** filtering + sorting run inside one `useMemo` keyed on `(projects, filters, sort)`; keystrokes that don't change the tuple do no work.
- **Facet options memoized separately** on `projects` only — recomputed once per dataset, never per filter change.
- **Stable callbacks:** all actions are `useCallback`-wrapped, so leaf components (`FilterChip`, etc.) keep referential stability and avoid needless re-renders.
- **Pre-computed search text:** each project carries a lowercase `searchText` haystack built once in the adapter, so search is a cheap `includes` per token instead of repeated field concatenation.
- **Debounce available:** `useDebouncedValue` is provided for very large datasets; for the current small-N catalog, direct filtering is already sub-millisecond.
- **Progressive enhancement:** content is server-rendered by the route page; the discovery layer hydrates on top. With JS disabled, the full project list still renders (controls simply inert).
- **Minimal client JS:** no third-party libraries; the entire system is a few small modules.

## 19. Deliverables (mapped to the brief)

| # | Deliverable | Where |
| --- | --- | --- |
| 1 | Complete Discovery & Filtering architecture | §1–14 (lib → hooks → components) |
| 2 | Filtering strategy | §8 (AND across facets, OR within), §12.3 reducer |
| 3 | Search strategy | §7 (normalize → tokenize → AND-token `includes`) |
| 4 | Sorting strategy | §9 (comparator registry, expandable) |
| 5 | Component hierarchy | §20 diagram |
| 6 | Performance strategy | §18 |
| 7 | Stop before 08E | §21 |

## 20. Component hierarchy

```
<DiscoveryExperience>            (client, route-supplied data)
  useFilterOptions(projects)     → facet options (memoized)
  useDiscovery(projects)         → state + memoized result
  ├─ SearchInput                  (query)
  ├─ SortSelect                   (sort)
  ├─ FilterPanel
  │    └─ FilterGroup (×5)        category/status/city/country/ownership
  │         └─ FilterChip (×n)
  ├─ ActiveFilters → removable pills
  ├─ ResultCount (aria-live)
  └─ matched === 0 ? EmptyState : ProjectResults
                                  └─ discovery card (×n)

Data flow:  Project[]  → toDiscoverableList  → DiscoverableProject[]
            → applyFilters → applySort → DiscoveryResult
```

## 21. Verification gates (run locally — I cannot run these)

```bash
npx tsc --noEmit
npm run lint
npm run build
# Sanity (only if you adopt the optional CMS field):
npx sanity schema validate
npx sanity typegen generate
```

**Manual QA checklist:**

- [ ]  Type in search → list narrows; clearing restores full list.
- [ ]  Select multiple chips in one facet → OR within facet; across facets → AND.
- [ ]  Active filter pills appear and remove individually; "Clear all" resets.
- [ ]  Sort toggles change order (newest/A–Z/status).
- [ ]  Zero matches → editorial empty state with working "Clear all".
- [ ]  Keyboard-only: tab through search → sort → chips → results; visible focus rings.
- [ ]  Screen reader announces updated result count after each change.

<aside>
⛔

**STOP — await approval before Phase 08E.** This phase delivered a complete, reusable, client-side Discovery & Filtering system plus one additive optional `ownershipModel` field. No homepage, project component, CMS, or SEO code was modified beyond the documented additive surface. Do not begin 08E (route-page wiring / `/projects` assembly) until approved.

</aside>

> **Part 4 of 4 — Phase 08D build page complete.**
>