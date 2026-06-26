# Phase 06H Build — Premium Call to Action & Footer Transition (Output)

<aside>
🎯

**Phase 06H — Premium Call to Action & Footer Transition.** The final homepage conversion section, mounted directly below Gallery Showcase: a large centered editorial composition — background treatment → eyebrow → large headline → supporting description → primary + secondary CTAs → trust indicators → footer transition. Elegant, minimal, no aggressive sales language. 5 pure, prop-driven, CMS-ready components + typed placeholder content. Entrance motion (fade-up, staggered text reveal, CTA reveal, trust stagger, footer-transition fade) reuses Phase 03 — **no footer implementation, no contact form, no new animation infrastructure**. Previous phases untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```jsx
lib/
  final-cta.ts                  # Types + CMS-ready placeholder content
components/sections/final-cta/
  FinalCTA.tsx                  # Server orchestrator (section + background + header/actions/trust/transition)
  CTAHeader.tsx                 # Client: eyebrow + large headline + description, staggered text reveal
  CTAActions.tsx                # Client: primary + secondary CTAs (internal/external), CTA reveal
  TrustIndicators.tsx           # Client: concise row of confidence signals, stagger
  FooterTransition.tsx          # Client: gradient transition band into the footer, fade
  index.ts                      # Barrel
app/
  page.tsx                      # EDIT — mount below Gallery Showcase
```

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Container`, `Heading`, `Text`, `Button` (with `asChild` for link-forwarding). `@/lib/animation` exports `staggerContainer`, `childVariants` (fade-up), and `easing` (with `easing.out`). The footer-transition fade `Variants` is composed locally from `easing.out` — the established pattern, not new infrastructure. Background treatment and the transition band are **pure CSS gradients** (no image/Three.js assets). The actual footer is **out of scope** (later phase); this section only blends *into* it.

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + the four leaf components (header, actions, trust indicators, footer transition). **Part 2** (appended next) = the `FinalCTA` orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/final-cta.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the Final CTA & Footer Transition section.
// Production sources this from Sanity; here we ship typed placeholders with the
// exact shape the CMS returns. No hardcoded copy lives inside the components.

// A CTA link that supports both internal routes and external URLs. When
// `external` is omitted it is inferred from the href (http/https or mailto).
export type FinalCTALink = {
	label: string
	href: string
	external?: boolean
}

export type TrustIndicator = {
	id: string
	label: string
	description?: string
}

export type FinalCTAContent = {
	eyebrow: string
	heading: string
	description: string
	primaryCta: FinalCTALink
	secondaryCta: FinalCTALink
	trustIndicators: TrustIndicator[]
}

export const finalCtaContent: FinalCTAContent = {
	eyebrow: "The future of premium real estate",
	heading: "A more considered way to own what matters",
	description:
		"Explore a curated portfolio, transparent digital ownership, and professional management — all in one place. When you're ready, we're here to guide the next step.",
	primaryCta: { label: "Explore Projects", href: "/projects" },
	secondaryCta: { label: "Contact Our Team", href: "/contact" },
	trustIndicators: [
		{ id: "developments", label: "Premium Developments" },
		{ id: "reach", label: "Global Reach" },
		{ id: "ownership", label: "Digital Ownership" },
		{ id: "management", label: "Professional Management" },
	],
}

// Shared helper so CTAActions can render internal <a> vs external links with the
// correct target/rel without duplicating the inference logic.
export function isExternalHref(link: FinalCTALink): boolean {
	if (typeof link.external === "boolean") return link.external
	return /^(https?:|mailto:|tel:)/.test(link.href)
}
```

<aside>
🔗

`FinalCTALink` covers **both internal and external** destinations: an optional `external` flag overrides the safe default, which is inferred from the href (`http(s):`, `mailto:`, `tel:`). `isExternalHref` centralises that decision so `CTAActions` stays declarative.

</aside>

---

## 3. `CTAHeader.tsx` — eyebrow + headline + description, staggered text reveal (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { FinalCTAContent } from "@/lib/final-cta"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type CTAHeaderProps = {
	content: Pick<FinalCTAContent, "eyebrow" | "heading" | "description">
	className?: string
}

// One stagger trigger; eyebrow → headline → description each fade up in sequence.
export function CTAHeader({ content, className }: CTAHeaderProps) {
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("mx-auto flex max-w-3xl flex-col items-center gap-5 text-center", className)}
		>
			<motion.span
				variants={childVariants}
				className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold"
			>
				{content.eyebrow}
			</motion.span>
			<motion.div variants={childVariants}>
				<Heading level={2} size="display" className="text-balance">
					{content.heading}
				</Heading>
			</motion.div>
			<motion.div variants={childVariants}>
				<Text size="lg" tone="muted" className="text-balance">
					{content.description}
				</Text>
			</motion.div>
		</motion.div>
	)
}
```

---

## 4. `CTAActions.tsx` — primary + secondary CTAs, internal/external (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Button } from "@/components/ui"
import { isExternalHref, type FinalCTALink } from "@/lib/final-cta"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type CTAActionsProps = {
	primary: FinalCTALink
	secondary: FinalCTALink
	className?: string
}

// Renders one link as the Button child (asChild) so it stays a real, keyboard-
// accessible anchor. External links get target/rel; internal links do not.
function CTALink({
	link,
	variant,
}: {
	link: FinalCTALink
	variant: "primary" | "secondary"
}) {
	const external = isExternalHref(link)
	return (
		<Button asChild variant={variant} size="lg">
			<a
				href={link.href}
				{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			>
				{link.label}
			</a>
		</Button>
	)
}

export function CTAActions({ primary, secondary, className }: CTAActionsProps) {
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4",
				className,
			)}
		>
			<motion.div variants={childVariants} className="w-full sm:w-auto">
				<CTALink link={primary} variant="primary" />
			</motion.div>
			<motion.div variants={childVariants} className="w-full sm:w-auto">
				<CTALink link={secondary} variant="secondary" />
			</motion.div>
		</motion.div>
	)
}
```

<aside>
✨

**CTA reveal**: a stagger trigger fades the two buttons up in sequence. Both render through the Phase 02 `Button` via `asChild`, so they remain genuine anchors with keyboard focus and the design system's focus ring. External destinations automatically receive `target="_blank"` + `rel="noopener noreferrer"`.

</aside>

---

## 5. `TrustIndicators.tsx` — concise confidence row, stagger (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Text } from "@/components/ui"
import type { TrustIndicator } from "@/lib/final-cta"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-10% 0px" } as const

type TrustIndicatorsProps = {
	items: TrustIndicator[]
	className?: string
}

// A semantic list of confidence signals; each chip fades up on a stagger.
export function TrustIndicators({ items, className }: TrustIndicatorsProps) {
	return (
		<motion.ul
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-6",
				className,
			)}
		>
			{items.map((item) => (
				<motion.li
					key={item.id}
					variants={childVariants}
					className="flex items-center gap-3"
				>
					<span
						aria-hidden="true"
						className="h-1.5 w-1.5 rounded-full bg-accent-gold/70"
					/>
					<Text size="sm" tone="muted" className="whitespace-nowrap">
						{item.label}
					</Text>
				</motion.li>
			))}
		</motion.ul>
	)
}
```

---

## 6. `FooterTransition.tsx` — gradient blend into the footer, fade (client)

```tsx
"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { easing } from "@/lib/animation"
import { cn } from "@/utils/cn"

// Footer-transition fade: composed locally from the Phase 03 easing token.
const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.9, ease: easing.out } },
}

const VIEWPORT = { once: true, margin: "-5% 0px" } as const

type FooterTransitionProps = {
	className?: string
}

// Pure-CSS gradient band (no assets) that visually dissolves the section into
// the darker footer that a later phase will mount. Decorative → aria-hidden.
export function FooterTransition({ className }: FooterTransitionProps) {
	return (
		<motion.div
			aria-hidden="true"
			variants={fadeVariants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"pointer-events-none mt-20 h-24 w-full bg-gradient-to-b from-transparent via-bg-base to-bg-elevated md:mt-28 md:h-32",
				className,
			)}
		/>
	)
}
```

<aside>
🌑

The transition is a **decorative gradient band** (`aria-hidden`) that fades the page from `bg-base` into `bg-elevated`, pre-blending toward the footer that a later phase will build. Zero assets, zero layout shift — it just reserves a fixed-height block.

</aside>

<aside>
⏭️

Part 2 (next) appends the `FinalCTA` orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 7. `FinalCTA.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import { finalCtaContent, type FinalCTAContent } from "@/lib/final-cta"
import { cn } from "@/utils/cn"
import { CTAHeader } from "./CTAHeader"
import { CTAActions } from "./CTAActions"
import { TrustIndicators } from "./TrustIndicators"
import { FooterTransition } from "./FooterTransition"

type FinalCTAProps = {
	content?: FinalCTAContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Content order
// matches the brief: background → eyebrow/headline/description → CTAs → trust →
// footer transition.
export function FinalCTA({
	content = finalCtaContent,
	id = "get-started",
	className,
}: FinalCTAProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative isolate overflow-hidden bg-bg-base pt-24 md:pt-32 lg:pt-40", className)}
		>
			{/* Background treatment: pure-CSS radial glow, no assets. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(200,162,106,0.12),transparent_70%)]"
			/>
			<Container size="content">
				<div className="flex flex-col items-center gap-10 text-center md:gap-12">
					<CTAHeader content={content} />
					<CTAActions primary={content.primaryCta} secondary={content.secondaryCta} />
					<TrustIndicators items={content.trustIndicators} />
				</div>
			</Container>
			<FooterTransition />
		</section>
	)
}
```

<aside>
🧩

Content renders in the exact brief order — **background treatment** (radial gold glow behind everything via `-z-10`) → **eyebrow → headline → description** (`CTAHeader`) → **primary + secondary CTA** (`CTAActions`) → **trust indicators** (`TrustIndicators`) → **footer transition** (`FooterTransition`). The section uses `pt-*` only (no bottom padding) so the transition band flows straight into the future footer.

</aside>

---

## 8. `index.ts` — barrel

```tsx
export { FinalCTA } from "./FinalCTA"
export { CTAHeader } from "./CTAHeader"
export { CTAActions } from "./CTAActions"
export { TrustIndicators } from "./TrustIndicators"
export { FooterTransition } from "./FooterTransition"
```

---

## 9. `app/page.tsx` — integrate below Gallery Showcase (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"
import { GlobalImpact } from "@/components/sections/global-impact"
import { VisionRoadmap } from "@/components/sections/vision-roadmap"
import { GalleryShowcase } from "@/components/sections/gallery-showcase"
import { FinalCTA } from "@/components/sections/final-cta"

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
			<GalleryShowcase id="gallery" />
			<FinalCTA id="get-started" />
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing Gallery Showcase mount. As the final section, it carries no bottom padding so it blends straight into the footer a later phase will add. All earlier sections are untouched.

</aside>

---

## 10. Deliverable 3 — Component hierarchy

```jsx
FinalCTA                          (server: section + background treatment + Container)
 ├── CTAHeader                     (client: eyebrow → headline → description, stagger trigger)
 ├── CTAActions                    (client: primary + secondary CTA, stagger trigger)
 │    └── CTALink ×2              (Button asChild → anchor; internal/external)
 ├── TrustIndicators               (client: <ul> of confidence signals, stagger trigger)
 └── FooterTransition              (client: decorative gradient band, fade)
```

- **Client only where motion lives**: `CTAHeader`, `CTAActions`, `TrustIndicators`, and `FooterTransition` opt into Framer; `FinalCTA` stays a server component and owns layout, the `<section>`, and the background treatment.
- Every component is pure and prop-driven — pass different `content` (or reuse on another page) and it renders unchanged. `CTALink` is the only internal helper, keeping internal/external link logic in one place.

## 11. Deliverable 4 — CMS data model

- All copy lives in `lib/final-cta.ts` as `FinalCTAContent`; **zero hardcoded content in components**.
- Supports every required field: `heading`, `description` (+ `eyebrow`), `primaryCta`, `secondaryCta`, and the `trustIndicators` array.
- CTAs are typed `FinalCTALink` objects that support **internal and external** links via an optional `external` flag (safely inferred from the href when omitted).
- Trust indicators are typed `TrustIndicator` objects (`id` + `label`, optional `description`) — add, remove, or reorder purely from data.
- Swap `finalCtaContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 12. Deliverable 5 — Animation approach (Phase 03 only)

- **Fade-up + staggered text reveal** → `CTAHeader` is a single `staggerContainer` trigger; eyebrow, headline, and description each rise via `childVariants` in sequence.
- **CTA reveal** → `CTAActions` staggers the primary then secondary button in with `childVariants`.
- **Trust indicator stagger** → `TrustIndicators` is a `staggerContainer` on the `<ul>`; each signal fades up via `childVariants`.
- **Footer transition fade** → `FooterTransition` plays a local opacity-only `Variants` composed from `easing.out`.
- Each trigger uses `whileInView` with `once: true`, so motion plays a single time as the section enters the viewport.
- All motion is neutralized for reduced-motion users via the global `MotionConfig reducedMotion="user"`; content stays fully visible and legible.
- **No parallax, no pinning, no horizontal scroll, no new infrastructure.**

## 13. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<640`)**: single column; CTAs stack full-width; trust indicators wrap onto multiple centered rows.
- **Tablet (`640–1023`)**: stacked editorial composition; CTAs sit side-by-side; trust indicators flow in a centered row.
- **Desktop (`≥1024`)**: large centered editorial composition inside a `content`-width container with generous vertical rhythm; the radial background glow anchors the headline.
- **No CLS / no assets**: background treatment and footer transition are pure CSS gradients with fixed dimensions; type and buttons reserve their own space, so nothing reflows on load.

## 14. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below Gallery Showcase, as the final homepage section
- [ ]  Order: background → eyebrow → headline → description → primary CTA → secondary CTA → trust indicators → footer transition
- [ ]  Desktop centered editorial; tablet stacked; mobile single column
- [ ]  Primary "Explore Projects" and secondary "Contact Our Team" both keyboard-focusable with visible focus ring
- [ ]  External links (if configured) open with `rel="noopener noreferrer"`
- [ ]  `prefers-reduced-motion`: no entrance motion; content fully visible
- [ ]  Footer transition blends into the page base with no layout shift

<aside>
🧩

**Assumptions to reconcile against your real exports:** `@/lib/animation` exports `staggerContainer`, `childVariants`, `easing` (`easing.out`); `@/components/ui` exports `Container`, `Heading`, `Text`, `Button` (with `asChild`). The background treatment uses the gold token as an inline `rgba(200,162,106,...)` inside an arbitrary Tailwind gradient — swap for your `--accent-gold` utility if you prefer. If a name differs, only the import line changes — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06H complete. Awaiting approval before Phase 07.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>