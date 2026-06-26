# Project Interface — Additive Optional Field Registry

<aside>
🧊

The `lib/project.ts` **`Project`** interface was frozen at **Phase 07A**. Every section phase since has added richer content than the frozen model carried. Per the standing rule ("extend only if required, additive optional fields, reuse existing types, no duplicate interfaces"), each was resolved with **one optional additive field** — no existing field renamed, removed, or retyped. This page is the canonical record of those fields.

</aside>

## Registry

| Phase | Field name | Purpose | Consumed by | Optional / Required |
| --- | --- | --- | --- | --- |
| 07C | `overviewContent?: ProjectOverviewData` | Editorial overview copy, narrative quote, highlight cards & metrics for the Overview section. | `ProjectOverviewSection` (→ `ProjectOverviewContent`, `ProjectOverviewHighlights`, `HighlightCard`, `ProjectOverviewQuote`), gated in `ProjectLayout`. | Optional |
| 07D | `amenitiesContent?: ProjectAmenitiesData` | Amenity categories, lifestyle highlights, feature image & stat for the Amenities & Lifestyle section. | `ProjectAmenitiesSection` (→ `AmenitiesContent`, `AmenitiesCategories`, `AmenityCategory`, `AmenityCard`, `LifestyleHighlights`, `LifestyleHighlight`), gated in `ProjectLayout`. | Optional |
| 07E | `galleryContent?: ProjectGalleryData` | Featured media, categorized gallery items (image/video), and filter categories for the Immersive Gallery section. | `ProjectGallerySection` (→ `GalleryHeader`, `FeaturedMedia`, `GalleryNavigation`, `MediaGrid`, `MediaCategory`, `MediaCard`, `MediaCaption`), gated in `ProjectLayout`. | Optional |
| 07F | `locationContent?: ProjectLocationData` | Connectivity summary, nearby destination categories, travel metrics, static location & map images for the Location & Connectivity section. | `ProjectLocationSection` (→ `LocationContent`, `ConnectivityHighlights`, `DestinationCategories`, `DestinationCard`, `TravelMetric`, `LocationMapPlaceholder`); also reuses existing `location: LocationInfo` for the address. Gated in `ProjectLayout`. | Optional |
| 07G | `investmentContent?: ProjectInvestmentData` | Ownership journey, investment highlights, investment cards, ownership model, key metrics, and primary CTA for the Investment & Digital Ownership section (plain-language, no financial promises). | `ProjectInvestmentSection` (→ `InvestmentContent`, `OwnershipJourneySummary`, `InvestmentHighlights`, `InvestmentCard`, `OwnershipModel`, `InvestmentMetric`, `InvestmentCTA`); existing `investment: InvestmentInfo` left intact. Gated in `ProjectLayout`. | Optional |
| 07H | `closingContent?: ProjectClosingData` | Closing experience: resources/downloads (reuses `ProjectDocument`), related projects (reuses `ProjectSummary` wrapped with a location string), and the final inquiry CTA (primary/secondary CTA, contact methods, closing statement). Placeholder, no working form. | `ProjectResourcesSection` (→ `ResourcesDownloads`, `DownloadCard`), `RelatedProjectsSection` (→ `RelatedProjectCard`), `FinalInquirySection` (→ `InquiryCTA`, `ContactOptions`); existing `downloads`/`relatedProjects` left intact. Gated in `ProjectLayout`. | Optional |
| 08D | `ownershipModel?: OwnershipModel` | Ownership classification (freehold / leasehold / fractional / branded residence) powering the Discovery ownership-model filter facet and search text. Enum is single-sourced as `OWNERSHIP_MODELS`  • `OWNERSHIP_MODEL_LABELS` in `lib/project.ts` (no duplication). | `lib/discovery` (`toDiscoverable`, `applyFilters`, `deriveFacetOptions`), `FilterPanel` / `FilterGroup` / `ActiveFilters`; optional Sanity `project.ownershipModel` string field mapped by `toProject` via a guarded `toOwnershipModel`. No `components/project/*` touched. | Optional |

## Rules this registry enforces

- **Additive only** — new fields are appended after the related existing field; nothing is renamed, removed, or retyped.
- **Always optional** — every field above is `?`, so existing/CMS records without it still type-check and `ProjectLayout` guards each render.
- **Reuse, don't duplicate** — new data shapes reuse existing primitives (`ProjectImage`, `ProjectAmenity`, `LocationInfo`) instead of cloning models.
- **One field per section phase** — each section phase contributes exactly one top-level `*Content` field, populated by its `build*Content(seed)` placeholder helper.
- **Frozen 07A components stay on disk** — the original 07A section component is left intact and simply unrendered; only its import/usage leaves `ProjectLayout`.

<aside>
📌

**Maintenance:** add a new row here whenever a future phase introduces another optional `Project` field (record phase, field name + type, purpose, consuming components, optionality). Candidates still on the frozen 07A model: Investment, Downloads, Related, Final CTA.

</aside>