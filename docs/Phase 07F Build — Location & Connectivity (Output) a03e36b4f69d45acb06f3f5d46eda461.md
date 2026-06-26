# Phase 07F Build — Location & Connectivity (Output)

<aside>
📍

**Phase 07F — Location & Connectivity.** A premium editorial split section that argues *why the address is valuable* — accessibility, nearby destinations, and neighbourhood quality — **not** an interactive map. Left: heading, description, connectivity summary, nearby destination categories. Right: a static location image, a static (non-interactive) map placeholder, and key travel metrics. Seven new pure, strictly-typed, CMS-ready components under `components/project/location/`, bound to the **single** `Project` interface via one *optional additive* field that **reuses** the existing `LocationInfo` + `ProjectImage`. Motion is **Phase 03 only**. Phases 07A–07E untouched; the only 07A edits are the sanctioned `ProjectLayout` integration + barrel re-export.

</aside>

## 1. Files in this phase

```jsx
lib/
  project.ts                       # EXTENDED (additive + optional) — location/connectivity types + placeholder builder
components/project/location/
  ProjectLocationSection.tsx       # Section shell + split layout, motion root (client)
  LocationContent.tsx              # Left column: heading, description, connectivity, destinations (client)
  ConnectivityHighlights.tsx       # Connectivity summary list, staggered (client)
  DestinationCategories.tsx        # Nearby destination categories, nested stagger (client)
  DestinationCard.tsx              # One destination row: name + distance + time (pure)
  TravelMetric.tsx                 # One key travel metric card (pure)
  LocationMapPlaceholder.tsx       # Static, NON-interactive map placeholder (pure)
  index.ts                         # Barrel
components/project/
  ProjectLayout.tsx                # EDITED — integrate section after Gallery
  index.ts                         # EDITED — re-export ./location
```

<aside>
🧭

**Design decisions (sanity-check against the freeze):**

1. **One optional additive field that reuses location types.** The existing `location: LocationInfo` carries only city/country/address/coordinates. The section also needs editorial copy, a connectivity summary, destination categories, and travel metrics. So `lib/project.ts` gains a few new types + one **optional** `Project.locationContent?` field. The new section still consumes the existing `project.location` (`LocationInfo`) for the address — reusing it, not duplicating it. No existing field is renamed, removed, or changed.
2. **No duplicate models.** The static location image + map placeholder reuse `ProjectImage`; the address reuses `LocationInfo`. Only genuinely new shapes are added (`NearbyDestination`, `DestinationCategory`, `ConnectivityHighlight`, `TravelMetricData`, `ProjectLocationData`).
3. **No interactive map.** `LocationMapPlaceholder` is a **static** block — an optional static map image with an address label overlay. No map SDK, tiles, directions, or route planning.
4. **Frozen 07A component stays intact.** `ProjectLocation.tsx` (07A) is **not edited or deleted** — only its dynamic import/usage leaves `ProjectLayout`.
5. **Anchor + placement.** New section keeps `id="location"` (sidebar anchor preserved) and stays directly after Gallery. `PROJECT_SECTIONS` is unchanged.
</aside>

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Heading`, `Text` (tones `primary`/`muted`/`subtle`/`accent`). `@/lib/animation` exports `staggerContainer`, `childVariants` (fade-up), `reveal` (mask). Global `MotionConfig reducedMotion="user"` (Phase 03) covers reduced motion. `cn` from `@/utils/cn`. Location/map images live under `/public/images/projects/`. Placeholder data only. If a name differs, only the import line changes.

</aside>

<aside>
📑

Delivered in **two parts**. **Part 1** (below) = the additive `lib/project.ts` extension + the three pure components (`DestinationCard`, `TravelMetric`, `LocationMapPlaceholder`). **Part 2** = `LocationContent`, `ConnectivityHighlights`, `DestinationCategories`, the `ProjectLocationSection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/project.ts` — additive extension (new optional types + placeholder builder)

**Add these types** (nothing existing is touched):

```tsx
// --- Phase 07F — location & connectivity content (additive, optional) -----
export type DestinationCategoryId =
	| "education"
	| "healthcare"
	| "retail"
	| "business"
	| "transport"
	| "recreation"

export type NearbyDestination = {
	id: string
	name: string
	distance: string // e.g. "1.8 km"
	travelTime: string // e.g. "5 min"
}

export type DestinationCategory = {
	id: DestinationCategoryId
	label: string
	destinations: NearbyDestination[]
}

export type ConnectivityHighlight = {
	id: string
	label: string
	detail?: string
}

export type TravelMetricData = {
	id: string
	label: string // e.g. "Airport"
	value: string // e.g. "25 min"
	detail?: string // e.g. "by car"
}

export type ProjectLocationData = {
	eyebrow: string
	heading: string
	description: string
	connectivitySummary: ConnectivityHighlight[]
	destinationCategories: DestinationCategory[]
	travelMetrics: TravelMetricData[]
	image: ProjectImage // static location image (reuses ProjectImage)
	mapImage?: ProjectImage // optional static map placeholder image (reuses ProjectImage)
}
```

**Add one optional field to the existing `Project` type** (shown here after `location`):

```tsx
location: LocationInfo
locationContent?: ProjectLocationData // ← Phase 07F (optional, additive)
```

**Add the placeholder builder + shared fixtures**, then populate it inside the existing `buildProject` factory (one new line):

```tsx
const sharedConnectivity: ConnectivityHighlight[] = [
	{ id: "metro", label: "Direct metro access", detail: "Two lines within walking distance" },
	{ id: "highway", label: "Major highway in 5 minutes" },
	{ id: "airport", label: "International airport under 30 minutes" },
	{ id: "walk", label: "Walkable to retail, dining, and parks" },
]

const sharedDestinationCategories: DestinationCategory[] = [
	{
		id: "education",
		label: "Education",
		destinations: [
			{ id: "edu-1", name: "International School", distance: "1.8 km", travelTime: "5 min" },
			{ id: "edu-2", name: "University Campus", distance: "4.2 km", travelTime: "11 min" },
		],
	},
	{
		id: "healthcare",
		label: "Healthcare",
		destinations: [
			{ id: "health-1", name: "General Hospital", distance: "2.6 km", travelTime: "7 min" },
			{ id: "health-2", name: "Specialist Clinic", distance: "1.2 km", travelTime: "4 min" },
		],
	},
	{
		id: "retail",
		label: "Retail",
		destinations: [
			{ id: "retail-1", name: "Luxury Mall", distance: "3.0 km", travelTime: "8 min" },
			{ id: "retail-2", name: "Boutique District", distance: "0.9 km", travelTime: "3 min" },
		],
	},
	{
		id: "business",
		label: "Business",
		destinations: [
			{ id: "biz-1", name: "Financial District", distance: "5.1 km", travelTime: "12 min" },
			{ id: "biz-2", name: "Tech Park", distance: "6.4 km", travelTime: "15 min" },
		],
	},
	{
		id: "transport",
		label: "Transport",
		destinations: [
			{ id: "trans-1", name: "Metro Station", distance: "0.4 km", travelTime: "4 min" },
			{ id: "trans-2", name: "International Airport", distance: "18 km", travelTime: "25 min" },
		],
	},
	{
		id: "recreation",
		label: "Recreation",
		destinations: [
			{ id: "rec-1", name: "Central Park", distance: "0.7 km", travelTime: "3 min" },
			{ id: "rec-2", name: "Marina & Beach", distance: "4.8 km", travelTime: "12 min" },
		],
	},
]

const sharedTravelMetrics: TravelMetricData[] = [
	{ id: "airport", label: "Airport", value: "25 min", detail: "by car" },
	{ id: "metro", label: "Metro", value: "4 min", detail: "on foot" },
	{ id: "city", label: "City Centre", value: "15 min", detail: "by car" },
	{ id: "business", label: "Business District", value: "12 min", detail: "by car" },
]

function buildLocationContent(seed: ProjectSeed): ProjectLocationData {
	return {
		eyebrow: "Location & connectivity",
		heading: "Connected to everything that matters",
		description:
			"A central address where culture, commerce, and nature meet — minutes from the city, moments from the everyday.",
		connectivitySummary: sharedConnectivity,
		destinationCategories: sharedDestinationCategories,
		travelMetrics: sharedTravelMetrics,
		image: img(`/images/projects/${seed.slug}-location.jpg`, `${seed.title} neighbourhood`, 1200, 900),
		mapImage: img(`/images/projects/${seed.slug}-map.jpg`, `${seed.title} location map`, 1200, 800),
	}
}
```

```tsx
// Inside the existing buildProject(seed) return object, add ONE line
// (next to the other Phase 07 content builders):
		location: buildLocation(seed),
		locationContent: buildLocationContent(seed), // ← Phase 07F
```

<aside>
🧩

**Why this respects the freeze.** Everything is *added*: `location`, `buildProject`'s other lines, `PROJECT_SECTIONS`, and all helpers are byte-for-byte unchanged. `locationContent` is optional → a CMS record without it still type-checks and the section simply doesn't render. The address reuses `LocationInfo`; images reuse `ProjectImage` — no duplicate models.

</aside>

---

## 3. `DestinationCard.tsx` — one destination row (pure)

```tsx
import { Text } from "@/components/ui"
import type { NearbyDestination } from "@/lib/project"
import { cn } from "@/utils/cn"

type DestinationCardProps = {
	destination: NearbyDestination
	className?: string
}

// Pure row: name on the left, distance + travel time on the right. Rendered
// inside a category's <ul>; motion is applied by the parent list.
export function DestinationCard({ destination, className }: DestinationCardProps) {
	return (
		<li
			className={cn(
				"flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-b-0",
				className,
			)}
		>
			<Text size="sm" className="text-text-primary">
				{destination.name}
			</Text>
			<div className="flex shrink-0 items-center gap-3">
				<Text size="sm" tone="muted">
					{destination.distance}
				</Text>
				<Text size="sm" tone="accent">
					{destination.travelTime}
				</Text>
			</div>
		</li>
	)
}
```

---

## 4. `TravelMetric.tsx` — one key travel metric card (pure)

```tsx
import { Text } from "@/components/ui"
import type { TravelMetricData } from "@/lib/project"
import { cn } from "@/utils/cn"

type TravelMetricProps = {
	metric: TravelMetricData
	className?: string
}

// Pure metric card: label, prominent value, optional detail. Reused in the
// right-column metrics grid; motion is applied by the parent.
export function TravelMetric({ metric, className }: TravelMetricProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-1 rounded-2xl border border-border bg-bg-elevated p-4",
				className,
			)}
		>
			<Text size="sm" tone="muted">
				{metric.label}
			</Text>
			<Text size="lg" className="font-display-sans font-semibold text-accent-gold">
				{metric.value}
			</Text>
			{metric.detail ? (
				<Text size="sm" tone="subtle">
					{metric.detail}
				</Text>
			) : null}
		</div>
	)
}
```

---

## 5. `LocationMapPlaceholder.tsx` — static, non-interactive map placeholder (pure)

```tsx
import Image from "next/image"
import { Text } from "@/components/ui"
import type { LocationInfo, ProjectImage } from "@/lib/project"
import { cn } from "@/utils/cn"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type LocationMapPlaceholderProps = {
	location: LocationInfo
	image?: ProjectImage
	className?: string
}

// Static, NON-interactive map placeholder. Renders a static map image when one
// is provided (next/image, blur, fixed aspect = zero CLS), with an address
// label overlay. No map SDK, tiles, directions, or interactivity (per scope).
export function LocationMapPlaceholder({ location, image, className }: LocationMapPlaceholderProps) {
	return (
		<div
			className={cn(
				"relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-bg-elevated",
				className,
			)}
		>
			{image ? (
				<Image
					src={image.src}
					alt={image.alt}
					fill
					loading="lazy"
					placeholder="blur"
					blurDataURL={image.blurDataURL ?? FALLBACK_BLUR}
					sizes="(min-width: 1024px) 45vw, 100vw"
					className="object-cover"
				/>
			) : null}
			<div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-bg-base/90 to-transparent p-4">
				<svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-accent-gold">
					<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
				</svg>
				<Text size="sm" className="text-text-primary">
					{location.address}, {location.city}
				</Text>
			</div>
		</div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends `LocationContent`, `ConnectivityHighlights`, `DestinationCategories`, the `ProjectLocationSection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 6. `ConnectivityHighlights.tsx` — connectivity summary list (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { ConnectivityHighlight } from "@/lib/project"
import { cn } from "@/utils/cn"

type ConnectivityHighlightsProps = {
	highlights: ConnectivityHighlight[]
	className?: string
}

// Connectivity summary as a staggered list (fade-up per item). Inherits
// "visible" from the section. Decorative gold marker is aria-hidden.
export function ConnectivityHighlights({ highlights, className }: ConnectivityHighlightsProps) {
	if (highlights.length === 0) return null
	return (
		<motion.div variants={staggerContainer} className={cn("flex flex-col gap-3", className)}>
			<motion.div variants={childVariants}>
				<Heading level={3} size="sm">
					Connectivity
				</Heading>
			</motion.div>
			<motion.ul variants={staggerContainer} className="flex flex-col gap-2">
				{highlights.map((highlight) => (
					<motion.li key={highlight.id} variants={childVariants} className="flex items-start gap-2.5">
						<span
							aria-hidden="true"
							className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold/70"
						/>
						<Text size="sm" tone="muted">
							<span className="text-text-primary">{highlight.label}</span>
							{highlight.detail ? ` — ${highlight.detail}` : ""}
						</Text>
					</motion.li>
				))}
			</motion.ul>
		</motion.div>
	)
}
```

---

## 7. `DestinationCategories.tsx` — nearby destination categories (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading } from "@/components/ui"
import type { DestinationCategory } from "@/lib/project"
import { cn } from "@/utils/cn"
import { DestinationCard } from "./DestinationCard"

type DestinationCategoriesProps = {
	categories: DestinationCategory[]
	className?: string
}

// Nested stagger: each category (h4) fades up; within it, destination rows
// stagger (destination stagger). "Nearby destinations" is the h3 group label.
export function DestinationCategories({ categories, className }: DestinationCategoriesProps) {
	if (categories.length === 0) return null
	return (
		<motion.div variants={staggerContainer} className={cn("flex flex-col gap-6", className)}>
			<motion.div variants={childVariants}>
				<Heading level={3} size="sm">
					Nearby destinations
				</Heading>
			</motion.div>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				{categories.map((category) => (
					<motion.div
						key={category.id}
						variants={childVariants}
						className="flex flex-col gap-2 rounded-2xl border border-border bg-bg-elevated p-5"
					>
						<Heading level={4} size="sm">
							{category.label}
						</Heading>
						<motion.ul variants={staggerContainer} className="flex flex-col">
							{category.destinations.map((destination) => (
								<motion.div key={destination.id} variants={childVariants} className="contents">
									<DestinationCard destination={destination} />
								</motion.div>
							))}
						</motion.ul>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}
```

<aside>
🔎

`DestinationCard` is the semantic `<li>`. To animate each row without inserting a non-`li` child directly inside `<ul>`, the per-row `motion` wrapper uses `className="contents"` (`display: contents`) so it adds the stagger variant **without** introducing an extra box in the list layout or breaking `ul > li` semantics.

</aside>

---

## 8. `LocationContent.tsx` — left column (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { ConnectivityHighlight, DestinationCategory } from "@/lib/project"
import { cn } from "@/utils/cn"
import { ConnectivityHighlights } from "./ConnectivityHighlights"
import { DestinationCategories } from "./DestinationCategories"

type LocationContentProps = {
	eyebrow: string
	heading: string
	description: string
	connectivitySummary: ConnectivityHighlight[]
	destinationCategories: DestinationCategory[]
	className?: string
}

// Left column: editorial header (eyebrow + h2 reveal + description) then the
// connectivity summary and nearby destinations. Inherits "visible".
export function LocationContent({
	eyebrow,
	heading,
	description,
	connectivitySummary,
	destinationCategories,
	className,
}: LocationContentProps) {
	return (
		<div className={cn("flex flex-col gap-8", className)}>
			<div className="flex flex-col gap-4">
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
				<motion.div variants={childVariants}>
					<Text tone="muted" className="max-w-xl">
						{description}
					</Text>
				</motion.div>
			</div>
			<ConnectivityHighlights highlights={connectivitySummary} />
			<DestinationCategories categories={destinationCategories} />
		</div>
	)
}
```

---

## 9. `ProjectLocationSection.tsx` — section shell + split layout (client)

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { staggerContainer, childVariants, reveal } from "@/lib/animation"
import { Heading } from "@/components/ui"
import type { LocationInfo, ProjectLocationData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { LocationContent } from "./LocationContent"
import { LocationMapPlaceholder } from "./LocationMapPlaceholder"
import { TravelMetric } from "./TravelMetric"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectLocationSectionProps = {
	content: ProjectLocationData
	location: LocationInfo
	className?: string
}

// Single motion trigger (whileInView, once) propagates "visible" to the left
// column, the static image (reveal), the map placeholder, and the metrics grid.
// id="location" keeps the sidebar anchor working. No interactive map.
export function ProjectLocationSection({ content, location, className }: ProjectLocationSectionProps) {
	return (
		<motion.section
			id="location"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
				{/* Left: editorial content */}
				<LocationContent
					eyebrow={content.eyebrow}
					heading={content.heading}
					description={content.description}
					connectivitySummary={content.connectivitySummary}
					destinationCategories={content.destinationCategories}
				/>
				{/* Right: static image + map placeholder + travel metrics */}
				<motion.div variants={staggerContainer} className="flex flex-col gap-6">
					<motion.div
						variants={reveal}
						className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-bg-elevated"
					>
						<Image
							src={content.image.src}
							alt={content.image.alt}
							fill
							loading="lazy"
							placeholder="blur"
							blurDataURL={content.image.blurDataURL ?? FALLBACK_BLUR}
							sizes="(min-width: 1024px) 45vw, 100vw"
							className="object-cover"
						/>
					</motion.div>
					<motion.div variants={childVariants}>
						<LocationMapPlaceholder location={location} image={content.mapImage} />
					</motion.div>
					<motion.div variants={childVariants} className="flex flex-col gap-3">
						<Heading level={3} size="sm">
							Key travel times
						</Heading>
						<motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3">
							{content.travelMetrics.map((metric) => (
								<motion.div key={metric.id} variants={childVariants}>
									<TravelMetric metric={metric} />
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</motion.section>
	)
}
```

---

## 10. `components/project/location/index.ts` — barrel

```tsx
export { ProjectLocationSection } from "./ProjectLocationSection"
export { LocationContent } from "./LocationContent"
export { ConnectivityHighlights } from "./ConnectivityHighlights"
export { DestinationCategories } from "./DestinationCategories"
export { DestinationCard } from "./DestinationCard"
export { TravelMetric } from "./TravelMetric"
export { LocationMapPlaceholder } from "./LocationMapPlaceholder"
```

---

## 11. `ProjectLayout.tsx` — integrate after Gallery (the only 07A render edit)

Removes the old dynamically-imported `<ProjectLocation>` (import + usage) and places the new `<ProjectLocationSection>` directly after Gallery, passing both the new `locationContent` and the existing `location`. Everything else is unchanged.

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
import { ProjectLocationSection } from "./location"
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
							{project.locationContent ? (
								<ProjectLocationSection
									content={project.locationContent}
									location={project.location}
								/>
							) : null}
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

**Frozen-safe.** `ProjectLocation.tsx` (07A) is untouched on disk — only its dynamic import/usage leaves `ProjectLayout`. The Hero, full-bleed positioning, Overview + Amenities + Gallery sections, grid, sticky sidebar, and the remaining Investment→Downloads→Related order are unchanged.

</aside>

---

## 12. `components/project/index.ts` — re-export location (edit)

Append one line to the existing barrel (all existing exports left as-is):

```tsx
// …existing exports unchanged…
export * from "./overview"
export * from "./amenities"
export * from "./gallery"
export * from "./location"
```

---

## 13. Deliverable 3 — Component hierarchy

```jsx
ProjectLayout (main column, after Gallery)
 └── ProjectLocationSection           (client: motion.section, single whileInView)
      └── grid lg:grid-cols-2
           ├── [left] LocationContent      (client)
           │    ├── eyebrow + h2 reveal + description
           │    ├── ConnectivityHighlights (client: h3 + staggered list)
           │    └── DestinationCategories  (client: h3 + nested stagger)
           │         └── [per category h4] + <ul>
           │              └── DestinationCard (pure: <li> row)
           └── [right] flex column
                ├── static location image  (reveal mask)
                ├── LocationMapPlaceholder (pure: static, non-interactive)
                └── metrics grid (h3 + stagger)
                     └── TravelMetric      (pure: metric card)
```

- **7 components**, each single-purpose. The three leaf components (`DestinationCard`, `TravelMetric`, `LocationMapPlaceholder`) are **pure/SSR**; motion lives in the section + the client columns/lists.
- **Heading hierarchy**: Hero `h1` → section `h2` (heading) → `h3` ("Connectivity", "Nearby destinations", "Key travel times") → `h4` (each destination category label).

## 14. Deliverable 4 — CMS bindings

- One optional additive field: `Project.locationContent?: ProjectLocationData` — **no duplicate models, no changed/removed fields** (`location` is intact and still consumed for the address).
- Field-by-field: `eyebrow`/`heading`/`description` → `LocationContent`; `connectivitySummary[]` → `ConnectivityHighlights`; `destinationCategories[]` (each with `NearbyDestination[]` of name/distance/travelTime) → `DestinationCategories` → `DestinationCard`; `travelMetrics[]` → metrics grid → `TravelMetric`; `image` → static location image; `mapImage?` + existing `project.location` → `LocationMapPlaceholder`.
- **No hardcoded content** — every string/asset comes from data; placeholders live in `buildLocationContent(seed)`. Swap the placeholder block for a Sanity fetch returning this shape and nothing else changes.
- `locationContent` is **optional** → records without it still type-check; `ProjectLayout` guards the render. `ConnectivityHighlights` / `DestinationCategories` no-op on empty arrays.

## 15. Deliverable 5 — Animation approach (Phase 03 only)

- **One trigger**: the section is the only `whileInView` (`once: true`); framer propagates `"visible"` to descendants declaring `variants` (no child sets its own `initial`/`animate`).
- **Fade-up** = `childVariants` (eyebrow, description, connectivity items, category blocks, metrics). **Editorial reveal** = `reveal` mask on the h2 + the static location image. **Destination stagger** = nested `staggerContainer` (categories stagger; rows stagger within each). **Metric reveal** = nested `staggerContainer` on the metrics grid. All composed from existing Phase 03 variants — **no new infrastructure**, no interactive maps, no parallax, no pinning.
- **Reduced motion**: handled globally by Phase 03's `MotionConfig reducedMotion="user"` — transforms/masks collapse; content stays fully visible.

## 16. Deliverable 6 — Responsive behavior (zero CLS)

- **Mobile (`<640`)**: single column — left editorial content, then the right media/metrics stack; destination categories and metrics one-/two-up respectively.
- **Tablet (`640–1023`)**: still stacked split (left above right), but destination categories go two-up (`sm:grid-cols-2`); metrics stay two-up.
- **Desktop (`≥1024`)**: true editorial split (`lg:grid-cols-2 lg:gap-16`) — content left, static image + map placeholder + metrics right.
- **Zero CLS**: fixed-aspect boxes for the location image (`4/3`) and map placeholder (`16/10`) with `next/image` + blur placeholders + responsive `sizes`; the map overlay is absolutely positioned; `scroll-mt-28` keeps the `#location` anchor clean.

## 17. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders after Gallery on all three project routes
- [ ]  Editorial split on desktop; stacked on tablet/mobile
- [ ]  Connectivity summary, six destination categories (name/distance/time), four travel metrics all render
- [ ]  Static location image + static map placeholder render with zero layout shift
- [ ]  Map placeholder is **not** interactive (no tiles/SDK)
- [ ]  Sidebar `Location` anchor still scrolls correctly
- [ ]  Heading order: h1 → h2 → h3 → h4
- [ ]  `prefers-reduced-motion`: no transform/mask; content fully visible
- [ ]  Zero ESLint / TS errors

<aside>
🧩

**Assumptions to reconcile:** `@/components/ui` (`Heading`, `Text` with `accent`/`subtle` tones) and `@/lib/animation` (`staggerContainer`, `childVariants`, `reveal`) export as used; `cn` from `@/utils/cn`. Location/map images at `/public/images/projects/<slug>-location.jpg` and `<slug>-map.jpg`. All content is placeholder. If a name differs, only import lines change.

</aside>

<aside>
🛑

**STOP — Phase 07F complete. Awaiting approval before Phase 07G.** I author these as Notion pages but can't run `lint`/`tsc`/`build` myself — run the verify block and paste any errors and I'll fix the exact file(s).

</aside>