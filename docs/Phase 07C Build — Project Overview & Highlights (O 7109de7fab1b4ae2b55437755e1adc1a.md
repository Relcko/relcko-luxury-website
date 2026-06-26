# Phase 07C Build — Project Overview & Highlights (Output)

<aside>
✒️

**Phase 07C — Project Overview & Highlights.** A premium two-column editorial section that transitions from the Hero into the project narrative: an eyebrow + heading + rich narrative + optional pull-quote on the left, and staggered highlight cards + key-metric cards on the right. Eight new pure, strictly-typed, CMS-ready components under `components/project/overview/`, bound to the **single** `Project` interface from 07A (extended *additively* — no duplicate interfaces). Motion is **Phase 03 only** (fade-up, editorial mask reveal, highlight stagger, metric reveal). The frozen Hero (07B) and its full-bleed layout are untouched; the only 07A edits are the sanctioned `ProjectLayout` integration + barrel re-export.

</aside>

## 1. Files in this phase

```jsx
lib/
  project.ts                       # EXTENDED (additive + optional) — overview-content types + placeholder builder
components/project/overview/
  ProjectOverviewSection.tsx       # Section shell + 2-col editorial grid (client, motion root)
  ProjectOverviewContent.tsx       # Left column: eyebrow, heading, narrative, quote (client)
  ProjectOverviewQuote.tsx         # Optional supporting pull-quote (client)
  ProjectOverviewHighlights.tsx    # Right column: highlight cards + metric cards (client)
  HighlightCard.tsx                # Reusable highlight card (pure)
  HighlightIcon.tsx                # Inline SVG icon by name (pure)
  HighlightValue.tsx               # Optional supporting value (pure)
  HighlightDescription.tsx         # Highlight description text (pure)
  index.ts                         # Barrel
components/project/
  ProjectLayout.tsx                # EDITED — integrate section directly below Quick Facts
  index.ts                         # EDITED — re-export ./overview
```

<aside>
🧭

**Design decisions (please sanity-check against the freeze):**

1. **Additive model extension, not a duplicate interface.** 07A's `overview: string[]` and `ProjectHighlight {id,title,description}` can't express a short/long split, a quote, highlight *icons*/*values*, or a metrics set. So `lib/project.ts` gains a few **new optional types** + one **optional** `Project.overviewContent?` field. No existing field, type, or function is modified → fully backward-compatible and CMS-ready (a Sanity record without it still type-checks).
2. **Frozen 07A components stay intact.** `ProjectOverview.tsx` and `ProjectHighlights.tsx` are **not edited or deleted** — they're simply no longer rendered (the new section supersedes both). Only their now-unused *imports* are removed from `ProjectLayout` to keep ESLint clean.
3. **Sidebar anchors preserved.** The new section keeps `id="overview"`, and the highlights block carries `id="highlights"` + `scroll-mt-28`, so both existing `PROJECT_SECTIONS` sidebar links still resolve — `PROJECT_SECTIONS` is left unchanged.
4. **Hero (07B) + full-bleed layout untouched.** Only the content-column composition changes.
</aside>

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Heading`, `Text` (and the rest). `@/lib/animation` exports `staggerContainer`, `childVariants` (fade-up), and `reveal` (mask). Global `MotionConfig reducedMotion="user"` (Phase 03) covers reduced-motion. `cn` from `@/utils/cn`. Placeholder copy/metrics only. If a name differs, only the import line changes.

</aside>

<aside>
📑

Delivered in **two parts** to avoid truncation. **Part 1** (below) = the additive `lib/project.ts` extension + the four leaf components (`HighlightIcon`, `HighlightValue`, `HighlightDescription`, `HighlightCard`). **Part 2** = `ProjectOverviewQuote`, `ProjectOverviewContent`, `ProjectOverviewHighlights`, `ProjectOverviewSection`, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/project.ts` — additive extension (new optional types + placeholder builder)

**Add these types** (near the other type exports — nothing existing is touched):

```tsx
// --- Phase 07C — editorial overview content (additive, optional) -----------
export type HighlightIconName =
	| "architecture"
	| "sustainability"
	| "location"
	| "community"
	| "design"
	| "investment"

export type OverviewHighlight = {
	id: string
	icon: HighlightIconName
	title: string
	value?: string // optional supporting value/metric
	description: string
}

export type ProjectMetric = { id: string; label: string; value: string }

export type OverviewQuote = {
	quote: string
	attribution?: string
	role?: string
}

// Note: the TYPE is `ProjectOverviewData`; the COMPONENT is `ProjectOverviewContent`
// (kept distinct to avoid a type/component name collision).
export type ProjectOverviewData = {
	eyebrow: string
	heading: string
	shortDescription: string
	longDescription: string[]
	quote?: OverviewQuote
	highlights: OverviewHighlight[]
	metrics?: ProjectMetric[]
}
```

**Add one optional field to the existing `Project` type** (anywhere inside it — shown here after `highlights`):

```tsx
// Project
overview: string[]
quickFacts: QuickFact[]
highlights: ProjectHighlight[]
overviewContent?: ProjectOverviewData // ← Phase 07C (optional, additive)
amenities: ProjectAmenity[]
```

**Add the placeholder builder + shared highlights**, then populate it inside the existing `buildProject` factory (one new line):

```tsx
const sharedOverviewHighlights: OverviewHighlight[] = [
	{
		id: "architecture",
		icon: "architecture",
		title: "Architecture",
		value: "Signature form",
		description:
			"A sculptural silhouette by an internationally recognised studio, composed for light, proportion, and permanence.",
	},
	{
		id: "sustainability",
		icon: "sustainability",
		title: "Sustainability",
		value: "LEED Platinum",
		description:
			"Passive design, high-performance facades, and on-site systems that lower running costs and footprint.",
	},
	{
		id: "location",
		icon: "location",
		title: "Premium location",
		value: "Waterfront",
		description:
			"Minutes from cultural, retail, and business districts, with seamless transit and waterfront frontage.",
	},
	{
		id: "community",
		icon: "community",
		title: "Community",
		value: "Curated",
		description:
			"A considered mix of residences, social spaces, and services that foster a genuine sense of belonging.",
	},
	{
		id: "design",
		icon: "design",
		title: "Design philosophy",
		value: "Human-centred",
		description:
			"Interiors finished to the millimetre, where every material and sightline is chosen for everyday calm.",
	},
	{
		id: "investment",
		icon: "investment",
		title: "Investment potential",
		value: "Resilient",
		description:
			"Scarce, well-managed assets in proven locations, with transparent reporting for every owner.",
	},
]

function buildOverviewContent(seed: ProjectSeed): ProjectOverviewData {
	return {
		eyebrow: "The vision",
		heading: "A considered approach to landmark living",
		shortDescription: seed.subtitle,
		longDescription: [
			...seed.overview,
			"From the arrival sequence to the private terraces, the development is organised around light, air, and a quiet sense of arrival — a place that rewards living in it every day.",
		],
		quote: {
			quote:
				"We designed every sightline to frame the horizon, so the architecture recedes and the place itself takes centre stage.",
			attribution: "Studio Meridian",
			role: "Lead Architects",
		},
		highlights: sharedOverviewHighlights,
		metrics: [
			{ id: "residences", label: "Total residences", value: "120" },
			{ id: "land", label: "Land area", value: "4.2 ha" },
			{ id: "completion", label: "Completion year", value: "2027" },
			{ id: "green", label: "Green certification", value: "LEED Platinum" },
			{ id: "category", label: "Property category", value: CATEGORY_LABELS[seed.category] },
		],
	}
}
```

```tsx
// Inside the existing buildProject(seed) return object, add ONE line:
		overview: seed.overview,
		overviewContent: buildOverviewContent(seed), // ← Phase 07C
		quickFacts: [
			// …unchanged…
		],
```

<aside>
🧩

**Why this respects the freeze.** Everything above is *added* — existing fields (`overview`, `highlights`, `quickFacts`), `buildProject`'s other lines, `PROJECT_SECTIONS`, and all helpers are byte-for-byte unchanged. `overviewContent` is optional, so any `Project` produced elsewhere (or a CMS record without it) still type-checks; the section simply doesn't render when it's absent.

</aside>

---

## 3. `HighlightIcon.tsx` — inline SVG icon by name (pure)

```tsx
import type { ReactNode } from "react"
import type { HighlightIconName } from "@/lib/project"
import { cn } from "@/utils/cn"

// Finite, typed icon registry → every HighlightIconName maps to decorative SVG.
const ICONS: Record<HighlightIconName, ReactNode> = {
	architecture: (
		<>
			<path d="M3 21h18" />
			<path d="M6 21V8l6-4 6 4v13" />
			<path d="M10 21v-5h4v5" />
		</>
	),
	sustainability: (
		<>
			<path d="M11 20A7 7 0 0 1 9 6c4-2 9-2 11-1 1 6-1 12-9 15Z" />
			<path d="M9 20c0-4 2-8 6-10" />
		</>
	),
	location: (
		<>
			<path d="M12 21s-6-5.5-6-10a6 6 0 1 1 12 0c0 4.5-6 10-6 10Z" />
			<circle cx="12" cy="11" r="2.5" />
		</>
	),
	community: (
		<>
			<circle cx="9" cy="8" r="3" />
			<path d="M3 20a6 6 0 0 1 12 0" />
			<path d="M16 6a3 3 0 0 1 0 6" />
			<path d="M18 20a6 6 0 0 0-3-5.2" />
		</>
	),
	design: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
		</>
	),
	investment: (
		<>
			<path d="M4 19h16" />
			<path d="M4 19V5" />
			<path d="M7 16l4-5 3 3 5-7" />
		</>
	),
}

type HighlightIconProps = {
	name: HighlightIconName
	className?: string
}

export function HighlightIcon({ name, className }: HighlightIconProps) {
	return (
		<span
			className={cn(
				"inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-base text-accent-gold",
				className,
			)}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
				aria-hidden="true"
				focusable="false"
			>
				{ICONS[name]}
			</svg>
		</span>
	)
}
```

---

## 4. `HighlightValue.tsx` — optional supporting value (pure)

```tsx
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type HighlightValueProps = {
	value: string
	className?: string
}

export function HighlightValue({ value, className }: HighlightValueProps) {
	return (
		<Text
			size="sm"
			className={cn("whitespace-nowrap font-medium text-accent-gold", className)}
		>
			{value}
		</Text>
	)
}
```

---

## 5. `HighlightDescription.tsx` — highlight description text (pure)

```tsx
import { Text } from "@/components/ui"

type HighlightDescriptionProps = {
	description: string
	className?: string
}

export function HighlightDescription({
	description,
	className,
}: HighlightDescriptionProps) {
	return (
		<Text size="sm" tone="muted" className={className}>
			{description}
		</Text>
	)
}
```

---

## 6. `HighlightCard.tsx` — reusable highlight card (pure)

```tsx
import { Heading } from "@/components/ui"
import type { OverviewHighlight } from "@/lib/project"
import { cn } from "@/utils/cn"
import { HighlightIcon } from "./HighlightIcon"
import { HighlightValue } from "./HighlightValue"
import { HighlightDescription } from "./HighlightDescription"

type HighlightCardProps = {
	highlight: OverviewHighlight
	className?: string
}

// Pure presentational card — composed from the three leaf parts. Motion is
// applied by the parent list (ProjectOverviewHighlights), so this stays SSR-pure.
export function HighlightCard({ highlight, className }: HighlightCardProps) {
	return (
		<article
			className={cn(
				"flex h-full flex-col gap-3 rounded-2xl border border-border bg-bg-elevated p-5",
				className,
			)}
		>
			<HighlightIcon name={highlight.icon} />
			<div className="flex flex-col gap-1.5">
				<div className="flex items-baseline justify-between gap-3">
					<Heading level={3} size="sm">
						{highlight.title}
					</Heading>
					{highlight.value ? <HighlightValue value={highlight.value} /> : null}
				</div>
				<HighlightDescription description={highlight.description} />
			</div>
		</article>
	)
}
```

<aside>
⏭️

Part 2 (next) appends `ProjectOverviewQuote`, `ProjectOverviewContent`, `ProjectOverviewHighlights`, the `ProjectOverviewSection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, and the six deliverable explanations.

</aside>

---

## 7. `ProjectOverviewQuote.tsx` — optional supporting pull-quote (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants } from "@/lib/animation"
import { Text } from "@/components/ui"
import type { OverviewQuote } from "@/lib/project"
import { cn } from "@/utils/cn"

type ProjectOverviewQuoteProps = {
	quote: OverviewQuote
	className?: string
}

// Semantic figure/blockquote; fades up as part of the left-column stagger.
export function ProjectOverviewQuote({ quote, className }: ProjectOverviewQuoteProps) {
	return (
		<motion.figure
			variants={childVariants}
			className={cn("flex flex-col gap-3 border-l-2 border-accent-gold/60 pl-5", className)}
		>
			<blockquote>
				<Text size="lg" className="text-balance text-text-primary">
					“{quote.quote}”
				</Text>
			</blockquote>
			{quote.attribution ? (
				<figcaption>
					<Text size="sm" tone="subtle">
						{quote.attribution}
						{quote.role ? `, ${quote.role}` : ""}
					</Text>
				</figcaption>
			) : null}
		</motion.figure>
	)
}
```

---

## 8. `ProjectOverviewContent.tsx` — left editorial column (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { ProjectOverviewData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { ProjectOverviewQuote } from "./ProjectOverviewQuote"

type ProjectOverviewContentProps = {
	content: ProjectOverviewData
	className?: string
}

// Left column. A nested stagger container: each child inherits the section's
// "visible" state and fades up in sequence; the heading uses the `reveal` mask
// for the editorial reveal. No own initial/animate — the parent section drives it.
export function ProjectOverviewContent({ content, className }: ProjectOverviewContentProps) {
	return (
		<motion.div variants={staggerContainer} className={cn("flex flex-col gap-6", className)}>
			<motion.span
				variants={childVariants}
				className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold"
			>
				{content.eyebrow}
			</motion.span>
			<motion.div variants={reveal}>
				<Heading level={2} size="xl" className="text-balance">
					{content.heading}
				</Heading>
			</motion.div>
			<motion.div variants={childVariants}>
				<Text size="lg" className="text-balance text-text-primary">
					{content.shortDescription}
				</Text>
			</motion.div>
			<div className="flex flex-col gap-4">
				{content.longDescription.map((paragraph, index) => (
					<motion.div key={index} variants={childVariants}>
						<Text tone="muted">{paragraph}</Text>
					</motion.div>
				))}
			</div>
			{content.quote ? <ProjectOverviewQuote quote={content.quote} /> : null}
		</motion.div>
	)
}
```

---

## 9. `ProjectOverviewHighlights.tsx` — right column: highlight + metric cards (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { OverviewHighlight, ProjectMetric } from "@/lib/project"
import { cn } from "@/utils/cn"
import { HighlightCard } from "./HighlightCard"

type ProjectOverviewHighlightsProps = {
	highlights: OverviewHighlight[]
	metrics?: ProjectMetric[]
	className?: string
}

// Right column. Carries id="highlights" (+ scroll-mt) so the existing sidebar
// anchor still resolves. Highlights stagger in; metric cards reveal after.
export function ProjectOverviewHighlights({
	highlights,
	metrics,
	className,
}: ProjectOverviewHighlightsProps) {
	return (
		<motion.div
			id="highlights"
			variants={staggerContainer}
			className={cn("flex scroll-mt-28 flex-col gap-8", className)}
		>
			<motion.ul
				variants={staggerContainer}
				className="grid grid-cols-1 gap-4 sm:grid-cols-2"
			>
				{highlights.map((highlight) => (
					<motion.li key={highlight.id} variants={childVariants}>
						<HighlightCard highlight={highlight} />
					</motion.li>
				))}
			</motion.ul>
			{metrics && metrics.length > 0 ? (
				<motion.div variants={childVariants} className="flex flex-col gap-3">
					<Heading level={3} size="sm">
						Key metrics
					</Heading>
					<motion.dl variants={staggerContainer} className="grid grid-cols-2 gap-3">
						{metrics.map((metric) => (
							<motion.div
								key={metric.id}
								variants={childVariants}
								className="flex flex-col gap-1 rounded-2xl border border-border bg-bg-base p-4"
							>
								<dt>
									<Text size="sm" tone="subtle" className="uppercase tracking-[0.16em]">
										{metric.label}
									</Text>
								</dt>
								<dd>
									<Text className="font-medium text-text-primary">{metric.value}</Text>
								</dd>
							</motion.div>
						))}
					</motion.dl>
				</motion.div>
			) : null}
		</motion.div>
	)
}
```

---

## 10. `ProjectOverviewSection.tsx` — section shell + 2-col editorial grid (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer } from "@/lib/animation"
import type { ProjectOverviewData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { ProjectOverviewContent } from "./ProjectOverviewContent"
import { ProjectOverviewHighlights } from "./ProjectOverviewHighlights"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectOverviewSectionProps = {
	content: ProjectOverviewData
	className?: string
}

// The single motion trigger: whileInView fires once, propagating "visible" down
// through both columns and their nested stagger containers. id="overview" keeps
// the sidebar anchor; generous vertical rhythm transitions from the Hero.
export function ProjectOverviewSection({ content, className }: ProjectOverviewSectionProps) {
	return (
		<motion.section
			id="overview"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
				<ProjectOverviewContent content={content} />
				<ProjectOverviewHighlights highlights={content.highlights} metrics={content.metrics} />
			</div>
		</motion.section>
	)
}
```

---

## 11. `components/project/overview/index.ts` — barrel

```tsx
export { ProjectOverviewSection } from "./ProjectOverviewSection"
export { ProjectOverviewContent } from "./ProjectOverviewContent"
export { ProjectOverviewQuote } from "./ProjectOverviewQuote"
export { ProjectOverviewHighlights } from "./ProjectOverviewHighlights"
export { HighlightCard } from "./HighlightCard"
export { HighlightIcon } from "./HighlightIcon"
export { HighlightValue } from "./HighlightValue"
export { HighlightDescription } from "./HighlightDescription"
```

---

## 12. `ProjectLayout.tsx` — integrate the section (the only 07A render edit)

Replaces the old `<ProjectOverview>` + `<ProjectHighlights>` (removed from the layout *and their imports*) with the new guarded `<ProjectOverviewSection>`, placed first in the main column — directly below the full-bleed Hero and Quick Facts. Everything else (full-bleed hero position, grid, sticky sidebar, dynamic imports, section order) is unchanged.

```tsx
import dynamic from "next/dynamic"
import { Container } from "@/components/ui"
import type { Project, ProjectSummary } from "@/lib/project"
import { ProjectBreadcrumb } from "./ProjectBreadcrumb"
import { ProjectHero } from "./hero"
import { QuickFacts } from "./QuickFacts"
import { ProjectOverviewSection } from "./overview"
import { ProjectAmenities } from "./ProjectAmenities"
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
🔒

**Frozen-safe.** `ProjectOverview.tsx` and `ProjectHighlights.tsx` are untouched on disk — only their *imports/usage* leave `ProjectLayout`. The Hero, full-bleed positioning, grid, sticky sidebar, dynamic imports, and the Amenities→…→Related order are all byte-for-byte unchanged.

</aside>

---

## 13. `components/project/index.ts` — re-export overview (edit)

Append one line to the existing barrel (existing exports, including the now-superseded `ProjectOverview` / `ProjectHighlights`, are left as-is):

```tsx
// …existing exports unchanged…
export * from "./overview"
```

---

## 14. Deliverable 3 — Component hierarchy

```jsx
ProjectLayout (main column)
 └── ProjectOverviewSection            (client: motion.section, the single whileInView trigger)
      └── grid lg:grid-cols-2
           ├── ProjectOverviewContent  (client: nested stagger)
           │    ├── eyebrow            (childVariants — fade-up)
           │    ├── Heading h2         (reveal — editorial mask)
           │    ├── shortDescription   (childVariants)
           │    ├── longDescription[]  (childVariants per paragraph)
           │    └── ProjectOverviewQuote (childVariants; figure/blockquote)
           └── ProjectOverviewHighlights (client: nested stagger, id="highlights")
                ├── ul → HighlightCard[]   (stagger)
                │         └── HighlightCard (pure)
                │              ├── HighlightIcon        (pure, typed SVG registry)
                │              ├── HighlightValue       (pure, optional)
                │              └── HighlightDescription (pure)
                └── dl → metric cards[]     (metric reveal)
```

- **8 components**, all single-purpose. The three leaf parts (`HighlightIcon`/`Value`/`Description`) and `HighlightCard` are **pure/SSR** — motion is applied only by the list wrappers, so cards stay reusable anywhere.
- **Client only where motion lives**: the section, the two columns, and the quote. Heading hierarchy is clean: Hero `h1` → section `h2` → card / "Key metrics" `h3`.

## 15. Deliverable 4 — CMS bindings

- Everything binds to the **single** `Project` interface via the new optional `Project.overviewContent: ProjectOverviewData` — **no duplicate interfaces**. Nested types: `OverviewHighlight` (with typed `HighlightIconName` + optional `value`), `ProjectMetric`, `OverviewQuote`.
- Field-by-field: `eyebrow`/`heading`/`shortDescription`/`longDescription[]` → left column; `quote?` → `ProjectOverviewQuote`; `highlights[]` → `HighlightCard`s; `metrics?[]` → metric cards (incl. **Property category** derived from `CATEGORY_LABELS[category]`, so it's correct per project).
- **No hardcoded copy** in components — every string is read from data. Placeholder values live in `buildOverviewContent(seed)`; swapping the placeholder block for a Sanity fetch that returns this shape is the only production change.
- `overviewContent` is **optional** → CMS records without it still type-check, and `ProjectLayout` guards the render.

## 16. Deliverable 5 — Animation approach (Phase 03 only)

- **One trigger**: `ProjectOverviewSection` is the only `whileInView` (`once: true`) element; it sets `initial="hidden"`/`animate→"visible"` and framer **propagates** the label to every descendant that declares `variants` (no child sets its own `initial`/`animate`).
- **Fade-up** = `childVariants` (eyebrow, lead, paragraphs, metric block). **Editorial reveal** = `reveal` mask on the `h2`. **Highlight stagger** = nested `staggerContainer` on the `ul`. **Metric reveal** = nested `staggerContainer` on the `dl`. All composed from existing Phase 03 variants — **no new animation infrastructure**, no parallax, no pinning.
- **Reduced motion**: handled globally by Phase 03's `MotionConfig reducedMotion="user"` — transforms collapse and content remains fully visible/legible.

## 17. Deliverable 6 — Responsive behavior (zero CLS)

- **Mobile (`<1024`)**: single column — narrative stacks above highlights; highlight cards single-column (`grid-cols-1`), metric cards two-up. Generous `py-16` rhythm.
- **Tablet**: highlight cards go two-up (`sm:grid-cols-2`) while the section stays stacked.
- **Desktop (`≥1024`)**: true two-column editorial (`lg:grid-cols-2 lg:gap-16`) — narrative + quote left, highlights + metrics right.
- **Zero CLS**: text/SVG-only section (no images to reflow); cards use `h-full` so equal-height grid cells don't jump; `scroll-mt-28` keeps anchored scrolling clean. (`next/image` + blur placeholders remain the standard for any imagery this section later adopts.)

## 18. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders below Hero / Quick Facts on all three project routes
- [ ]  Two columns on desktop; stacked on tablet/mobile; generous spacing
- [ ]  Six highlight cards (icon + title + value + description) + five metric cards
- [ ]  Sidebar `Overview` and `Highlights` anchors both scroll correctly
- [ ]  Heading order: Hero h1 → section h2 → card/metrics h3
- [ ]  `prefers-reduced-motion`: no transform/mask; content fully visible
- [ ]  Zero layout shift; zero ESLint / TS errors

<aside>
🧩

**Assumptions to reconcile:** `@/components/ui` (`Heading`, `Text`) and `@/lib/animation` (`staggerContainer`, `childVariants`, `reveal`) export as used; `cn` from `@/utils/cn`. Icons are decorative inline SVG (no extra dependency). All copy/metrics are placeholders. If a name differs, only import lines change.

</aside>

<aside>
🛑

**STOP — Phase 07C complete. Awaiting approval before Phase 07D.** I author these as Notion pages but can't run `lint`/`tsc`/`build` myself — run the verify block and paste any errors and I'll fix the exact file(s).

</aside>