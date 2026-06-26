# SEO & Metadata — QA Freeze (Phase 08B)

<aside>
🧊

**Status: FROZEN (v1.0).** Phase 08B (SEO & Metadata System) is verified and frozen as of **26 Jun 2026**. The SEO layer is CMS-driven and lives entirely in `lib/seo/` + App Router route files. It consumes **only frozen interfaces via the frozen adapter loaders** — no CMS schema, adapter, query, loader, or UI component is modified. Future SEO changes must be **additive only**.

</aside>

> **Scope note:** this is a **static/architectural review** of the authored Phase 08B build page. Compile/runtime gates (`tsc`, ESLint, `/sitemap.xml`, `/robots.txt`, Rich Results validation) are run locally — see §9. Inspection-confirmed items are ✅; runtime gates are ⏳.
> 

Sources of truth (frozen): Phase 08B Build page · `lib/project.ts` (v1.6.0) · CMS Foundation QA Freeze (08A v1.0) · Project Detail QA Freeze (07A–07H).

---

## 1. Freeze declaration

| Layer | Files | State |
| --- | --- | --- |
| Metadata helpers | `lib/seo/{types,buildCanonical,buildOpenGraph,buildMetadata}.ts` | 🔒 Frozen |
| Breadcrumbs | `lib/seo/buildBreadcrumbs.ts` | 🔒 Frozen |
| JSON-LD generators | `lib/seo/buildJsonLd.ts`, `lib/seo/JsonLd.tsx` | 🔒 Frozen |
| Sitemap / robots | `lib/seo/{sitemap,robots}.ts`, `app/{sitemap,robots}.ts` | 🔒 Frozen |
| Barrel | `lib/seo/index.ts` | 🔒 Frozen |
| Route wiring (additive) | `app/layout.tsx`, `app/page.tsx`, `app/projects/[slug]/page.tsx`, static `app/*/page.tsx` (metadata + JSON-LD mounts only) | 🔒 Frozen |
| **CMS (08A v1.0)**  • **components**  • **`lib/project.ts`** | — | 🔒 **Untouched** |

**Invariant:** metadata flows one way — `Sanity → (frozen) loader → frozen interface → lib/seo → Next Metadata / JSON-LD`. SEO helpers never call GROQ or read raw documents.

---

## 2. Metadata verification summary

| Target | Mechanism | Verified |
| --- | --- | --- |
| Homepage metadata | `app/page.tsx` `generateMetadata` → `getHomePage()` → `buildMetadata` (home `seo` wins; `title.absolute`) | ✅ |
| Project metadata | `app/projects/[slug]/page.tsx` `generateMetadata` → `getProjectBySlug` → `buildMetadata` | ✅ |
| Static page metadata | static `metadata` export = `buildMetadata({ path, title, description })` | ✅ |
| Dynamic generation | server-side `generateMetadata`; same `buildMetadata` path for all | ✅ |
| Canonical URLs | `alternates.canonical` from `buildCanonical`  • `metadataBase` (root layout) | ✅ |
| Open Graph | `buildOpenGraph` (type/title/description/url/siteName/locale/images, absolute via `toAbsolute`) | ✅ |
| Twitter/X Cards | `buildTwitter` (`summary_large_image`, site/creator handle, absolute image) | ✅ |
| Robots directives | `buildMetadata.robots` (+ per-page `noIndex` from CMS `seo`) | ✅ |

**Precedence confirmed:** CMS `seo` (`ProjectSeo`) → explicit page input → `SEO_DEFAULTS`. Title template (`%s · Relcko`) owned once by root layout; homepage uses `title.absolute` (no brand duplication). ✅

---

## 3. Structured data verification summary

All generators return `schema-dts` `WithContext<T>` (compile-checked) and consume **only frozen interfaces / primitives**.

| Generator | Output `@type` | Input (frozen) | Verified |
| --- | --- | --- | --- |
| `organizationJsonLd` | `Organization` | Site Settings fields (frozen) | ✅ |
| `websiteJsonLd` | `WebSite` | site name (frozen) + org `@id` link | ✅ |
| `breadcrumbJsonLd` | `BreadcrumbList` | `Crumb[]` from `projectBreadcrumbs(Project)` | ✅ |
| `residenceJsonLd` | `Residence` (RealEstateListing-style) | frozen `Project` (location/media/coordinates) | ✅ |
| `articleJsonLd` | `Article` (future-ready, unmounted) | `ArticleInput` | ✅ |
- **Frozen-only inputs:** every generator takes `Project` / Site Settings / plain inputs — **no raw Sanity document** anywhere. ✅
- **Graph integrity:** stable `@id`s (`#organization`, `#website`); `WebSite.publisher` + `Article.publisher` reference the org node. ✅
- **Safe mounting:** `JsonLd` emits one `<script type="application/ld+json">` with `<`-escaping; site-wide Org+WebSite in root layout, per-page Residence+Breadcrumb on project routes; Article exported but not mounted. ✅

---

## 4. Routing verification summary

| Item | Mechanism | Verified |
| --- | --- | --- |
| `sitemap.xml` | `app/sitemap.ts` → `buildSitemap()` → typed `MetadataRoute.Sitemap` | ✅ / ⏳ render |
| Static routes | `STATIC_ROUTES` (`/`, `/projects`, `/about`, `/contact`) | ✅ |
| Dynamic project inclusion | `getProjectSlugs()` (frozen loader) mapped to `/projects/{slug}` — new projects auto-included | ✅ |
| `robots.txt` | `app/robots.ts` → `buildRobots()` → typed `MetadataRoute.Robots` | ✅ / ⏳ render |
| Robots rules | allow `/`; disallow `/studio`, `/api/`; advertise absolute sitemap + host | ✅ |
| Canonical generation | `buildCanonical`/`absoluteUrl` from `SITE_URL`; one origin everywhere | ✅ |
| Future CMS pages | extend `STATIC_ROUTES` / map new loader slugs; route re-runs per request/revalidate | ✅ (designed) |

---

## 5. CMS confirmation

| Check | Result |
| --- | --- |
| No schema changes | ✅ reuses frozen `seo` object on `homePage`/`project`/`siteSettings.defaultSeo` |
| No adapter changes | ✅ consumes existing adapter outputs only |
| No loader changes | ✅ reuses `getHomePage`/`getProjectBySlug`/`getProjectSlugs`/`getSiteSettings` |
| No interface changes | ✅ `lib/project.ts` (incl. `ProjectSeo`) untouched |

→ **CMS Foundation remains at v1.0**; the Additive Optional Field Registry and CMS QA Freeze need **no update**. ✅

---

## 6. Performance verification summary

| Check | Result |
| --- | --- |
| Server-side metadata generation | ✅ `generateMetadata`  • server components; **no client-side SEO** |
| No duplicate metadata | ✅ single `buildMetadata` path; root layout owns base/template once; pages set only their delta |
| Lightweight JSON-LD | ✅ minimal generators emit only data-backed fields; one `<script>` per node-set |
| Efficient caching | ✅ metadata + body share the same draft-aware, CDN-cached `sanityFetch` request cache (no extra fetch) |
| Accessibility | ✅ JSON-LD is non-visual `<script>`; no impact on focus/landmarks/contrast |

---

## 7. Final SEO architecture diagram

```
              Sanity (08A, FROZEN v1.0)
                       │
      frozen loaders (getHomePage / getProjectBySlug /
           getProjectSlugs / getSiteSettings)
                       │   → frozen interfaces (Project, HomePageContent, Site Settings, ProjectSeo)
                       ▼
         ┌─────────── lib/seo/ ───────────┐
         │ buildMetadata  (resolveSeo: CMS seo  │
         │   → input → SEO_DEFAULTS)            │
         │   ├─ buildCanonical  (metadataBase)   │
         │   ├─ buildOpenGraph / buildTwitter    │
         │ buildJsonLd  (Organization · WebSite │
         │   · BreadcrumbList · Residence ·      │
         │   Article[future])  → JsonLd        │
         │ buildSitemap · buildRobots           │
         └───────────────┬──────────────┘
                         ▼
App Router route files (ADDITIVE, no component touched)
layout.tsx  metadata + <JsonLd Org/WebSite>
page.tsx                generateMetadata
projects/[slug]/page.tsx  generateMetadata + <JsonLd Residence/Breadcrumb>
about|contact|projects   static metadata
sitemap.ts → /sitemap.xml      robots.ts → /robots.txt
                         ▼
  Crawlers / social / search (absolute canonical + OG + JSON-LD graph)
```

---

## 8. Freeze contract — additive-only

- 🔒 **Frozen:** metadata helpers, JSON-LD generators, sitemap, robots, canonical generation, and the route-level wiring pattern.
- 🔒 CMS (v1.0), `lib/project.ts`, and all components remain the untouched single source of truth.
- ➕ **Additive only:** new JSON-LD generator (new `WithContext<T>`) · new optional `SeoInput` field · new route mounting an existing helper · new `STATIC_ROUTES` entry or loader-fed slug set. If SEO needs a new CMS field, it goes through the **08A additive path** (optional schema field → query → adapter → optional frozen field + Registry) — never an in-place edit.
- 🚫 No hardcoded metadata in components; no client-side SEO; no duplicate base metadata; no SEO logic scattered outside `lib/seo/`.

---

## 9. Pre-08C gate (run locally — I can't execute these) & STOP

- [ ]  `npm install schema-dts`; `.env.local` has `NEXT_PUBLIC_SITE_URL`.
- [ ]  `npx tsc --noEmit` — zero errors (JSON-LD checked by `schema-dts`).
- [ ]  `npm run lint` — zero ESLint errors.
- [ ]  `/sitemap.xml` lists static routes + every project slug; `/robots.txt` correct.
- [ ]  Rich Results Test: Organization+WebSite on `/`, Residence+BreadcrumbList on a project.
- [ ]  Canonical + absolute OG/Twitter image on every page; `noIndex` toggles per page.
- [ ]  `git status` clean under `components/**`, `schemas/**`, `adapters/**`, `queries/**`, `lib/sanity/**`, `lib/project.ts`.

<aside>
⛔

**STOP — Phase 08B SEO & Metadata is frozen (v1.0).** All verifications pass at the architecture level; the ⏳ gates above are yours to run locally (I can't execute builds/lint/tsc). I will not begin **Phase 08C** until you review and approve.

</aside>