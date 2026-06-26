# Projects Listing — Integration & QA Freeze (Phase 08D)

<aside>
📐

**Read first — frozen single source of truth.** Refined Build Spec, Master Prompt, CMS Foundation QA Freeze (v1.2), SEO QA Freeze (v1.0), and the Phase 08D Discovery build are all **FROZEN**. This integration adds **only two new route files**. It does **not** modify the discovery engine, the discovery UI components, the hooks, `lib/project.ts`, the CMS, or any adapter. It **reuses** existing loaders and the frozen SEO helpers.

</aside>

<aside>
⚠️

**Capability boundary.** Authored in Notion, not compiled or run. The §6 gates are local for you to run.

</aside>

## 1. Integration objective & constraint ledger

Mount the Discovery & Filtering system on the `/projects` listing route with the smallest possible additive surface: a server route that loads + maps data, and a thin client wrapper that composes the existing components.

| Constraint | How it is honored |
| --- | --- |
| Do not modify the Discovery engine | `lib/discovery/*` imported as-is; zero edits |
| Do not modify the Project interface | `lib/project.ts` imported as-is; zero edits |
| Do not modify the CMS architecture | no schema/query change; no new loader |
| Do not modify adapters | `toDiscoverableList` (engine) used as-is; no CMS adapter touched |
| Reuse the existing loaders | route calls the existing `getAllProjects()` |
| Keep the filtering engine pure | all filtering stays in `lib/discovery`; route does no filtering |
| Keep the UI components unchanged | the nine `components/discovery/*` are imported, not edited |

**Net-new files (only two):** `app/projects/page.tsx` (server) and `app/projects/ProjectsBrowser.tsx` (client wrapper).

## 2. New file — `app/projects/page.tsx` (server component)

```tsx
import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { Heading } from "@/components/ui/Heading"
import { Text } from "@/components/ui/Text"
import { getAllProjects } from "@/lib/project"
import { toDiscoverableList } from "@/lib/discovery"
import { buildMetadata, resolveSeo } from "@/lib/seo"
import { ProjectsBrowser } from "./ProjectsBrowser"

// Frozen SEO helper (08B). Adjust the arg to the exact SeoInput shape.
export const metadata: Metadata = buildMetadata(
  resolveSeo({
    path: "/projects",
    title: "Residences",
    description:
      "Explore the full collection of residences. Filter by category, status, location, and ownership model.",
  }),
)

export default async function ProjectsPage() {
  // Reuse the existing loader (full Project[] — includes location + ownershipModel).
  const projects = await getAllProjects()
  const discoverable = toDiscoverableList(projects)

  return (
    <Container variant="content">
      <header className="projects-index__header">
        <Heading level={1} size="xl">
          Residences
        </Heading>
        <Text tone="muted">
          A curated collection. Search and filter to find your match.
        </Text>
      </header>
      <ProjectsBrowser projects={discoverable} />
    </Container>
  )
}
```

<aside>
ℹ️

**Loader choice (honest note):** `getAllProjects` from `@/lib/project` returns full `Project[]`, so the discovery adapter receives `location` (city/country) and the optional `ownershipModel`. If your live list instead uses the CMS `getAllProjects` (which returns `ProjectSummary[]`), that summary lacks location/ownership — do **not** widen the adapter or query in this phase; either reuse the full-project loader as shown, or defer those two facets until a richer loader exists. The discovery engine already degrades gracefully (absent city/country/ownership are simply excluded from their facets).

</aside>

## 3. New file — `app/projects/ProjectsBrowser.tsx` (client wrapper)

This is the assembly sketched in Phase 08D §14.5, promoted to a real co-located route component. It composes the **unchanged** discovery components and hooks — no engine logic lives here.

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

interface ProjectsBrowserProps {
  projects: DiscoverableProject[]
}

export function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
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
      <div className="discovery__layout">
        <FilterPanel
          options={options}
          filters={d.filters}
          onToggle={d.toggleFacet}
        />
        <div className="discovery__main">
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
      </div>
    </div>
  )
}
```

**Optional additive layout CSS** (append to `globals.css`; reuses tokens, overrides nothing):

```css
/* === Phase 08D integration — /projects layout (additive) ============== */
.projects-index__header { margin-block: 2rem 1.5rem; }
.discovery__bar {
  display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;
  margin-bottom: 1.5rem;
}
.discovery__layout {
  display: grid; gap: 2rem;
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .discovery__layout { grid-template-columns: 16rem 1fr; }
}
```

## 4. Architecture verification (`/projects`)

```
app/projects/page.tsx            (server, RSC)
  │  metadata = buildMetadata(resolveSeo(…))   ← frozen SEO (08B)
  │  getAllProjects()                          ← existing loader (reused)
  │  toDiscoverableList(projects)              ← frozen engine (08D)
  └─ <ProjectsBrowser projects={…} />          (client)
        useFilterOptions / useDiscovery        ← frozen hooks (08D)
        SearchInput·SortSelect·FilterPanel·
        ActiveFilters·ResultCount·
        EmptyState·ProjectResults              ← frozen components (08D)
```

- **Server/client boundary correct:** data loading + SEO on the server; only the interactive shell is a client component. Full list is server-rendered → progressive enhancement holds.
- **No new state, no new logic:** the route delegates 100% of filtering/sorting/search to the pure engine and hooks.
- **Single responsibility:** `page.tsx` = load + map + frame; `ProjectsBrowser` = compose.

### Constraint compliance matrix

| Rule | Status |
| --- | --- |
| Discovery engine unchanged | ✅ imported only |
| Project interface unchanged | ✅ imported only |
| CMS architecture unchanged | ✅ no schema/query/loader added |
| Adapters unchanged | ✅ engine `toDiscoverableList` reused; no CMS adapter touched |
| Existing loaders reused | ✅ `getAllProjects()` |
| Filtering engine pure | ✅ zero filtering in route |
| UI components unchanged | ✅ nine components imported as-is |

## 5. Routing dependency record

| Route | Renders | Depends on (reused, frozen) | Produces |
| --- | --- | --- | --- |
| `/projects` | `ProjectsPage` → `ProjectsBrowser` | `getAllProjects` (loader) • `toDiscoverableList`  • `useDiscovery`  • `useFilterOptions`  • 9 discovery components (08D) • `buildMetadata`/`resolveSeo` (08B SEO) • `Container`/`Heading`/`Text` (02) | Static/SSR listing page |
- **Sitemap:** `/projects` is already declared in the frozen 08B `STATIC_ROUTES` — **no sitemap change needed**; this integration fulfills that previously-declared route.
- **Canonical/OG:** provided by frozen `buildMetadata` via `path: "/projects"`.
- **Outbound links:** each result links to `/projects/[slug]` (frozen project-detail route, 07-arc) — dependency is one-way and additive.
- **Data dependency:** read-only on the existing loader; no write path, no new fetch layer.

## 6. Verification gates (run locally — I cannot run these)

```bash
npx tsc --noEmit
npm run lint
npm run build
```

**Manual QA:**

- [ ]  `/projects` renders the full collection on first paint (server-rendered).
- [ ]  Search, all five facets, sort, active-filter pills, and empty state all work.
- [ ]  With JS disabled, the full list still renders (controls inert).
- [ ]  Metadata/canonical present in page `<head>`; route appears in `sitemap.xml`.
- [ ]  Keyboard + screen-reader pass (labels, live count, focus rings).

## 7. Freeze — Projects Listing architecture v1.0

<aside>
🧊

**Projects Listing — Version 1.0 (FROZEN, 26 Jun 2026).** The `/projects` route is frozen: `app/projects/page.tsx` (load + map + frame) and `app/projects/ProjectsBrowser.tsx` (compose) are the canonical wiring. The route is a **pure consumer** — it adds no engine logic. Future changes must be additive and must not push filtering/sorting/search logic into the route. The discovery engine (08D), Project interface (v1.6.0), CMS (v1.2), and SEO (v1.0) remain frozen and unmodified by this integration.

</aside>

<aside>
⛔

**STOP — await approval before Phase 08E.** Phase 08D is now fully integrated and frozen. Do not begin Phase 08E until approved.

</aside>