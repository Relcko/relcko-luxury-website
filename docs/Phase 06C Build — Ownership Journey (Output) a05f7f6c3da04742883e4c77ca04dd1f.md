# Phase 06C Build — Ownership Journey (Output)

<aside>
🧭

**Phase 06C — Investment & Digital Ownership Experience.** A premium editorial two-column section that follows About: a sticky editorial intro (heading + description + CTA) on the left, and five connected journey steps on a subtle vertical timeline on the right. 6 pure, prop-driven, CMS-ready components + typed placeholder content. Reuses Phase 02 design system + Phase 03 motion — **no new animation infrastructure**, no new dependencies. Previous phases untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```
lib/
  ownership.ts              # Types + CMS-ready placeholder content
components/sections/ownership/
  OwnershipJourney.tsx      # Server orchestrator (section + 2-col grid)
  JourneyHeader.tsx         # Client: left intro (eyebrow/h2/desc/CTA), fade-up
  JourneyTimeline.tsx       # Client: ordered list, step stagger + connector reveal
  JourneyStep.tsx           # Numbered icon marker + title + description
  JourneyConnector.tsx      # Vertical connector line (decorative)
  JourneyCTA.tsx            # Button asChild > Link
  index.ts                  # Barrel
app/
  page.tsx                  # EDIT — mount below About
```

<aside>
⚠️

**Standing assumptions (unchanged):** `@/components/ui` exports `Button` (with `asChild`), `Container`, `Heading` (`level`/`size`), `Text` (`size`/`tone`). `@/lib/animation` exports `staggerContainer`, `childVariants`, and `easing` (with `easing.out` as a cubic-bezier tuple Framer accepts). Step icons are an inline SVG registry keyed by a typed icon name — CMS data stays string-only.

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + leaf components. **Part 2** (appended next) = timeline, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/ownership.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the Ownership Journey. Production sources this
// from Sanity; here we ship typed placeholders with the exact shape the CMS
// returns. No hardcoded copy lives inside the components. Storytelling only —
// no technical / blockchain terminology.

export type JourneyIconName = "explore" | "invest" | "own" | "track" | "grow"

export type JourneyStep = {
	id: string
	step: number
	icon: JourneyIconName
	title: string
	description: string
}

export type OwnershipContent = {
	eyebrow: string
	heading: string
	description: string
	steps: JourneyStep[]
	cta: { label: string; href: string }
}

export const ownershipContent: OwnershipContent = {
	eyebrow: "The Ownership Journey",
	heading: "Ownership, made effortless",
	description:
		"From the first viewing to long-term growth, owning with Relcko is a guided, transparent journey — five simple steps that take you from discovery to a residence you truly own.",
	steps: [
		{
			id: "step-explore",
			step: 1,
			icon: "explore",
			title: "Explore premium properties",
			description:
				"Browse a curated collection of landmark residences, each presented with the detail and clarity you would expect of a flagship address.",
		},
		{
			id: "step-invest",
			step: 2,
			icon: "invest",
			title: "Choose an opportunity",
			description:
				"Select the residence and the stake that suit your ambitions, with clear terms and transparent pricing from the very first step.",
		},
		{
			id: "step-own",
			step: 3,
			icon: "own",
			title: "Complete digital ownership",
			description:
				"Finalize your ownership securely online — your stake is recorded clearly and held in your name, wherever you are in the world.",
		},
		{
			id: "step-track",
			step: 4,
			icon: "track",
			title: "Track your investment",
			description:
				"Follow your portfolio in one elegant dashboard, with everything you own visible at a glance and updated in real time.",
		},
		{
			id: "step-grow",
			step: 5,
			icon: "grow",
			title: "Grow with the platform",
			description:
				"Reinvest, expand, or pass on your holdings as your portfolio matures alongside a growing global community.",
		},
	],
	cta: { label: "Start Your Journey", href: "/ownership" },
}
```

---

## 3. `JourneyCTA.tsx` — primary call to action

```tsx
import Link from "next/link"
import { Button } from "@/components/ui"

type JourneyCTAProps = {
	label: string
	href: string
	className?: string
}

export function JourneyCTA({ label, href, className }: JourneyCTAProps) {
	return (
		<Button asChild variant="primary" size="lg" className={className}>
			<Link href={href}>{label}</Link>
		</Button>
	)
}
```

---

## 4. `JourneyConnector.tsx` — vertical connector line

```tsx
import { cn } from "@/utils/cn"

type JourneyConnectorProps = {
	className?: string
}

// Purely decorative rail between steps. Fills the height of its (animated)
// wrapper; the reveal is driven by the timeline via Framer variants.
export function JourneyConnector({ className }: JourneyConnectorProps) {
	return (
		<div
			aria-hidden="true"
			className={cn("h-full w-px bg-gradient-to-b from-accent-gold/50 to-border", className)}
		/>
	)
}
```

---

## 5. `JourneyStep.tsx` — numbered icon marker + title + description

```tsx
import type { ReactNode } from "react"
import { Heading, Text } from "@/components/ui"
import type { JourneyIconName, JourneyStep as JourneyStepData } from "@/lib/ownership"
import { cn } from "@/utils/cn"

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<JourneyIconName, ReactNode> = {
	explore: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
	invest: (
		<>
			<path d="M4 15l5-5 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M15 6h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	own: (
		<>
			<circle cx="8" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" />
			<path d="M10.5 11.5L20 4M17 6l2 2M14 8l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	track: (
		<>
			<path d="M4 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M8 16l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	grow: (
		<>
			<path d="M12 21v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M12 13c0-3 2.2-5.2 5-5.2-.2 2.8-2.2 5.2-5 5.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M12 15c0-3-2.2-5.2-5-5.2.2 2.8 2.2 5.2 5 5.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
}

type JourneyStepProps = {
	step: JourneyStepData
	className?: string
}

export function JourneyStep({ step, className }: JourneyStepProps) {
	return (
		<div className={cn("flex gap-5", className)}>
			<span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-accent-gold">
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
					{ICONS[step.icon]}
				</svg>
			</span>
			<div className="flex flex-col gap-1 pt-1">
				<span className="font-display-sans text-xs uppercase tracking-[0.24em] text-text-muted">
					Step {step.step}
				</span>
				<Heading level={3} size="sm">
					{step.title}
				</Heading>
				<Text size="sm" tone="muted" className="max-w-[46ch]">
					{step.description}
				</Text>
			</div>
		</div>
	)
}
```

---

## 6. `JourneyHeader.tsx` — left editorial intro (client, fade-up + CTA fade)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { OwnershipContent } from "@/lib/ownership"
import { cn } from "@/utils/cn"
import { JourneyCTA } from "./JourneyCTA"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type JourneyHeaderProps = {
	content: Pick<OwnershipContent, "eyebrow" | "heading" | "description" | "cta">
	className?: string
}

// Sticky editorial column. One stagger trigger: eyebrow/heading, description,
// and CTA each fade-up in sequence (the CTA settling in last).
export function JourneyHeader({ content, className }: JourneyHeaderProps) {
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("flex flex-col gap-6 lg:sticky lg:top-32", className)}
		>
			<motion.div variants={childVariants} className="flex flex-col gap-3">
				<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
					{content.eyebrow}
				</span>
				<Heading level={2} size="xl" className="text-balance">
					{content.heading}
				</Heading>
			</motion.div>
			<motion.div variants={childVariants}>
				<Text size="md" tone="muted" className="max-w-[52ch]">
					{content.description}
				</Text>
			</motion.div>
			<motion.div variants={childVariants}>
				<JourneyCTA label={content.cta.label} href={content.cta.href} />
			</motion.div>
		</motion.div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends the timeline, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 7. `JourneyTimeline.tsx` — ordered list, step stagger + connector reveal

```tsx
"use client"

import { motion, type Variants } from "framer-motion"
import { staggerContainer, childVariants, easing } from "@/lib/animation"
import type { JourneyStep as JourneyStepData } from "@/lib/ownership"
import { cn } from "@/utils/cn"
import { JourneyStep } from "./JourneyStep"
import { JourneyConnector } from "./JourneyConnector"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

// Composed from the Phase 03 easing token — not new infrastructure. The connector
// grows downward (origin-top) as each step settles in.
const connectorReveal: Variants = {
	hidden: { scaleY: 0 },
	visible: { scaleY: 1, transition: { duration: 0.6, ease: easing.out } },
}

type JourneyTimelineProps = {
	steps: JourneyStepData[]
	className?: string
}

// Semantic ordered list. One stagger trigger cascades hidden/visible to each
// <li> (step fade-up) and to each connector (scaleY reveal) — step-by-step.
export function JourneyTimeline({ steps, className }: JourneyTimelineProps) {
	return (
		<motion.ol
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("relative flex flex-col", className)}
		>
			{steps.map((step, index) => {
				const isLast = index === steps.length - 1
				return (
					<motion.li
						key={step.id}
						variants={childVariants}
						className="relative flex pb-10 last:pb-0"
					>
						{!isLast ? (
							<motion.div
								variants={connectorReveal}
								className="absolute left-[1.375rem] top-12 bottom-0 origin-top -translate-x-1/2"
							>
								<JourneyConnector />
							</motion.div>
						) : null}
						<JourneyStep step={step} />
					</motion.li>
				)
			})}
		</motion.ol>
	)
}
```

<aside>
💡

The connector sits in the marker rail: `left-[1.375rem]` is the centre of the `w-11` (2.75rem) badge, `top-12` clears the badge, `bottom-0` reaches the next step (the `pb-10` gap). The badge is `z-10` with a solid background so the line tucks neatly behind it.

</aside>

---

## 8. `OwnershipJourney.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import { ownershipContent, type OwnershipContent } from "@/lib/ownership"
import { cn } from "@/utils/cn"
import { JourneyHeader } from "./JourneyHeader"
import { JourneyTimeline } from "./JourneyTimeline"

type OwnershipJourneyProps = {
	content?: OwnershipContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Editorial
// intro is the left column, the journey timeline the right.
export function OwnershipJourney({
	content = ownershipContent,
	id = "ownership",
	className,
}: OwnershipJourneyProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
					<JourneyHeader content={content} />
					<JourneyTimeline steps={content.steps} />
				</div>
			</Container>
		</section>
	)
}
```

---

## 9. `index.ts` — barrel

```tsx
export { OwnershipJourney } from "./OwnershipJourney"
export { JourneyHeader } from "./JourneyHeader"
export { JourneyTimeline } from "./JourneyTimeline"
export { JourneyStep } from "./JourneyStep"
export { JourneyConnector } from "./JourneyConnector"
export { JourneyCTA } from "./JourneyCTA"
```

---

## 10. `app/page.tsx` — integrate below About (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />
			<FeaturedProjects id="featured" />
			<AboutSection id="about" />
			<OwnershipJourney id="ownership" />
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing About mount. Hero, Featured Projects, and About are untouched.

</aside>

---

## 11. Deliverable 3 — Component hierarchy

```
OwnershipJourney                   (server: section + Container + 2-col grid)
 ├── JourneyHeader                 (client: sticky intro, stagger trigger)
 │    └── JourneyCTA               (Phase 02 Button asChild > Link)
 └── JourneyTimeline               (client: <ol>, stagger trigger)
      └── <li> ×5
           ├── JourneyConnector    (decorative rail, scaleY reveal; omitted on last)
           └── JourneyStep         (numbered icon marker + h3 + description)
```

- **Two client islands only** (`JourneyHeader`, `JourneyTimeline`) because they own scroll motion; `OwnershipJourney`, `JourneyStep`, `JourneyConnector`, and `JourneyCTA` are server-renderable and pure.
- Each component takes exactly the data it needs (`JourneyStep` gets one step, `JourneyCTA` gets label+href), so all are independently reusable and testable.

## 12. Deliverable 4 — CMS data model

- All content lives in `lib/ownership.ts` as `OwnershipContent`; **zero hardcoded copy in components**.
- Supports every required field: `heading` (+ `eyebrow`), `description`, `steps`, and `cta`.
- Each step is a typed `JourneyStep` with `step` (number), `icon`, `title`, `description`; `icon` is a **typed union** (`JourneyIconName`) resolved by an inline SVG registry, so the CMS only ever sends a string and `Record<JourneyIconName, …>` forces every icon name to have art at compile time.
- Add, remove, or reorder steps purely from data — the timeline, numbering, and connectors all derive from the array (last-step connector is dropped automatically).
- Swap `ownershipContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 13. Deliverable 5 — Animation approach (Phase 03 only)

- **Fade-up** → `JourneyHeader` is one `staggerContainer` trigger; eyebrow/heading, description, and CTA each rise in via `childVariants`.
- **Step-by-step stagger** → `JourneyTimeline` is a second `staggerContainer` trigger on the `<ol>`; each `<li>` fades-up in sequence via `childVariants`.
- **Connector reveal** → each connector is a `motion.div` using a small `connectorReveal` variant (`scaleY` 0→1, `origin-top`) **composed from the Phase 03 `easing.out` token** — it inherits hidden/visible from the list cascade, so lines draw downward step by step. No new animation utilities or files.
- **CTA fade** → the CTA is the last `childVariants` child of the header, settling in after the copy.
- **No parallax, no pinning, no horizontal scroll.** Reduced motion is honored globally by the Phase 03 `MotionConfig reducedMotion="user"` — entrances and the connector reveal resolve instantly with full legibility.

## 14. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<1024`)**: single column; the editorial intro stacks above the timeline; generous `gap-12` rhythm; the connector rail keeps the five steps visually linked.
- **Tablet (`768–1023`)**: still stacked single column (per brief), wider gutters via `Container`.
- **Desktop (`≥1024`)**: two columns `lg:grid-cols-2` with `lg:gap-16 xl:gap-24`; the intro is `lg:sticky lg:top-32` so it holds while the journey scrolls beside it — an elegant editorial pairing.
- **No CLS**: the section is pure text + inline SVG (no imagery needed), so there is nothing to shift; the connector animates via `transform` (`scaleY`) only, which never affects layout.

## 15. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below About
- [ ]  Desktop two-column (sticky intro left, timeline right); stacks at <1024
- [ ]  Five steps render as a semantic `<ol>` in order, numbered 1–5
- [ ]  Heading outline correct (section h2 → step h3)
- [ ]  Connectors draw between steps and are omitted after the last step
- [ ]  Steps fade-up and connectors reveal step-by-step on scroll-in
- [ ]  CTA is keyboard-focusable with a visible focus state
- [ ]  `prefers-reduced-motion`: entrances + connector reveal disabled, content fully visible
- [ ]  No layout shift

<aside>
🧩

**Assumptions to reconcile against your real Phase 02/03 exports:** `@/lib/animation` exports `staggerContainer`, `childVariants`, and `easing` (`easing.out` a cubic-bezier tuple); `@/components/ui` exports `Button` (with `asChild`), `Container`, `Heading`, `Text`. If a name differs, only the import line changes — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06C complete. Awaiting approval before Phase 06D.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>