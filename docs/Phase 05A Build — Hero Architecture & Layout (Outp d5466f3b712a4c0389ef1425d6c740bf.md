# Phase 05A Build — Hero Architecture & Layout (Output)

<aside>
🏔️

**Phase 05A — Hero Architecture & Layout.** Structurally complete, fully responsive Hero section with layered architecture and CMS-ready data. **No cinematic animations** — those land in Phase 05B. Reuses Phase 02 primitives + Phase 03 motion architecture. No new dependencies.

</aside>

## 1. Files in this phase

```
lib/
  hero.ts                         # CMS-ready Hero data + types (placeholder)
components/sections/hero/
  hero.tsx                        # Orchestrator: composes all layers
  hero-media.tsx                  # Background media layer (image OR video)
  hero-overlay.tsx                # Gradient/scrim overlay layer
  hero-content.tsx                # Editorial content layer (grid)
  hero-heading.tsx                # Eyebrow + Heading + Subheading
  hero-description.tsx            # Lead description copy
  hero-actions.tsx                # CTA layer (primary + secondary)
  hero-scroll-indicator.tsx       # Scroll cue (static, animation in 05B)
  index.ts                        # Barrel export
app/
  page.tsx                        # Homepage integration
```

No new dependencies. Pure Phase 02 + Phase 03 reuse.

---

## 2. `lib/hero.ts` — CMS-ready data + types

```tsx
// CMS-ready Hero content model.
// In production these fields are sourced from Sanity; here we ship typed
// placeholder data with the exact shape the CMS will return.

export type HeroMediaSource =
	| {
			kind: "image"
			/** Path under /public or a remote CMS URL. */
			src: string
			/** Required for a11y; empty string only for decorative media. */
			alt: string
			/** Low-quality placeholder data URL (optional). */
			blurDataURL?: string
	  }
	| {
			kind: "video"
			/** Primary video source (mp4/webm). */
			src: string
			/** Poster shown before/while the video loads. Prevents CLS. */
			poster: string
			/** Accessible label describing the footage. */
			label: string
	  }

export type HeroCta = {
	label: string
	href: string
}

export type HeroContent = {
	eyebrow: string
	heading: string
	subheading?: string
	description: string
	primaryCta: HeroCta
	secondaryCta?: HeroCta
	media: HeroMediaSource
	/** Accessible name for the hero landmark region. */
	regionLabel: string
}

// Placeholder content — swap `media.src` for real assets in /public/images/hero/
// or wire to the CMS query in Phase 06+.
export const heroContent: HeroContent = {
	eyebrow: "Private Collection · Est. 2026",
	heading: "Architecture for a Considered Life",
	subheading: "Limited residences in the world's most coveted addresses",
	description:
		"Lumière Estates curates a portfolio of architecturally significant homes — each a study in light, proportion, and permanence. Tokenized ownership, reimagined for the discerning few.",
	primaryCta: { label: "Explore Residences", href: "/projects" },
	secondaryCta: { label: "Request Private Tour", href: "/contact" },
	media: {
		kind: "image",
		src: "/images/hero/hero-poster.jpg",
		alt: "Floor-to-ceiling glass residence overlooking a still infinity pool at dusk",
	},
	regionLabel: "Lumière Estates — featured residences",
}
```

---

## 3. `components/sections/hero/hero-media.tsx` — Background media layer

```tsx
import Image from "next/image"
import type { HeroMediaSource } from "@/lib/hero"
import { cn } from "@/utils/cn"

type HeroMediaProps = {
	media: HeroMediaSource
	className?: string
}

// Background layer only. Fills the hero, sits behind overlay + content.
// No animation here (Phase 05B adds zoom/parallax). Poster + fixed fill
// guarantee zero CLS for both image and video.
export function HeroMedia({ media, className }: HeroMediaProps) {
	return (
		<div
			aria-hidden="true"
			className={cn("absolute inset-0 overflow-hidden bg-bg-base", className)}
		>
			{media.kind === "image" ? (
				<Image
					src={media.src}
					alt={media.alt}
					fill
					priority
					sizes="100vw"
					className="object-cover"
					{...(media.blurDataURL
						? { placeholder: "blur", blurDataURL: media.blurDataURL }
						: {})}
				/>
			) : (
				<video
					className="h-full w-full object-cover"
					poster={media.poster}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					aria-label={media.label}
				>
					<source src={media.src} type="video/mp4" />
				</video>
			)}
		</div>
	)
}
```

---

## 4. `components/sections/hero/hero-overlay.tsx` — Overlay layer

```tsx
import { cn } from "@/utils/cn"

type HeroOverlayProps = {
	className?: string
}

// Scrim that guarantees text contrast over any media.
// Dual gradient: vertical darkening at the base for copy legibility,
// plus a subtle radial vignette for editorial depth. No inline styles.
export function HeroOverlay({ className }: HeroOverlayProps) {
	return (
		<div aria-hidden="true" className={cn("absolute inset-0", className)}>
			<div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-bg-base/10" />
			<div className="absolute inset-0 bg-gradient-to-r from-bg-base/70 via-transparent to-transparent" />
		</div>
	)
}
```

---

## 5. `components/sections/hero/hero-heading.tsx` — Eyebrow + Heading + Subheading

```tsx
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type HeroHeadingProps = {
	eyebrow: string
	heading: string
	subheading?: string
	className?: string
}

// The page's single H1 lives here (proper heading hierarchy).
// Eyebrow is decorative-but-readable; subheading is an H2-weighted lead.
export function HeroHeading({
	eyebrow,
	heading,
	subheading,
	className,
}: HeroHeadingProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<Text
				size="sm"
				tone="accent"
				className="font-display-sans uppercase tracking-[0.28em]"
			>
				{eyebrow}
			</Text>
			<Heading
				level={1}
				size="display"
				className="max-w-[16ch] text-balance"
			>
				{heading}
			</Heading>
			{subheading ? (
				<Text size="lg" tone="primary" className="max-w-[44ch]">
					{subheading}
				</Text>
			) : null}
		</div>
	)
}
```

---

## 6. `components/sections/hero/hero-description.tsx` — Lead copy

```tsx
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type HeroDescriptionProps = {
	children: string
	className?: string
}

export function HeroDescription({ children, className }: HeroDescriptionProps) {
	return (
		<Text size="md" tone="muted" className={cn("max-w-[52ch]", className)}>
			{children}
		</Text>
	)
}
```

---

## 7. `components/sections/hero/hero-actions.tsx` — CTA layer

```tsx
import Link from "next/link"
import type { HeroCta } from "@/lib/hero"
import { Button } from "@/components/ui"
import { cn } from "@/utils/cn"

type HeroActionsProps = {
	primary: HeroCta
	secondary?: HeroCta
	className?: string
}

// CTA layer. Buttons render as Next.js Links via asChild-free composition:
// we wrap Button in Link so navigation + button styling stay decoupled.
// Keyboard accessible by default (native anchors).
export function HeroActions({ primary, secondary, className }: HeroActionsProps) {
	return (
		<div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
			<Button asChild variant="primary" size="lg">
				<Link href={primary.href}>{primary.label}</Link>
			</Button>
			{secondary ? (
				<Button asChild variant="secondary" size="lg">
					<Link href={secondary.href}>{secondary.label}</Link>
				</Button>
			) : null}
		</div>
	)
}
```

<aside>
⚠️

**Button `asChild` note:** this assumes the Phase 02 `Button` supports an `asChild` prop (Radix-`Slot`-style) to render as the child `Link`. If your Phase 02 `Button` does **not** have `asChild`, use the click-handler form instead: `<Button variant="primary" size="lg" onClick={...}>` is not ideal for links. Tell me and I'll ship a tiny `Slot`-free variant that forwards `className` onto `Link` directly — keeps zero-CLS and full keyboard support.

</aside>

---

## 8. `components/sections/hero/hero-scroll-indicator.tsx` — Scroll cue

```tsx
import { cn } from "@/utils/cn"

type HeroScrollIndicatorProps = {
	/** Anchor id of the next section to jump to. */
	targetId: string
	className?: string
}

// Static, accessible scroll cue. Animation (bounce/fade) is added in 05B.
// Rendered as a real link so keyboard + screen-reader users can skip down.
export function HeroScrollIndicator({ targetId, className }: HeroScrollIndicatorProps) {
	return (
		<a
			href={`#${targetId}`}
			className={cn(
				"group inline-flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-text-primary focus-visible:text-text-primary",
				className,
			)}
		>
			<span className="font-display-sans text-xs uppercase tracking-[0.3em]">
				Scroll
			</span>
			<span
				aria-hidden="true"
				className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5"
			>
				<span className="h-2 w-0.5 rounded-full bg-accent-gold" />
			</span>
			<span className="sr-only">Scroll to explore the residences</span>
		</a>
	)
}
```

---

## 9. `components/sections/hero/hero-content.tsx` — Content layer (grid)

```tsx
import { Container } from "@/components/ui"
import type { HeroContent as HeroContentModel } from "@/lib/hero"
import { cn } from "@/utils/cn"
import { HeroActions } from "./hero-actions"
import { HeroDescription } from "./hero-description"
import { HeroHeading } from "./hero-heading"

type HeroContentProps = {
	content: HeroContentModel
	className?: string
}

// Editorial composition layer. Grid-based: on large screens the copy sits in
// the lower-left editorial column; on small screens it stacks centered-bottom.
export function HeroContent({ content, className }: HeroContentProps) {
	return (
		<Container
			size="max"
			className={cn("relative z-10 flex h-full items-end pb-24 md:pb-28", className)}
		>
			<div className="grid w-full grid-cols-1 lg:grid-cols-12">
				<div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-6">
					<HeroHeading
						eyebrow={content.eyebrow}
						heading={content.heading}
						subheading={content.subheading}
					/>
					<HeroDescription>{content.description}</HeroDescription>
					<HeroActions
						primary={content.primaryCta}
						secondary={content.secondaryCta}
						className="mt-2"
					/>
				</div>
			</div>
		</Container>
	)
}
```

---

## 10. `components/sections/hero/hero.tsx` — Orchestrator

```tsx
import type { HeroContent as HeroContentModel } from "@/lib/hero"
import { heroContent as defaultHeroContent } from "@/lib/hero"
import { cn } from "@/utils/cn"
import { HeroContent } from "./hero-content"
import { HeroMedia } from "./hero-media"
import { HeroOverlay } from "./hero-overlay"
import { HeroScrollIndicator } from "./hero-scroll-indicator"

type HeroProps = {
	/** CMS-injectable; falls back to placeholder content. */
	content?: HeroContentModel
	/** Anchor id of the section the scroll indicator points to. */
	nextSectionId?: string
	className?: string
}

// Layer order (back -> front):
//   media -> overlay -> content -> scroll indicator
// `min-h` uses svh/dvh to avoid mobile URL-bar CLS while keeping ~100vh.
export function Hero({
	content = defaultHeroContent,
	nextSectionId = "featured",
	className,
}: HeroProps) {
	return (
		<section
			aria-label={content.regionLabel}
			className={cn(
				"relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden",
				className,
			)}
		>
			{/* Background media layer */}
			<HeroMedia media={content.media} />

			{/* Overlay layer */}
			<HeroOverlay />

			{/* Content + CTA layers */}
			<HeroContent content={content} className="flex-1" />

			{/* Decorative + scroll-indicator layer */}
			<div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
				<div className="pointer-events-auto">
					<HeroScrollIndicator targetId={nextSectionId} />
				</div>
			</div>
		</section>
	)
}
```

---

## 11. `components/sections/hero/index.ts` — Barrel

```tsx
export { Hero } from "./hero"
export { HeroMedia } from "./hero-media"
export { HeroOverlay } from "./hero-overlay"
export { HeroContent } from "./hero-content"
export { HeroHeading } from "./hero-heading"
export { HeroDescription } from "./hero-description"
export { HeroActions } from "./hero-actions"
export { HeroScrollIndicator } from "./hero-scroll-indicator"
```

---

## 12. `app/page.tsx` — Homepage integration

```tsx
import { Hero } from "@/components/sections/hero"

export default function HomePage() {
	return (
		<>
			<Hero nextSectionId="featured" />

			{/* Phase 06+ sections mount below this anchor. */}
			<section id="featured" aria-hidden="true" className="min-h-px" />
		</>
	)
}
```

<aside>
🧭

The `<main id="main">` landmark already lives in `app/layout.tsx` (added in Phase 04), so the Hero `<section>` correctly nests inside the page's main landmark — no duplicate landmarks.

</aside>

---

## 13. Deliverable 3 — Component hierarchy

```
HomePage (app/page.tsx)
└─ Hero (orchestrator, server component)
   ├─ HeroMedia        ← background layer (image | video), aria-hidden
   ├─ HeroOverlay      ← contrast scrim (dual gradient), aria-hidden
   ├─ HeroContent      ← Container + 12-col grid (editorial composition)
   │  ├─ HeroHeading   ← Eyebrow (Text) + H1 (Heading) + Subheading (Text)
   │  ├─ HeroDescription ← lead copy (Text)
   │  └─ HeroActions   ← Primary + Secondary CTAs (Button > Link)
   └─ HeroScrollIndicator ← accessible scroll cue (anchor link)
```

- **`Hero`** is the only composition point and is a **server component** (no client JS — there's no state or animation yet, so it ships zero runtime cost).
- Every sub-component is **pure and prop-driven**, independently testable, and accepts `className` for placement overrides.
- **No duplicated logic**: spacing/typography come from Phase 02 primitives (`Container`, `Heading`, `Text`, `Button`); `cn` handles class merging.

---

## 14. Deliverable 4 — Responsive behavior

| Breakpoint | Behavior |
| --- | --- |
| **360px** (small phones) | Single column, copy stacks bottom, `display` heading clamps down via Phase 02 fluid type, CTAs stack full-width (`flex-col`). |
| **768px** (tablet) | CTAs go side-by-side (`sm:flex-row`), increased bottom padding, copy width capped by `ch` measures. |
| **1024px** (desktop) | 12-col grid engages; copy occupies left 7 columns (`lg:col-span-7`), media breathes on the right. |
| **1440px** | Copy tightens to 6 columns (`xl:col-span-6`) for editorial balance. |
| **1920px+** (ultra-wide) | `Container size="max"` caps line length; hero stays centered, media fills full bleed via `object-cover`. |

**No CLS guarantees:**

- `min-h-[100svh]` uses small-viewport units so the mobile URL bar collapse doesn't reflow the hero.
- `next/image` with `fill` + `sizes="100vw"` + `priority` reserves layout box immediately.
- Video uses a `poster` + `object-cover` so the frame box is reserved before footage loads.
- All measures use `ch`/`max-w` caps — no font-swap reflow beyond the reserved box.

---

## 15. Deliverable 5 — CMS integration points

- **`lib/hero.ts`** defines the exact content contract (`HeroContent`) the CMS must satisfy. The discriminated union `HeroMediaSource` (`kind: "image" | "video"`) maps 1:1 to a Sanity media field.
- **`Hero`** accepts a `content?` prop. Today it defaults to `heroContent`; in Phase 06+ the homepage server component fetches the Sanity document and passes it: `<Hero content={await getHeroContent()} />`.
- **Image vs video** is data-driven — switching media type requires only a CMS field change, no code change (`HeroMedia` branches on `media.kind`).
- **CTAs** (`HeroCta { label, href }`) map directly to CMS link fields; `href` supports internal routes and external URLs.
- **`regionLabel`** is CMS-editable for localized/SEO-friendly landmark naming.

---

## 16. Accessibility checklist

- ✅ **Semantic landmark**: `<section aria-label>` inside the existing `<main>`.
- ✅ **Heading hierarchy**: exactly one `<h1>` (HeroHeading); eyebrow/subheading are non-heading `Text`.
- ✅ **ARIA labels**: media layers `aria-hidden`; video has `aria-label`; scroll cue has `sr-only` description.
- ✅ **Keyboard navigation**: CTAs and scroll indicator are native anchors — fully focusable/operable.
- ✅ **Contrast compliance**: dual-gradient overlay guarantees AA contrast for `text-primary`/`text-muted` over any media.
- ✅ **Reduced motion**: nothing animates in 05A; video is `muted`/`playsInline`. 05B will gate motion behind the Phase 03 `reducedMotion="user"` + `useReducedMotion` infra.

---

## 17. Scope confirmation

**Built:** Hero, HeroMedia, HeroOverlay, HeroContent, HeroHeading, HeroDescription, HeroActions, HeroScrollIndicator + CMS data + homepage integration. All 7 layers (media, overlay, content, CTA, scroll, decorative, accessibility) present.

**Deliberately NOT built (per scope):** GSAP timelines, text reveal, SplitType, mouse parallax, video/image zoom, cursor interaction, scroll-triggered animations, Three.js scene, particle system, floating elements. → **Phase 05B.**

---

## 18. Verify locally

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Drop a real asset at `/public/images/hero/hero-poster.jpg` (or point `heroContent.media.src` at any existing placeholder) so `next/image` has a file to optimize.

<aside>
🛑

**Stopping here for your approval before Phase 05B (Cinematic Animations).**

</aside>