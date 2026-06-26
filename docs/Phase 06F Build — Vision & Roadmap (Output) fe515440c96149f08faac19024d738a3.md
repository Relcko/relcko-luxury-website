# Phase 06F Build — Vision & Roadmap (Output)

<aside>
🗺️

**Phase 06F — Vision & Roadmap.** A forward-looking, understated editorial section that follows Global Impact: a centered header above an **alternating vertical timeline** of milestones (year / title / description / optional supporting image). 7 pure, prop-driven, CMS-ready components + typed placeholder content. Reuses Phase 02 design system + Phase 03 motion. Timeline-line reveal, marker scale-in, and image reveal are **Variants composed from the existing `easing.out` token** — no new shared animation infrastructure, no new dependencies. Previous phases untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```
lib/
  vision-roadmap.ts             # Types + CMS-ready placeholder content
components/sections/vision-roadmap/
  VisionRoadmap.tsx             # Server orchestrator (section + centered header + timeline)
  RoadmapHeader.tsx             # Client: centered intro (eyebrow/h2/desc), fade-up
  Timeline.tsx                  # Client: <ol> stagger + animated center line
  TimelineItem.tsx              # Client: one <li>, alternating side, fade-up
  TimelineMarker.tsx            # Client: node dot, scale-in reveal
  TimelineContent.tsx           # Year + title + description (pure)
  TimelineMedia.tsx             # Client: next/image, image reveal
  index.ts                      # Barrel
app/
  page.tsx                      # EDIT — mount below Global Impact
```

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Container`, `Heading` (`level`/`size`), `Text` (`size`/`tone`). `@/lib/animation` exports `staggerContainer`, `childVariants`, and `easing` (with `easing.out` cubic-bezier tuple). Images live under `/public/images/roadmap/` (placeholders). Composing local `Variants` from `easing.out` is the established pattern from Phase 06C — not new infrastructure.

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + marker/content/media leaves. **Part 2** (appended next) = item, timeline, header, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/vision-roadmap.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the Vision & Roadmap section. Production sources
// this from Sanity; here we ship typed placeholders with the exact shape the
// CMS returns. No hardcoded copy lives inside the components. Images are
// optional per milestone.

export type RoadmapImage = {
	src: string
	alt: string
	width: number
	height: number
}

export type RoadmapMilestone = {
	id: string
	year: string
	title: string
	description: string
	image?: RoadmapImage
}

export type VisionRoadmapContent = {
	eyebrow: string
	heading: string
	description: string
	milestones: RoadmapMilestone[]
}

export const visionRoadmapContent: VisionRoadmapContent = {
	eyebrow: "Vision & Roadmap",
	heading: "Building the future of ownership",
	description:
		"A deliberate path from a single foundation to a global ecosystem — each stage measured, each ambition grounded in what we have already delivered.",
	milestones: [
		{
			id: "milestone-foundation",
			year: "2019",
			title: "Foundation",
			description:
				"The platform is established on a principle of disciplined, transparent ownership and a long-term view.",
		},
		{
			id: "milestone-developments",
			year: "2021",
			title: "Premium Developments",
			description:
				"A curated portfolio of landmark residences takes shape across the first wave of flagship cities.",
			image: {
				src: "/images/roadmap/developments.jpg",
				alt: "Architectural model of a premium residential development",
				width: 1280,
				height: 800,
			},
		},
		{
			id: "milestone-ownership",
			year: "2023",
			title: "Digital Ownership",
			description:
				"Ownership becomes fully digital — transparent records, streamlined transfers, and clarity at every step.",
		},
		{
			id: "milestone-expansion",
			year: "2025",
			title: "Global Expansion",
			description:
				"The platform extends across continents, opening access to a worldwide community of investors.",
			image: {
				src: "/images/roadmap/expansion.jpg",
				alt: "World map highlighting the platform's growing international presence",
				width: 1280,
				height: 800,
			},
		},
		{
			id: "milestone-ecosystem",
			year: "2027",
			title: "Future Ecosystem",
			description:
				"A connected ecosystem of services, partners, and tools — built around a single, trusted standard of ownership.",
			image: {
				src: "/images/roadmap/ecosystem.jpg",
				alt: "Abstract visualization of a connected digital ecosystem",
				width: 1280,
				height: 800,
			},
		},
	],
}
```

---

## 3. `TimelineContent.tsx` — year + title + description (pure)

```tsx
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type TimelineContentProps = {
	year: string
	title: string
	description: string
	className?: string
}

// Pure, server-renderable. Year as a restrained eyebrow, title as the
// milestone heading (h3), description as muted supporting copy.
export function TimelineContent({ year, title, description, className }: TimelineContentProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
				{year}
			</span>
			<Heading level={3} size="md">
				{title}
			</Heading>
			<Text size="md" tone="muted" className="max-w-[48ch]">
				{description}
			</Text>
		</div>
	)
}
```

---

## 4. `TimelineMarker.tsx` — node dot, scale-in reveal (client)

```tsx
"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { easing } from "@/lib/animation"
import { cn } from "@/utils/cn"

// Marker reveal: a local scale/opacity Variant composed from the Phase 03
// easing token. Inherits the visible state from the parent <li> trigger.
const markerVariants: Variants = {
	hidden: { opacity: 0, scale: 0.4 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easing.out } },
}

type TimelineMarkerProps = {
	className?: string
}

export function TimelineMarker({ className }: TimelineMarkerProps) {
	return (
		<motion.span
			variants={markerVariants}
			aria-hidden="true"
			className={cn(
				"flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated",
				className,
			)}
		>
			<span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
		</motion.span>
	)
}
```

---

## 5. `TimelineMedia.tsx` — optional supporting image (client)

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { easing } from "@/lib/animation"
import type { RoadmapImage } from "@/lib/vision-roadmap"
import { cn } from "@/utils/cn"

// Image reveal: gentle fade + settle, composed from the Phase 03 easing token.
const mediaVariants: Variants = {
	hidden: { opacity: 0, scale: 1.04 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: easing.out } },
}

type TimelineMediaProps = {
	image: RoadmapImage
	className?: string
}

export function TimelineMedia({ image, className }: TimelineMediaProps) {
	return (
		<motion.div
			variants={mediaVariants}
			className={cn(
				"relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-bg-elevated",
				className,
			)}
		>
			<Image
				src={image.src}
				alt={image.alt}
				fill
				loading="lazy"
				sizes="(min-width: 1024px) 28rem, (min-width: 640px) 80vw, 100vw"
				className="object-cover"
			/>
		</motion.div>
	)
}
```

<aside>
🖼️

`fill` inside a fixed `aspect-[16/10]` box + `sizes` gives responsive sources with **zero layout shift**; `loading="lazy"` defers offscreen milestone images. The box reserves its space whether or not the image has loaded.

</aside>

<aside>
⏭️

Part 2 (next) appends the item, timeline, header, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 6. `TimelineItem.tsx` — one milestone, alternating side (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants } from "@/lib/animation"
import type { RoadmapMilestone } from "@/lib/vision-roadmap"
import { cn } from "@/utils/cn"
import { TimelineMarker } from "./TimelineMarker"
import { TimelineContent } from "./TimelineContent"
import { TimelineMedia } from "./TimelineMedia"

type TimelineItemProps = {
	milestone: RoadmapMilestone
	index: number
}

// One <li>. Fade-up via childVariants (a stagger child of the <ol>). Marker and
// media inherit the visible state and play their own reveals. On lg the row is
// a two-column grid and even/odd items alternate sides of the center line.
export function TimelineItem({ milestone, index }: TimelineItemProps) {
	const isLeft = index % 2 === 0
	return (
		<motion.li
			variants={childVariants}
			className="relative pl-14 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0"
		>
			<TimelineMarker className="absolute left-[1.0625rem] top-1.5 -translate-x-1/2 lg:left-1/2" />
			<div
				className={cn(
					"flex flex-col gap-4",
					isLeft
						? "lg:col-start-1 lg:items-end lg:pr-16 lg:text-right"
						: "lg:col-start-2 lg:pl-16",
				)}
			>
				<TimelineContent
					year={milestone.year}
					title={milestone.title}
					description={milestone.description}
				/>
				{milestone.image ? <TimelineMedia image={milestone.image} /> : null}
			</div>
		</motion.li>
	)
}
```

---

## 7. `Timeline.tsx` — ordered list, stagger + center-line reveal (client)

```tsx
"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { staggerContainer, easing } from "@/lib/animation"
import type { RoadmapMilestone } from "@/lib/vision-roadmap"
import { cn } from "@/utils/cn"
import { TimelineItem } from "./TimelineItem"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

// Timeline reveal: the vertical line grows from the top (scaleY, origin top).
const lineVariants: Variants = {
	hidden: { scaleY: 0 },
	visible: { scaleY: 1, transition: { duration: 1.1, ease: easing.out } },
}

// Named style object (origin top) so the line scales downward from the start.
// Kept as a const — never write an inline style= ...  double-brace here.
const LINE_STYLE = { originY: 0 } as const

type TimelineProps = {
	milestones: RoadmapMilestone[]
	className?: string
}

// Semantic ordered list. One stagger trigger cascades each <li> (and the line)
// from hidden → visible — the "alternating stagger" as items reveal top to bottom.
export function Timeline({ milestones, className }: TimelineProps) {
	return (
		<motion.ol
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("relative flex flex-col gap-12 lg:gap-20", className)}
		>
			<motion.span
				aria-hidden="true"
				variants={lineVariants}
				style={LINE_STYLE}
				className="pointer-events-none absolute top-1.5 bottom-1.5 left-[1.0625rem] w-px -translate-x-1/2 bg-border lg:left-1/2"
			/>
			{milestones.map((milestone, index) => (
				<TimelineItem key={milestone.id} milestone={milestone} index={index} />
			))}
		</motion.ol>
	)
}
```

---

## 8. `RoadmapHeader.tsx` — centered editorial intro (client, fade-up)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { VisionRoadmapContent } from "@/lib/vision-roadmap"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type RoadmapHeaderProps = {
	content: Pick<VisionRoadmapContent, "eyebrow" | "heading" | "description">
	className?: string
}

export function RoadmapHeader({ content, className }: RoadmapHeaderProps) {
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("mx-auto flex max-w-2xl flex-col items-center gap-4 text-center", className)}
		>
			<motion.div variants={childVariants} className="flex flex-col items-center gap-3">
				<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
					{content.eyebrow}
				</span>
				<Heading level={2} size="xl" className="text-balance">
					{content.heading}
				</Heading>
			</motion.div>
			<motion.div variants={childVariants}>
				<Text size="md" tone="muted" className="text-balance">
					{content.description}
				</Text>
			</motion.div>
		</motion.div>
	)
}
```

---

## 9. `VisionRoadmap.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import { visionRoadmapContent, type VisionRoadmapContent } from "@/lib/vision-roadmap"
import { cn } from "@/utils/cn"
import { RoadmapHeader } from "./RoadmapHeader"
import { Timeline } from "./Timeline"

type VisionRoadmapProps = {
	content?: VisionRoadmapContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Centered
// header sits above the alternating vertical timeline.
export function VisionRoadmap({
	content = visionRoadmapContent,
	id = "vision",
	className,
}: VisionRoadmapProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="flex flex-col gap-14 md:gap-20">
					<RoadmapHeader content={content} />
					<Timeline milestones={content.milestones} />
				</div>
			</Container>
		</section>
	)
}
```

---

## 10. `index.ts` — barrel

```tsx
export { VisionRoadmap } from "./VisionRoadmap"
export { RoadmapHeader } from "./RoadmapHeader"
export { Timeline } from "./Timeline"
export { TimelineItem } from "./TimelineItem"
export { TimelineMarker } from "./TimelineMarker"
export { TimelineContent } from "./TimelineContent"
export { TimelineMedia } from "./TimelineMedia"
```

---

## 11. `app/page.tsx` — integrate below Global Impact (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"
import { GlobalImpact } from "@/components/sections/global-impact"
import { VisionRoadmap } from "@/components/sections/vision-roadmap"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />
			<FeaturedProjects id="featured" />
			<AboutSection id="about" />
			<OwnershipJourney id="ownership" />
			<PlatformAdvantages id="advantages" />
			<GlobalImpact id="impact" />
			<VisionRoadmap id="vision" />
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing Global Impact mount. All earlier sections are untouched.

</aside>

---

## 12. Deliverable 3 — Component hierarchy

```
VisionRoadmap                      (server: section + Container + header/timeline stack)
 ├── RoadmapHeader                 (client: centered intro, stagger trigger)
 └── Timeline                      (client: <ol> stagger trigger + animated line)
      ├── <span> line               (timeline reveal: scaleY from top)
      └── TimelineItem <li> ×5      (fade-up; alternating side on lg)
           ├── TimelineMarker        (client: node dot, scale-in reveal)
           ├── TimelineContent       (year + title h3 + description — pure)
           └── TimelineMedia         (client: next/image, image reveal — optional)
```

- **Client only where needed**: `RoadmapHeader`, `Timeline`, `TimelineItem`, `TimelineMarker`, and `TimelineMedia` opt into motion; `VisionRoadmap` and `TimelineContent` are server-renderable and pure.
- `TimelineItem` composes the marker, content, and optional media; each leaf is independently reusable and strictly typed.

## 13. Deliverable 4 — CMS data model

- All content lives in `lib/vision-roadmap.ts` as `VisionRoadmapContent`; **zero hardcoded copy in components**.
- Supports every required field: `heading` (+ `eyebrow`), `description`, and the `milestones` array.
- Each milestone is a typed `RoadmapMilestone` supporting `year`, `title`, `description`, and an **optional** `image` (`RoadmapImage` with `src`/`alt`/`width`/`height`).
- Add, remove, or reorder milestones purely from data — alternating sides derive from index, so the layout stays correct automatically.
- Swap `visionRoadmapContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 14. Deliverable 5 — Animation approach (Phase 03 only)

- **Fade-up** → each `TimelineItem` rises in via `childVariants`; `RoadmapHeader` uses the same on its eyebrow/heading/description.
- **Timeline reveal** → the center line is a `motion.span` with a local `lineVariants` (`scaleY` 0→1, `originY: 0`) so it draws from the top.
- **Marker reveal** → `TimelineMarker` scales/fades in via `markerVariants`.
- **Alternating stagger** → `Timeline` is a single `staggerContainer` trigger on the `<ol>`; children (line + items) cascade hidden→visible top to bottom while alternating sides on desktop.
- **Image reveal** → `TimelineMedia` fades + settles via `mediaVariants`.
- All custom Variants are **composed from the existing `easing.out` token** — no new shared utilities/files. The global `MotionConfig reducedMotion="user"` neutralizes transforms/opacity for reduced-motion users; content stays fully visible and readable.
- **No pinning, no horizontal scroll, no parallax.**

## 15. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<640`) & Tablet (`640–1023`)**: single-column timeline — line on the left, markers on the line, content (and any image) stacked to the right (`pl-14`). Generous vertical rhythm.
- **Desktop (`≥1024`)**: centered header above an **alternating** two-column timeline (`lg:grid-cols-2`) with the line centered (`lg:left-1/2`); even milestones sit left (right-aligned), odd milestones sit right.
- **No CLS**: images use `next/image` `fill` inside a fixed `aspect-[16/10]` box with `sizes` + `loading="lazy"`, so space is reserved and offscreen images defer; text-only milestones simply omit the media box.

## 16. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below Global Impact
- [ ]  Centered header above the timeline
- [ ]  Desktop alternates sides; tablet/mobile single column
- [ ]  Semantic `<section>` + ordered `<ol>` list; titles are h3 under the section h2
- [ ]  Center line draws in; markers scale in; items fade up in sequence
- [ ]  Optional images reveal; text-only milestones render with no gap
- [ ]  `prefers-reduced-motion`: content fully visible, no transforms
- [ ]  No layout shift as images load

<aside>
🧩

**Assumptions to reconcile against your real exports:** `@/lib/animation` exports `staggerContainer`, `childVariants`, `easing` (`easing.out`); `@/components/ui` exports `Container`, `Heading`, `Text`. Roadmap images are placeholders under `/public/images/roadmap/`. If a name differs, only the import line changes — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06F complete. Awaiting approval before Phase 06G.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>