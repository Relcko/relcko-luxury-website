# Phase 08E Build — Performance Optimization & Production Readiness (Output)

<aside>
📐

**Read first — frozen single source of truth.** Refined Build Spec, Master Prompt, CMS Foundation QA Freeze (v1.2), SEO QA Freeze (v1.0), and Projects Listing QA Freeze (v1.0) are all **FROZEN**. This phase is **optimization-only**: no new features, no redesign. Changes are confined to **configuration, route-segment exports, font/asset loading, and dynamic-import boundaries** — never the internals of homepage components, project components, CMS schemas, adapters, or discovery logic.

</aside>

<aside>
⚠️

**Capability boundary.** Authored in Notion, not compiled, bundled, or profiled. Every Lighthouse/bundle-analyzer/`tsc`/lint number in this page is a **local gate for you to run** — I report strategy and targets, not measured results.

</aside>

## 1. Optimize-only guardrails

| May change (additive / config-level) | Must NOT change |
| --- | --- |
| `next.config.ts` (images, tree-shaking, compiler) | Homepage component internals |
| Route-segment exports in `app/**` (`revalidate`, `dynamic`, dynamic imports, `<Suspense>`) | Project component internals |
| `app/layout.tsx` font loader wiring | CMS schemas / queries |
| New additive wrappers (skeletons, `WebVitals`) | Adapters |
| `package.json` devDeps (analyzer) | Discovery engine / hooks / components logic |

**Principle:** wrap, configure, and split — never rewrite. If an optimization would require editing a frozen component, it is **out of scope** and noted as a future refactor instead.

## 2. `next.config.ts` — images, tree-shaking, compiler

```tsx
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  compiler: {
    // Strip console.* in prod except errors/warnings.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    // Modern formats first; Next negotiates per Accept header.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Sanity CDN assets are content-addressed → cache hard.
    minimumCacheTTL: 31_536_000,
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  experimental: {
    // Per-symbol imports for barrel-heavy deps → smaller client bundles.
    optimizePackageImports: [
      "@sanity/icons",
      "framer-motion",
      "lucide-react",
    ],
  },
}

export default nextConfig
```

<aside>
ℹ️

Adjust `optimizePackageImports` and `remotePatterns` to your **actual** dependencies/hosts. Only list packages you really import. `framer-motion`/`motion` — use whichever the frozen animation system (Phase 03) actually depends on. Do not add a package here that isn't in `package.json`.

</aside>

## 3. Bundle optimization report

### 3.1 Measurement harness (additive devDependency)

```bash
npm i -D @next/bundle-analyzer
```

Wrap the config (keeps §2 intact, only composes around it):

```tsx
// next.config.ts — wrap the export
import bundleAnalyzer from "@next/bundle-analyzer"

const withAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })

export default withAnalyzer(nextConfig)
```

```bash
ANALYZE=true npm run build   # emits client/server/edge treemaps
```

### 3.2 Findings & levers (architecture-level, no component edits)

| Lever | Action | Expected effect |
| --- | --- | --- |
| Tree shaking | `optimizePackageImports` for icon/motion barrels | Drops unused icon/motion exports from client chunks |
| Route code splitting | Already automatic per route in App Router | `/`, `/projects`, `/projects/[slug]`, `/studio` ship separate chunks |
| `/studio` isolation | Confirm Sanity Studio is only under `app/studio/**` | Studio's heavy deps never enter public route bundles |
| Server-only modules | Ensure loaders/adapters import no client code | Keeps `lib/sanity`, `lib/seo` out of client bundles |
| `schema-dts` / type-only imports | Verify `import type` everywhere for type-only deps | Zero runtime cost (already the convention) |
| Dynamic import of client islands | §4 | Removes non-critical JS from initial load |

### 3.3 Bundle budget (targets to verify locally)

| Route | First-Load JS target |
| --- | --- |
| `/` (home) | ≤ 130 kB gz |
| `/projects` (discovery) | ≤ 150 kB gz |
| `/projects/[slug]` | ≤ 145 kB gz |
| `/studio` | unbudgeted (admin-only, isolated) |

## 4. Rendering strategy

### 4.1 Server / client inventory (verify, don't rewrite)

| Surface | Correct boundary | Status |
| --- | --- | --- |
| `app/layout.tsx`, all `page.tsx` | Server Components (data + metadata) | ✅ keep server |
| Loaders (`lib/sanity`), adapters, `lib/seo`, `lib/project`, `lib/discovery` engine | Server / pure modules, no `"use client"` | ✅ keep server-safe |
| `JsonLd` (08B) | Server component emitting a `<script>` | ✅ keep server |
| `ProjectsBrowser`, discovery hooks/components (08D) | Client island (interactive) | ✅ client, isolated |
| Lead-capture forms (08C) | Client islands (Server Actions + `useActionState`) | ✅ client, isolated |
| Animation primitives (03) | Client (`motion`) | ✅ client, leaf-level only |

**Rule reinforced:** the only client components are genuinely interactive islands. Everything above them stays a Server Component, so the default is zero client JS.

### 4.2 Dynamic imports for non-critical client islands

Use `next/dynamic` **at the route/composition layer** (new wiring — the frozen components are imported unchanged). Targets: client islands that are below the fold or not needed for first paint.

```tsx
// app/projects/[slug]/heavy-islands.ts  (new, route-level only)
import dynamic from "next/dynamic"

// Inquiry form is below the fold → defer its JS until idle/visible.
export const ProjectInquiryFormLazy = dynamic(
  () =>
    import("@/components/forms").then((m) => ({ default: m.ProjectInquiryForm })),
  { loading: () => null },
)

// Immersive gallery is heavy + below the fold on detail pages.
export const ProjectGallerySectionLazy = dynamic(
  () =>
    import("@/components/project/gallery").then((m) => ({
      default: m.ProjectGallerySection,
    })),
  { loading: () => null },
)
```

<aside>
ℹ️

**Constraint guard:** dynamic-importing a component does **not** modify it — the frozen module is imported as-is, only the *import site* changes. Keep `ssr: true` (default) for SEO-relevant content so it still server-renders; reserve `ssr: false` strictly for client-only widgets with no SEO value (e.g. a map embed). Do not `ssr:false` the gallery if its markup matters for crawlers.

</aside>

### 4.3 Suspense & streaming boundaries

Add route-level `loading.tsx` and `<Suspense>` around slow data reads so the shell streams immediately (better LCP/TTFB-perceived).

```tsx
// app/projects/loading.tsx  (new, additive)
export default function Loading() {
  return (
    <div className="discovery" aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton--bar" />
      <div className="discovery__layout">
        <div className="skeleton skeleton--panel" />
        <div className="discovery-results">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton skeleton--card" />
          ))}
        </div>
      </div>
    </div>
  )
}
```

```tsx
// Optional: stream a slow below-the-fold section on the detail route
import { Suspense } from "react"

// inside the detail page JSX:
// <Suspense fallback={<SectionSkeleton />}>
//   <RelatedProjects slug={slug} />
// </Suspense>
```

Skeleton CSS (additive, token-based, **fixed dimensions to protect CLS**):

```css
/* === Phase 08E — skeletons (additive) ================================ */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    rgba(247, 247, 245, 0.06) 37%,
    var(--bg-elevated) 63%
  );
  background-size: 400% 100%;
  border-radius: 0.5rem;
}
@media (prefers-reduced-motion: no-preference) {
  .skeleton { animation: skeleton-shimmer 1.4s ease infinite; }
}
@keyframes skeleton-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
.skeleton--bar { height: 3rem; margin-bottom: 1.5rem; }
.skeleton--panel { height: 24rem; }
.skeleton--card { height: 22rem; }
```

### 4.4 Rendering optimization report

| Item | Finding | Action |
| --- | --- | --- |
| Server Components | Pages/layout already server | Confirm — no change |
| Client Components | Limited to forms, discovery, motion leaves | Confirm boundaries; no new client code |
| Dynamic imports | Below-fold islands load eagerly today | Defer via §4.2 (route-level) |
| Hydration boundaries | One island per interactive region | Keep islands small; no client layout wrappers |
| Suspense / streaming | No route skeletons yet | Add `loading.tsx` per route (§4.3) |
| Unnecessary client JS | Animation `motion` on leaves | Already leaf-scoped; ensure no parent is needlessly `"use client"` |

## 5. Image, font & asset loading review

### 5.1 `next/image` review (review-only — no component rewrites)

The frozen image component(s) already wrap `next/image`. This phase **verifies usage** and only adjusts props that are passed at the call site (additive), never the component internals.

| Checkpoint | Target state | Where verified |
| --- | --- | --- |
| Format negotiation | AVIF → WebP via `next.config` (§2) | config |
| Responsive `sizes` | Every fill/responsive image declares accurate `sizes` | call sites |
| Blur placeholders | LQIP from Sanity (`metadata.lqip`) → `placeholder="blur" blurDataURL` | frozen image adapter |
| Priority | **Only** the LCP image per route uses `priority` | hero / first card |
| Lazy loading | Default (`loading="lazy"`) for everything below the fold | implicit |
| Aspect ratio | `width`/`height` or fixed-ratio wrapper to pin CLS | frozen card/hero |

Reference `sizes` values (apply at call sites if missing):

```tsx
// Hero (full-bleed, LCP)
<Image priority sizes="100vw" /* fill */ />

// Project card grid (responsive columns)
<Image sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />

// Detail gallery thumbnail rail
<Image sizes="(min-width: 1024px) 20vw, 40vw" />
```

<aside>
⚠️

**`priority` is a budget, not a default.** Exactly one above-the-fold LCP image per route should be `priority`. Marking many images `priority` floods the network and *hurts* LCP. If the frozen hero already sets it, do not duplicate on cards.

</aside>

### 5.2 Font loading (`next/font`, self-hosted, zero layout shift)

Font wiring lives in `app/layout.tsx` (allowed surface). Use `next/font` so fonts are self-hosted, preloaded, and emit a `size-adjust` fallback automatically (protects CLS).

```tsx
// app/layout.tsx (font wiring only — no layout/markup redesign)
import { Inter } from "next/font/google"
import localFont from "next/font/local"

export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
})

// Editorial display face, self-hosted/variable to avoid extra round-trips.
export const display = localFont({
  src: "./fonts/Display-Variable.woff2",
  display: "swap",
  variable: "--font-display",
  preload: true,
})
```

- `display: "swap"` + `next/font` fallback metrics → no FOIT, minimal CLS.
- Only **preload** faces used above the fold; defer rare weights.
- Subset to `latin` (or your locales) to shrink font payload.
- Keep the existing CSS variables (`--font-sans`/`--font-display`) so frozen tokens/components are untouched.

### 5.3 Other assets

| Asset | Optimization |
| --- | --- |
| Icons | Tree-shaken via `optimizePackageImports`; inline critical SVGs |
| `globals.css` | Single file, token-driven; no per-component CSS round-trips |
| Third-party scripts (analytics, if any) | Load via `next/script` with `strategy="afterInteractive"` or `lazyOnload` |
| Fonts/images on Sanity CDN | Immutable cache (`minimumCacheTTL`, §2) |

## 6. Caching, ISR & request deduplication strategy

<aside>
🔒

**The frozen CMS data layer is the source of truth and is NOT modified.** Phase 08A's `sanityFetch` / `defineLive` already provides tag-aware fetching, draft-mode handling, and per-request dedup. This phase adds caching **only** via route-segment exports (`app/**`) and documents the existing behavior — no loader, query, or adapter is edited.

</aside>

### 6.1 ISR via route-segment config (additive, route-level)

```tsx
// app/projects/page.tsx  AND  app/projects/[slug]/page.tsx
// (segment-level exports only — page logic unchanged)
export const revalidate = 3600        // ISR: rebuild at most hourly
export const dynamicParams = true     // allow new slugs after build
```

```tsx
// app/projects/[slug]/page.tsx — pre-render known slugs at build (reuses frozen loader)
import { getProjectSlugs } from "@/lib/project"

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}
```

### 6.2 Fetch cache, tags & revalidation (existing behavior, documented)

| Concern | Mechanism (frozen / config) | Notes |
| --- | --- | --- |
| Static-by-default | RSC + `fetch` cache + ISR `revalidate` | Pages render at build, refresh on interval |
| Tag-based invalidation | `sanityFetch` tags + webhook → `revalidateTag` (08A) | On-publish refresh; no polling |
| On-demand path | `revalidatePath('/projects')` from a Sanity webhook route (if present) | Route handler is allowed surface |
| Draft mode | `draftMode()` → `sanityFetch` switches to live/uncached preview (08A) | Production traffic stays cached; only editors see live drafts |
| Live preview | `defineLive` overlay (08A) | Untouched |

### 6.3 Request deduplication

| Layer | Dedup mechanism |
| --- | --- |
| Same query, same request | `sanityFetch` / React `cache()` already collapses duplicate reads within a render (08A) |
| Adjacent-project + detail reads | Share the frozen loader → one fetch, reused |
| Cross-request | ISR cache + CDN → origin hit at most once per `revalidate` window |

<aside>
ℹ️

**Draft-mode interaction guard:** never set `revalidate` so aggressively that it fights preview. When `draftMode` is on, the frozen layer already bypasses the cache; keep `revalidate` on the page segment (not inside loaders) so the preview path is unaffected.

</aside>

### 6.4 Caching strategy report

- **Default posture:** static + ISR (`revalidate = 3600`) for `/projects` and `/projects/[slug]`; home as static with the same revalidate if it reads CMS.
- **Freshness:** tag/path revalidation on publish keeps content current without rebuilds.
- **Preview:** draft mode remains live and uncached — unchanged.
- **Dedup:** in-render dedup (frozen) + CDN/ISR cross-request → minimal origin load.
- **No regressions:** all caching is declared at the segment layer; the CMS data layer is byte-for-byte unchanged.

## 7. React rendering performance review

The discovery engine (08D) is already the hot path and was built memoized; this is a **verification pass**, not a rewrite.

| Concern | Current state (frozen) | Action |
| --- | --- | --- |
| Memoization | `useDiscovery` derives results in one `useMemo` keyed on `(projects, filters, sort)`; `useFilterOptions` memoized on `projects` | ✅ verify keys; no change |
| Expensive renders | Filtering/sorting/search are pure, run once per state change | ✅ no per-item work in render |
| Hooks discipline | Stable actions via `useCallback`; reducer dispatch is stable | ✅ verify deps arrays |
| Stable callbacks | Handlers passed to chips/inputs are `useCallback`-stable | ✅ prevents child re-render churn |
| Derived state | Result set is **derived**, never stored in state (no setState-in-effect) | ✅ no redundant state |
| Re-render boundaries | Search input debounced (`useDebouncedValue`) so typing doesn't re-filter every keystroke | ✅ verify debounce wired |
| Optional `React.memo` | Leaf result card | Wrap **only if** profiler shows wasted renders (additive, no logic change) |

<aside>
ℹ️

Do not add `useMemo`/`React.memo` speculatively — measure first with the React Profiler. The frozen engine is already memoized at the right boundary; over-memoizing leaf components can *cost* more than it saves.

</aside>

## 8. Core Web Vitals strategy (target Lighthouse ≥ 95)

### 8.1 LCP — Largest Contentful Paint (target < 2.0 s)

- Hero image: `priority` + `fetchPriority="high"` (one per route), AVIF/WebP, correct `sizes`.
- Fonts preloaded via `next/font` with `swap` → text paints immediately.
- Static/ISR HTML from cache/CDN → fast TTFB.
- Critical content server-rendered; no client fetch waterfall for above-the-fold.

### 8.2 CLS — Cumulative Layout Shift (target < 0.05)

- Every image has intrinsic `width`/`height` or a fixed-ratio wrapper.
- `next/font` fallback metrics (`size-adjust`) → no swap reflow.
- Skeletons (§4.3) use **fixed** dimensions matching final content.
- No injected banners/ads above content; reserved space for any async UI.

### 8.3 INP — Interaction to Next Paint (target < 200 ms)

- Minimal client JS (islands only) → short main-thread tasks.
- Debounced search keeps keystroke handlers cheap.
- Memoized derivation avoids re-filtering on unrelated state.
- Dynamic imports keep the hydration/TBT budget small.
- `content-visibility: auto` on long below-the-fold result lists (additive CSS) to cut rendering work.

### 8.4 Field measurement (additive `WebVitals` reporter — optional)

```tsx
// app/_components/WebVitals.tsx  (new, additive, client)
"use client"
import { useReportWebVitals } from "next/web-vitals"

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Forward to your analytics endpoint; no PII.
    const body = JSON.stringify(metric)
    navigator.sendBeacon?.("/api/vitals", body)
  })
  return null
}
```

<aside>
ℹ️

Mount `<WebVitals />` once in `app/layout.tsx` only if you want field RUM data. It renders `null` (no UI), adds negligible JS, and touches no frozen component. Skip it if there is no analytics sink.

</aside>

## 9. Production optimization checklist

**Config & bundle**

- [ ]  `next.config.ts` updated (formats, deviceSizes, `optimizePackageImports`, `removeConsole`).
- [ ]  `ANALYZE=true npm run build` reviewed; per-route First-Load JS within §3.3 budgets.
- [ ]  `/studio` confirmed isolated from public route chunks.

**Rendering**

- [ ]  Server/client inventory (§4.1) verified; no new `"use client"` at layout level.
- [ ]  Below-fold islands dynamically imported (§4.2) with correct `ssr` flag.
- [ ]  `loading.tsx` skeletons added per data route (§4.3); dimensions pin CLS.

**Images & fonts**

- [ ]  Exactly one `priority` LCP image per route; rest lazy.
- [ ]  All responsive images carry accurate `sizes`; blur placeholders present.
- [ ]  Fonts via `next/font`, `swap`, subset, preloaded; CSS variables unchanged.

**Caching**

- [ ]  `revalidate` + `generateStaticParams` on `/projects` & `/projects/[slug]`.
- [ ]  Tag/path revalidation confirmed against publish webhook; draft mode still live.

**Core Web Vitals (run Lighthouse, mobile + desktop)**

- [ ]  Performance ≥ 95 on `/`, `/projects`, `/projects/[slug]`.
- [ ]  LCP < 2.0 s • CLS < 0.05 • INP < 200 ms (lab + field if RUM enabled).

**Quality gates**

- [ ]  `npx tsc --noEmit` — zero errors.
- [ ]  `npm run lint` — zero errors.
- [ ]  `npm run build` — succeeds, no warnings.
- [ ]  No architectural regressions: frozen homepage/project/CMS/adapter/discovery code byte-for-byte unchanged.

## 10. Deliverables map

| # | Deliverable | Section |
| --- | --- | --- |
| 1 | Performance optimization architecture | §1–2 (guardrails + config) |
| 2 | Rendering strategy | §4 + §7 |
| 3 | Bundle optimization strategy | §3 |
| 4 | Caching strategy | §6 |
| 5 | Core Web Vitals strategy | §8 |
| 6 | Production optimization checklist | §9 |
| — | Image/font/asset loading | §5 |

## 11. Constraint compliance

| Rule | Status |
| --- | --- |
| Do not redesign any architecture | ✅ optimize-only |
| Do not modify homepage components | ✅ untouched |
| Do not modify project components | ✅ untouched (dynamic-import = import site only) |
| Do not modify CMS schemas | ✅ untouched |
| Do not modify adapters | ✅ untouched |
| Do not modify discovery logic | ✅ verified, not edited |
| No new user-facing features | ✅ perf/infra only |

<aside>
⛔

**STOP — await approval before Phase 08F.** Phase 08E optimization architecture, all five reports, and the production checklist are complete. All optimizations are config/route/wrapper-level and additive; no frozen architecture was modified. Do not begin Phase 08F until approved.

</aside>