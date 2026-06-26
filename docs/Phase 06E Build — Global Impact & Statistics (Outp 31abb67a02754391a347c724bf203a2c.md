# Phase 06E Build — Global Impact & Statistics (Output)

<aside>
📊

**Phase 06E — Global Impact & Statistics.** An understated, editorial statistics section that follows Platform Advantages: a centered header above a responsive metric grid of large numeric values with restrained labels. 7 pure, prop-driven, CMS-ready components + typed placeholder content. Reuses Phase 02 design system + Phase 03 motion. The count-up is **component-local logic** (framer-motion `useInView` + the Phase 03 `useReducedMotion` hook + a tiny requestAnimationFrame tween) — **no new shared animation infrastructure**, no new dependencies. Previous phases untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```
lib/
  global-impact.ts              # Types + CMS-ready placeholder content
components/sections/global-impact/
  GlobalImpact.tsx              # Server orchestrator (section + centered header + grid)
  ImpactHeader.tsx              # Client: centered intro (eyebrow/h2/desc), fade-up
  StatisticsGrid.tsx            # Client: responsive grid, stagger reveal
  StatisticCard.tsx             # Centered card (optional icon + value + label + desc)
  StatisticValue.tsx            # Client: count-up + readable formatting
  StatisticLabel.tsx            # Restrained metric label
  StatisticDescription.tsx      # Optional muted supporting line
  index.ts                      # Barrel
app/
  page.tsx                      # EDIT — mount below Platform Advantages
```

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Container`, `Heading` (`level`/`size`), `Text` (`size`/`tone`). `@/lib/animation` exports `staggerContainer`, `childVariants`. `@/hooks` exports `useReducedMotion` (Phase 03). `framer-motion` exports `useInView` (it is already a dependency — this is not new infrastructure). Stat icons are an inline SVG registry keyed by a typed icon name. **Note:** the brief lists an optional `suffix`; I also added an optional `prefix` so currency values like `$1.2B` format cleanly — both optional and CMS-driven.

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + value/label/description/card. **Part 2** (appended next) = grid, header, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/global-impact.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the Global Impact section. Production sources
// this from Sanity; here we ship typed placeholders with the exact shape the
// CMS returns. No hardcoded copy lives inside the components. Values are
// placeholders — understated, confidence-inspiring metrics.

export type StatIconName =
	| "properties"
	| "cities"
	| "investors"
	| "aum"
	| "countries"
	| "experience"

export type Statistic = {
	id: string
	/** Raw numeric target the count-up animates toward. */
	value: number
	label: string
	description?: string
	/** Rendered before the value, e.g. "$". */
	prefix?: string
	/** Rendered after the value, e.g. "+" or "B". */
	suffix?: string
	/** Fixed decimal places for display + count-up (default 0). */
	decimals?: number
	icon?: StatIconName
}

export type GlobalImpactContent = {
	eyebrow: string
	heading: string
	description: string
	statistics: Statistic[]
}

export const globalImpactContent: GlobalImpactContent = {
	eyebrow: "Global Impact",
	heading: "Trusted at a global scale",
	description:
		"A growing portfolio, a worldwide community, and a track record measured in decades — the numbers behind a platform built for the long term.",
	statistics: [
		{
			id: "stat-properties",
			value: 320,
			suffix: "+",
			icon: "properties",
			label: "Premium properties",
			description: "Landmark residences across our curated portfolio.",
		},
		{
			id: "stat-cities",
			value: 28,
			suffix: "+",
			icon: "cities",
			label: "Cities worldwide",
		},
		{
			id: "stat-investors",
			value: 8500,
			suffix: "+",
			icon: "investors",
			label: "Global investors",
			description: "A community that spans continents and generations.",
		},
		{
			id: "stat-aum",
			value: 1.2,
			prefix: "$",
			suffix: "B",
			decimals: 1,
			icon: "aum",
			label: "Assets under management",
		},
		{
			id: "stat-countries",
			value: 24,
			icon: "countries",
			label: "Countries",
		},
		{
			id: "stat-experience",
			value: 15,
			suffix: "+",
			icon: "experience",
			label: "Years of experience",
			description: "Decades of disciplined, long-term stewardship.",
		},
	],
}
```

---

## 3. `StatisticLabel.tsx` — restrained metric label

```tsx
import type { ReactNode } from "react"
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type StatisticLabelProps = {
	children: ReactNode
	className?: string
}

export function StatisticLabel({ children, className }: StatisticLabelProps) {
	return (
		<Text
			size="sm"
			tone="primary"
			className={cn("font-medium uppercase tracking-[0.16em]", className)}
		>
			{children}
		</Text>
	)
}
```

---

## 4. `StatisticDescription.tsx` — optional supporting line

```tsx
import type { ReactNode } from "react"
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type StatisticDescriptionProps = {
	children: ReactNode
	className?: string
}

export function StatisticDescription({ children, className }: StatisticDescriptionProps) {
	return (
		<Text size="sm" tone="muted" className={cn("max-w-[34ch]", className)}>
			{children}
		</Text>
	)
}
```

---

## 5. `StatisticValue.tsx` — count-up + readable formatting (client)

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { useReducedMotion } from "@/hooks"
import { cn } from "@/utils/cn"

// Local tween constant — a number, not shared animation infrastructure.
const DURATION_MS = 1600

// Grouped, fixed-precision formatting for readable numbers (e.g. 8,500 / 1.2).
function formatValue(value: number, decimals: number) {
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value)
}

type StatisticValueProps = {
	value: number
	prefix?: string
	suffix?: string
	decimals?: number
	className?: string
}

export function StatisticValue({
	value,
	prefix = "",
	suffix = "",
	decimals = 0,
	className,
}: StatisticValueProps) {
	const ref = useRef<HTMLSpanElement>(null)
	// Count-up runs only when the value scrolls into view, once.
	const inView = useInView(ref, { once: true, margin: "-15% 0px" })
	const prefersReducedMotion = useReducedMotion()
	const [display, setDisplay] = useState(0)

	useEffect(() => {
		if (!inView) return
		// Reduced-motion fallback: show the final value immediately.
		if (prefersReducedMotion) {
			setDisplay(value)
			return
		}
		let frame = 0
		const start = performance.now()
		const tick = (now: number) => {
			const progress = Math.min((now - start) / DURATION_MS, 1)
			const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
			setDisplay(value * eased)
			if (progress < 1) {
				frame = requestAnimationFrame(tick)
			} else {
				setDisplay(value)
			}
		}
		frame = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(frame)
	}, [inView, prefersReducedMotion, value])

	const finalText = `${prefix}${formatValue(value, decimals)}${suffix}`

	return (
		<span
			ref={ref}
			className={cn(
				"font-display-sans text-5xl font-semibold tracking-tight text-text-primary tabular-nums md:text-6xl",
				className,
			)}
		>
			{/* Animated, decorative; the static final value is exposed to AT below. */}
			<span aria-hidden="true">
				{prefix}
				{formatValue(display, decimals)}
				{suffix}
			</span>
			<span className="sr-only">{finalText}</span>
		</span>
	)
}
```

<aside>
♿

The animating digits are `aria-hidden`; a static, fully-formatted final value sits in an `sr-only` span so screen readers announce the real number once — not a stream of intermediate values. `tabular-nums` keeps the width stable so digits don't jitter (no layout shift).

</aside>

---

## 6. `StatisticCard.tsx` — centered card (optional icon + value + label + description)

```tsx
import type { ReactNode } from "react"
import type { Statistic, StatIconName } from "@/lib/global-impact"
import { cn } from "@/utils/cn"
import { StatisticValue } from "./StatisticValue"
import { StatisticLabel } from "./StatisticLabel"
import { StatisticDescription } from "./StatisticDescription"

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<StatIconName, ReactNode> = {
	properties: (
		<>
			<path d="M5 21V6l7-3 7 3v15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M9.5 10h.01M14.5 10h.01M9.5 14h.01M14.5 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	cities: (
		<>
			<path d="M3 21V10l5-3v14M8 21V4l6 2v15M14 21v-8l5 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M2 21h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	investors: (
		<>
			<circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M16 5.2a3 3 0 0 1 0 5.6M16.5 14.2a5.5 5.5 0 0 1 4 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	aum: (
		<>
			<ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" />
			<path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="1.5" />
			<path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
	countries: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
	experience: (
		<>
			<circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
			<path d="M8.5 13l-1 8 4.5-2.5L16.5 21l-1-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
}

type StatisticCardProps = {
	statistic: Statistic
	className?: string
}

export function StatisticCard({ statistic, className }: StatisticCardProps) {
	const { value, label, description, prefix, suffix, decimals, icon } = statistic
	return (
		<div className={cn("flex flex-col items-center gap-3 px-4 text-center", className)}>
			{icon ? (
				<span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent-gold">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
						{ICONS[icon]}
					</svg>
				</span>
			) : null}
			<StatisticValue value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
			<StatisticLabel>{label}</StatisticLabel>
			{description ? <StatisticDescription>{description}</StatisticDescription> : null}
		</div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends the grid, header, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 7. `ImpactHeader.tsx` — centered editorial intro (client, fade-up)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { GlobalImpactContent } from "@/lib/global-impact"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type ImpactHeaderProps = {
	content: Pick<GlobalImpactContent, "eyebrow" | "heading" | "description">
	className?: string
}

// Centered intro. One stagger trigger: eyebrow/heading then description fade-up.
export function ImpactHeader({ content, className }: ImpactHeaderProps) {
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

## 8. `StatisticsGrid.tsx` — responsive grid, stagger reveal

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { Statistic } from "@/lib/global-impact"
import { cn } from "@/utils/cn"
import { StatisticCard } from "./StatisticCard"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type StatisticsGridProps = {
	statistics: Statistic[]
	className?: string
}

// One stagger trigger on the list cascades hidden/visible to each card
// (fade-up reveal). 1 → 2 → 3 columns; six metrics settle into a 3×2 grid.
export function StatisticsGrid({ statistics, className }: StatisticsGridProps) {
	return (
		<motion.ul
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
				className,
			)}
		>
			{statistics.map((statistic) => (
				<motion.li key={statistic.id} variants={childVariants}>
					<StatisticCard statistic={statistic} />
				</motion.li>
			))}
		</motion.ul>
	)
}
```

---

## 9. `GlobalImpact.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import { globalImpactContent, type GlobalImpactContent } from "@/lib/global-impact"
import { cn } from "@/utils/cn"
import { ImpactHeader } from "./ImpactHeader"
import { StatisticsGrid } from "./StatisticsGrid"

type GlobalImpactProps = {
	content?: GlobalImpactContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Centered
// header sits above the responsive statistics grid.
export function GlobalImpact({
	content = globalImpactContent,
	id = "impact",
	className,
}: GlobalImpactProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="flex flex-col gap-14 md:gap-20">
					<ImpactHeader content={content} />
					<StatisticsGrid statistics={content.statistics} />
				</div>
			</Container>
		</section>
	)
}
```

---

## 10. `index.ts` — barrel

```tsx
export { GlobalImpact } from "./GlobalImpact"
export { ImpactHeader } from "./ImpactHeader"
export { StatisticsGrid } from "./StatisticsGrid"
export { StatisticCard } from "./StatisticCard"
export { StatisticValue } from "./StatisticValue"
export { StatisticLabel } from "./StatisticLabel"
export { StatisticDescription } from "./StatisticDescription"
```

---

## 11. `app/page.tsx` — integrate below Platform Advantages (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"
import { GlobalImpact } from "@/components/sections/global-impact"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />
			<FeaturedProjects id="featured" />
			<AboutSection id="about" />
			<OwnershipJourney id="ownership" />
			<PlatformAdvantages id="advantages" />
			<GlobalImpact id="impact" />
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing Platform Advantages mount. All earlier sections are untouched.

</aside>

---

## 12. Deliverable 3 — Component hierarchy

```
GlobalImpact                       (server: section + Container + header/grid stack)
 ├── ImpactHeader                  (client: centered intro, stagger trigger)
 └── StatisticsGrid                (client: <ul> responsive grid, stagger trigger)
      └── <li> ×6
           └── StatisticCard      (centered: optional icon + value + label + desc)
                ├── StatisticValue        (client: count-up + readable formatting)
                ├── StatisticLabel        (restrained metric label)
                └── StatisticDescription  (optional muted line)
```

- **Client only where needed**: `ImpactHeader` and `StatisticsGrid` own the scroll stagger; `StatisticValue` is client for the count-up. `GlobalImpact`, `StatisticCard`, `StatisticLabel`, and `StatisticDescription` are server-renderable and pure.
- `StatisticCard` is a thin composition of value/label/description leaves, so each is reusable and testable in isolation.

## 13. Deliverable 4 — CMS data model

- All content lives in `lib/global-impact.ts` as `GlobalImpactContent`; **zero hardcoded copy in components**.
- Supports every required field: `heading` (+ `eyebrow`), `description`, and the `statistics` array.
- Each statistic is a typed `Statistic` supporting `value`, `label`, optional `description`, optional `suffix` (plus an optional `prefix` for currency), optional `decimals`, and an optional typed `icon`.
- `icon` is a **typed union** (`StatIconName`) resolved by an inline SVG registry, so the CMS only ever sends a string and `Record<StatIconName, …>` forces every icon name to have art at compile time.
- Add, remove, or reorder metrics purely from data — the grid reflows automatically.
- Swap `globalImpactContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 14. Deliverable 5 — Animation approach (Phase 03 + component-local count-up)

- **Fade-up** → `ImpactHeader` is one `staggerContainer` trigger; eyebrow/heading then description rise in via `childVariants`.
- **Stagger reveal** → `StatisticsGrid` is a second `staggerContainer` trigger on the `<ul>`; each card fades-up in sequence via `childVariants`.
- **Count-up on enter** → `StatisticValue` uses framer-motion's `useInView` (already a dependency) to start a small `requestAnimationFrame` easeOutCubic tween from 0 to the target **once**, only when that value scrolls into view. No new shared utilities or files.
- **Reduced-motion fallback** → the Phase 03 `useReducedMotion` hook short-circuits the tween and sets the final value immediately; the global `MotionConfig reducedMotion="user"` likewise disables the fade-up/stagger entrances.
- **No parallax, no pinning, no horizontal scroll, no new infrastructure.**

## 15. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<640`)**: single-column stack — centered header, then one metric per row, with generous `gap-y-12`.
- **Tablet (`640–1023`)**: two-column grid (`sm:grid-cols-2`).
- **Desktop (`≥1024`)**: centered header above a three-column grid (`lg:grid-cols-3`) — six metrics form a calm 3×2 block; large values with restrained labels.
- **No CLS**: values are text-only with `tabular-nums` (fixed-width digits) so the count-up never changes width; cards reserve their own space; nothing reflows as numbers animate.

## 16. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below Platform Advantages
- [ ]  Centered header above a responsive grid (1 → 2 → 3 columns)
- [ ]  Six metrics with large value + restrained label (+ optional icon/description)
- [ ]  Heading outline correct (single section h2; values are not headings)
- [ ]  Count-up runs once when each value enters the viewport
- [ ]  Numbers are grouped/formatted (e.g. 8,500; $1.2B)
- [ ]  `prefers-reduced-motion`: final values shown immediately, no tween or entrance
- [ ]  Screen readers announce the final value once (sr-only), not intermediate values
- [ ]  No layout shift while counting

<aside>
🧩

**Assumptions to reconcile against your real exports:** `@/lib/animation` exports `staggerContainer`, `childVariants`; `@/components/ui` exports `Container`, `Heading`, `Text`; `@/hooks` exports `useReducedMotion`; `framer-motion` exports `useInView`. If a name differs, only the import line changes — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06E complete. Awaiting approval before Phase 06F.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>