# Phase 07G Build — Investment & Digital Ownership (Output)

<aside>
💎

**Phase 07G — Investment & Digital Ownership.** A premium editorial split that explains *how investors participate* in plain, trustworthy language — no blockchain jargon, no financial promises, placeholder content only. Built entirely on the frozen Phase 02 design system + Phase 03 motion. Delivered in **two parts** (this page = Part 1).

</aside>

<aside>
🤊

**Model gap + decision.** The frozen 07A `InvestmentInfo` is too thin for an ownership journey, highlight list, investment cards, an ownership model, metric cards, and a CTA. Per the standing rule I add **one optional additive field** — `Project.investmentContent?: ProjectInvestmentData` — reusing existing primitives, renaming/removing nothing. The existing `investment: InvestmentInfo` field stays intact (the frozen `ProjectInvestment.tsx` still references it on disk). The **Additive Optional Field Registry is updated** with the 07G row.

</aside>

<aside>
📄

**Files.** New under `components/project/investment/`: `ProjectInvestmentSection.tsx`, `InvestmentContent.tsx`, `OwnershipJourneySummary.tsx`, `InvestmentHighlights.tsx`, `InvestmentCard.tsx`, `OwnershipModel.tsx`, `InvestmentMetric.tsx`, `InvestmentCTA.tsx`, `index.ts`. **Edited:** `lib/project.ts` (additive types + builder), `components/project/ProjectLayout.tsx` (swap render after Location), `components/project/index.ts` (barrel), and the registry page.

</aside>

<aside>
🔒

**Frozen-safe.** No existing `Project` field renamed/removed/retyped. 07A `ProjectInvestment.tsx` left untouched on disk — only its dynamic import/usage leaves `ProjectLayout`. Section keeps `id="investment"` so the sidebar anchor and `PROJECT_SECTIONS` are unchanged. Hero, Overview, Amenities, Gallery, Location all unchanged.

</aside>

<aside>
🧩

**Assumptions.** `@/components/ui` exports `Heading`, `Text` (tones `muted`/`subtle`/`accent`), `Button` (`variant`, `size`, `asChild`); `@/lib/animation` exports `staggerContainer`, `childVariants`, `reveal`; `cn` from `@/utils/cn`; `next/link` for the CTA. All wording is placeholder and informational — no performance/return claims. If a name differs, only import lines change.

</aside>

---

## 1. `lib/project.ts` — additive types + placeholder builder

Appended after the existing `InvestmentInfo` declaration; existing types/fields untouched.

```tsx
// ────────────── Phase 07G — Investment & Digital Ownership (additive) ──────────────

export type OwnershipJourneyStep = {
	id: string
	title: string
	description: string
}

export type InvestmentHighlight = {
	id: string
	title: string
	description: string
}

export type InvestmentCardData = {
	id: string
	title: string
	description: string
	detail?: string
}

export type OwnershipModelPoint = {
	id: string
	label: string
	detail?: string
}

export type OwnershipModelData = {
	title: string
	summary: string
	points: OwnershipModelPoint[]
}

export type InvestmentMetricData = {
	id: string
	label: string
	value: string
	detail?: string
}

export type InvestmentCTAData = {
	label: string
	href: string
	description?: string
}

export type ProjectInvestmentData = {
	eyebrow: string
	heading: string
	description: string
	ownershipJourney: OwnershipJourneyStep[]
	highlights: InvestmentHighlight[]
	cards: InvestmentCardData[]
	ownershipModel: OwnershipModelData
	metrics: InvestmentMetricData[]
	cta: InvestmentCTAData
}
```

The single additive field on `Project` (placed right after the existing `investment: InvestmentInfo`):

```tsx
export type Project = {
	// …all existing fields unchanged…
	investment: InvestmentInfo
	investmentContent?: ProjectInvestmentData // 07G — additive, optional
	// …overviewContent?, amenitiesContent?, galleryContent?, locationContent? …
}
```

Placeholder data + builder (generic, informational — no financial promises):

```tsx
const sharedOwnershipJourney: OwnershipJourneyStep[] = [
	{
		id: "explore",
		title: "Explore the opportunity",
		description:
			"Review the project vision, the design, and the share of ownership available to participants.",
	},
	{
		id: "register",
		title: "Express your interest",
		description:
			"Register to receive the information pack and speak with the ownership team at your own pace.",
	},
	{
		id: "confirm",
		title: "Confirm your participation",
		description:
			"Complete the documented onboarding steps with guided support — no obligation until you choose to proceed.",
	},
	{
		id: "co-own",
		title: "Co-own and stay informed",
		description:
			"Hold your share and receive ongoing project updates through a single, clear dashboard.",
	},
]

const sharedInvestmentHighlights: InvestmentHighlight[] = [
	{
		id: "access",
		title: "Considered access",
		description:
			"Participation is structured to be approachable, with clear documentation at every step.",
	},
	{
		id: "transparency",
		title: "Transparency by design",
		description:
			"Ownership details, availability, and project updates are presented in plain language.",
	},
	{
		id: "vision",
		title: "A long-term vision",
		description:
			"The project is positioned as a long-horizon asset intended to be held and enjoyed over time.",
	},
]

const sharedInvestmentCards: InvestmentCardData[] = [
	{
		id: "minimum",
		title: "Minimum participation",
		description:
			"A clearly defined entry share, so you know exactly what participation involves.",
		detail: "Placeholder share size",
	},
	{
		id: "availability",
		title: "Availability",
		description: "A limited allocation is made available for each project phase.",
		detail: "Limited allocation",
	},
	{
		id: "distribution",
		title: "Distribution approach",
		description:
			"Any project distributions are described in advance and shared on a defined schedule.",
		detail: "Defined schedule",
	},
	{
		id: "benefits",
		title: "Investor benefits",
		description:
			"Owners receive curated updates, invitations, and access tied to the project.",
	},
]

const sharedOwnershipModel: OwnershipModelData = {
	title: "How ownership is structured",
	summary:
		"Ownership is divided into clearly defined shares, so several participants can co-own a single landmark project with confidence.",
	points: [
		{ id: "shared", label: "Shared ownership", detail: "the project is divided into defined, documented shares" },
		{ id: "records", label: "Clear records", detail: "each share is recorded and easy to verify" },
		{ id: "stewardship", label: "Professional stewardship", detail: "the asset is managed on behalf of all owners" },
		{ id: "transfers", label: "Considered transfers", detail: "a transparent process is described for transferring a share" },
	],
}

const sharedInvestmentMetrics: InvestmentMetricData[] = [
	{ id: "ownership-type", label: "Ownership type", value: "Shared ownership", detail: "Documented shares" },
	{ id: "participation", label: "Participation model", value: "By registration", detail: "Guided onboarding" },
	{ id: "availability", label: "Availability", value: "Limited", detail: "Per project phase" },
	{ id: "documentation", label: "Documentation", value: "Provided", detail: "Plain-language pack" },
]

const investmentCTA: InvestmentCTAData = {
	label: "Register your interest",
	href: "/contact",
	description: "Request the information pack and speak with the ownership team. No obligation.",
}

export function buildInvestmentContent(seed: ProjectSeed): ProjectInvestmentData {
	return {
		eyebrow: "Investment & ownership",
		heading: `Own a share of ${seed.title}`,
		description:
			"A considered way to participate in a landmark project — presented in plain language, with clear documentation and no financial promises.",
		ownershipJourney: sharedOwnershipJourney,
		highlights: sharedInvestmentHighlights,
		cards: sharedInvestmentCards,
		ownershipModel: sharedOwnershipModel,
		metrics: sharedInvestmentMetrics,
		cta: investmentCTA,
	}
}
```

One new line inside `buildProject` (alongside the other `*Content` builders):

```tsx
investmentContent: buildInvestmentContent(seed),
```

<aside>
🗛️

**Wording guardrail.** All copy is generic and informational — it describes *structure and process* (shares, documentation, registration, schedule) and explicitly avoids returns, yields, projections, or guarantees. "Digital ownership" is conveyed through plain terms like "documented shares" and "verify" — **no** wallet/token/chain vocabulary.

</aside>

---

## 2. `InvestmentCard.tsx` — pure investment card

```tsx
import { Heading, Text } from "@/components/ui"
import type { InvestmentCardData } from "@/lib/project"
import { cn } from "@/utils/cn"

type InvestmentCardProps = {
	card: InvestmentCardData
	className?: string
}

// Pure / SSR. A single participation fact (e.g. minimum, availability,
// distribution). h4 keeps hierarchy under the section h2 + group h3.
export function InvestmentCard({ card, className }: InvestmentCardProps) {
	return (
		<article
			className={cn(
				"flex h-full flex-col gap-2 rounded-2xl border border-border bg-bg-elevated p-5",
				className,
			)}
		>
			<Heading level={4} size="sm">
				{card.title}
			</Heading>
			<Text size="sm" tone="muted">
				{card.description}
			</Text>
			{card.detail ? (
				<Text size="sm" tone="accent" className="mt-auto">
					{card.detail}
				</Text>
			) : null}
		</article>
	)
}
```

---

## 3. `OwnershipModel.tsx` — pure ownership model panel

```tsx
import { Heading, Text } from "@/components/ui"
import type { OwnershipModelData } from "@/lib/project"
import { cn } from "@/utils/cn"

type OwnershipModelProps = {
	model: OwnershipModelData
	className?: string
}

// Pure / SSR. Explains the structure in plain language. aria-label ties the
// region to its title; decorative gold markers are aria-hidden.
export function OwnershipModel({ model, className }: OwnershipModelProps) {
	return (
		<section
			aria-label={model.title}
			className={cn(
				"flex flex-col gap-4 rounded-3xl border border-border bg-bg-elevated p-6",
				className,
			)}
		>
			<div className="flex flex-col gap-2">
				<Heading level={4} size="sm">
					{model.title}
				</Heading>
				<Text size="sm" tone="muted">
					{model.summary}
				</Text>
			</div>
			<ul className="flex flex-col gap-2.5">
				{model.points.map((point) => (
					<li key={point.id} className="flex items-start gap-2.5">
						<span
							aria-hidden="true"
							className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold/70"
						/>
						<Text size="sm" tone="muted">
							<span className="text-text-primary">{point.label}</span>
							{point.detail ? ` — ${point.detail}` : ""}
						</Text>
					</li>
				))}
			</ul>
		</section>
	)
}
```

---

## 4. `InvestmentMetric.tsx` — pure metric card

```tsx
import { Text } from "@/components/ui"
import type { InvestmentMetricData } from "@/lib/project"
import { cn } from "@/utils/cn"

type InvestmentMetricProps = {
	metric: InvestmentMetricData
	className?: string
}

// Pure / SSR. Mirrors the Phase 07F TravelMetric shape for visual consistency.
export function InvestmentMetric({ metric, className }: InvestmentMetricProps) {
	return (
		<div
			className={cn(
				"flex h-full flex-col gap-1 rounded-2xl border border-border bg-bg-elevated p-4",
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

## 5. `InvestmentCTA.tsx` — pure primary CTA panel

```tsx
import Link from "next/link"
import { Button, Text } from "@/components/ui"
import type { InvestmentCTAData } from "@/lib/project"
import { cn } from "@/utils/cn"

type InvestmentCTAProps = {
	cta: InvestmentCTAData
	className?: string
}

// Pure / SSR. Reuses the Phase 02 Button (asChild -> next/link) so keyboard
// focus, focus-visible ring, and routing come from the design system.
export function InvestmentCTA({ cta, className }: InvestmentCTAProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 rounded-3xl border border-accent-gold/30 bg-bg-elevated p-6",
				className,
			)}
		>
			{cta.description ? (
				<Text size="sm" tone="muted">
					{cta.description}
				</Text>
			) : null}
			<Button asChild variant="primary" size="lg">
				<Link href={cta.href}>{cta.label}</Link>
			</Button>
		</div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends `InvestmentHighlights`, `OwnershipJourneySummary`, `InvestmentContent`, the `ProjectInvestmentSection` orchestrator, the barrel, the `ProjectLayout` + barrel integration, the registry update, and the deliverable explanations.

</aside>

---

## 6. `InvestmentHighlights.tsx` — investment highlights list (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { InvestmentHighlight } from "@/lib/project"
import { cn } from "@/utils/cn"

type InvestmentHighlightsProps = {
	highlights: InvestmentHighlight[]
	className?: string
}

// Staggered fade-up list. Inherits "visible" from the section; no own trigger.
export function InvestmentHighlights({ highlights, className }: InvestmentHighlightsProps) {
	if (highlights.length === 0) return null
	return (
		<motion.div variants={staggerContainer} className={cn("flex flex-col gap-4", className)}>
			<motion.div variants={childVariants}>
				<Heading level={3} size="sm">
					Investment highlights
				</Heading>
			</motion.div>
			<motion.ul variants={staggerContainer} className="flex flex-col gap-3">
				{highlights.map((highlight) => (
					<motion.li key={highlight.id} variants={childVariants} className="flex flex-col gap-1">
						<Text className="text-text-primary">{highlight.title}</Text>
						<Text size="sm" tone="muted">
							{highlight.description}
						</Text>
					</motion.li>
				))}
			</motion.ul>
		</motion.div>
	)
}
```

---

## 7. `OwnershipJourneySummary.tsx` — ordered ownership journey (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { OwnershipJourneyStep } from "@/lib/project"
import { cn } from "@/utils/cn"

type OwnershipJourneySummaryProps = {
	steps: OwnershipJourneyStep[]
	className?: string
}

// Semantic ordered list (<ol>) — the numbered markers are decorative
// (aria-hidden) since <ol> already conveys order. Steps stagger (fade-up).
export function OwnershipJourneySummary({ steps, className }: OwnershipJourneySummaryProps) {
	if (steps.length === 0) return null
	return (
		<motion.div variants={staggerContainer} className={cn("flex flex-col gap-4", className)}>
			<motion.div variants={childVariants}>
				<Heading level={3} size="sm">
					How ownership works
				</Heading>
			</motion.div>
			<motion.ol variants={staggerContainer} className="flex flex-col gap-4">
				{steps.map((step, index) => (
					<motion.li key={step.id} variants={childVariants} className="flex items-start gap-3">
						<span
							aria-hidden="true"
							className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-gold/40 font-display-sans text-sm text-accent-gold"
						>
							{index + 1}
						</span>
						<div className="flex flex-col gap-1">
							<Text className="text-text-primary">{step.title}</Text>
							<Text size="sm" tone="muted">
								{step.description}
							</Text>
						</div>
					</motion.li>
				))}
			</motion.ol>
		</motion.div>
	)
}
```

---

## 8. `InvestmentContent.tsx` — left column (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { InvestmentHighlight, OwnershipJourneyStep } from "@/lib/project"
import { cn } from "@/utils/cn"
import { OwnershipJourneySummary } from "./OwnershipJourneySummary"
import { InvestmentHighlights } from "./InvestmentHighlights"

type InvestmentContentProps = {
	eyebrow: string
	heading: string
	description: string
	ownershipJourney: OwnershipJourneyStep[]
	highlights: InvestmentHighlight[]
	className?: string
}

// Left column: editorial header (eyebrow + h2 reveal + description) then the
// ownership journey and investment highlights. Inherits "visible".
export function InvestmentContent({
	eyebrow,
	heading,
	description,
	ownershipJourney,
	highlights,
	className,
}: InvestmentContentProps) {
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
			<OwnershipJourneySummary steps={ownershipJourney} />
			<InvestmentHighlights highlights={highlights} />
		</div>
	)
}
```

---

## 9. `ProjectInvestmentSection.tsx` — section shell + split layout (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants, reveal } from "@/lib/animation"
import { Heading } from "@/components/ui"
import type { ProjectInvestmentData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { InvestmentContent } from "./InvestmentContent"
import { InvestmentCard } from "./InvestmentCard"
import { OwnershipModel } from "./OwnershipModel"
import { InvestmentMetric } from "./InvestmentMetric"
import { InvestmentCTA } from "./InvestmentCTA"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectInvestmentSectionProps = {
	content: ProjectInvestmentData
	className?: string
}

// Single motion trigger (whileInView, once) propagates "visible" to the left
// column, the card grid, the ownership model, the metrics grid, and the CTA.
// id="investment" preserves the sidebar anchor. No parallax, no pinning.
export function ProjectInvestmentSection({ content, className }: ProjectInvestmentSectionProps) {
	return (
		<motion.section
			id="investment"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
				{/* Left: editorial content */}
				<InvestmentContent
					eyebrow={content.eyebrow}
					heading={content.heading}
					description={content.description}
					ownershipJourney={content.ownershipJourney}
					highlights={content.highlights}
				/>
				{/* Right: cards + ownership model + metrics + CTA */}
				<motion.div variants={staggerContainer} className="flex flex-col gap-6">
					{content.cards.length > 0 ? (
						<motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{content.cards.map((card) => (
								<motion.div key={card.id} variants={childVariants}>
									<InvestmentCard card={card} />
								</motion.div>
							))}
						</motion.div>
					) : null}
					<motion.div variants={childVariants}>
						<OwnershipModel model={content.ownershipModel} />
					</motion.div>
					{content.metrics.length > 0 ? (
						<motion.div variants={childVariants} className="flex flex-col gap-3">
							<Heading level={3} size="sm">
								Key details
							</Heading>
							<motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3">
								{content.metrics.map((metric) => (
									<motion.div key={metric.id} variants={childVariants}>
										<InvestmentMetric metric={metric} />
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					) : null}
					<motion.div variants={reveal}>
						<InvestmentCTA cta={content.cta} />
					</motion.div>
				</motion.div>
			</div>
		</motion.section>
	)
}
```

---

## 10. `components/project/investment/index.ts` — barrel

```tsx
export { ProjectInvestmentSection } from "./ProjectInvestmentSection"
export { InvestmentContent } from "./InvestmentContent"
export { OwnershipJourneySummary } from "./OwnershipJourneySummary"
export { InvestmentHighlights } from "./InvestmentHighlights"
export { InvestmentCard } from "./InvestmentCard"
export { OwnershipModel } from "./OwnershipModel"
export { InvestmentMetric } from "./InvestmentMetric"
export { InvestmentCTA } from "./InvestmentCTA"
```

---

## 11. `ProjectLayout.tsx` — integrate after Location (the only 07A render edit)

Removes the old `<ProjectInvestment investment={project.investment} />` (import + usage) and renders the new `<ProjectInvestmentSection>` in its place, immediately after the Location section. Everything else is unchanged.

```tsx
// — import changes —
// REMOVE: import { ProjectInvestment } from "./ProjectInvestment"
import { ProjectLocationSection } from "./location"
import { ProjectInvestmentSection } from "./investment" // ADD
import { ProjectDownloads } from "./ProjectDownloads"
```

```tsx
{project.locationContent ? (
	<ProjectLocationSection
		content={project.locationContent}
		location={project.location}
	/>
) : null}
{/* 07G — replaces the old <ProjectInvestment> */}
{project.investmentContent ? (
	<ProjectInvestmentSection content={project.investmentContent} />
) : null}
<ProjectDownloads downloads={project.downloads} />
<RelatedProjects projects={project.relatedProjects} />
```

<aside>
🔒

**Frozen-safe.** `ProjectInvestment.tsx` (07A) is untouched on disk — only its import/usage leaves `ProjectLayout`. Running order is now Overview → Amenities → Gallery → Location → **Investment** → Downloads → Related, with the sticky sidebar and `ProjectFinalCTA` unchanged.

</aside>

---

## 12. `components/project/index.ts` — re-export investment (edit)

Append one line to the existing barrel (all existing exports left as-is):

```tsx
// …existing exports unchanged…
export * from "./gallery"
export * from "./location"
export * from "./investment"
```

---

## 13. Deliverable 3 — Component hierarchy

```jsx
ProjectLayout (main column, after Location)
 └── ProjectInvestmentSection         (client: motion.section, single whileInView)
      └── grid lg:grid-cols-2
           ├── [left] InvestmentContent    (client)
           │    ├── eyebrow + h2 reveal + description
           │    ├── OwnershipJourneySummary (client: <ol>, step stagger)
           │    └── InvestmentHighlights    (client: <ul>, fade-up stagger)
           └── [right] flex column
                ├── cards grid (card stagger)
                │    └── InvestmentCard     (pure: <article>)
                ├── OwnershipModel        (pure: <section> + <ul>)
                ├── metrics grid (h3 + stagger)
                │    └── InvestmentMetric   (pure: metric card)
                └── InvestmentCTA         (pure: reveal-wrapped, Button -> next/link)
```

- **8 components**, each single-purpose. The four leaf components (`InvestmentCard`, `OwnershipModel`, `InvestmentMetric`, `InvestmentCTA`) are **pure/SSR**; motion lives only in the section + the client columns/lists.
- **Heading hierarchy**: Hero `h1` → section `h2` (heading) → `h3` ("How ownership works", "Investment highlights", "Key details") → `h4` (each card title + ownership-model title).

## 14. Deliverable 4 — CMS bindings

- One optional additive field: `Project.investmentContent?: ProjectInvestmentData` — **no duplicate models, no changed/removed fields**. The existing `investment: InvestmentInfo` is preserved and still referenced by the frozen 07A component on disk.
- Field-by-field: `eyebrow`/`heading`/`description` → `InvestmentContent`; `ownershipJourney[]` → `OwnershipJourneySummary`; `highlights[]` → `InvestmentHighlights`; `cards[]` → card grid → `InvestmentCard`; `ownershipModel` → `OwnershipModel`; `metrics[]` → metrics grid → `InvestmentMetric`; `cta` → `InvestmentCTA`.
- **No hardcoded content** — every string comes from data; placeholders live in `buildInvestmentContent(seed)`. Swap that block for a Sanity fetch returning the same shape and nothing else changes.
- `investmentContent` is **optional** → records without it still type-check; `ProjectLayout` guards the render. `InvestmentHighlights`, the card grid, and the metrics grid each no-op on empty arrays.

## 15. Deliverable 5 — Animation approach (Phase 03 only)

- **One trigger**: the section is the only `whileInView` (`once: true`); framer propagates `"visible"` to descendants declaring `variants` (no child sets its own `initial`/`animate`).
- **Fade-up** = `childVariants` (eyebrow, description, journey steps, highlight rows, model, metrics). **Editorial reveal** = `reveal` mask on the h2. **Card stagger** = nested `staggerContainer` on the investment-card grid (and again on the metrics grid). **CTA reveal** = `reveal` mask wrapping `InvestmentCTA`. All composed from existing Phase 03 variants — **no new infrastructure**, no parallax, no pinning.
- **Reduced motion**: handled globally by Phase 03's `MotionConfig reducedMotion="user"` — transforms/masks collapse; content stays fully visible.

## 16. Deliverable 7 — Responsive behavior (zero CLS)

- **Mobile (`<640`)**: single column — editorial content first, then cards (one-up), ownership model, metrics (two-up), CTA.
- **Tablet (`640–1023`)**: still stacked split (left above right); cards go two-up (`sm:grid-cols-2`); metrics stay two-up.
- **Desktop (`≥1024`)**: true editorial split (`lg:grid-cols-2 lg:gap-16`) — content left, cards + model + metrics + CTA right.
- **Zero CLS / lightweight**: no images in this section — it's text + bordered panels, so there is nothing to lazy-load and no intrinsic-size reservation needed; `h-full` keeps cards in a row equal-height; `scroll-mt-28` keeps the `#investment` anchor clean.

## 17. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders after Location on all three project routes
- [ ]  Editorial split on desktop; stacked on tablet/mobile
- [ ]  Ownership journey, highlights, cards, ownership model, metrics, and CTA all render
- [ ]  CTA routes to `/contact` and is keyboard-focusable with a visible ring
- [ ]  Sidebar `Investment` anchor still scrolls correctly
- [ ]  Heading order: h1 → h2 → h3 → h4
- [ ]  Copy contains no returns/yield/guarantee language and no wallet/token/chain terms
- [ ]  `prefers-reduced-motion`: no transform/mask; content fully visible
- [ ]  Zero ESLint / TS errors

<aside>
🧩

**Assumptions to reconcile:** `@/components/ui` (`Heading`, `Text` with `accent`/`subtle` tones, `Button` with `asChild`), `@/lib/animation` (`staggerContainer`, `childVariants`, `reveal`), `cn` from `@/utils/cn`, `next/link`. All content is placeholder. If a name differs, only import lines change.

</aside>

<aside>
🛑

**STOP — Phase 07G complete. Awaiting approval before Phase 07H.** I author these as Notion pages but can't run `lint`/`tsc`/`build` myself — run the verify block and paste any errors and I'll fix the exact file(s).

</aside>