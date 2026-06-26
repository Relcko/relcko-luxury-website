# Phase 06A Build — Featured Projects (Output)

<aside>
🏛️

**Phase 06A — Featured Projects (Premium Editorial Showcase).** A cinematic, editorial flagship-projects section directly below the Hero. 11 pure, prop-driven, CMS-ready components + typed placeholder data. Reuses Phase 02 design system + Phase 03 motion (variants/tokens) — **no new animation infrastructure**, no new dependencies. Previous phases untouched except the one-line homepage integration.

</aside>

## 1. Files in this phase

```
lib/
  featured-projects.ts                 # Types + CMS-ready placeholder data
components/sections/featured-projects/
  FeaturedProjects.tsx                 # Orchestrator (section/bg/header/grid/CTA)
  FeaturedProjectsHeader.tsx           # Eyebrow + Heading + Description (mask reveal)
  FeaturedProjectsGrid.tsx             # 12-col responsive grid + stagger
  FeaturedProjectCard.tsx              # Card shell (primary | secondary)
  FeaturedProjectMedia.tsx             # next/image + hover zoom + overlay + badge
  FeaturedProjectContent.tsx           # Title + meta + description + CTA
  FeaturedProjectMeta.tsx              # Location + Status + completion year row
  FeaturedProjectLocation.tsx          # Location w/ pin icon
  FeaturedProjectStatus.tsx            # Status dot + label
  FeaturedProjectCategory.tsx          # Category badge (Phase 02 Badge)
  FeaturedProjectCTA.tsx               # Stretched accessible link
  index.ts                             # Barrel
app/
  page.tsx                             # EDIT — mount below Hero (replaces stub)
```

<aside>
⚠️

**Standing assumptions (unchanged from earlier phases):** Phase 02 `Button` supports `asChild` (renders the child `Link`); `Heading`/`Badge` accept `level`/`className`. Inline meta uses token classes (`text-text-muted`, `bg-accent-gold`) directly rather than the `Text` primitive to avoid guessing an `as`/`span` prop. Everything else is native elements or wrapper `div`s I fully control.

</aside>

<aside>
📑

This page is delivered in two parts to avoid truncation: **Part 1** below = data model + leaf components. **Part 2** (appended next) = card, grid, header, orchestrator, barrel, homepage integration, and all six deliverable explanations.

</aside>

---

## 2. `lib/featured-projects.ts` — typed CMS-ready data

```tsx
// CMS-ready content model for the Featured Projects section.
// In production this is sourced from Sanity; here we ship typed placeholders
// with the exact shape the CMS will return. No hardcoded copy in components.

export type ProjectStatus =
	| "Completed"
	| "Under Construction"
	| "Now Selling"
	| "Coming Soon"

export type ProjectImage = {
	src: string
	alt: string
	blurDataURL?: string
}

export type ProjectVideo = {
	sources: Array<{ src: string; type: "video/webm" | "video/mp4" }>
	poster: string
	label: string
}

export type FeaturedProject = {
	id: string
	slug: string
	title: string
	subtitle: string
	category: string
	location: string
	status: ProjectStatus
	completionYear: number
	shortDescription: string
	heroImage: ProjectImage
	optionalVideo?: ProjectVideo
	featured: boolean
	href: string
}

export type FeaturedProjectsContent = {
	eyebrow: string
	heading: string
	description: string
	cta: { label: string; href: string }
	projects: FeaturedProject[]
}

export const featuredProjectsContent: FeaturedProjectsContent = {
	eyebrow: "Flagship Developments",
	heading: "Residences that redefine the skyline",
	description:
		"A curated portfolio of landmark addresses — each conceived as a piece of permanent architecture, engineered for light, scale, and a life lived without compromise.",
	cta: { label: "View All Projects", href: "/projects" },
	projects: [
		{
			id: "prj-aurelia",
			slug: "aurelia-tower",
			title: "Aurelia Tower",
			subtitle: "Sky residences above the harbor",
			category: "Residential Tower",
			location: "Marina District",
			status: "Now Selling",
			completionYear: 2027,
			shortDescription:
				"Sixty storeys of sculpted glass with full-floor residences, a private sky lounge, and uninterrupted views across the bay.",
			heroImage: {
				src: "/images/projects/aurelia.jpg",
				alt: "Tapering glass residential tower glowing against a dusk skyline",
			},
			featured: true,
			href: "/projects/aurelia-tower",
		},
		{
			id: "prj-monolith",
			slug: "the-monolith",
			title: "The Monolith",
			subtitle: "Brutalist-modern villas",
			category: "Private Villas",
			location: "Cliffside Reserve",
			status: "Under Construction",
			completionYear: 2026,
			shortDescription:
				"Twelve board-formed concrete villas terraced into the cliff, each framing the horizon through a single monumental aperture.",
			heroImage: {
				src: "/images/projects/monolith.jpg",
				alt: "Board-formed concrete villa cantilevered over a coastal cliff",
			},
			featured: false,
			href: "/projects/the-monolith",
		},
		{
			id: "prj-lumen",
			slug: "lumen-gardens",
			title: "Lumen Gardens",
			subtitle: "Biophilic garden residences",
			category: "Garden Estate",
			location: "Old Quarter",
			status: "Completed",
			completionYear: 2024,
			shortDescription:
				"A low-rise enclave woven through mature gardens, where every residence opens onto a private landscaped court.",
			heroImage: {
				src: "/images/projects/lumen.jpg",
				alt: "Low-rise residences integrated into lush landscaped gardens",
			},
			featured: false,
			href: "/projects/lumen-gardens",
		},
	],
}

// Primary = the featured project (falls back to first); the rest are secondary.
export function splitFeatured(projects: FeaturedProject[]): {
	primary: FeaturedProject | undefined
	secondary: FeaturedProject[]
} {
	const primary = projects.find((project) => project.featured) ?? projects[0]
	const secondary = projects.filter((project) => project !== primary)
	return { primary, secondary }
}
```

---

## 3. `FeaturedProjectCategory.tsx` — category badge

```tsx
import { Badge } from "@/components/ui"

type FeaturedProjectCategoryProps = {
	category: string
	className?: string
}

export function FeaturedProjectCategory({ category, className }: FeaturedProjectCategoryProps) {
	return <Badge className={className}>{category}</Badge>
}
```

---

## 4. `FeaturedProjectLocation.tsx` — location with pin icon

```tsx
import { cn } from "@/utils/cn"

type FeaturedProjectLocationProps = {
	location: string
	className?: string
}

export function FeaturedProjectLocation({ location, className }: FeaturedProjectLocationProps) {
	return (
		<span className={cn("inline-flex items-center gap-1.5 text-sm text-text-muted", className)}>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-3.5 w-3.5 text-accent-gold"
			>
				<path
					d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
			</svg>
			{location}
		</span>
	)
}
```

---

## 5. `FeaturedProjectStatus.tsx` — status dot + label

```tsx
import type { ProjectStatus } from "@/lib/featured-projects"
import { cn } from "@/utils/cn"

type FeaturedProjectStatusProps = {
	status: ProjectStatus
	className?: string
}

// Dot color encodes lifecycle; label carries the text for screen readers.
const STATUS_DOT: Record<ProjectStatus, string> = {
	"Completed": "bg-emerald-400",
	"Under Construction": "bg-amber-400",
	"Now Selling": "bg-accent-gold",
	"Coming Soon": "bg-text-muted",
}

export function FeaturedProjectStatus({ status, className }: FeaturedProjectStatusProps) {
	return (
		<span className={cn("inline-flex items-center gap-2 text-sm text-text-muted", className)}>
			<span aria-hidden="true" className={cn("h-2 w-2 rounded-full", STATUS_DOT[status])} />
			{status}
		</span>
	)
}
```

---

## 6. `FeaturedProjectMeta.tsx` — location + status + year row

```tsx
import type { FeaturedProject } from "@/lib/featured-projects"
import { cn } from "@/utils/cn"
import { FeaturedProjectLocation } from "./FeaturedProjectLocation"
import { FeaturedProjectStatus } from "./FeaturedProjectStatus"

type FeaturedProjectMetaProps = {
	project: Pick<FeaturedProject, "location" | "status" | "completionYear">
	className?: string
}

export function FeaturedProjectMeta({ project, className }: FeaturedProjectMetaProps) {
	return (
		<dl className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
			<div>
				<dt className="sr-only">Location</dt>
				<dd><FeaturedProjectLocation location={project.location} /></dd>
			</div>
			<div>
				<dt className="sr-only">Status</dt>
				<dd><FeaturedProjectStatus status={project.status} /></dd>
			</div>
			<div>
				<dt className="sr-only">Completion</dt>
				<dd className="text-sm text-text-muted">Est. {project.completionYear}</dd>
			</div>
		</dl>
	)
}
```

---

## 7. `FeaturedProjectCTA.tsx` — stretched accessible link

```tsx
import Link from "next/link"
import { cn } from "@/utils/cn"

type FeaturedProjectCTAProps = {
	href: string
	label: string
	/** Project title — used for the accessible name of the stretched link. */
	title: string
	className?: string
}

// `after:absolute after:inset-0` stretches this single link across the card's
// relative root, so the whole card is one clickable, keyboard-focusable target.
export function FeaturedProjectCTA({ href, label, title, className }: FeaturedProjectCTAProps) {
	return (
		<Link
			href={href}
			aria-label={`${label}: ${title}`}
			className={cn(
				"group/cta inline-flex items-center gap-2 text-sm font-display-sans uppercase tracking-[0.18em] text-text-primary",
				"after:absolute after:inset-0 after:content-[''] focus:outline-none",
				className,
			)}
		>
			<span>{label}</span>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				className="h-4 w-4 text-accent-gold transition-transform duration-300 motion-safe:group-hover/cta:translate-x-1"
			>
				<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</Link>
	)
}
```

---

## 8. `FeaturedProjectMedia.tsx` — image + hover zoom + overlay + badge

```tsx
import Image from "next/image"
import type { FeaturedProject } from "@/lib/featured-projects"
import { cn } from "@/utils/cn"
import { FeaturedProjectCategory } from "./FeaturedProjectCategory"

type FeaturedProjectMediaProps = {
	project: Pick<FeaturedProject, "heroImage" | "category">
	/** Responsive sizes hint for next/image. */
	sizes: string
	/** Only the primary above-the-fold card should be priority. */
	priority?: boolean
	className?: string
}

// Pure presentational media layer. Hover zoom + overlay deepen are CSS and
// motion-safe gated. The category badge floats over the top-left.
export function FeaturedProjectMedia({
	project,
	sizes,
	priority = false,
	className,
}: FeaturedProjectMediaProps) {
	const { heroImage } = project
	return (
		<div className={cn("relative h-full w-full overflow-hidden", className)}>
			<Image
				src={heroImage.src}
				alt={heroImage.alt}
				fill
				sizes={sizes}
				{...(priority ? { priority: true } : { loading: "lazy" })}
				{...(heroImage.blurDataURL
					? { placeholder: "blur", blurDataURL: heroImage.blurDataURL }
					: {})}
				className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
			/>
			{/* Legibility gradient (always on) */}
			<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent" />
			{/* Hover-deepening overlay */}
			<div aria-hidden="true" className="absolute inset-0 bg-bg-base/0 transition-colors duration-500 group-hover:bg-bg-base/25" />
			<FeaturedProjectCategory category={project.category} className="absolute left-5 top-5" />
		</div>
	)
}
```

---

## 9. `FeaturedProjectContent.tsx` — title + meta + description + CTA

```tsx
import { Heading, Text } from "@/components/ui"
import type { FeaturedProject } from "@/lib/featured-projects"
import { cn } from "@/utils/cn"
import { FeaturedProjectMeta } from "./FeaturedProjectMeta"
import { FeaturedProjectCTA } from "./FeaturedProjectCTA"

type FeaturedProjectContentProps = {
	project: FeaturedProject
	/** Heading level for correct document outline (cards are h3 under the h2). */
	headingLevel?: 2 | 3 | 4
	ctaLabel?: string
	className?: string
}

export function FeaturedProjectContent({
	project,
	headingLevel = 3,
	ctaLabel = "View Project",
	className,
}: FeaturedProjectContentProps) {
	return (
		<div className={cn("relative z-10 flex flex-col gap-4", className)}>
			<div className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1">
				<Heading level={headingLevel} size="lg" className="text-balance">
					{project.title}
				</Heading>
				<Text size="sm" tone="muted" className="mt-1">
					{project.subtitle}
				</Text>
			</div>
			<FeaturedProjectMeta project={project} />
			<Text size="md" tone="muted" className="max-w-[54ch]">
				{project.shortDescription}
			</Text>
			<FeaturedProjectCTA
				href={project.href}
				label={ctaLabel}
				title={project.title}
				className="mt-1 opacity-100 md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100 md:group-focus-within:opacity-100 motion-reduce:opacity-100"
			/>
		</div>
	)
}
```

<aside>
♿

**CTA reveal stays accessible:** the CTA is hidden only on `md+` pointer hover, but is forced visible on `group-focus-within` (keyboard), on touch/mobile (`opacity-100` base), and under `motion-reduce`. So it is never keyboard- or touch-inaccessible.

</aside>

<aside>
⏭️

Part 2 (next) appends the card shell, grid, header, orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 10. `FeaturedProjectCard.tsx` — card shell (primary | secondary)

```tsx
"use client"

import { motion, type Variants } from "framer-motion"
import { easing } from "@/lib/animation"
import type { FeaturedProject } from "@/lib/featured-projects"
import { cn } from "@/utils/cn"
import { FeaturedProjectMedia } from "./FeaturedProjectMedia"
import { FeaturedProjectContent } from "./FeaturedProjectContent"

type CardVariant = "primary" | "secondary"

type FeaturedProjectCardProps = {
	project: FeaturedProject
	variant?: CardVariant
	priority?: boolean
	className?: string
}

// Primary spans the full row and goes media-beside-content on desktop;
// secondary cards are compact, media-over-content.
const MEDIA_FRAME: Record<CardVariant, string> = {
	primary: "aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[28rem]",
	secondary: "aspect-[4/3]",
}

const MEDIA_SIZES: Record<CardVariant, string> = {
	primary: "(max-width: 1024px) 100vw, 66vw",
	secondary: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
}

// Subtle entrance scale on the media. It inherits hidden/visible from the
// parent stagger via Framer variant propagation — no own scroll trigger.
const mediaReveal: Variants = {
	hidden: { scale: 1.08 },
	visible: { scale: 1, transition: { duration: 1.1, ease: easing.out } },
}

export function FeaturedProjectCard({
	project,
	variant = "secondary",
	priority = false,
	className,
}: FeaturedProjectCardProps) {
	const isPrimary = variant === "primary"
	return (
		<article
			className={cn(
				"group relative isolate flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated",
				"transition-shadow duration-500 hover:shadow-2xl",
				"focus-within:ring-2 focus-within:ring-accent-gold/70 focus-within:ring-offset-2 focus-within:ring-offset-bg-base",
				"motion-safe:transition-[transform,box-shadow] motion-safe:hover:-translate-y-1",
				isPrimary && "lg:grid lg:grid-cols-2 lg:items-stretch",
				className,
			)}
		>
			<motion.div variants={mediaReveal} className={cn("relative w-full", MEDIA_FRAME[variant])}>
				<FeaturedProjectMedia project={project} sizes={MEDIA_SIZES[variant]} priority={priority} />
			</motion.div>
			<div className={cn("flex flex-1 flex-col justify-end p-6 md:p-8", isPrimary && "lg:p-10")}>
				<FeaturedProjectContent project={project} headingLevel={3} />
			</div>
		</article>
	)
}
```

---

## 11. `FeaturedProjectsGrid.tsx` — 12-col responsive grid + stagger

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { splitFeatured, type FeaturedProject } from "@/lib/featured-projects"
import { cn } from "@/utils/cn"
import { FeaturedProjectCard } from "./FeaturedProjectCard"

// Named const avoids inline object literals in JSX (project convention).
const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type FeaturedProjectsGridProps = {
	projects: FeaturedProject[]
	className?: string
}

export function FeaturedProjectsGrid({ projects, className }: FeaturedProjectsGridProps) {
	const { primary, secondary } = splitFeatured(projects)
	if (!primary) return null
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-12",
				className,
			)}
		>
			<motion.div variants={childVariants} className="md:col-span-2 lg:col-span-12">
				<FeaturedProjectCard project={primary} variant="primary" priority />
			</motion.div>
			{secondary.map((project) => (
				<motion.div key={project.id} variants={childVariants} className="lg:col-span-6">
					<FeaturedProjectCard project={project} variant="secondary" />
				</motion.div>
			))}
		</motion.div>
	)
}
```

<aside>
🎞️

**Why variant propagation works:** the grid sets `initial="hidden" whileInView="visible"` once. `staggerContainer` cascades to each `childVariants` wrapper (fade-up, staggered), and each card's inner `mediaReveal` wrapper *also* receives `hidden`/`visible` from the same cascade — so the slight image scale runs in sync with no extra ScrollTrigger. Reduced motion is honored globally by the Phase 03 `MotionConfig reducedMotion="user"`.

</aside>

---

## 12. `FeaturedProjectsHeader.tsx` — eyebrow + heading + description (mask reveal)

```tsx
"use client"

import { motion } from "framer-motion"
import { reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-10% 0px" } as const

type FeaturedProjectsHeaderProps = {
	eyebrow: string
	heading: string
	description: string
	className?: string
}

export function FeaturedProjectsHeader({
	eyebrow,
	heading,
	description,
	className,
}: FeaturedProjectsHeaderProps) {
	return (
		<motion.div
			variants={reveal}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("flex max-w-3xl flex-col gap-4", className)}
		>
			<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
				{eyebrow}
			</span>
			<Heading level={2} size="xl" className="text-balance">
				{heading}
			</Heading>
			<Text size="md" tone="muted" className="max-w-[60ch]">
				{description}
			</Text>
		</motion.div>
	)
}
```

---

## 13. `FeaturedProjects.tsx` — orchestrator (server component)

```tsx
import Link from "next/link"
import { Button, Container } from "@/components/ui"
import {
	featuredProjectsContent,
	type FeaturedProjectsContent,
} from "@/lib/featured-projects"
import { cn } from "@/utils/cn"
import { FeaturedProjectsHeader } from "./FeaturedProjectsHeader"
import { FeaturedProjectsGrid } from "./FeaturedProjectsGrid"

type FeaturedProjectsProps = {
	content?: FeaturedProjectsContent
	id?: string
	className?: string
}

// Server component: it ships static markup; only the header/grid that need
// scroll motion are client islands. The landmark uses a native <section> so
// `id` + `aria-label` are guaranteed regardless of primitive prop forwarding.
export function FeaturedProjects({
	content = featuredProjectsContent,
	id = "featured",
	className,
}: FeaturedProjectsProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_-10%,rgba(200,162,106,0.10),transparent_55%)]"
			/>
			<Container size="max" className="flex flex-col gap-12 md:gap-16">
				<FeaturedProjectsHeader
					eyebrow={content.eyebrow}
					heading={content.heading}
					description={content.description}
				/>
				<FeaturedProjectsGrid projects={content.projects} />
				<div className="flex justify-center">
					<Button asChild variant="secondary" size="lg">
						<Link href={content.cta.href}>{content.cta.label}</Link>
					</Button>
				</div>
			</Container>
		</section>
	)
}
```

---

## 14. `index.ts` — barrel

```tsx
export { FeaturedProjects } from "./FeaturedProjects"
export { FeaturedProjectsHeader } from "./FeaturedProjectsHeader"
export { FeaturedProjectsGrid } from "./FeaturedProjectsGrid"
export { FeaturedProjectCard } from "./FeaturedProjectCard"
export { FeaturedProjectMedia } from "./FeaturedProjectMedia"
export { FeaturedProjectContent } from "./FeaturedProjectContent"
export { FeaturedProjectMeta } from "./FeaturedProjectMeta"
export { FeaturedProjectLocation } from "./FeaturedProjectLocation"
export { FeaturedProjectStatus } from "./FeaturedProjectStatus"
export { FeaturedProjectCategory } from "./FeaturedProjectCategory"
export { FeaturedProjectCTA } from "./FeaturedProjectCTA"
```

---

## 15. `app/page.tsx` — integrate below the Hero (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />
			<FeaturedProjects id="featured" />
		</>
	)
}
```

<aside>
🔗

This **replaces the Phase 05A `#featured` anchor stub**. The Hero scroll-indicator already targets `#featured`, so it now lands precisely on this section — no Hero changes required.

</aside>

---

## 16. Deliverable 3 — Component hierarchy

```
FeaturedProjects                     (server: section + bg + Container + bottom CTA)
 ├── FeaturedProjectsHeader          (client: mask reveal — eyebrow/h2/description)
 ├── FeaturedProjectsGrid            (client: stagger container, 12-col grid)
 │    └── FeaturedProjectCard ×3     (client: fade-up child + media reveal)
 │         ├── FeaturedProjectMedia          (next/image, zoom, overlay)
 │         │    └── FeaturedProjectCategory  (Phase 02 Badge)
 │         └── FeaturedProjectContent        (title/subtitle/meta/desc/CTA)
 │              ├── FeaturedProjectMeta
 │              │    ├── FeaturedProjectLocation
 │              │    └── FeaturedProjectStatus
 │              └── FeaturedProjectCTA       (stretched link)
 └── Button (asChild → Link)         (Phase 02 — "View All Projects")
```

- **Only three components are client islands** (`Header`, `Grid`, `Card`) because they use Framer scroll-in motion. Everything else is a pure server-renderable presentational unit.
- Every component is **prop-driven and independently testable** — no component reaches into global state; data flows down from `featuredProjectsContent`.

## 17. Deliverable 4 — CMS data model

- All copy + media live in `lib/featured-projects.ts` as `FeaturedProjectsContent`; **zero hardcoded strings inside components**.
- `FeaturedProject` carries every field the brief specified: `id, slug, title, subtitle, category, location, status, completionYear, shortDescription, heroImage, optionalVideo?, featured, href`.
- `status` is a **typed union** (`ProjectStatus`) so the status dot/colors stay exhaustive (`Record<ProjectStatus, …>` will fail to compile if a new status is added without a color).
- `optionalVideo` reuses the **same multi-codec `sources[]` + poster contract from Phase 05C**, so a card can later upgrade to video without a model change.
- `splitFeatured()` derives the primary (the `featured` flag, falling back to first) vs. secondary projects — layout is data-driven, not positional. Swap the CMS source and the section re-renders unchanged.

## 18. Deliverable 5 — Animation approach (Phase 03 only)

- **Mask reveal** (header) → Phase 03 `reveal` variant. **Stagger entrance + fade-up** (cards) → `staggerContainer` + `childVariants`. **Slight image scale** → local `mediaReveal` composed from the Phase 03 `easing` token, inheriting `hidden`/`visible` via Framer variant propagation. **No new hooks, no GSAP timelines, no ScrollTrigger** added here.
- **One trigger per group**: `whileInView` + `viewport= once: true`  (via named `VIEWPORT`) means each section animates once on entry — **no parallax, no pinning, no horizontal scroll**.
- **Hover** is pure CSS, all `motion-safe:` gated: image zoom `scale-[1.04]`, overlay deepen, title `-translate-y-1`, CTA fade-in, card elevation `-translate-y-1` + `shadow-2xl`. Restrained, no exaggerated movement.
- **Reduced motion**: transforms are `motion-safe:` only and global `MotionConfig reducedMotion="user"` neutralizes the Framer entrances — content appears instantly and fully legible.

## 19. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<768`)**: single column; primary + each secondary stack full-width.
- **Tablet (`768–1023`)**: 2-column grid; primary spans both columns (`md:col-span-2`), secondaries sit side-by-side.
- **Desktop (`≥1024`)**: 12-column grid; primary spans all 12 and switches to **media-beside-content** (`lg:grid-cols-2`), each secondary spans 6.
- **No CLS**: every image is `next/image` with `fill` inside an aspect-ratio box (`aspect-[16/11]` / `aspect-[4/3]`), so space is reserved before load; `sizes` is tuned per variant; only the primary is `priority`, the rest `loading="lazy"`; optional `blurDataURL` gives an instant LQIP.

## 20. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below the Hero; scroll indicator lands on it
- [ ]  Primary + 2 secondary cards; correct grid at 360 / 768 / 1024 / 1440
- [ ]  No layout shift as images load (aspect boxes reserve space)
- [ ]  Hover: subtle zoom, overlay, title lift, CTA fade-in, elevation
- [ ]  Whole card is one keyboard-focusable link; visible focus ring
- [ ]  `prefers-reduced-motion`: entrances + hover transforms disabled, CTA visible
- [ ]  Heading outline correct (Hero h1 → section h2 → card h3)

<aside>
🧩

**Assumptions to reconcile against your actual Phase 02/03 exports:** `@/lib/animation` exports `reveal`, `staggerContainer`, `childVariants`, and `easing` (with `easing.out` as a cubic-bezier tuple Framer accepts); `@/components/ui` exports `Badge`, `Button` (with `asChild`), `Container`, `Heading`, `Text`. If any name differs, only the import line needs adjusting — the component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06A complete. Awaiting approval before Phase 06B (About / Brand Story).** I can author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>