# Phase 07D Build — Amenities & Lifestyle (Output)

<aside>
🌿

**Phase 07D — Amenities & Lifestyle.** An aspirational, editorial section conveying quality of life — a large lifestyle image with an optional floating statistic on the left, and eyebrow + heading + description + amenity categories + lifestyle highlights on the right. Seven new pure, strictly-typed, CMS-ready components under `components/project/amenities/`, bound to the **single** `Project` interface via one *optional additive* field. Motion is **Phase 03 only** (fade-up, editorial image reveal, category stagger, lifestyle card reveal). Phases 07A–07C are untouched; the only 07A edits are the sanctioned `ProjectLayout` integration + barrel re-export.

</aside>

## 1. Files in this phase

```jsx
lib/
  project.ts                       # EXTENDED (additive + optional) — amenities/lifestyle types + placeholder builder
components/project/amenities/
  ProjectAmenitiesSection.tsx      # Section shell + 2-col editorial grid (client, motion root)
  AmenitiesContent.tsx             # Right-column header: eyebrow, heading, description (client)
  AmenitiesCategories.tsx          # Category grid container, staggered (client)
  AmenityCategory.tsx              # One category card: name + amenity list (pure)
  AmenityCard.tsx                  # One amenity row (pure)
  LifestyleHighlights.tsx          # Lifestyle card grid container, staggered (client)
  LifestyleHighlight.tsx           # One concise lifestyle card (pure)
  index.ts                         # Barrel
components/project/
  ProjectLayout.tsx                # EDITED — integrate section after Overview
  index.ts                         # EDITED — re-export ./amenities
```

<aside>
🧭

**Design decisions (sanity-check against the freeze):**

1. **One optional additive field.** The existing flat `amenities: ProjectAmenity[]` can't carry a lifestyle image, a floating stat, editorial copy, *named multi-amenity categories*, or lifestyle highlight cards. So `lib/project.ts` gains a few new types + one **optional** `Project.amenitiesContent?` field. No existing field is renamed, removed, or changed.
2. **No duplicate models.** Categories reuse the existing `ProjectAmenity` for their amenities, and the lifestyle image reuses the existing `ProjectImage`. Only genuinely new shapes are added (`AmenityCategoryData`, `LifestyleHighlightData`, `AmenityStat`, `ProjectAmenitiesData`).
3. **Frozen 07A component stays intact.** `ProjectAmenities.tsx` (07A) is **not edited or deleted** — just no longer rendered; only its now-unused import leaves `ProjectLayout`.
4. **Sidebar anchor preserved.** The new section keeps `id="amenities"`, so the existing `PROJECT_SECTIONS` link still resolves — `PROJECT_SECTIONS` is unchanged.
</aside>

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Heading`, `Text`. `@/lib/animation` exports `staggerContainer`, `childVariants` (fade-up), `reveal` (mask). Global `MotionConfig reducedMotion="user"` (Phase 03) covers reduced-motion. `cn` from `@/utils/cn`. Lifestyle image lives at `/public/images/projects/<slug>-lifestyle.jpg`. Placeholder copy only. If a name differs, only the import line changes.

</aside>

<aside>
📑

Delivered in **two parts**. **Part 1** (below) = the additive `lib/project.ts` extension + the three pure leaf components (`AmenityCard`, `AmenityCategory`, `LifestyleHighlight`). **Part 2** = `AmenitiesContent`, `AmenitiesCategories`, `LifestyleHighlights`, the `ProjectAmenitiesSection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/project.ts` — additive extension (new optional types + placeholder builder)

**Add these types** (nothing existing is touched):

```tsx
// --- Phase 07D — amenities & lifestyle content (additive, optional) --------
export type AmenityCategoryData = {
	id: string
	name: string
	amenities: ProjectAmenity[] // reuses the existing ProjectAmenity shape
}

export type LifestyleHighlightData = {
	id: string
	title: string
	description: string
}

export type AmenityStat = { value: string; label: string }

export type ProjectAmenitiesData = {
	eyebrow: string
	heading: string
	description: string
	image: ProjectImage // reuses the existing ProjectImage shape
	stat?: AmenityStat
	categories: AmenityCategoryData[]
	lifestyleHighlights: LifestyleHighlightData[]
}
```

**Add one optional field to the existing `Project` type** (shown here after `amenities`):

```tsx
amenities: ProjectAmenity[]
amenitiesContent?: ProjectAmenitiesData // ← Phase 07D (optional, additive)
```

**Add the placeholder builder + shared fixtures**, then populate it inside the existing `buildProject` factory (one new line):

```tsx
const sharedAmenityCategories: AmenityCategoryData[] = [
	{
		id: "wellness",
		name: "Wellness",
		amenities: [
			{ id: "wellness-pool", label: "Infinity pool" },
			{ id: "wellness-spa", label: "Spa & sauna" },
			{ id: "wellness-gym", label: "Fitness studio" },
		],
	},
	{
		id: "recreation",
		name: "Recreation",
		amenities: [
			{ id: "rec-padel", label: "Padel courts" },
			{ id: "rec-cinema", label: "Screening room" },
			{ id: "rec-lounge", label: "Rooftop lounge" },
		],
	},
	{
		id: "community",
		name: "Community",
		amenities: [
			{ id: "com-club", label: "Residents' club" },
			{ id: "com-cowork", label: "Co-working spaces" },
			{ id: "com-lawn", label: "Event lawn" },
		],
	},
	{
		id: "security",
		name: "Security",
		amenities: [
			{ id: "sec-concierge", label: "24/7 concierge" },
			{ id: "sec-gated", label: "Gated access" },
			{ id: "sec-cctv", label: "CCTV monitoring" },
		],
	},
	{
		id: "smart",
		name: "Smart Living",
		amenities: [
			{ id: "smart-home", label: "App-controlled homes" },
			{ id: "smart-entry", label: "Keyless entry" },
			{ id: "smart-ev", label: "EV charging" },
		],
	},
	{
		id: "sustainability",
		name: "Sustainability",
		amenities: [
			{ id: "sus-solar", label: "Solar systems" },
			{ id: "sus-water", label: "Rainwater harvesting" },
			{ id: "sus-native", label: "Native landscaping" },
		],
	},
]

const sharedLifestyleHighlights: LifestyleHighlightData[] = [
	{
		id: "walkable",
		title: "Walkable community",
		description: "Tree-lined promenades connect homes, retail, and parks within an easy stroll.",
	},
	{
		id: "green",
		title: "Green open spaces",
		description: "Landscaped gardens and shaded courtyards bring calm to everyday life.",
	},
	{
		id: "concierge",
		title: "Premium concierge",
		description: "A dedicated team handles the details, from reservations to deliveries.",
	},
	{
		id: "family",
		title: "Family-oriented design",
		description: "Play areas, schools nearby, and safe streets designed for every generation.",
	},
]

function buildAmenitiesContent(seed: ProjectSeed): ProjectAmenitiesData {
	return {
		eyebrow: "Amenities & lifestyle",
		heading: "A life composed around comfort and connection",
		description:
			"More than a residence — a curated way of living, where wellness, recreation, and community are woven into every day.",
		image: img(`/images/projects/${seed.slug}-lifestyle.jpg`, `${seed.title} lifestyle`, 1200, 1500),
		stat: { value: "40+", label: "Curated amenities" },
		categories: sharedAmenityCategories,
		lifestyleHighlights: sharedLifestyleHighlights,
	}
}
```

```tsx
// Inside the existing buildProject(seed) return object, add ONE line
// (next to the other Phase 07 content builders):
		amenities: sharedAmenities,
		amenitiesContent: buildAmenitiesContent(seed), // ← Phase 07D
```

<aside>
🧩

**Why this respects the freeze.** Everything is *added*: existing fields (`amenities`, etc.), `buildProject`'s other lines, `PROJECT_SECTIONS`, and all helpers are byte-for-byte unchanged. `amenitiesContent` is optional, so a CMS record without it still type-checks; the section simply doesn't render when it's absent. Categories reuse `ProjectAmenity`; the image reuses `ProjectImage` — no duplicate models.

</aside>

---

## 3. `AmenityCard.tsx` — one amenity row (pure)

```tsx
import { Text } from "@/components/ui"
import type { ProjectAmenity } from "@/lib/project"
import { cn } from "@/utils/cn"

type AmenityCardProps = {
	amenity: ProjectAmenity
	className?: string
}

// Compact, pure amenity row (rendered inside a category's <ul>). Decorative
// marker is aria-hidden; the label carries the meaning.
export function AmenityCard({ amenity, className }: AmenityCardProps) {
	return (
		<li className={cn("flex items-center gap-2.5", className)}>
			<span
				aria-hidden="true"
				className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold/70"
			/>
			<Text size="sm" tone="muted">
				{amenity.label}
			</Text>
		</li>
	)
}
```

---

## 4. `AmenityCategory.tsx` — one category card (pure)

```tsx
import { Heading } from "@/components/ui"
import type { AmenityCategoryData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { AmenityCard } from "./AmenityCard"

type AmenityCategoryProps = {
	category: AmenityCategoryData
	className?: string
}

// Pure category card: a heading + its amenities. Motion is applied by the
// parent grid (AmenitiesCategories), so this stays SSR-pure and reusable.
export function AmenityCategory({ category, className }: AmenityCategoryProps) {
	return (
		<article
			className={cn(
				"flex h-full flex-col gap-3 rounded-2xl border border-border bg-bg-elevated p-5",
				className,
			)}
		>
			<Heading level={3} size="sm">
				{category.name}
			</Heading>
			<ul className="flex flex-col gap-2">
				{category.amenities.map((amenity) => (
					<AmenityCard key={amenity.id} amenity={amenity} />
				))}
			</ul>
		</article>
	)
}
```

---

## 5. `LifestyleHighlight.tsx` — one concise lifestyle card (pure)

```tsx
import { Heading, Text } from "@/components/ui"
import type { LifestyleHighlightData } from "@/lib/project"
import { cn } from "@/utils/cn"

type LifestyleHighlightProps = {
	highlight: LifestyleHighlightData
	className?: string
}

// Pure editorial micro-card. h4 — it nests under the "Lifestyle" h3 group.
export function LifestyleHighlight({ highlight, className }: LifestyleHighlightProps) {
	return (
		<article
			className={cn(
				"flex h-full flex-col gap-1.5 rounded-2xl border border-border bg-bg-base p-4",
				className,
			)}
		>
			<Heading level={4} size="sm">
				{highlight.title}
			</Heading>
			<Text size="sm" tone="muted">
				{highlight.description}
			</Text>
		</article>
	)
}
```

<aside>
⏭️

Part 2 (next) appends `AmenitiesContent`, `AmenitiesCategories`, `LifestyleHighlights`, the `ProjectAmenitiesSection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 6. `AmenitiesContent.tsx` — right-column header (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type AmenitiesContentProps = {
	eyebrow: string
	heading: string
	description: string
	className?: string
}

// Editorial header for the right column. Discrete props keep it reusable; no own
// initial/animate — the parent section propagates "visible". Heading uses `reveal`.
export function AmenitiesContent({
	eyebrow,
	heading,
	description,
	className,
}: AmenitiesContentProps) {
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
			<motion.div variants={childVariants}>
				<Text tone="muted" className="max-w-xl">
					{description}
				</Text>
			</motion.div>
		</div>
	)
}
```

---

## 7. `AmenitiesCategories.tsx` — category grid container (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { AmenityCategoryData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { AmenityCategory } from "./AmenityCategory"

type AmenitiesCategoriesProps = {
	categories: AmenityCategoryData[]
	className?: string
}

// Nested stagger container: each category card fades up in sequence (category
// stagger). Inherits "visible" from the section; equal-height cells via h-full.
export function AmenitiesCategories({ categories, className }: AmenitiesCategoriesProps) {
	return (
		<motion.div
			variants={staggerContainer}
			className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", className)}
		>
			{categories.map((category) => (
				<motion.div key={category.id} variants={childVariants}>
					<AmenityCategory category={category} />
				</motion.div>
			))}
		</motion.div>
	)
}
```

---

## 8. `LifestyleHighlights.tsx` — lifestyle card grid container (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading } from "@/components/ui"
import type { LifestyleHighlightData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { LifestyleHighlight } from "./LifestyleHighlight"

type LifestyleHighlightsProps = {
	highlights: LifestyleHighlightData[]
	className?: string
}

// "Lifestyle" group (h3) + staggered editorial cards (lifestyle card reveal).
// Renders nothing when there are no highlights — fully data-driven.
export function LifestyleHighlights({ highlights, className }: LifestyleHighlightsProps) {
	if (highlights.length === 0) return null
	return (
		<motion.div variants={staggerContainer} className={cn("flex flex-col gap-4", className)}>
			<Heading level={3} size="sm">
				Lifestyle
			</Heading>
			<motion.ul
				variants={staggerContainer}
				className="grid grid-cols-1 gap-3 sm:grid-cols-2"
			>
				{highlights.map((highlight) => (
					<motion.li key={highlight.id} variants={childVariants}>
						<LifestyleHighlight highlight={highlight} />
					</motion.li>
				))}
			</motion.ul>
		</motion.div>
	)
}
```

---

## 9. `ProjectAmenitiesSection.tsx` — section shell + 2-col editorial grid (client)

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { staggerContainer, reveal } from "@/lib/animation"
import { Text } from "@/components/ui"
import type { ProjectAmenitiesData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { AmenitiesContent } from "./AmenitiesContent"
import { AmenitiesCategories } from "./AmenitiesCategories"
import { LifestyleHighlights } from "./LifestyleHighlights"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectAmenitiesSectionProps = {
	content: ProjectAmenitiesData
	className?: string
}

// The single motion trigger: whileInView fires once and propagates "visible"
// to the image (reveal mask), the header, the category grid, and the lifestyle
// cards. id="amenities" preserves the existing sidebar anchor.
export function ProjectAmenitiesSection({ content, className }: ProjectAmenitiesSectionProps) {
	return (
		<motion.section
			id="amenities"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
				{/* Left: lifestyle image + optional floating statistic */}
				<motion.div variants={reveal} className="relative">
					<div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-bg-elevated">
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
					</div>
					{content.stat ? (
						<div className="absolute bottom-5 left-5 flex flex-col gap-0.5 rounded-2xl border border-border bg-bg-base/80 px-5 py-4 backdrop-blur">
							<Text size="lg" className="font-display-sans font-semibold text-accent-gold">
								{content.stat.value}
							</Text>
							<Text size="sm" tone="muted">
								{content.stat.label}
							</Text>
						</div>
					) : null}
				</motion.div>
				{/* Right: header + categories + lifestyle */}
				<motion.div variants={staggerContainer} className="flex flex-col gap-10">
					<AmenitiesContent
						eyebrow={content.eyebrow}
						heading={content.heading}
						description={content.description}
					/>
					<AmenitiesCategories categories={content.categories} />
					<LifestyleHighlights highlights={content.lifestyleHighlights} />
				</motion.div>
			</div>
		</motion.section>
	)
}
```

<aside>
🖼️

The lifestyle image sits in a fixed `aspect-[4/5]` box (`next/image fill` + blur placeholder) → **zero CLS**; the floating statistic is absolutely positioned over it, so it never reflows the layout. On desktop the image is sticky-free editorial; it stacks above the content on tablet/mobile.

</aside>

---

## 10. `components/project/amenities/index.ts` — barrel

```tsx
export { ProjectAmenitiesSection } from "./ProjectAmenitiesSection"
export { AmenitiesContent } from "./AmenitiesContent"
export { AmenitiesCategories } from "./AmenitiesCategories"
export { AmenityCategory } from "./AmenityCategory"
export { AmenityCard } from "./AmenityCard"
export { LifestyleHighlights } from "./LifestyleHighlights"
export { LifestyleHighlight } from "./LifestyleHighlight"
```

---

## 11. `ProjectLayout.tsx` — integrate the section after Overview (the only 07A render edit)

Replaces the old `<ProjectAmenities>` (removed from the layout *and its import*) with the new guarded `<ProjectAmenitiesSection>`, placed directly after the Overview section. Everything else is unchanged.

```tsx
import dynamic from "next/dynamic"
import { Container } from "@/components/ui"
import type { Project, ProjectSummary } from "@/lib/project"
import { ProjectBreadcrumb } from "./ProjectBreadcrumb"
import { ProjectHero } from "./hero"
import { QuickFacts } from "./QuickFacts"
import { ProjectOverviewSection } from "./overview"
import { ProjectAmenitiesSection } from "./amenities"
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
🔒

**Frozen-safe.** `ProjectAmenities.tsx` (07A) is untouched on disk — only its import/usage leaves `ProjectLayout`. The Hero, full-bleed positioning, Overview section, grid, sticky sidebar, dynamic imports, and the Location→…→Related order are all unchanged.

</aside>

---

## 12. `components/project/index.ts` — re-export amenities (edit)

Append one line to the existing barrel (all existing exports left as-is):

```tsx
// …existing exports unchanged…
export * from "./overview"
export * from "./amenities"
```

---

## 13. Deliverable 3 — Component hierarchy

```jsx
ProjectLayout (main column, after Overview)
 └── ProjectAmenitiesSection           (client: motion.section, single whileInView trigger)
      └── grid lg:grid-cols-2
           ├── [left] lifestyle image    (reveal mask) + optional floating stat (absolute)
           └── [right] flex column
                ├── AmenitiesContent     (client: eyebrow + h2 reveal + description)
                ├── AmenitiesCategories  (client: staggered grid)
                │    └── AmenityCategory (pure: h3 + <ul>)
                │         └── AmenityCard (pure: amenity row)
                └── LifestyleHighlights  (client: "Lifestyle" h3 + staggered grid)
                     └── LifestyleHighlight (pure: h4 micro-card)
```

- **7 components**, each single-purpose. The four leaf/structural cards (`AmenityCard`, `AmenityCategory`, `LifestyleHighlight`) are **pure/SSR**; motion lives only in the section + the two grid containers + the header, so the cards stay reusable anywhere.
- **Heading hierarchy**: Hero `h1` → section `h2` (heading) → `h3` (category names + "Lifestyle") → `h4` (lifestyle card titles).

## 14. Deliverable 4 — CMS bindings

- One optional additive field: `Project.amenitiesContent?: ProjectAmenitiesData` — **no duplicate models, no changed/removed fields**.
- Field-by-field: `eyebrow`/`heading`/`description` → `AmenitiesContent`; `image` (reused `ProjectImage`) + `stat?` (`AmenityStat`) → left column; `categories[]` (`AmenityCategoryData`, whose `amenities` reuse `ProjectAmenity`) → `AmenitiesCategories`; `lifestyleHighlights[]` (`LifestyleHighlightData`) → `LifestyleHighlights`.
- **No hardcoded copy** — every string comes from data; placeholders live in `buildAmenitiesContent(seed)`. Swap the placeholder block for a Sanity fetch returning this shape and nothing else changes.
- `amenitiesContent` is **optional** → CMS records without it still type-check; `ProjectLayout` guards the render and `LifestyleHighlights` no-ops on an empty array.

## 15. Deliverable 5 — Animation approach (Phase 03 only)

- **One trigger**: the section is the only `whileInView` (`once: true`); framer propagates `"visible"` to every descendant declaring `variants` (no child sets its own `initial`/`animate`).
- **Editorial image reveal** = `reveal` mask on the image wrapper. **Fade-up** = `childVariants` (eyebrow, description). **Category stagger** = nested `staggerContainer` on the category grid. **Lifestyle card reveal** = nested `staggerContainer` on the lifestyle list. The h2 also uses `reveal`. All composed from existing Phase 03 variants — **no new infrastructure**, no parallax, no pinning.
- **Reduced motion**: handled globally by Phase 03's `MotionConfig reducedMotion="user"` — transforms/masks collapse and content stays fully visible.

## 16. Deliverable 6 — Responsive behavior (zero CLS)

- **Mobile (`<640`)**: single column — image stacks above content; categories and lifestyle cards one-up.
- **Tablet (`640–1023`)**: section still stacked (image above content), but categories and lifestyle cards go two-up (`sm:grid-cols-2`).
- **Desktop (`≥1024`)**: true two-column editorial (`lg:grid-cols-2 lg:gap-16`) — image + floating stat left, header + categories + lifestyle right.
- **Zero CLS**: fixed `aspect-[4/5]` image box with `next/image` + blur placeholder; absolute floating stat; `h-full` cards keep grid cells equal-height; `scroll-mt-28` keeps the `#amenities` anchor clean.

## 17. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders after Overview on all three project routes
- [ ]  Two-column editorial on desktop; stacked on tablet/mobile
- [ ]  Lifestyle image + floating stat render with zero layout shift
- [ ]  Six categories (each with multiple amenities) + four lifestyle cards
- [ ]  Sidebar `Amenities` anchor still scrolls correctly
- [ ]  Heading order: h1 → h2 → h3 → h4
- [ ]  `prefers-reduced-motion`: no transform/mask; content fully visible
- [ ]  Zero ESLint / TS errors

<aside>
🧩

**Assumptions to reconcile:** `@/components/ui` (`Heading`, `Text`) and `@/lib/animation` (`staggerContainer`, `childVariants`, `reveal`) export as used; `cn` from `@/utils/cn`. Lifestyle images at `/public/images/projects/<slug>-lifestyle.jpg`. All copy is placeholder. If a name differs, only import lines change.

</aside>

<aside>
🛑

**STOP — Phase 07D complete. Awaiting approval before Phase 07E.** I author these as Notion pages but can't run `lint`/`tsc`/`build` myself — run the verify block and paste any errors and I'll fix the exact file(s).

</aside>