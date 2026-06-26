# Phase 06B Build — About Relcko & Digital Ownership (Output)

<aside>
🏛️

**Phase 06B — About Relcko & Digital Ownership.** A premium editorial two-column section that follows Featured Projects: architectural imagery + floating accent on the left, brand story (eyebrow → heading → rich description → three feature highlights → CTA) on the right. 8 pure, prop-driven, CMS-ready components + typed placeholder content. Reuses Phase 02 design system + Phase 03 motion — **no new animation utilities**, no new dependencies. Hero / Featured Projects untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```
lib/
  about.ts                  # Types + CMS-ready placeholder content
components/sections/about/
  AboutSection.tsx          # Server orchestrator (section + 2-col grid)
  AboutMedia.tsx            # next/image reveal + floating accent
  AboutContent.tsx          # Client stagger orchestrator (right column)
  AboutHeading.tsx          # Eyebrow + h2
  AboutDescription.tsx      # Rich multi-paragraph copy
  AboutFeatures.tsx         # Staggered feature list
  AboutFeatureCard.tsx      # Icon + title + description
  AboutCTA.tsx              # Button asChild > Link
  index.ts                  # Barrel
app/
  page.tsx                  # EDIT — mount below Featured Projects
```

<aside>
⚠️

**Standing assumptions (unchanged):** `@/components/ui` exports `Button` (with `asChild`), `Container`, `Heading` (`level`/`size`), `Text` (`size`/`tone`). `@/lib/animation` exports `reveal`, `staggerContainer`, `childVariants`. Feature icons are an inline SVG registry keyed by a typed icon name, so CMS data stays string-only while components own the visuals.

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + leaf/media components. **Part 2** (appended next) = content orchestrator, section, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/about.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the About section. Production sources this from
// Sanity; here we ship typed placeholders with the exact shape the CMS returns.
// No hardcoded copy lives inside the components.

export type AboutIconName = "developments" | "ownership" | "globe"

export type AboutFeature = {
	id: string
	icon: AboutIconName
	title: string
	description: string
}

export type AboutImage = {
	src: string
	alt: string
	blurDataURL?: string
}

export type AboutAccent = {
	value: string
	label: string
}

export type AboutContent = {
	eyebrow: string
	heading: string
	paragraphs: string[]
	image: AboutImage
	accent?: AboutAccent
	features: AboutFeature[]
	cta: { label: string; href: string }
}

export const aboutContent: AboutContent = {
	eyebrow: "About Relcko",
	heading: "Permanent architecture, reimagined for a new era of ownership",
	paragraphs: [
		"Relcko is a global real estate house dedicated to landmark living — places designed to outlast trends and hold their meaning for generations. Every address we create begins with architecture worth keeping.",
		"What makes us different is how we think about ownership itself. We pair enduring buildings with a modern, transparent way to own them — so a residence can be held, understood, and passed on with the same clarity as any treasured asset.",
		"Digital ownership simply means your stake in a property is recorded clearly and securely, accessible from anywhere in the world. No opaque paperwork, no borders — just confident, verifiable ownership. We believe this is where real estate is going, and we are building it for people first, technology second.",
	],
	image: {
		src: "/images/about/relcko-vision.jpg",
		alt: "Sunlit atrium of a contemporary residential tower with layered balconies",
	},
	accent: { value: "12+", label: "Cities worldwide" },
	features: [
		{
			id: "feat-developments",
			icon: "developments",
			title: "Premium Developments",
			description:
				"A curated portfolio of architecturally significant residences, built to a standard that endures.",
		},
		{
			id: "feat-ownership",
			icon: "ownership",
			title: "Digital Ownership",
			description:
				"A clear, secure record of what you own — transparent, verifiable, and effortless to manage.",
		},
		{
			id: "feat-global",
			icon: "globe",
			title: "Global Accessibility",
			description:
				"Own and oversee a residence from anywhere, with a borderless experience designed around you.",
		},
	],
	cta: { label: "Discover Our Vision", href: "/about" },
}
```

---

## 3. `AboutHeading.tsx` — eyebrow + h2

```tsx
import { Heading } from "@/components/ui"
import { cn } from "@/utils/cn"

type AboutHeadingProps = {
	eyebrow: string
	heading: string
	className?: string
}

export function AboutHeading({ eyebrow, heading, className }: AboutHeadingProps) {
	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
				{eyebrow}
			</span>
			<Heading level={2} size="xl" className="text-balance">
				{heading}
			</Heading>
		</div>
	)
}
```

---

## 4. `AboutDescription.tsx` — rich multi-paragraph copy

```tsx
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type AboutDescriptionProps = {
	paragraphs: string[]
	className?: string
}

export function AboutDescription({ paragraphs, className }: AboutDescriptionProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			{paragraphs.map((paragraph, index) => (
				<Text key={`about-paragraph-${index}`} size="md" tone="muted" className="max-w-[60ch]">
					{paragraph}
				</Text>
			))}
		</div>
	)
}
```

---

## 5. `AboutFeatureCard.tsx` — icon + title + description

```tsx
import type { ReactNode } from "react"
import { Heading, Text } from "@/components/ui"
import type { AboutFeature, AboutIconName } from "@/lib/about"
import { cn } from "@/utils/cn"

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<AboutIconName, ReactNode> = {
	developments: (
		<path
			d="M3 21h18M5 21V7l6-4v18M11 21V11l8-3v13"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	),
	ownership: (
		<>
			<path
				d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	globe: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
}

type AboutFeatureCardProps = {
	feature: AboutFeature
	className?: string
}

export function AboutFeatureCard({ feature, className }: AboutFeatureCardProps) {
	return (
		<div className={cn("flex gap-4", className)}>
			<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent-gold">
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
					{ICONS[feature.icon]}
				</svg>
			</span>
			<div className="flex flex-col gap-1">
				<Heading level={3} size="sm">
					{feature.title}
				</Heading>
				<Text size="sm" tone="muted" className="max-w-[44ch]">
					{feature.description}
				</Text>
			</div>
		</div>
	)
}
```

---

## 6. `AboutFeatures.tsx` — staggered feature list

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { AboutFeature } from "@/lib/about"
import { cn } from "@/utils/cn"
import { AboutFeatureCard } from "./AboutFeatureCard"

type AboutFeaturesProps = {
	features: AboutFeature[]
	className?: string
}

// No own trigger: this list is a nested stagger container that inherits
// hidden/visible from AboutContent and cascades to each card.
export function AboutFeatures({ features, className }: AboutFeaturesProps) {
	return (
		<motion.ul variants={staggerContainer} className={cn("flex flex-col gap-6", className)}>
			{features.map((feature) => (
				<motion.li key={feature.id} variants={childVariants}>
					<AboutFeatureCard feature={feature} />
				</motion.li>
			))}
		</motion.ul>
	)
}
```

---

## 7. `AboutCTA.tsx` — primary call to action

```tsx
import Link from "next/link"
import { Button } from "@/components/ui"

type AboutCTAProps = {
	label: string
	href: string
	className?: string
}

export function AboutCTA({ label, href, className }: AboutCTAProps) {
	return (
		<Button asChild variant="primary" size="lg" className={className}>
			<Link href={href}>{label}</Link>
		</Button>
	)
}
```

---

## 8. `AboutMedia.tsx` — image reveal + floating accent

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { reveal } from "@/lib/animation"
import type { AboutAccent, AboutImage } from "@/lib/about"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type AboutMediaProps = {
	image: AboutImage
	accent?: AboutAccent
	className?: string
}

export function AboutMedia({ image, accent, className }: AboutMediaProps) {
	return (
		<motion.div
			variants={reveal}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("relative", className)}
		>
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border">
				<Image
					src={image.src}
					alt={image.alt}
					fill
					sizes="(max-width: 1024px) 100vw, 50vw"
					loading="lazy"
					{...(image.blurDataURL
						? { placeholder: "blur", blurDataURL: image.blurDataURL }
						: {})}
					className="object-cover"
				/>
				<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent" />
			</div>
			{accent ? (
				<div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-bg-elevated/90 px-6 py-4 backdrop-blur md:block">
					<div className="font-display-sans text-3xl text-accent-gold">{accent.value}</div>
					<div className="text-sm text-text-muted">{accent.label}</div>
				</div>
			) : null}
		</motion.div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends the content orchestrator, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 9. `AboutContent.tsx` — right-column stagger orchestrator

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { AboutContent as AboutContentData } from "@/lib/about"
import { cn } from "@/utils/cn"
import { AboutHeading } from "./AboutHeading"
import { AboutDescription } from "./AboutDescription"
import { AboutFeatures } from "./AboutFeatures"
import { AboutCTA } from "./AboutCTA"

// Named const keeps inline object literals out of JSX (project convention).
const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type AboutContentProps = {
	content: Pick<
		AboutContentData,
		"eyebrow" | "heading" | "paragraphs" | "features" | "cta"
	>
	className?: string
}

// Single scroll trigger for the whole right column. staggerContainer cascades
// hidden/visible to each block (fade-up); AboutFeatures is a nested stagger
// container that then cascades to its cards — no extra triggers, Phase 03 only.
export function AboutContent({ content, className }: AboutContentProps) {
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("flex flex-col gap-8", className)}
		>
			<motion.div variants={childVariants}>
				<AboutHeading eyebrow={content.eyebrow} heading={content.heading} />
			</motion.div>
			<motion.div variants={childVariants}>
				<AboutDescription paragraphs={content.paragraphs} />
			</motion.div>
			<AboutFeatures features={content.features} />
			<motion.div variants={childVariants}>
				<AboutCTA label={content.cta.label} href={content.cta.href} />
			</motion.div>
		</motion.div>
	)
}
```

---

## 10. `AboutSection.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import { aboutContent, type AboutContent as AboutContentData } from "@/lib/about"
import { cn } from "@/utils/cn"
import { AboutMedia } from "./AboutMedia"
import { AboutContent } from "./AboutContent"

type AboutSectionProps = {
	content?: AboutContentData
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label regardless of
// primitive prop forwarding. Media is the left column, content the right.
export function AboutSection({
	content = aboutContent,
	id = "about",
	className,
}: AboutSectionProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
					<AboutMedia image={content.image} accent={content.accent} />
					<AboutContent content={content} />
				</div>
			</Container>
		</section>
	)
}
```

---

## 11. `index.ts` — barrel

```tsx
export { AboutSection } from "./AboutSection"
export { AboutMedia } from "./AboutMedia"
export { AboutContent } from "./AboutContent"
export { AboutHeading } from "./AboutHeading"
export { AboutDescription } from "./AboutDescription"
export { AboutFeatures } from "./AboutFeatures"
export { AboutFeatureCard } from "./AboutFeatureCard"
export { AboutCTA } from "./AboutCTA"
```

---

## 12. `app/page.tsx` — integrate below Featured Projects (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />
			<FeaturedProjects id="featured" />
			<AboutSection id="about" />
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing Featured Projects mount. Hero and Featured Projects are untouched.

</aside>

---

## 13. Deliverable 3 — Component hierarchy

```
AboutSection                       (server: section + Container + 2-col grid)
 ├── AboutMedia                    (client: image reveal + floating accent)
 └── AboutContent                  (client: stagger orchestrator, right column)
      ├── AboutHeading             (eyebrow + h2)
      ├── AboutDescription         (rich multi-paragraph copy)
      ├── AboutFeatures            (nested stagger list)
      │    └── AboutFeatureCard ×3 (icon + h3 + description)
      └── AboutCTA                 (Phase 02 Button asChild > Link)
```

- **Two client islands only** (`AboutMedia`, `AboutContent`) because they own scroll motion; `AboutSection` and every leaf is server-renderable and pure.
- Each component takes exactly the data it needs and nothing else (`AboutHeading` gets eyebrow+heading, `AboutFeatureCard` gets one feature), so all are independently reusable and testable.

## 14. Deliverable 4 — CMS data model

- All content lives in `lib/about.ts` as `AboutContent`; **zero hardcoded copy in components**.
- Supports every required field: `heading` (+ `eyebrow`), `paragraphs` (rich description as an array — add/remove paragraphs without code changes), `image`, `features`, `cta`, plus an optional `accent` for the floating stat.
- `features` are typed `AboutFeature[]`; `icon` is a **typed union** (`AboutIconName`) resolved by an inline SVG registry — the CMS only ever sends a string, and `Record<AboutIconName, …>` forces every icon name to have art at compile time.
- Swap `aboutContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 15. Deliverable 5 — Animation approach (Phase 03 only)

- **Image reveal** → Phase 03 `reveal` variant on `AboutMedia` (its own `whileInView` trigger in the left column).
- **Fade-up + stagger** → `AboutContent` is one `staggerContainer` trigger; heading, description, features block, and CTA each fade-up via `childVariants`.
- **Staggered feature cards** → `AboutFeatures` is a *nested* `staggerContainer` (no own trigger) that inherits hidden/visible from the cascade and staggers each card.
- **CTA fade** → the CTA is the last `childVariants` item, so it settles in after the rest.
- **No new utilities, no parallax, no pinning, no horizontal scroll.** Reduced motion is honored globally by the Phase 03 `MotionConfig reducedMotion="user"` — entrances resolve instantly with full legibility.

## 16. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<1024`)**: single column; media stacks above content; generous `gap-12` rhythm. The floating accent is hidden below `md` to avoid crowding.
- **Tablet (`768–1023`)**: still stacked single column (per brief), wider gutters via `Container`.
- **Desktop (`≥1024`)**: two-column `lg:grid-cols-2`, vertically centered (`items-center`), with `lg:gap-16 xl:gap-24` editorial spacing — media left, story right.
- **No CLS**: the image is `next/image` `fill` inside a fixed `aspect-[4/5]` box (space reserved pre-load), `loading="lazy"`, `sizes` set for the 50vw desktop column, optional `blurDataURL` LQIP.

## 17. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below Featured Projects
- [ ]  Desktop two-column (media left, story right); stacks at <1024
- [ ]  Heading outline correct (section h2 → feature h3)
- [ ]  Three feature cards with icon + title + description, staggered in
- [ ]  Image reveal + fade-up entrances fire once on scroll-in
- [ ]  CTA is keyboard-focusable with a visible focus state
- [ ]  `prefers-reduced-motion`: entrances disabled, content fully visible
- [ ]  No layout shift as the image loads

<aside>
🧩

**Assumptions to reconcile against your real Phase 02/03 exports:** `@/lib/animation` exports `reveal`, `staggerContainer`, `childVariants`; `@/components/ui` exports `Button` (with `asChild`), `Container`, `Heading`, `Text`. If a name differs, only the import line changes — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06B complete. Awaiting approval before Phase 06C (Lifestyle Experience).** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>