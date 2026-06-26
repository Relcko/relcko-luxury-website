# Phase 08B Build — SEO & Metadata System (Output)

## 11. Explanation — metadata generation

- **One builder, every page.** `buildMetadata(SeoInput)` is the single entry point. Static pages call it in a `metadata` export; CMS pages call it inside `generateMetadata` after loading data through the **frozen adapter loaders**. Nothing is hardcoded in components.
- **Resolution precedence:** `resolveSeo` merges in priority order — CMS `seo` object → explicit page input → `SEO_DEFAULTS` (from `siteConfig`). So an editor's `metaTitle`/`metaDescription`/`ogImage`/`noIndex` always wins, with safe fallbacks.
- **Titles:** root layout owns `title.template` (`%s · Relcko`); pages return a **bare** title and the template appends the brand; the homepage returns `title.absolute` to avoid duplication.
- **`metadataBase`** is set once in the root layout from `NEXT_PUBLIC_SITE_URL`, so every relative OG/canonical URL resolves to an absolute one.
- **Server-side only:** `generateMetadata` runs on the server; no metadata is computed on the client. Loaders use the existing draft-aware, CDN-cached `sanityFetch`, so metadata reads share the same request cache as the page body (no duplicate fetch, efficient caching).

## 12. Explanation — structured data generation

- Generators in `buildJsonLd.ts` return `schema-dts` `WithContext<T>` objects — **compile-checked** so invalid [schema.org](http://schema.org) shapes fail at build time.
- **Minimal & data-backed:** each generator only emits fields present in CMS data (optional fields are conditionally added), keeping JSON-LD small.
- **Graph linking:** `Organization` and `WebSite` use stable `@id`s (`#organization`, `#website`); `WebSite.publisher` and `Article.publisher` reference the org `@id` so crawlers see one connected graph.
- **Placement:** the `JsonLd` server component renders a single `<script type="application/ld+json">` with `<`-escaping. Site-wide Organization + WebSite mount once in the root layout; per-page Residence + BreadcrumbList mount on project routes. Article is exported and ready but unmounted (future journal pages).
- **Project structured data:** `residenceJsonLd(project)` maps the frozen `Project` → `Residence` (name, description, hero image, `PostalAddress` from `location`, `GeoCoordinates` when present).

## 13. Explanation — sitemap generation

- `app/sitemap.ts` delegates to `buildSitemap()`, producing a typed `MetadataRoute.Sitemap` (Next renders `/sitemap.xml`).
- **Static routes** come from `STATIC_ROUTES`; **project routes** are pulled via the frozen `getProjectSlugs()` loader — so **new CMS projects appear automatically** with no code change.
- **Future-proof:** any new CMS-driven page type is added by mapping its loader's slugs into the entry list — the route re-runs on each request/revalidation, so the sitemap stays current.

## 14. Explanation — robots configuration

- `app/robots.ts` delegates to `buildRobots()` (typed `MetadataRoute.Robots`, Next renders `/robots.txt`).
- Allows all crawlers on `/`, disallows `/studio` (the Sanity Studio) and `/api/`, and advertises the absolute `sitemap.xml` + canonical `host`.
- Per-page indexing is controlled independently: an editor toggling `noIndex` on a page's CMS `seo` object emits `robots: { index: false, follow: false }` for that route only.

## 15. Explanation — CMS integration

- **Reuses the frozen 08A `seo` object** (`ProjectSeo`) — already present on `homePage`, `project`, and `siteSettings.defaultSeo`. **No schema, adapter, query, or loader was changed.**
- Metadata flows strictly through the existing boundary: `Sanity → (frozen) loader → frozen interface → lib/seo → Metadata/JSON-LD`. SEO helpers consume frozen interfaces (`Project`, `HomePageContent`, Site Settings) and never raw documents.
- **Zero schema changes required** for this phase. Organization/WebSite data is sourced from existing `siteSettings` fields (`title`, `description`, `logo`, `socialLinks`, `contactEmail`, `contactPhone`); verification tokens come from env. → The **CMS QA Freeze (v1.0) and the Additive Optional Field Registry remain unchanged** — nothing to update.

<aside>
🧊

**CMS freeze respected:** Phase 08B added no optional fields and made no schema/adapter/query/loader edits, so the CMS Foundation stays at **v1.0** with no registry or QA-freeze update needed.

</aside>

## 16. Deliverables checklist

| # | Deliverable | Status |
| --- | --- | --- |
| 1 | Complete SEO & Metadata architecture (`lib/seo/*`  • route wiring) | ✅ authored §5–§10 |
| 2 | Metadata generation explained | ✅ §11 |
| 3 | Structured data generation explained | ✅ §12 |
| 4 | Sitemap generation explained | ✅ §13 |
| 5 | Robots configuration explained | ✅ §14 |
| 6 | CMS integration explained | ✅ §15 |
| 7 | Stop before Phase 08C | ✅ §18 |

Covered scope: dynamic metadata · Open Graph · Twitter/X cards · canonical URLs · robots directives · sitemap · robots.txt · JSON-LD · Breadcrumb · Organization · WebSite · Residence (project). Metadata API: `generateMetadata` · `metadataBase` · `alternates` · `robots` · `verification` · `openGraph` · `twitter`. Reusable across home / project / static / future CMS pages.

## 17. Verify (run locally — I can't execute these)

- [ ]  `npm install schema-dts` succeeds.
- [ ]  `.env.local` has `NEXT_PUBLIC_SITE_URL` (+ optional verification token).
- [ ]  `npx tsc --noEmit` — zero errors (JSON-LD shapes checked by `schema-dts`).
- [ ]  `npm run lint` — zero ESLint errors.
- [ ]  `/sitemap.xml` lists static routes + every project slug.
- [ ]  `/robots.txt` allows `/`, disallows `/studio` + `/api/`, points to the sitemap.
- [ ]  View source on `/` → Organization + WebSite JSON-LD; on a project → Residence + BreadcrumbList. Validate in Google Rich Results Test.
- [ ]  OG/Twitter tags resolve absolute image URLs; canonical present on every page.
- [ ]  `noIndex` toggled on a CMS `seo` object → that page emits noindex only.
- [ ]  `git status` clean under `components/**`, `schemas/**`, `adapters/**`, `queries/**`, `lib/sanity/**`, `lib/project.ts`.

## 18. ⛔ STOP — end of Phase 08B

<aside>
⛔

**Phase 08B is complete and I am stopping here.** The CMS-driven SEO & Metadata system (metadata API, Open Graph, Twitter, canonicals, robots, sitemap, robots.txt, and JSON-LD for Organization/WebSite/Breadcrumb/Residence + future-ready Article) is authored as a single `lib/seo/` module wired in only at the route boundary. **No frozen component, schema, adapter, query, or loader was modified; CMS stays at v1.0.** I will not begin **Phase 08C** until you review and approve.

</aside>