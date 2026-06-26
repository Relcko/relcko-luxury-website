# Phase 06D Build — Platform Advantages & Trust (Output)

<aside>
🛡️

**Phase 06D — Platform Advantages & Trust.** A premium editorial credibility section that follows Ownership Journey: a sticky editorial intro (heading + description) on the left, and a responsive 2×3 advantage grid on the right. 7 pure, prop-driven, CMS-ready components + typed placeholder content. Reuses Phase 02 design system + Phase 03 motion — **no new animation utilities**, no new dependencies. Previous phases untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```
lib/
  platform-advantages.ts        # Types + CMS-ready placeholder content
components/sections/platform-advantages/
  PlatformAdvantages.tsx        # Server orchestrator (section + 2-col grid)
  AdvantagesHeader.tsx          # Client: left intro (eyebrow/h2/desc), fade-up
  AdvantagesGrid.tsx            # Client: 2×3 grid, stagger + card reveal
  AdvantageCard.tsx             # Card shell + hover lift (composes the 3 leaves)
  AdvantageIcon.tsx             # Lightweight inline SVG icon
  AdvantageTitle.tsx            # h3 wrapper
  AdvantageDescription.tsx      # Muted body copy
  index.ts                      # Barrel
app/
  page.tsx                      # EDIT — mount below Ownership Journey
```

<aside>
⚠️

**Standing assumptions (unchanged):** `@/components/ui` exports `Container`, `Heading` (`level`/`size`), `Text` (`size`/`tone`). `@/lib/animation` exports `staggerContainer`, `childVariants`. Advantage icons are an inline SVG registry keyed by a typed icon name — CMS data stays string-only. The hover lift is pure CSS (`motion-safe:` Tailwind), so cards stay server-renderable.

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + leaf/card/header components. **Part 2** (appended next) = grid, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/platform-advantages.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the Platform Advantages section. Production
// sources this from Sanity; here we ship typed placeholders with the exact
// shape the CMS returns. No hardcoded copy lives inside the components.
// Tone: confidence and clarity — no marketing hype.

export type AdvantageIconName =
	| "curated"
	| "ownership"
	| "diligence"
	| "global"
	| "secure"
	| "vision"

export type Advantage = {
	id: string
	icon: AdvantageIconName
	title: string
	description: string
}

export type PlatformAdvantagesContent = {
	eyebrow: string
	heading: string
	description: string
	advantages: Advantage[]
}

export const platformAdvantagesContent: PlatformAdvantagesContent = {
	eyebrow: "Why Relcko",
	heading: "A platform built to be trusted",
	description:
		"Trust is earned in the details. Every part of the Relcko experience — from the residences we select to the way you hold and manage them — is designed to be clear, considered, and dependable for the long term.",
	advantages: [
		{
			id: "adv-curated",
			icon: "curated",
			title: "Curated Properties",
			description:
				"Every residence is hand-selected for its architecture, location, and lasting value — never volume for its own sake.",
		},
		{
			id: "adv-ownership",
			icon: "ownership",
			title: "Transparent Digital Ownership",
			description:
				"What you own is recorded plainly and accessibly, so your stake is always clear and entirely yours.",
		},
		{
			id: "adv-diligence",
			icon: "diligence",
			title: "Professional Due Diligence",
			description:
				"Each opportunity is reviewed by experienced professionals before it ever reaches you.",
		},
		{
			id: "adv-global",
			icon: "global",
			title: "Global Access",
			description:
				"Own and manage residences across borders, with an experience that feels local wherever you are.",
		},
		{
			id: "adv-secure",
			icon: "secure",
			title: "Secure Platform",
			description:
				"Considered safeguards protect your ownership and information at every step, quietly and reliably.",
		},
		{
			id: "adv-vision",
			icon: "vision",
			title: "Long-Term Vision",
			description:
				"We build for decades, not headlines — aligning every decision with enduring value.",
		},
	],
}
```

---

## 3. `AdvantageIcon.tsx` — lightweight inline SVG icon

```tsx
import type { ReactNode } from "react"
import type { AdvantageIconName } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<AdvantageIconName, ReactNode> = {
	curated: (
		<>
			<path d="M6 3h12l3 6-9 12L3 9l3-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M3 9h18M9 3L6 9l6 12 6-12-3-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
	ownership: (
		<>
			<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	diligence: (
		<>
			<rect x="6" y="4" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M9 4.5V3.5h6v1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	global: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
	secure: (
		<>
			<rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	vision: (
		<>
			<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
}

type AdvantageIconProps = {
	icon: AdvantageIconName
	className?: string
}

export function AdvantageIcon({ icon, className }: AdvantageIconProps) {
	return (
		<span
			className={cn(
				"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-base text-accent-gold",
				className,
			)}
		>
			<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
				{ICONS[icon]}
			</svg>
		</span>
	)
}
```

---

## 4. `AdvantageTitle.tsx` — h3 wrapper

```tsx
import type { ReactNode } from "react"
import { Heading } from "@/components/ui"

type AdvantageTitleProps = {
	children: ReactNode
	className?: string
}

export function AdvantageTitle({ children, className }: AdvantageTitleProps) {
	return (
		<Heading level={3} size="sm" className={className}>
			{children}
		</Heading>
	)
}
```

---

## 5. `AdvantageDescription.tsx` — muted body copy

```tsx
import type { ReactNode } from "react"
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type AdvantageDescriptionProps = {
	children: ReactNode
	className?: string
}

export function AdvantageDescription({ children, className }: AdvantageDescriptionProps) {
	return (
		<Text size="sm" tone="muted" className={cn("max-w-[42ch]", className)}>
			{children}
		</Text>
	)
}
```

---

## 6. `AdvantageCard.tsx` — card shell + hover lift

```tsx
import type { Advantage } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"
import { AdvantageIcon } from "./AdvantageIcon"
import { AdvantageTitle } from "./AdvantageTitle"
import { AdvantageDescription } from "./AdvantageDescription"

type AdvantageCardProps = {
	advantage: Advantage
	className?: string
}

// Pure presentational card. Subtle hover lift is CSS-only and gated behind
// motion-safe:, so reduced-motion users get no transform and the component
// stays server-renderable (the grid wrapper owns the scroll reveal).
export function AdvantageCard({ advantage, className }: AdvantageCardProps) {
	return (
		<div
			className={cn(
				"flex h-full flex-col gap-4 rounded-2xl border border-border bg-bg-elevated/50 p-6",
				"motion-safe:transition motion-safe:duration-300 hover:border-accent-gold/40 motion-safe:hover:-translate-y-1",
				className,
			)}
		>
			<AdvantageIcon icon={advantage.icon} />
			<div className="flex flex-col gap-2">
				<AdvantageTitle>{advantage.title}</AdvantageTitle>
				<AdvantageDescription>{advantage.description}</AdvantageDescription>
			</div>
		</div>
	)
}
```

---

## 7. `AdvantagesHeader.tsx` — left editorial intro (client, fade-up)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { PlatformAdvantagesContent } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type AdvantagesHeaderProps = {
	content: Pick<PlatformAdvantagesContent, "eyebrow" | "heading" | "description">
	className?: string
}

// Sticky editorial column. One stagger trigger: eyebrow/heading then
// description fade-up in sequence.
export function AdvantagesHeader({ content, className }: AdvantagesHeaderProps) {
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
		</motion.div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends the grid, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 8. `AdvantagesGrid.tsx` — 2×3 grid, stagger + card reveal

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { Advantage } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"
import { AdvantageCard } from "./AdvantageCard"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type AdvantagesGridProps = {
	advantages: Advantage[]
	className?: string
}

// One stagger trigger on the list cascades hidden/visible to each card
// (fade-up reveal). Two columns from sm upward = a 2×3 grid for six items.
export function AdvantagesGrid({ advantages, className }: AdvantagesGridProps) {
	return (
		<motion.ul
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", className)}
		>
			{advantages.map((advantage) => (
				<motion.li key={advantage.id} variants={childVariants} className="h-full">
					<AdvantageCard advantage={advantage} />
				</motion.li>
			))}
		</motion.ul>
	)
}
```

---

## 9. `PlatformAdvantages.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import {
	platformAdvantagesContent,
	type PlatformAdvantagesContent,
} from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"
import { AdvantagesHeader } from "./AdvantagesHeader"
import { AdvantagesGrid } from "./AdvantagesGrid"

type PlatformAdvantagesProps = {
	content?: PlatformAdvantagesContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Editorial
// intro is the left column, the advantage grid the right.
export function PlatformAdvantages({
	content = platformAdvantagesContent,
	id = "advantages",
	className,
}: PlatformAdvantagesProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
					<AdvantagesHeader content={content} />
					<AdvantagesGrid advantages={content.advantages} />
				</div>
			</Container>
		</section>
	)
}
```

---

## 10. `index.ts` — barrel

```tsx
export { PlatformAdvantages } from "./PlatformAdvantages"
export { AdvantagesHeader } from "./AdvantagesHeader"
export { AdvantagesGrid } from "./AdvantagesGrid"
export { AdvantageCard } from "./AdvantageCard"
export { AdvantageIcon } from "./AdvantageIcon"
export { AdvantageTitle } from "./AdvantageTitle"
export { AdvantageDescription } from "./AdvantageDescription"
```

---

## 11. `app/page.tsx` — integrate below Ownership Journey (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />
			<FeaturedProjects id="featured" />
			<AboutSection id="about" />
			<OwnershipJourney id="ownership" />
			<PlatformAdvantages id="advantages" />
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing Ownership Journey mount. All earlier sections are untouched.

</aside>

---

## 12. Deliverable 3 — Component hierarchy

```
PlatformAdvantages                 (server: section + Container + 2-col grid)
 ├── AdvantagesHeader              (client: sticky intro, stagger trigger)
 └── AdvantagesGrid                (client: <ul> 2×3, stagger trigger)
      └── <li> ×6
           └── AdvantageCard       (card shell + CSS hover lift)
                ├── AdvantageIcon          (inline SVG)
                ├── AdvantageTitle         (h3)
                └── AdvantageDescription   (muted body)
```

- **Two client islands only** (`AdvantagesHeader`, `AdvantagesGrid`) because they own scroll motion; `PlatformAdvantages`, `AdvantageCard`, and the three leaves are server-renderable and pure.
- `AdvantageCard` is a thin composition of the three single-purpose leaves, so each can be reused or restyled independently.

## 13. Deliverable 4 — CMS data model

- All content lives in `lib/platform-advantages.ts` as `PlatformAdvantagesContent`; **zero hardcoded copy in components**.
- Supports every required field: `heading` (+ `eyebrow`), `description`, and the `advantages` list.
- Each advantage is a typed `Advantage` with `icon`, `title`, `description`; `icon` is a **typed union** (`AdvantageIconName`) resolved by an inline SVG registry, so the CMS only ever sends a string and `Record<AdvantageIconName, …>` forces every icon name to have art at compile time.
- Add, remove, or reorder advantages purely from data — the grid reflows automatically (six items → a clean 2×3).
- Swap `platformAdvantagesContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 14. Deliverable 5 — Animation approach (Phase 03 only)

- **Fade-up** → `AdvantagesHeader` is one `staggerContainer` trigger; eyebrow/heading then description rise in via `childVariants`.
- **Grid stagger + card reveal** → `AdvantagesGrid` is a second `staggerContainer` trigger on the `<ul>`; each card fades-up in sequence via `childVariants`.
- **Subtle hover lift** → CSS-only on `AdvantageCard` (`motion-safe:hover:-translate-y-1` + border warm-up), so it is automatically suppressed under reduced motion and needs no JS.
- **No new utilities, no parallax, no pinning, no horizontal scroll.** Reduced motion is honored globally by the Phase 03 `MotionConfig reducedMotion="user"` — entrances resolve instantly and the hover transform is gated behind `motion-safe:`.

## 15. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<640`)**: single-column stack — intro, then advantages one per row.
- **Tablet (`640–1023`)**: the grid becomes two columns (`sm:grid-cols-2`) while the intro still sits above it — a balanced 2-column card layout per the brief.
- **Desktop (`≥1024`)**: editorial split — `lg:grid-cols-2` places the sticky intro (`lg:sticky lg:top-32`) beside the advantage grid, which is itself 2 columns × 3 rows.
- **No CLS**: cards are text + inline SVG only (no imagery), `h-full` keeps a row's cards equal height, and the hover lift animates `transform` only — nothing reflows.

## 16. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below Ownership Journey
- [ ]  Desktop editorial split (sticky intro left, 2×3 grid right)
- [ ]  Tablet 2-column grid; mobile single-column stack
- [ ]  Six advantage cards with icon + title + description
- [ ]  Heading outline correct (section h2 → card h3)
- [ ]  Cards fade-up and stagger in on scroll-in
- [ ]  Hover lift is smooth and disabled under reduced motion
- [ ]  `prefers-reduced-motion`: entrances + hover lift disabled, content fully visible
- [ ]  No layout shift

<aside>
🧩

**Assumptions to reconcile against your real Phase 02/03 exports:** `@/lib/animation` exports `staggerContainer`, `childVariants`; `@/components/ui` exports `Container`, `Heading`, `Text`. If a name differs, only the import line changes — component logic is unaffected. (This section uses no `Button`/CTA.)

</aside>

<aside>
🛑

**STOP — Phase 06D complete. Awaiting approval before Phase 06E.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>