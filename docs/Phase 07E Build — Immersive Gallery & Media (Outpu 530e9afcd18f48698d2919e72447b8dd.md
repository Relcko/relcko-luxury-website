# Phase 07E Build — Immersive Gallery & Media (Output)

<aside>
🖼️

**Phase 07E — Immersive Gallery & Media.** A curated, editorial media experience — a featured hero image, a supporting media grid, and a UI-only category filter bar — spanning architecture, renders, interiors, lifestyle, and construction. Eight new pure, strictly-typed, CMS-ready components under `components/project/gallery/`, bound to the **single** `Project` interface via one *optional additive* field. Interactions are **CSS-only** (image zoom, caption reveal, overlay) plus lightweight client filter state. **No** lightbox, carousel, or fullscreen viewer. Motion is **Phase 03 only**. Phases 07A–07D untouched; the only 07A edits are the sanctioned `ProjectLayout` integration + barrel re-export.

</aside>

## 1. Files in this phase

```jsx
lib/
  project.ts                       # EXTENDED (additive + optional) — gallery/media types + placeholder builder
components/project/gallery/
  ProjectGallerySection.tsx        # Orchestrator: holds filter state, motion root (client)
  GalleryHeader.tsx                # Eyebrow + heading + optional description (client)
  FeaturedMedia.tsx                # Featured hero image (image reveal + zoom + caption) (client)
  MediaGrid.tsx                    # Staggered, filtered grid of MediaCard (client)
  MediaCard.tsx                    # One media tile (CSS-only zoom/caption/overlay) (pure)
  MediaCategory.tsx                # One filter chip/button (pure)
  MediaCaption.tsx                 # Editorial caption overlay (pure)
  GalleryNavigation.tsx            # Filter bar composed of MediaCategory (pure)
  index.ts                         # Barrel
components/project/
  ProjectLayout.tsx                # EDITED — integrate section after Amenities
  index.ts                         # EDITED — re-export ./gallery
```

<aside>
🧭

**Design decisions (sanity-check against the freeze):**

1. **One optional additive field.** The existing `media.gallery: ProjectImage[]` is a flat list with no category, caption, video-thumbnail kind, or featured flag. So `lib/project.ts` gains a few new types + one **optional** `Project.galleryContent?` field. No existing field is renamed, removed, or changed (`media` is fully intact).
2. **No duplicate models.** Every media item reuses the existing `ProjectImage` for its image/poster. Only genuinely new shapes are added (`GalleryMediaItem`, `GalleryCategory`, the id unions, `ProjectGalleryData`).
3. **Scope discipline.** Interactions are limited to image zoom, caption reveal, overlay transition (all **CSS-only**, `group` hover/focus) + a small client `useState` filter. **No lightbox, carousel, fullscreen viewer, or drag** — a clicked/focused tile reveals its caption only; no viewer is attached.
4. **Frozen 07A component stays intact.** `ProjectGallery.tsx` (07A) is **not edited or deleted** — only its dynamic import/usage leaves `ProjectLayout`.
5. **Anchor + placement.** New section keeps `id="gallery"` (sidebar anchor preserved) and is placed **directly after Amenities** per the brief — so the running order becomes Overview → Amenities → Gallery → Location → … `PROJECT_SECTIONS` is unchanged.
</aside>

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Heading`, `Text`. `@/lib/animation` exports `staggerContainer`, `childVariants` (fade-up), `reveal` (mask). Global `MotionConfig reducedMotion="user"` (Phase 03) covers framer; CSS interactions are guarded with Tailwind `motion-reduce:` variants. `cn` from `@/utils/cn`. Media lives under `/public/images/projects/`. Video items are **thumbnails with a decorative play badge** (no player is built). Placeholder media only. If a name differs, only the import line changes.

</aside>

<aside>
📑

Delivered in **two parts**. **Part 1** (below) = the additive `lib/project.ts` extension + the four pure components (`MediaCaption`, `MediaCard`, `MediaCategory`, `GalleryNavigation`). **Part 2** = `GalleryHeader`, `FeaturedMedia`, `MediaGrid`, the `ProjectGallerySection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/project.ts` — additive extension (new optional types + placeholder builder)

**Add these types** (nothing existing is touched):

```tsx
// --- Phase 07E — gallery & media content (additive, optional) -------------
export type GalleryCategoryId =
	| "architecture"
	| "renders"
	| "interiors"
	| "lifestyle"
	| "construction"

// Filter ids include the implicit "all" bucket used by the nav bar.
export type GalleryFilterId = GalleryCategoryId | "all"

export type GalleryMediaKind = "image" | "video"

export type GalleryMediaItem = {
	id: string
	kind: GalleryMediaKind // "video" = thumbnail/poster with a play affordance (no player)
	category: GalleryCategoryId
	image: ProjectImage // reuses the existing ProjectImage shape (poster for video)
	caption?: string
	featured?: boolean
}

export type GalleryCategory = {
	id: GalleryFilterId
	label: string
}

export type ProjectGalleryData = {
	eyebrow: string
	heading: string
	description?: string
	featured: GalleryMediaItem
	items: GalleryMediaItem[]
	categories: GalleryCategory[]
}
```

**Add one optional field to the existing `Project` type** (shown here after `media`):

```tsx
media: ProjectMedia
galleryContent?: ProjectGalleryData // ← Phase 07E (optional, additive)
```

**Add the placeholder builder + shared fixtures**, then populate it inside the existing `buildProject` factory (one new line):

```tsx
const sharedGalleryCategories: GalleryCategory[] = [
	{ id: "all", label: "All" },
	{ id: "architecture", label: "Architecture" },
	{ id: "renders", label: "Renders" },
	{ id: "interiors", label: "Interiors" },
	{ id: "lifestyle", label: "Lifestyle" },
	{ id: "construction", label: "Construction" },
]

function buildGalleryItems(seed: ProjectSeed): GalleryMediaItem[] {
	const base = `/images/projects/${seed.slug}-gallery`
	return [
		{
			id: "g-arch-1",
			kind: "image",
			category: "architecture",
			image: img(`${base}-architecture-1.jpg`, `${seed.title} architecture`, 1200, 1500),
			caption: "Sculptural façade defining the skyline.",
		},
		{
			id: "g-render-1",
			kind: "image",
			category: "renders",
			image: img(`${base}-render-1.jpg`, `${seed.title} architectural render`, 1200, 900),
			caption: "Render of the arrival court.",
		},
		{
			id: "g-interior-1",
			kind: "image",
			category: "interiors",
			image: img(`${base}-interior-1.jpg`, `${seed.title} interior`, 1200, 900),
			caption: "Light-filled living spaces in natural tones.",
		},
		{
			id: "g-interior-2",
			kind: "video",
			category: "interiors",
			image: img(`${base}-interior-2.jpg`, `${seed.title} residence walkthrough`, 1200, 900),
			caption: "Walkthrough of a signature residence.",
		},
		{
			id: "g-lifestyle-1",
			kind: "image",
			category: "lifestyle",
			image: img(`${base}-lifestyle-1.jpg`, `${seed.title} lifestyle`, 1200, 1500),
			caption: "Resort-style amenities for everyday life.",
		},
		{
			id: "g-lifestyle-2",
			kind: "video",
			category: "lifestyle",
			image: img(`${base}-lifestyle-2.jpg`, `${seed.title} neighbourhood film`, 1200, 900),
			caption: "A short film of the neighbourhood.",
		},
		{
			id: "g-construction-1",
			kind: "image",
			category: "construction",
			image: img(`${base}-construction-1.jpg`, `${seed.title} construction progress`, 1200, 900),
			caption: "On-site progress, latest quarter.",
		},
		{
			id: "g-arch-2",
			kind: "image",
			category: "architecture",
			image: img(`${base}-architecture-2.jpg`, `${seed.title} architectural detail`, 1200, 900),
			caption: "Detailing in stone and bronze.",
		},
	]
}

function buildGalleryContent(seed: ProjectSeed): ProjectGalleryData {
	return {
		eyebrow: "Gallery & media",
		heading: "A curated view of the project",
		description:
			"Architecture, interiors, lifestyle, and construction — a closer look at the craft behind the address.",
		featured: {
			id: "g-featured",
			kind: "image",
			category: "architecture",
			image: img(`/images/projects/${seed.slug}-gallery-featured.jpg`, `${seed.title} featured view`, 1600, 900),
			caption: "The signature view, from the approach.",
			featured: true,
		},
		items: buildGalleryItems(seed),
		categories: sharedGalleryCategories,
	}
}
```

```tsx
// Inside the existing buildProject(seed) return object, add ONE line
// (next to the other Phase 07 content builders):
		media: buildMedia(seed),
		galleryContent: buildGalleryContent(seed), // ← Phase 07E
```

<aside>
🧩

**Why this respects the freeze.** Everything is *added*: `media`, `buildProject`'s other lines, `PROJECT_SECTIONS`, and all helpers are byte-for-byte unchanged. `galleryContent` is optional → a CMS record without it still type-checks and the section simply doesn't render. Every item reuses `ProjectImage` — no duplicate models.

</aside>

---

## 3. `MediaCaption.tsx` — editorial caption overlay (pure)

```tsx
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type MediaCaptionProps = {
	caption: string
	className?: string
}

// Caption overlay. Reveal is driven by the parent figure's `group` hover/focus
// state (CSS only). It stays in the DOM (opacity, not display) so screen readers
// always read it; pointer-events-none keeps it from blocking the tile.
export function MediaCaption({ caption, className }: MediaCaptionProps) {
	return (
		<figcaption
			className={cn(
				"pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-base/90 via-bg-base/40 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
				className,
			)}
		>
			<Text size="sm" className="text-text-primary">
				{caption}
			</Text>
		</figcaption>
	)
}
```

---

## 4. `MediaCard.tsx` — one media tile (pure, CSS-only interactions)

```tsx
import Image from "next/image"
import type { GalleryMediaItem } from "@/lib/project"
import { cn } from "@/utils/cn"
import { MediaCaption } from "./MediaCaption"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type MediaCardProps = {
	item: GalleryMediaItem
	className?: string
	sizes?: string
}

// Pure media tile. Interactions are CSS-only via `group` hover/focus: image zoom,
// caption reveal, gradient overlay. Focusable so keyboard users can surface the
// caption; no viewer/lightbox is attached (per scope). Fixed aspect = zero CLS.
export function MediaCard({
	item,
	className,
	sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: MediaCardProps) {
	return (
		<figure
			tabIndex={0}
			className={cn(
				"group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-elevated outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
				className,
			)}
		>
			<Image
				src={item.image.src}
				alt={item.image.alt}
				fill
				loading="lazy"
				placeholder="blur"
				blurDataURL={item.image.blurDataURL ?? FALLBACK_BLUR}
				sizes={sizes}
				className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
			/>
			{item.kind === "video" ? (
				<span
					aria-hidden="true"
					className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-base/70 backdrop-blur"
				>
					<svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px] fill-text-primary" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
				</span>
			) : null}
			{item.caption ? <MediaCaption caption={item.caption} /> : null}
		</figure>
	)
}
```

---

## 5. `MediaCategory.tsx` — one filter chip (pure)

```tsx
import type { GalleryCategory, GalleryFilterId } from "@/lib/project"
import { cn } from "@/utils/cn"

type MediaCategoryProps = {
	category: GalleryCategory
	isActive: boolean
	onSelect: (id: GalleryFilterId) => void
	className?: string
}

// Pure filter control. State lives in the section; this reports selection via
// onSelect and reflects active state with aria-pressed + styling.
export function MediaCategory({ category, isActive, onSelect, className }: MediaCategoryProps) {
	return (
		<button
			type="button"
			aria-pressed={isActive}
			onClick={() => onSelect(category.id)}
			className={cn(
				"rounded-full border px-4 py-1.5 font-display-sans text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base motion-reduce:transition-none",
				isActive
					? "border-accent-gold bg-accent-gold/10 text-accent-gold"
					: "border-border text-text-muted hover:text-text-primary",
				className,
			)}
		>
			{category.label}
		</button>
	)
}
```

---

## 6. `GalleryNavigation.tsx` — filter bar (pure)

```tsx
import type { GalleryCategory, GalleryFilterId } from "@/lib/project"
import { cn } from "@/utils/cn"
import { MediaCategory } from "./MediaCategory"

type GalleryNavigationProps = {
	categories: GalleryCategory[]
	activeId: GalleryFilterId
	onSelect: (id: GalleryFilterId) => void
	className?: string
}

// UI-only category filtering infrastructure: renders the controls and reports
// selection upward. Pure — the section owns the active-category state.
export function GalleryNavigation({ categories, activeId, onSelect, className }: GalleryNavigationProps) {
	return (
		<nav aria-label="Filter gallery by category" className={cn("flex flex-wrap gap-2", className)}>
			{categories.map((category) => (
				<MediaCategory
					key={category.id}
					category={category}
					isActive={category.id === activeId}
					onSelect={onSelect}
				/>
			))}
		</nav>
	)
}
```

<aside>
⏭️

Part 2 (next) appends `GalleryHeader`, `FeaturedMedia`, `MediaGrid`, the `ProjectGallerySection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 7. `GalleryHeader.tsx` — eyebrow + heading + optional description (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type GalleryHeaderProps = {
	eyebrow: string
	heading: string
	description?: string
	className?: string
}

// Editorial header. No own initial/animate — inherits "visible" from the section.
// Heading uses the mask `reveal`; eyebrow + description fade up.
export function GalleryHeader({ eyebrow, heading, description, className }: GalleryHeaderProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<motion.span
				variants={childVariants}
				className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold"
			>
				{eyebrow}
			</motion.span>
			<motion.div variants={reveal}>
				<Heading level={2} size="xl" className="text-balance">
					{heading}
				</Heading>
			</motion.div>
			{description ? (
				<motion.div variants={childVariants}>
					<Text tone="muted" className="max-w-xl">
						{description}
					</Text>
				</motion.div>
			) : null}
		</div>
	)
}
```

---

## 8. `FeaturedMedia.tsx` — featured hero image (client)

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { reveal } from "@/lib/animation"
import type { GalleryMediaItem } from "@/lib/project"
import { cn } from "@/utils/cn"
import { MediaCaption } from "./MediaCaption"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type FeaturedMediaProps = {
	item: GalleryMediaItem
	className?: string
}

// Featured hero tile: mask `reveal` (image reveal) on entrance, CSS-only zoom +
// caption reveal on hover/focus. 16/9 fixed box = zero CLS.
export function FeaturedMedia({ item, className }: FeaturedMediaProps) {
	return (
		<motion.figure
			variants={reveal}
			tabIndex={0}
			className={cn(
				"group relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-bg-elevated outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
				className,
			)}
		>
			<Image
				src={item.image.src}
				alt={item.image.alt}
				fill
				loading="lazy"
				placeholder="blur"
				blurDataURL={item.image.blurDataURL ?? FALLBACK_BLUR}
				sizes="(min-width: 1024px) 70vw, 100vw"
				className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
			/>
			{item.kind === "video" ? (
				<span
					aria-hidden="true"
					className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-base/70 backdrop-blur"
				>
					<svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[1px] fill-text-primary" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
				</span>
			) : null}
			{item.caption ? <MediaCaption caption={item.caption} /> : null}
		</motion.figure>
	)
}
```

---

## 9. `MediaGrid.tsx` — staggered, filtered grid (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Text } from "@/components/ui"
import type { GalleryMediaItem } from "@/lib/project"
import { cn } from "@/utils/cn"
import { MediaCard } from "./MediaCard"

type MediaGridProps = {
	items: GalleryMediaItem[]
	className?: string
}

// Stagger reveal + fade-up for each tile. Receives the already-filtered list, so
// it re-renders in place when the active category changes. Graceful empty state.
export function MediaGrid({ items, className }: MediaGridProps) {
	if (items.length === 0) {
		return (
			<Text tone="muted" role="status">
				No media in this category yet.
			</Text>
		)
	}
	return (
		<motion.ul
			variants={staggerContainer}
			className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
		>
			{items.map((item) => (
				<motion.li key={item.id} variants={childVariants}>
					<MediaCard item={item} />
				</motion.li>
			))}
		</motion.ul>
	)
}
```

---

## 10. `ProjectGallerySection.tsx` — orchestrator + filter state (client)

```tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { staggerContainer } from "@/lib/animation"
import type { GalleryFilterId, ProjectGalleryData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { GalleryHeader } from "./GalleryHeader"
import { GalleryNavigation } from "./GalleryNavigation"
import { FeaturedMedia } from "./FeaturedMedia"
import { MediaGrid } from "./MediaGrid"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectGallerySectionProps = {
	content: ProjectGalleryData
	className?: string
}

// Single motion trigger (whileInView, once) propagates "visible" to the header,
// featured image, and grid. Owns the UI-only category filter; the featured hero
// is always shown, the grid filters by active category. id="gallery" keeps the
// sidebar anchor working.
export function ProjectGallerySection({ content, className }: ProjectGallerySectionProps) {
	const [activeCategory, setActiveCategory] = useState<GalleryFilterId>("all")
	const visibleItems =
		activeCategory === "all"
			? content.items
			: content.items.filter((item) => item.category === activeCategory)
	return (
		<motion.section
			id="gallery"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					<GalleryHeader
						eyebrow={content.eyebrow}
						heading={content.heading}
						description={content.description}
					/>
					<GalleryNavigation
						categories={content.categories}
						activeId={activeCategory}
						onSelect={setActiveCategory}
					/>
				</div>
				<FeaturedMedia item={content.featured} />
				<MediaGrid items={visibleItems} />
			</div>
		</motion.section>
	)
}
```

---

## 11. `components/project/gallery/index.ts` — barrel

```tsx
export { ProjectGallerySection } from "./ProjectGallerySection"
export { GalleryHeader } from "./GalleryHeader"
export { FeaturedMedia } from "./FeaturedMedia"
export { MediaGrid } from "./MediaGrid"
export { MediaCard } from "./MediaCard"
export { MediaCategory } from "./MediaCategory"
export { MediaCaption } from "./MediaCaption"
export { GalleryNavigation } from "./GalleryNavigation"
```

---

## 12. `ProjectLayout.tsx` — integrate after Amenities (the only 07A render edit)

Removes the old dynamically-imported `<ProjectGallery>` (import + usage) and places the new `<ProjectGallerySection>` directly after Amenities. Everything else is unchanged.

```tsx
import dynamic from "next/dynamic"
import { Container } from "@/components/ui"
import type { Project, ProjectSummary } from "@/lib/project"
import { ProjectBreadcrumb } from "./ProjectBreadcrumb"
import { ProjectHero } from "./hero"
import { QuickFacts } from "./QuickFacts"
import { ProjectOverviewSection } from "./overview"
import { ProjectAmenitiesSection } from "./amenities"
import { ProjectGallerySection } from "./gallery"
import { ProjectInvestment } from "./ProjectInvestment"
import { ProjectDownloads } from "./ProjectDownloads"
import { ProjectFinalCTA } from "./ProjectFinalCTA"
import { ProjectSidebar } from "./ProjectSidebar"

function SectionFallback({ label }: { label: string }) {
	return (
		<div
			aria-hidden="true"
			data-loading={label}
			className="min-h-[16rem] animate-pulse rounded-2xl border border-border bg-bg-elevated"
		/>
	)
}

const ProjectLocation = dynamic(
	() => import("./ProjectLocation").then((m) => m.ProjectLocation),
	{ loading: () => <SectionFallback label="location" /> },
)
const RelatedProjects = dynamic(
	() => import("./RelatedProjects").then((m) => m.RelatedProjects),
	{ loading: () => <SectionFallback label="related" /> },
)

type ProjectLayoutProps = {
	project: Project
	previous?: ProjectSummary
	next?: ProjectSummary
}

export function ProjectLayout({ project, previous, next }: ProjectLayoutProps) {
	const crumbs = [
		{ label: "Home", href: "/" },
		{ label: "Projects", href: "/projects" },
		{ label: project.title },
	]
	return (
		<main className="bg-bg-base pb-24">
			{/* Full-bleed hero — intentionally OUTSIDE the content Container */}
			<ProjectHero project={project} />

			<Container size="max">
				<div className="flex flex-col gap-8 pt-8 md:pt-10">
					<ProjectBreadcrumb items={crumbs} />
					<QuickFacts items={project.quickFacts} />
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem]">
						<div className="flex flex-col">
							{project.overviewContent ? (
								<ProjectOverviewSection content={project.overviewContent} />
							) : null}
							{project.amenitiesContent ? (
								<ProjectAmenitiesSection content={project.amenitiesContent} />
							) : null}
							{project.galleryContent ? (
								<ProjectGallerySection content={project.galleryContent} />
							) : null}
							<ProjectLocation location={project.location} />
							<ProjectInvestment investment={project.investment} />
							<ProjectDownloads downloads={project.downloads} />
							<RelatedProjects projects={project.relatedProjects} />
						</div>
						<ProjectSidebar
							previous={previous}
							next={next}
							className="order-first lg:order-none lg:sticky lg:top-28 lg:h-fit"
						/>
					</div>
					<ProjectFinalCTA project={project} />
				</div>
			</Container>
		</main>
	)
}
```

<aside>
🔒

**Frozen-safe.** `ProjectGallery.tsx` (07A) is untouched on disk — only its dynamic import/usage leaves `ProjectLayout`. The Hero, full-bleed positioning, Overview + Amenities sections, grid, sticky sidebar, and the remaining Location→Investment→Downloads→Related order are unchanged. Gallery now sits directly after Amenities, per the brief.

</aside>

---

## 13. `components/project/index.ts` — re-export gallery (edit)

Append one line to the existing barrel (all existing exports left as-is):

```tsx
// …existing exports unchanged…
export * from "./overview"
export * from "./amenities"
export * from "./gallery"
```

---

## 14. Deliverable 3 — Component hierarchy

```jsx
ProjectLayout (main column, after Amenities)
 └── ProjectGallerySection            (client: motion.section + useState filter, single whileInView)
      ├── header row (md:flex-row)
      │    ├── GalleryHeader           (client: eyebrow + h2 reveal + optional description)
      │    └── GalleryNavigation       (pure: filter bar)
      │         └── MediaCategory      (pure: filter chip, aria-pressed)
      ├── FeaturedMedia              (client: image reveal + zoom + caption)
      │    └── MediaCaption          (pure)
      └── MediaGrid                  (client: staggered, filtered)
           └── MediaCard             (pure: CSS-only zoom/caption/overlay)
                └── MediaCaption     (pure)
```

- **8 components**, each single-purpose. State (active category) lives only in the section; everything below receives props → the four card/control components (`MediaCard`, `MediaCategory`, `MediaCaption`, `GalleryNavigation`) are **pure** and reusable anywhere.
- **Heading hierarchy**: Hero `h1` → section `h2` (gallery heading). Tiles use semantic `figure`/`figcaption`; the filter bar is a labelled `nav`.

## 15. Deliverable 4 — CMS bindings

- One optional additive field: `Project.galleryContent?: ProjectGalleryData` — **no duplicate models, no changed/removed fields** (`media` is intact).
- Field-by-field: `eyebrow`/`heading`/`description` → `GalleryHeader`; `categories[]` → `GalleryNavigation` → `MediaCategory`; `featured` (`GalleryMediaItem`) → `FeaturedMedia`; `items[]` → `MediaGrid` → `MediaCard`. Each item's `image` reuses `ProjectImage`; `kind: "video"` renders a decorative play badge; `caption` → `MediaCaption`; `category` drives filtering.
- **No hardcoded media** — every string/asset comes from data; placeholders live in `buildGalleryContent(seed)` / `buildGalleryItems(seed)`. Swap the placeholder block for a Sanity fetch returning this shape and nothing else changes.
- `galleryContent` is **optional** → records without it still type-check; `ProjectLayout` guards the render.

## 16. Deliverable 5 — Animation approach (Phase 03 only)

- **One trigger**: the section is the only `whileInView` (`once: true`); framer propagates `"visible"` to descendants declaring `variants` (no child sets its own `initial`/`animate`).
- **Fade-up** = `childVariants` (eyebrow, description, each grid tile). **Image reveal** = `reveal` mask on `FeaturedMedia` + the h2. **Stagger reveal** = `staggerContainer` on `MediaGrid`. **Overlay transitions** (image zoom, caption reveal, gradient) are **CSS-only** via `group-hover` / `group-focus-within` — no JS, no parallax, no pinning, **no new infrastructure**.
- **Filtering** re-renders the grid in place with the filtered list (UI-only); it does not re-trigger the entrance stagger.
- **Reduced motion**: framer handled by the global `MotionConfig reducedMotion="user"`; CSS transforms/transitions are neutralised with Tailwind `motion-reduce:` variants — content stays fully visible and legible.

## 17. Deliverable 6 — Responsive behavior (zero CLS)

- **Mobile (`<640`)**: single-column stack — header, then filter bar, featured image, then one-up tiles.
- **Tablet (`640–1023`)**: balanced grid — tiles two-up (`sm:grid-cols-2`); featured image full-width.
- **Desktop (`≥1024`)**: editorial composition — header + filter bar share a row (`md:flex-row md:justify-between`), large featured image, tiles three-up (`lg:grid-cols-3`).
- **Zero CLS**: every image is `next/image fill` inside a fixed-aspect box (featured `16/9`, tiles `4/3`) with blur placeholders + responsive `sizes`; captions/overlays/badges are absolutely positioned; `lazy` loading throughout; `scroll-mt-28` keeps the `#gallery` anchor clean.

## 18. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders after Amenities on all three project routes
- [ ]  Featured image + supporting grid render with zero layout shift
- [ ]  Filter chips switch the visible tiles; "All" shows everything; empty state is graceful
- [ ]  Image zoom + caption reveal work on hover **and** keyboard focus
- [ ]  Video tiles show the play badge (no player/lightbox opens)
- [ ]  Sidebar `Gallery` anchor still scrolls correctly
- [ ]  `prefers-reduced-motion`: no transform/mask; content fully visible
- [ ]  Zero ESLint / TS errors

<aside>
🧩

**Assumptions to reconcile:** `@/components/ui` (`Heading`, `Text`) and `@/lib/animation` (`staggerContainer`, `childVariants`, `reveal`) export as used; `cn` from `@/utils/cn`; Tailwind `motion-reduce:` variant enabled (default). Media at `/public/images/projects/<slug>-gallery-*`. Video items are thumbnails only. All media is placeholder. If a name differs, only import lines change.

</aside>

<aside>
🛑

**STOP — Phase 07E complete. Awaiting approval before Phase 07F.** I author these as Notion pages but can't run `lint`/`tsc`/`build` myself — run the verify block and paste any errors and I'll fix the exact file(s).

</aside>