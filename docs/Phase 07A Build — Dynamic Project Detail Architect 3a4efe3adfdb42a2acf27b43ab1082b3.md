# Phase 07A Build — Dynamic Project Detail Architecture (Output)

<aside>
🏙️

**Phase 07A — Dynamic Project Detail Architecture.** One reusable, data-driven template that renders *every* project (luxury residential, commercial, master community, fractional, tokenized) from CMS data alone — **no duplicate page templates**. A single dynamic route `app/projects/[slug]` generates all pages via `generateStaticParams`. 15 pure, prop-driven, strictly-typed, independently-testable components compose the page in the exact required order, with breadcrumbs, sticky section navigation, and previous/next support. Motion is **minimal Phase 03 fades only** — no cinematic animation, gallery interactions, or map animation. The frozen homepage is untouched (this phase adds only new files under `components/project/`, `lib/project.ts`, and `app/projects/[slug]/`).

</aside>

## 1. Files in this phase

```jsx
lib/
  project.ts                    # Comprehensive CMS model + placeholder data + routing helpers
components/project/
  ProjectSection.tsx            # Reusable section shell (anchor id, heading, minimal fade)
  ProjectBreadcrumb.tsx         # Accessible breadcrumb nav
  ProjectHeroShell.tsx          # Hero shell (placeholder treatment, no final visuals)
  QuickFacts.tsx                # Compact key-facts strip
  ProjectOverview.tsx           # Overview paragraphs
  ProjectHighlights.tsx         # Key highlights grid
  ProjectAmenities.tsx          # Grouped amenities
  ProjectLocation.tsx           # Address + map placeholder (no interactive map)
  ProjectGallery.tsx            # Image grid (no lightbox)
  ProjectInvestment.tsx         # Ownership model, minimums, documents
  ProjectDownloads.tsx          # Brochures + floor plans
  RelatedProjects.tsx           # Related project cards
  ProjectFinalCTA.tsx           # Project-scoped CTA (separate from frozen homepage FinalCTA)
  ProjectSidebar.tsx            # Sticky section nav + previous/next
  ProjectLayout.tsx             # Orchestrator (order + 2-col layout + dynamic imports)
  index.ts                      # Barrel
app/projects/[slug]/
  page.tsx                      # Dynamic route (generateStaticParams + notFound)
```

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Container`, `Heading`, `Text`, `Button` (with `asChild`), and `Badge`. `@/lib/animation` exports `staggerContainer` and `childVariants` (fade-up). Placeholder media live under `/public/images/projects/`. SEO data is *modeled* now but `generateMetadata` is intentionally **not** wired (SEO is a later phase). The frozen homepage `FinalCTA` is **not** reused — a separate `ProjectFinalCTA` keeps the homepage architecture untouched. If a name differs, only the import line changes.

</aside>

<aside>
📑

Delivered in **three parts** to avoid truncation. **Part 1** (below) = the CMS model `lib/project.ts` + `ProjectSection` + `ProjectBreadcrumb`. **Part 2** = hero shell, quick facts, overview, highlights, amenities, location, gallery. **Part 3** = investment, downloads, related, project CTA, sidebar, layout orchestrator, barrel, the dynamic route, and the six deliverable explanations.

</aside>

---

## 2. `lib/project.ts` — comprehensive CMS model + placeholder data + helpers

```tsx
// Comprehensive, CMS-ready data model for project detail pages. A single
// Project shape powers every category through data alone — no duplicate
// templates. Production sources this from Sanity; here we ship typed
// placeholders with the exact shape the CMS returns.

export type ProjectCategory =
	| "residential"
	| "commercial"
	| "community"
	| "fractional"
	| "tokenized"

export type ProjectStatusValue =
	| "available"
	| "coming-soon"
	| "under-construction"
	| "sold-out"
	| "completed"

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
	residential: "Luxury Residential",
	commercial: "Commercial",
	community: "Master Community",
	fractional: "Fractional Ownership",
	tokenized: "Tokenized Asset",
}

export const STATUS_LABELS: Record<ProjectStatusValue, string> = {
	available: "Available",
	"coming-soon": "Coming Soon",
	"under-construction": "Under Construction",
	"sold-out": "Sold Out",
	completed: "Completed",
}

export type ProjectImage = {
	src: string
	alt: string
	width: number
	height: number
	blurDataURL?: string
}

export type ProjectVideo = { src: string; poster?: string }

export type GeoCoordinates = { lat: number; lng: number }

export type LocationInfo = {
	city: string
	country: string
	address: string
	coordinates?: GeoCoordinates
}

export type ProjectMedia = {
	heroImage: ProjectImage
	heroVideo?: ProjectVideo
	gallery: ProjectImage[]
}

export type QuickFact = { id: string; label: string; value: string }

export type ProjectHighlight = { id: string; title: string; description: string }

export type ProjectAmenity = { id: string; label: string; group?: string }

export type ProjectDocument = {
	id: string
	title: string
	href: string
	fileType?: string
	fileSize?: string
}

export type InvestmentInfo = {
	ownershipModel: string
	minimumInvestment: string
	availability: string
	documents: ProjectDocument[]
}

export type DownloadsInfo = {
	brochures: ProjectDocument[]
	floorPlans: ProjectDocument[]
}

export type ProjectSeo = {
	title: string
	description: string
	ogImage?: ProjectImage
}

export type ProjectSummary = {
	id: string
	slug: string
	title: string
	subtitle?: string
	category: ProjectCategory
	status?: ProjectStatusValue
	heroImage: ProjectImage
}

export type Project = {
	// General
	id: string
	slug: string
	title: string
	subtitle: string
	status: ProjectStatusValue
	category: ProjectCategory
	// Location
	location: LocationInfo
	// Media
	media: ProjectMedia
	// Project
	overview: string[]
	quickFacts: QuickFact[]
	highlights: ProjectHighlight[]
	amenities: ProjectAmenity[]
	// Investment
	investment: InvestmentInfo
	// Downloads
	downloads: DownloadsInfo
	// SEO
	seo: ProjectSeo
	// Related
	relatedProjects: ProjectSummary[]
}

// Sticky section-navigation registry: drives ProjectSidebar links and each
// ProjectSection's anchor id (one source of truth).
export type ProjectSectionId =
	| "overview"
	| "highlights"
	| "amenities"
	| "location"
	| "gallery"
	| "investment"
	| "downloads"
	| "related"

export const PROJECT_SECTIONS: { id: ProjectSectionId; label: string }[] = [
	{ id: "overview", label: "Overview" },
	{ id: "highlights", label: "Highlights" },
	{ id: "amenities", label: "Amenities" },
	{ id: "location", label: "Location" },
	{ id: "gallery", label: "Gallery" },
	{ id: "investment", label: "Investment" },
	{ id: "downloads", label: "Downloads" },
	{ id: "related", label: "Related" },
]

// ---------------------------------------------------------------------------
// Placeholder content (CMS stand-in). Shared arrays keep the fixtures compact;
// production replaces this whole block with a Sanity fetch returning Project[].
// ---------------------------------------------------------------------------

function img(src: string, alt: string, width = 1600, height = 1067): ProjectImage {
	return { src, alt, width, height }
}

const sharedGallery: ProjectImage[] = [
	img("/images/projects/gallery-1.jpg", "Exterior elevation at dusk"),
	img("/images/projects/gallery-2.jpg", "Double-height lobby"),
	img("/images/projects/gallery-3.jpg", "Residence living space", 1200, 1200),
	img("/images/projects/gallery-4.jpg", "Landscaped amenity deck"),
]

const sharedHighlights: ProjectHighlight[] = [
	{ id: "design", title: "Award-calibre design", description: "A collaboration with internationally recognised architects and interior studios." },
	{ id: "location", title: "Connected location", description: "Minutes from cultural, retail, and business districts with seamless transit links." },
	{ id: "stewardship", title: "Professional stewardship", description: "End-to-end management and transparent reporting for every owner." },
]

const sharedAmenities: ProjectAmenity[] = [
	{ id: "pool", label: "Infinity pool", group: "Wellness" },
	{ id: "spa", label: "Spa & sauna", group: "Wellness" },
	{ id: "gym", label: "Fitness studio", group: "Wellness" },
	{ id: "concierge", label: "24/7 concierge", group: "Services" },
	{ id: "valet", label: "Valet parking", group: "Services" },
	{ id: "lounge", label: "Residents' lounge", group: "Social" },
	{ id: "garden", label: "Sky garden", group: "Social" },
]

const sharedDocuments: ProjectDocument[] = [
	{ id: "prospectus", title: "Investment prospectus", href: "/downloads/prospectus.pdf", fileType: "PDF", fileSize: "3.2 MB" },
	{ id: "terms", title: "Ownership terms", href: "/downloads/terms.pdf", fileType: "PDF", fileSize: "1.1 MB" },
]

const sharedDownloads: DownloadsInfo = {
	brochures: [
		{ id: "brochure", title: "Project brochure", href: "/downloads/brochure.pdf", fileType: "PDF", fileSize: "8.4 MB" },
	],
	floorPlans: [
		{ id: "floor-a", title: "Floor plan — Type A", href: "/downloads/floorplan-a.pdf", fileType: "PDF", fileSize: "2.0 MB" },
		{ id: "floor-b", title: "Floor plan — Type B", href: "/downloads/floorplan-b.pdf", fileType: "PDF", fileSize: "2.1 MB" },
	],
}

type ProjectSeed = {
	id: string
	slug: string
	title: string
	subtitle: string
	status: ProjectStatusValue
	category: ProjectCategory
	location: LocationInfo
	overview: string[]
	ownershipModel: string
	minimumInvestment: string
	availability: string
}

function buildProject(seed: ProjectSeed): Project {
	return {
		id: seed.id,
		slug: seed.slug,
		title: seed.title,
		subtitle: seed.subtitle,
		status: seed.status,
		category: seed.category,
		location: seed.location,
		media: {
			heroImage: img(`/images/projects/${seed.slug}-hero.jpg`, `${seed.title} hero`, 2400, 1350),
			gallery: sharedGallery,
		},
		overview: seed.overview,
		quickFacts: [
			{ id: "category", label: "Category", value: CATEGORY_LABELS[seed.category] },
			{ id: "status", label: "Status", value: STATUS_LABELS[seed.status] },
			{ id: "city", label: "City", value: seed.location.city },
			{ id: "ownership", label: "Ownership", value: seed.ownershipModel },
			{ id: "minimum", label: "From", value: seed.minimumInvestment },
			{ id: "availability", label: "Availability", value: seed.availability },
		],
		highlights: sharedHighlights,
		amenities: sharedAmenities,
		investment: {
			ownershipModel: seed.ownershipModel,
			minimumInvestment: seed.minimumInvestment,
			availability: seed.availability,
			documents: sharedDocuments,
		},
		downloads: sharedDownloads,
		seo: {
			title: `${seed.title} — Relcko`,
			description: seed.subtitle,
			ogImage: img(`/images/projects/${seed.slug}-og.jpg`, `${seed.title}`, 1200, 630),
		},
		relatedProjects: [],
	}
}

const seeds: ProjectSeed[] = [
	{
		id: "prj-aurelia",
		slug: "aurelia-residences",
		title: "Aurelia Residences",
		subtitle: "Sculptural waterfront living with private sky gardens.",
		status: "available",
		category: "residential",
		location: { city: "Dubai", country: "UAE", address: "Marasi Drive, Business Bay", coordinates: { lat: 25.1857, lng: 55.2645 } },
		overview: [
			"Aurelia Residences reframes waterfront living as a calm, light-filled retreat in the heart of the city.",
			"Each residence is finished to the millimetre, with floor-to-ceiling glazing and private outdoor space.",
		],
		ownershipModel: "Freehold",
		minimumInvestment: "$1.2M",
		availability: "Selling now",
	},
	{
		id: "prj-helix",
		slug: "helix-tower",
		title: "Helix Tower",
		subtitle: "A fractional-ownership landmark for the modern investor.",
		status: "under-construction",
		category: "fractional",
		location: { city: "Lisbon", country: "Portugal", address: "Avenida da Liberdade 200", coordinates: { lat: 38.7223, lng: -9.1393 } },
		overview: [
			"Helix Tower opens premium real estate to more owners through transparent fractional shares.",
			"Professional management and clear reporting make ownership effortless from anywhere.",
		],
		ownershipModel: "Fractional (1/8 shares)",
		minimumInvestment: "$180K",
		availability: "Phase 1 open",
	},
	{
		id: "prj-meridian",
		slug: "meridian-exchange",
		title: "Meridian Exchange",
		subtitle: "Tokenized commercial assets with on-chain transparency.",
		status: "coming-soon",
		category: "tokenized",
		location: { city: "Singapore", country: "Singapore", address: "Raffles Quay, Downtown Core", coordinates: { lat: 1.2806, lng: 103.8507 } },
		overview: [
			"Meridian Exchange brings institutional-grade commercial real estate on-chain.",
			"Tokenized ownership delivers liquidity and transparency without compromising quality.",
		],
		ownershipModel: "Tokenized (security tokens)",
		minimumInvestment: "$25K",
		availability: "Register interest",
	},
]

function toSummary(project: Project): ProjectSummary {
	return {
		id: project.id,
		slug: project.slug,
		title: project.title,
		subtitle: project.subtitle,
		category: project.category,
		status: project.status,
		heroImage: project.media.heroImage,
	}
}

const projects: Project[] = seeds.map(buildProject)

// Each project relates to the others (placeholder logic).
const allSummaries: ProjectSummary[] = projects.map(toSummary)
for (const project of projects) {
	project.relatedProjects = allSummaries.filter((s) => s.slug !== project.slug)
}

// --- Routing / data-access helpers ----------------------------------------

export function getAllProjects(): Project[] {
	return projects
}

export function getProjectSlugs(): string[] {
	return projects.map((p) => p.slug)
}

export function getProjectBySlug(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string): {
	previous?: ProjectSummary
	next?: ProjectSummary
} {
	const index = projects.findIndex((p) => p.slug === slug)
	if (index === -1) return {}
	const prev = index > 0 ? projects[index - 1] : undefined
	const next = index < projects.length - 1 ? projects[index + 1] : undefined
	return {
		previous: prev ? toSummary(prev) : undefined,
		next: next ? toSummary(next) : undefined,
	}
}
```

<aside>
🧩

**One shape, every category.** `Project` covers all eight CMS groups from the brief (General, Location, Media, Project, Investment, Downloads, SEO, Related). The `buildProject` factory + shared fixtures keep placeholders compact; swapping the placeholder block for a Sanity fetch that returns `Project[]` is the only change for production. `PROJECT_SECTIONS` is the single source of truth shared by the section anchors and the sticky sidebar.

</aside>

---

## 3. `ProjectSection.tsx` — reusable section shell (client, minimal fade)

```tsx
"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectSectionProps = {
	id: string
	title: string
	eyebrow?: string
	description?: string
	headingLevel?: 2 | 3
	className?: string
	contentClassName?: string
	children: ReactNode
}

// Every detail section reuses this shell: a semantic <section> with a stable
// anchor id (for the sticky nav), scroll-margin, a heading, and a minimal
// fade-up on enter. No cinematic motion — just Phase 03 fade.
export function ProjectSection({
	id,
	title,
	eyebrow,
	description,
	headingLevel = 2,
	className,
	contentClassName,
	children,
}: ProjectSectionProps) {
	return (
		<motion.section
			id={id}
			aria-label={title}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-14 md:py-20", className)}
		>
			<motion.div variants={childVariants} className="flex flex-col gap-3">
				{eyebrow ? (
					<span className="font-display-sans text-xs uppercase tracking-[0.24em] text-accent-gold">
						{eyebrow}
					</span>
				) : null}
				<Heading level={headingLevel} size="lg">
					{title}
				</Heading>
				{description ? (
					<Text tone="muted" className="max-w-2xl">
						{description}
					</Text>
				) : null}
			</motion.div>
			<motion.div variants={childVariants} className={cn("mt-8", contentClassName)}>
				{children}
			</motion.div>
		</motion.section>
	)
}
```

---

## 4. `ProjectBreadcrumb.tsx` — accessible breadcrumb nav (pure)

```tsx
import { cn } from "@/utils/cn"

export type Crumb = { label: string; href?: string }

type ProjectBreadcrumbProps = {
	items: Crumb[]
	className?: string
}

// Semantic breadcrumb: <nav> + ordered list, last item marked aria-current.
export function ProjectBreadcrumb({ items, className }: ProjectBreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
			<ol className="flex flex-wrap items-center gap-2 text-text-muted">
				{items.map((item, index) => {
					const isLast = index === items.length - 1
					return (
						<li key={`${item.label}-${index}`} className="flex items-center gap-2">
							{item.href && !isLast ? (
								<a
									href={item.href}
									className="transition-colors hover:text-text-primary focus:outline-none focus-visible:text-text-primary"
								>
									{item.label}
								</a>
							) : (
								<span
									aria-current={isLast ? "page" : undefined}
									className={isLast ? "text-text-primary" : undefined}
								>
									{item.label}
								</span>
							)}
							{!isLast ? (
								<span aria-hidden="true" className="text-text-muted/50">
									/
								</span>
							) : null}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
```

<aside>
⏭️

Part 2 (next) appends the hero shell, quick facts, overview, highlights, amenities, location, and gallery sections.

</aside>

---

## 5. `ProjectHeroShell.tsx` — hero shell, placeholder treatment (client)

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text, Badge } from "@/components/ui"
import { CATEGORY_LABELS, STATUS_LABELS, type Project } from "@/lib/project"
import { cn } from "@/utils/cn"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type ProjectHeroShellProps = {
	project: Project
	className?: string
}

// Structural hero only — final cinematic visuals arrive in a later phase. Image
// is a placeholder with a gradient scrim so the title/subtitle stay legible.
export function ProjectHeroShell({ project, className }: ProjectHeroShellProps) {
	const { media, title, subtitle, location, category, status } = project
	return (
		<motion.header
			variants={staggerContainer}
			initial="hidden"
			animate="visible"
			className={cn(
				"relative overflow-hidden rounded-3xl border border-border bg-bg-elevated",
				className,
			)}
		>
			<div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
				<Image
					src={media.heroImage.src}
					alt={media.heroImage.alt}
					fill
					priority
					sizes="100vw"
					placeholder="blur"
					blurDataURL={media.heroImage.blurDataURL ?? FALLBACK_BLUR}
					className="object-cover"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent"
				/>
			</div>
			<motion.div
				variants={childVariants}
				className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:p-10"
			>
				<div className="flex flex-wrap items-center gap-2">
					<Badge>{CATEGORY_LABELS[category]}</Badge>
					<Badge>{STATUS_LABELS[status]}</Badge>
				</div>
				<Heading level={1} size="xl" className="text-balance">
					{title}
				</Heading>
				<Text size="lg" tone="muted" className="max-w-2xl">
					{subtitle}
				</Text>
				<Text size="sm" tone="subtle">
					{location.city}, {location.country}
				</Text>
			</motion.div>
		</motion.header>
	)
}
```

<aside>
🏗️

Hero is a **shell**, per the brief — no final cinematic visuals. It uses `priority` (above the fold), a blur placeholder, and a fixed aspect ratio so there's zero layout shift. `heroVideo` is modeled in the CMS but intentionally not rendered yet.

</aside>

---

## 6. `QuickFacts.tsx` — compact key-facts strip (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Text } from "@/components/ui"
import type { QuickFact } from "@/lib/project"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-10% 0px" } as const

type QuickFactsProps = {
	items: QuickFact[]
	className?: string
}

// Semantic description list of headline facts; each cell fades up on a stagger.
export function QuickFacts({ items, className }: QuickFactsProps) {
	return (
		<motion.dl
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			aria-label="Quick facts"
			className={cn(
				"grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 lg:grid-cols-6",
				className,
			)}
		>
			{items.map((fact) => (
				<motion.div
					key={fact.id}
					variants={childVariants}
					className="flex flex-col gap-1 bg-bg-base p-4"
				>
					<dt>
						<Text size="sm" tone="subtle" className="uppercase tracking-[0.16em]">
							{fact.label}
						</Text>
					</dt>
					<dd>
						<Text size="sm" className="font-medium text-text-primary">
							{fact.value}
						</Text>
					</dd>
				</motion.div>
			))}
		</motion.dl>
	)
}
```

---

## 7. `ProjectOverview.tsx` — overview paragraphs

```tsx
import { Text } from "@/components/ui"
import { ProjectSection } from "./ProjectSection"

type ProjectOverviewProps = {
	overview: string[]
}

export function ProjectOverview({ overview }: ProjectOverviewProps) {
	return (
		<ProjectSection id="overview" eyebrow="Overview" title="Project overview">
			<div className="flex max-w-3xl flex-col gap-4">
				{overview.map((paragraph, index) => (
					<Text key={index} tone="muted">
						{paragraph}
					</Text>
				))}
			</div>
		</ProjectSection>
	)
}
```

---

## 8. `ProjectHighlights.tsx` — key highlights grid

```tsx
import { Heading, Text } from "@/components/ui"
import type { ProjectHighlight } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

type ProjectHighlightsProps = {
	highlights: ProjectHighlight[]
}

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
	return (
		<ProjectSection id="highlights" eyebrow="Key highlights" title="What sets it apart">
			<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{highlights.map((highlight) => (
					<li
						key={highlight.id}
						className="flex flex-col gap-2 rounded-2xl border border-border bg-bg-elevated p-6"
					>
						<Heading level={3} size="sm">
							{highlight.title}
						</Heading>
						<Text size="sm" tone="muted">
							{highlight.description}
						</Text>
					</li>
				))}
			</ul>
		</ProjectSection>
	)
}
```

---

## 9. `ProjectAmenities.tsx` — grouped amenities

```tsx
import { Heading, Text } from "@/components/ui"
import type { ProjectAmenity } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

type ProjectAmenitiesProps = {
	amenities: ProjectAmenity[]
}

// Groups amenities by their optional `group`, falling back to "General".
function groupAmenities(items: ProjectAmenity[]): Record<string, ProjectAmenity[]> {
	const groups: Record<string, ProjectAmenity[]> = {}
	for (const item of items) {
		const key = item.group ?? "General"
		const list = groups[key] ?? []
		list.push(item)
		groups[key] = list
	}
	return groups
}

export function ProjectAmenities({ amenities }: ProjectAmenitiesProps) {
	const groups = groupAmenities(amenities)
	return (
		<ProjectSection id="amenities" eyebrow="Amenities" title="Amenities & services">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{Object.entries(groups).map(([group, items]) => (
					<div key={group} className="flex flex-col gap-3">
						<Heading level={3} size="sm">
							{group}
						</Heading>
						<ul className="flex flex-col gap-2">
							{items.map((amenity) => (
								<li key={amenity.id} className="flex items-center gap-2">
									<span
										aria-hidden="true"
										className="h-1.5 w-1.5 rounded-full bg-accent-gold/70"
									/>
									<Text size="sm" tone="muted">
										{amenity.label}
									</Text>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</ProjectSection>
	)
}
```

---

## 10. `ProjectLocation.tsx` — address + map placeholder (no interactive map)

```tsx
import { Heading, Text } from "@/components/ui"
import type { LocationInfo } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

type ProjectLocationProps = {
	location: LocationInfo
}

export function ProjectLocation({ location }: ProjectLocationProps) {
	return (
		<ProjectSection id="location" eyebrow="Location" title="Where you'll be">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="flex flex-col gap-3">
					<Heading level={3} size="sm">
						{location.city}, {location.country}
					</Heading>
					<Text size="sm" tone="muted">
						{location.address}
					</Text>
					{location.coordinates ? (
						<Text size="sm" tone="subtle">
							{location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
						</Text>
					) : null}
				</div>
				<div
					aria-hidden="true"
					className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-border bg-bg-elevated lg:col-span-2"
				>
					<Text size="sm" tone="subtle">
						Map placeholder — interactive map arrives in a later phase
					</Text>
				</div>
			</div>
		</ProjectSection>
	)
}
```

<aside>
🗺️

Per the brief, **no interactive map and no map animation**. The map area is a fixed-aspect placeholder box; a real map provider is wired in a later phase. Coordinates are already in the CMS model, ready for it.

</aside>

---

## 11. `ProjectGallery.tsx` — image grid (no lightbox)

```tsx
import Image from "next/image"
import type { ProjectImage } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type ProjectGalleryProps = {
	images: ProjectImage[]
}

// Static grid — no lightbox, no hover interactions (those arrive in a later
// phase). Each tile reserves a fixed aspect ratio for zero layout shift.
export function ProjectGallery({ images }: ProjectGalleryProps) {
	return (
		<ProjectSection id="gallery" eyebrow="Gallery" title="A visual tour">
			<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{images.map((image) => (
					<li
						key={image.src}
						className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-elevated"
					>
						<Image
							src={image.src}
							alt={image.alt}
							fill
							loading="lazy"
							placeholder="blur"
							blurDataURL={image.blurDataURL ?? FALLBACK_BLUR}
							sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
							className="object-cover"
						/>
					</li>
				))}
			</ul>
		</ProjectSection>
	)
}
```

<aside>
⏭️

Part 3 (next) appends investment, downloads, related projects, the project CTA, the sidebar, the layout orchestrator, the barrel, the dynamic route, and the six deliverable explanations.

</aside>

---

## 12. `ProjectInvestment.tsx` — ownership model, minimums, documents

```tsx
import { Heading, Text } from "@/components/ui"
import type { InvestmentInfo } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

type ProjectInvestmentProps = {
	investment: InvestmentInfo
}

export function ProjectInvestment({ investment }: ProjectInvestmentProps) {
	const facts = [
		{ label: "Ownership model", value: investment.ownershipModel },
		{ label: "Minimum investment", value: investment.minimumInvestment },
		{ label: "Availability", value: investment.availability },
	]
	return (
		<ProjectSection id="investment" eyebrow="Investment" title="Investment information">
			<div className="flex flex-col gap-8">
				<dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{facts.map((fact) => (
						<div
							key={fact.label}
							className="flex flex-col gap-1 rounded-2xl border border-border bg-bg-elevated p-5"
						>
							<dt>
								<Text size="sm" tone="subtle" className="uppercase tracking-[0.16em]">
									{fact.label}
								</Text>
							</dt>
							<dd>
								<Text className="font-medium text-text-primary">{fact.value}</Text>
							</dd>
						</div>
					))}
				</dl>
				{investment.documents.length > 0 ? (
					<div className="flex flex-col gap-3">
						<Heading level={3} size="sm">
							Investment documents
						</Heading>
						<ul className="flex flex-col gap-2">
							{investment.documents.map((doc) => (
								<li key={doc.id}>
									<a
										href={doc.href}
										className="inline-flex items-center gap-2 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
									>
										<Text size="sm" tone="accent">
											{doc.title}
										</Text>
										{doc.fileType ? (
											<Text size="sm" tone="subtle">
												({doc.fileType}
												{doc.fileSize ? ` · ${doc.fileSize}` : ""})
											</Text>
										) : null}
									</a>
								</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</ProjectSection>
	)
}
```

---

## 13. `ProjectDownloads.tsx` — brochures + floor plans

```tsx
import { Heading, Text } from "@/components/ui"
import type { DownloadsInfo, ProjectDocument } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

function DownloadList({ title, documents }: { title: string; documents: ProjectDocument[] }) {
	if (documents.length === 0) return null
	return (
		<div className="flex flex-col gap-3">
			<Heading level={3} size="sm">
				{title}
			</Heading>
			<ul className="flex flex-col gap-2">
				{documents.map((doc) => (
					<li
						key={doc.id}
						className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-elevated px-4 py-3"
					>
						<Text size="sm" className="text-text-primary">
							{doc.title}
						</Text>
						<a
							href={doc.href}
							download
							className="text-sm text-accent-gold underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
						>
							Download{doc.fileSize ? ` · ${doc.fileSize}` : ""}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

type ProjectDownloadsProps = {
	downloads: DownloadsInfo
}

export function ProjectDownloads({ downloads }: ProjectDownloadsProps) {
	return (
		<ProjectSection id="downloads" eyebrow="Downloads" title="Brochures & floor plans">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				<DownloadList title="Brochures" documents={downloads.brochures} />
				<DownloadList title="Floor plans" documents={downloads.floorPlans} />
			</div>
		</ProjectSection>
	)
}
```

---

## 14. `RelatedProjects.tsx` — related project cards

```tsx
import Image from "next/image"
import { Heading, Text } from "@/components/ui"
import { CATEGORY_LABELS, type ProjectSummary } from "@/lib/project"
import { ProjectSection } from "./ProjectSection"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type RelatedProjectsProps = {
	projects: ProjectSummary[]
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
	if (projects.length === 0) return null
	return (
		<ProjectSection id="related" eyebrow="Related" title="More opportunities">
			<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{projects.map((project) => (
					<li key={project.id}>
						<a
							href={`/projects/${project.slug}`}
							className="group flex flex-col gap-3 focus:outline-none"
						>
							<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-elevated">
								<Image
									src={project.heroImage.src}
									alt={project.heroImage.alt}
									fill
									loading="lazy"
									placeholder="blur"
									blurDataURL={project.heroImage.blurDataURL ?? FALLBACK_BLUR}
									sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
									className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<Text size="sm" tone="accent">
									{CATEGORY_LABELS[project.category]}
								</Text>
								<Heading
									level={3}
									size="sm"
									className="transition-colors group-hover:text-accent-gold group-focus-visible:text-accent-gold"
								>
									{project.title}
								</Heading>
								{project.subtitle ? (
									<Text size="sm" tone="muted">
										{project.subtitle}
									</Text>
								) : null}
							</div>
						</a>
					</li>
				))}
			</ul>
		</ProjectSection>
	)
}
```

---

## 15. `ProjectFinalCTA.tsx` — project-scoped CTA (separate from homepage)

```tsx
import { Heading, Text, Button } from "@/components/ui"
import type { Project } from "@/lib/project"

type ProjectFinalCTAProps = {
	project: Project
}

// Deliberately NOT the homepage FinalCTA (which is frozen). A lightweight,
// project-scoped conversion block; the inquiry form arrives in a later phase.
export function ProjectFinalCTA({ project }: ProjectFinalCTAProps) {
	return (
		<section
			aria-label={`Enquire about ${project.title}`}
			className="scroll-mt-28 rounded-3xl border border-border bg-bg-elevated p-8 text-center md:p-14"
		>
			<div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
				<Heading level={2} size="lg" className="text-balance">
					Interested in {project.title}?
				</Heading>
				<Text tone="muted" className="text-balance">
					Speak with our team to explore availability, ownership options, and next steps.
				</Text>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild variant="primary" size="lg">
						<a href="/contact">Contact Our Team</a>
					</Button>
					<Button asChild variant="secondary" size="lg">
						<a href="/projects">Explore Projects</a>
					</Button>
				</div>
			</div>
		</section>
	)
}
```

---

## 16. `ProjectSidebar.tsx` — sticky section nav + previous/next (pure)

```tsx
import { Text } from "@/components/ui"
import { PROJECT_SECTIONS, type ProjectSummary } from "@/lib/project"
import { cn } from "@/utils/cn"

type ProjectSidebarProps = {
	previous?: ProjectSummary
	next?: ProjectSummary
	className?: string
}

// Pure, JS-free navigation: in-page anchors (sticky via the layout wrapper) plus
// previous/next links. No scroll-spy yet (advanced interactions are out of scope).
export function ProjectSidebar({ previous, next, className }: ProjectSidebarProps) {
	return (
		<aside className={cn("flex flex-col gap-6", className)}>
			<nav aria-label="On this page" className="hidden lg:block">
				<Text size="sm" tone="subtle" className="mb-3 uppercase tracking-[0.16em]">
					On this page
				</Text>
				<ul className="flex flex-col gap-1 border-l border-border">
					{PROJECT_SECTIONS.map((section) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className="block border-l-2 border-transparent px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-accent-gold hover:text-text-primary focus:outline-none focus-visible:text-text-primary"
							>
								{section.label}
							</a>
						</li>
					))}
				</ul>
			</nav>
			{previous || next ? (
				<nav aria-label="Project navigation" className="flex flex-col gap-2">
					{previous ? (
						<a
							href={`/projects/${previous.slug}`}
							className="flex flex-col gap-0.5 rounded-xl border border-border p-3 transition-colors hover:border-accent-gold/60 focus:outline-none focus-visible:border-accent-gold"
						>
							<Text size="sm" tone="subtle">
								← Previous
							</Text>
							<Text size="sm" className="text-text-primary">
								{previous.title}
							</Text>
						</a>
					) : null}
					{next ? (
						<a
							href={`/projects/${next.slug}`}
							className="flex flex-col gap-0.5 rounded-xl border border-border p-3 text-right transition-colors hover:border-accent-gold/60 focus:outline-none focus-visible:border-accent-gold"
						>
							<Text size="sm" tone="subtle">
								Next →
							</Text>
							<Text size="sm" className="text-text-primary">
								{next.title}
							</Text>
						</a>
					) : null}
				</nav>
			) : null}
		</aside>
	)
}
```

---

## 17. `ProjectLayout.tsx` — orchestrator (order + 2-col layout + dynamic imports)

```tsx
import dynamic from "next/dynamic"
import { Container } from "@/components/ui"
import type { Project, ProjectSummary } from "@/lib/project"
import { ProjectBreadcrumb } from "./ProjectBreadcrumb"
import { ProjectHeroShell } from "./ProjectHeroShell"
import { QuickFacts } from "./QuickFacts"
import { ProjectOverview } from "./ProjectOverview"
import { ProjectHighlights } from "./ProjectHighlights"
import { ProjectAmenities } from "./ProjectAmenities"
import { ProjectInvestment } from "./ProjectInvestment"
import { ProjectDownloads } from "./ProjectDownloads"
import { ProjectFinalCTA } from "./ProjectFinalCTA"
import { ProjectSidebar } from "./ProjectSidebar"

// Height-reserving fallback keeps layout shift at zero while a section loads.
function SectionFallback({ label }: { label: string }) {
	return (
		<div
			aria-hidden="true"
			data-loading={label}
			className="min-h-[16rem] animate-pulse rounded-2xl border border-border bg-bg-elevated"
		/>
	)
}

// Below-the-fold sections are dynamically imported → smaller initial bundle,
// lazy hydration, placeholder fallbacks. (No ssr:false → still SSR'd, zero CLS.)
const ProjectLocation = dynamic(
	() => import("./ProjectLocation").then((m) => m.ProjectLocation),
	{ loading: () => <SectionFallback label="location" /> },
)
const ProjectGallery = dynamic(
	() => import("./ProjectGallery").then((m) => m.ProjectGallery),
	{ loading: () => <SectionFallback label="gallery" /> },
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
		<main className="bg-bg-base pb-24 pt-6 md:pt-10">
			<Container size="max">
				<div className="flex flex-col gap-8">
					<ProjectBreadcrumb items={crumbs} />
					<ProjectHeroShell project={project} />
					<QuickFacts items={project.quickFacts} />
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem]">
						<div className="flex flex-col">
							<ProjectOverview overview={project.overview} />
							<ProjectHighlights highlights={project.highlights} />
							<ProjectAmenities amenities={project.amenities} />
							<ProjectLocation location={project.location} />
							<ProjectGallery images={project.media.gallery} />
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
🧱

The orchestrator renders sections in the **exact brief order**: Hero → Quick Facts → Overview → Highlights → Amenities → Location → Gallery → Investment → Downloads → Related → Final CTA. Main content + sticky sidebar form a 2-column grid on desktop; the sidebar collapses above the content on mobile (`order-first`). `ProjectLocation`, `ProjectGallery`, and `RelatedProjects` are `next/dynamic` imports with height-reserving fallbacks.

</aside>

---

## 18. `index.ts` — barrel

```tsx
export { ProjectLayout } from "./ProjectLayout"
export { ProjectHeroShell } from "./ProjectHeroShell"
export { QuickFacts } from "./QuickFacts"
export { ProjectOverview } from "./ProjectOverview"
export { ProjectHighlights } from "./ProjectHighlights"
export { ProjectAmenities } from "./ProjectAmenities"
export { ProjectLocation } from "./ProjectLocation"
export { ProjectGallery } from "./ProjectGallery"
export { ProjectInvestment } from "./ProjectInvestment"
export { ProjectDownloads } from "./ProjectDownloads"
export { RelatedProjects } from "./RelatedProjects"
export { ProjectFinalCTA } from "./ProjectFinalCTA"
export { ProjectBreadcrumb } from "./ProjectBreadcrumb"
export { ProjectSidebar } from "./ProjectSidebar"
export { ProjectSection } from "./ProjectSection"
```

---

## 19. `app/projects/[slug]/page.tsx` — dynamic route

```tsx
import { notFound } from "next/navigation"
import { ProjectLayout } from "@/components/project"
import { getProjectBySlug, getProjectSlugs, getAdjacentProjects } from "@/lib/project"

type ProjectPageProps = {
	params: Promise<{ slug: string }>
}

// Pre-render every project at build time (SSG). New CMS projects appear by
// returning more slugs here — no new files, no hardcoded pages.
export function generateStaticParams() {
	return getProjectSlugs().map((slug) => ({ slug }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params
	const project = getProjectBySlug(slug)
	if (!project) {
		notFound()
	}
	const { previous, next } = getAdjacentProjects(slug)
	return <ProjectLayout project={project} previous={previous} next={next} />
}
```

<aside>
🛜

SEO is intentionally deferred: `generateMetadata` is **not** added here (it's a later phase), though `project.seo` already carries title / description / OG image, ready to wire up.

</aside>

---

## 20. Deliverable 3 — Component hierarchy

```jsx
app/projects/[slug]/page.tsx        (server: generateStaticParams + notFound)
 └── ProjectLayout                  (server: order + 2-col grid + dynamic imports)
      ├── ProjectBreadcrumb         (pure: Home / Projects / Title)
      ├── ProjectHeroShell          (client: hero shell, minimal fade)
      ├── QuickFacts                (client: key-facts strip, stagger)
      ├── [ main column ]
      │    ├── ProjectOverview      ┐
      │    ├── ProjectHighlights    │ each wraps ProjectSection
      │    ├── ProjectAmenities     │ (anchor id + heading + fade)
      │    ├── ProjectLocation      │  ← dynamic import
      │    ├── ProjectGallery       │  ← dynamic import
      │    ├── ProjectInvestment    │
      │    ├── ProjectDownloads     │
      │    └── RelatedProjects      ┘  ← dynamic import
      ├── ProjectSidebar            (pure: sticky section nav + prev/next)
      └── ProjectFinalCTA           (pure: project-scoped CTA)
```

- **15 components**, each pure and prop-driven. `ProjectSection` is the shared shell every content section composes, so anchors, spacing, headings, and fade behave identically everywhere.
- **Client only where motion lives**: `ProjectSection`, `ProjectHeroShell`, `QuickFacts`. Everything else is server-renderable and independently testable in isolation.

## 21. Deliverable 4 — CMS schema

- A single `Project` interface in `lib/project.ts` covers every group from the brief: **General** (`id`, `slug`, `title`, `subtitle`, `status`, `category`), **Location** (`city`, `country`, `address`, `coordinates`), **Media** (`heroImage`, `heroVideo`, `gallery`), **Project** (`overview`, `highlights`, `amenities`), **Investment** (`ownershipModel`, `minimumInvestment`, `availability`, `documents`), **Downloads** (`brochures`, `floorPlans`), **SEO** (`title`, `description`, `ogImage`), and **Related** (`relatedProjects`).
- `category` and `status` are typed unions with `CATEGORY_LABELS` / `STATUS_LABELS` maps, so the **same template renders residential, commercial, community, fractional, and tokenized** projects from data alone.
- Everything is data-driven: components receive only their slice of `Project`; no copy is hardcoded. Replace the placeholder block with a Sanity fetch returning `Project[]` and nothing else changes.
- `ProjectSummary` is the lightweight shape reused for related cards and previous/next.

## 22. Deliverable 5 — Routing strategy

- **One dynamic segment**, `app/projects/[slug]/page.tsx`, renders every project — no duplicate templates, no hardcoded pages.
- `generateStaticParams` returns all slugs from `getProjectSlugs()`, so each project is statically pre-rendered (SSG); adding a CMS project just adds a slug.
- `getProjectBySlug` resolves the record; an unknown slug calls `notFound()` (renders the 404). After the guard, TypeScript narrows the value to a non-optional `Project`.
- `getAdjacentProjects` powers previous/next from the project ordering — the sidebar links straight to neighbouring slugs.
- `params` is awaited (Next.js 15 async dynamic APIs).

## 23. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<640`)**: single column; the sidebar (section nav + prev/next) sits above the content via `order-first`; quick facts show two per row.
- **Tablet (`640–1023`)**: multi-column grids for highlights, amenities, gallery, and related; quick facts at three per row; sidebar still stacked.
- **Desktop (`≥1024`)**: a `1fr / 18rem` two-column grid — scrolling content beside a `sticky top-28` sidebar; quick facts span six columns; the “On this page” nav appears.
- **Zero CLS**: hero and all imagery use fixed aspect ratios + `next/image` with blur placeholders; dynamically imported sections use height-reserving fallbacks, so lazy loading never reflows the page.

## 24. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  `/projects/aurelia-residences`, `/projects/helix-tower`, `/projects/meridian-exchange` all render from the one template
- [ ]  Unknown slug (e.g. `/projects/nope`) renders 404 via `notFound()`
- [ ]  Section order matches the brief exactly
- [ ]  Breadcrumb, sticky section nav, and previous/next all work and are keyboard-navigable
- [ ]  Headings form a clean hierarchy (h1 hero → h2 sections → h3 cards)
- [ ]  `prefers-reduced-motion`: no fade/transform; content fully visible
- [ ]  No layout shift as dynamic sections and images load

<aside>
🧩

**Assumptions to reconcile against your real exports:** `@/components/ui` exports `Container`, `Heading`, `Text`, `Button` (`asChild`), `Badge`; `@/lib/animation` exports `staggerContainer`, `childVariants`. Placeholder media live under `/public/images/projects/` and `/public/downloads/`. If a name differs, only the import lines change — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 07A complete. Awaiting approval before Phase 07B.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>