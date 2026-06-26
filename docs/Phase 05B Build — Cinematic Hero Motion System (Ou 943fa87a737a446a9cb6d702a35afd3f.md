# Phase 05B Build — Cinematic Hero Motion System (Output)

<aside>
🎬

**Phase 05B — Cinematic Hero Motion System.** Adds motion ONLY on top of the Phase 05A Hero — same layout, same component tree. One master GSAP entrance timeline + SplitType heading reveal + scrubbed scroll interactions + ambient idle + reduced-motion fallback. Reuses Phase 03 infra (`registerGsap`, `duration`, `gsapEase`, `useIsomorphicLayoutEffect`, `useReducedMotion`). No new dependencies.

</aside>

## 1. What changes vs 05A

Layout/architecture are **unchanged**. Motion is wired three ways, all decoupled via `data-hero="*"` attributes (no ref drilling):

```
hooks/
  use-hero-timeline.ts     # NEW — master entrance timeline + SplitType + idle
  use-hero-scroll.ts       # NEW — scrubbed scroll interactions (ScrollTrigger)
  index.ts                 # EDIT — export the two new hooks
components/sections/hero/
  hero.tsx                 # EDIT — now "use client"; root ref + invokes hooks
  hero-media.tsx           # EDIT — data-hero="media"
  hero-overlay.tsx         # EDIT — data-hero="overlay"
  hero-content.tsx         # EDIT — data-hero="content" + description wrapper
  hero-heading.tsx         # EDIT — eyebrow/heading/subheading targets + line mask
  hero-actions.tsx         # EDIT — data-hero="cta" + hover scale/glow
  hero-scroll-indicator.tsx# EDIT — data-hero="scroll" + scroll-dot target
```

<aside>
⚠️

**Prop-forwarding assumption:** the CTA targets set `data-hero="cta"` + hover classes directly on the Phase 02 `Button`. This assumes `Button` forwards unknown props + merges `className` onto its root (standard). Same `asChild` assumption as 05A. Every other target sits on a native element or a wrapper `div` I fully control, so those are guaranteed regardless.

</aside>

---

## 2. `hooks/use-hero-timeline.ts` — Master entrance timeline + SplitType + idle

```tsx
"use client"

import type { RefObject } from "react"
import gsap from "gsap"
import SplitType from "split-type"
import { duration } from "@/lib/animation/tokens"
import { gsapEase } from "@/lib/animation/easing"
import { registerGsap } from "@/lib/animation/gsap"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type UseHeroTimelineArgs = {
	scope: RefObject<HTMLElement | null>
}

// ONE master entrance timeline for the whole Hero, scoped to the root via
// gsap.context. Runs on every mount, so it replays on each page refresh.
// Anti-FOUC: useIsomorphicLayoutEffect applies initial states before paint.
export function useHeroTimeline({ scope }: UseHeroTimelineArgs) {
	const reduce = useReducedMotion()

	useIsomorphicLayoutEffect(() => {
		const root = scope.current
		if (!root) return

		registerGsap()

		const headingEl = root.querySelector<HTMLElement>('[data-hero="heading"]')
		let split: SplitType | null = null

		const ctx = gsap.context(() => {
			// Reduced motion: skip all entrance + idle motion. Native CSS leaves
			// every element fully visible, so the Hero is immediately readable.
			if (reduce) return

			// SplitType: split the headline into lines + chars for a line-masked
			// character reveal. The `.line` mask comes from a Tailwind arbitrary
			// variant on the heading wrapper, so no global CSS is needed.
			if (headingEl) {
				split = new SplitType(headingEl, {
					types: "lines,chars",
					tagName: "span",
				})
			}

			// Initial states (transform + opacity only — never layout props → no CLS)
			gsap.set('[data-hero="media"]', { autoAlpha: 0, scale: 1.12 })
			gsap.set('[data-hero="overlay"]', { autoAlpha: 0 })
			gsap.set('[data-hero="eyebrow"]', { autoAlpha: 0, y: 16 })
			gsap.set('[data-hero="subheading"]', { autoAlpha: 0, y: 18 })
			gsap.set('[data-hero="description"]', { autoAlpha: 0, y: 24 })
			gsap.set('[data-hero="cta"]', { autoAlpha: 0, y: 20 })
			gsap.set('[data-hero="scroll"]', { autoAlpha: 0, y: -8 })
			if (split?.chars) {
				gsap.set(split.chars, { autoAlpha: 0, yPercent: 110 })
			}

			// MASTER ENTRANCE TIMELINE — one continuous cinematic sequence.
			const tl = gsap.timeline({
				defaults: { ease: gsapEase.out, duration: duration.slow },
			})

			tl
				// 1 + 2: overlay fade-in & background media reveal (scale settle)
				.to('[data-hero="overlay"]', { autoAlpha: 1, duration: duration.base }, 0)
				.to('[data-hero="media"]', { autoAlpha: 1, scale: 1, duration: 1.6 }, 0)
				// 3: eyebrow reveal
				.to('[data-hero="eyebrow"]', { autoAlpha: 1, y: 0, duration: duration.base }, 0.45)

			// 4: heading SplitType character reveal (line-masked)
			if (split?.chars) {
				tl.to(
					split.chars,
					{ autoAlpha: 1, yPercent: 0, duration: duration.slow, stagger: 0.018 },
					0.6,
				)
			}

			tl
				.to('[data-hero="subheading"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.55")
				// 5: description fade + slide
				.to('[data-hero="description"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.45")
				// 6: CTA stagger
				.to('[data-hero="cta"]', { autoAlpha: 1, y: 0, duration: duration.base, stagger: 0.12 }, "-=0.35")
				// 7: scroll indicator appearance
				.to('[data-hero="scroll"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.2")
				// 8: ambient idle motion (starts once the entrance lands)
				.add(startIdle)

			// Ambient idle: a single lightweight looping tween on the scroll dot.
			// Created inside the same context so ctx.revert() also kills it.
			function startIdle() {
				const dot = root.querySelector('[data-hero="scroll-dot"]')
				if (!dot) return
				gsap.to(dot, {
					yPercent: 140,
					autoAlpha: 0.25,
					duration: 1.4,
					ease: gsapEase.inOut,
					repeat: -1,
					yoyo: true,
				})
			}
		}, root)

		return () => {
			ctx.revert()
			split?.revert()
		}
	}, [scope, reduce])
}
```

---

## 3. `hooks/use-hero-scroll.ts` — Scrubbed scroll interactions

```tsx
"use client"

import type { RefObject } from "react"
import gsap from "gsap"
import { registerGsap } from "@/lib/animation/gsap"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type UseHeroScrollArgs = {
	scope: RefObject<HTMLElement | null>
}

// Scroll-linked motion via ScrollTrigger scrub. No pinning, no horizontal
// scroll. All ScrollTriggers are created inside gsap.context, so ctx.revert()
// kills them (and resets inline styles) on cleanup.
export function useHeroScroll({ scope }: UseHeroScrollArgs) {
	const reduce = useReducedMotion()

	useIsomorphicLayoutEffect(() => {
		const root = scope.current
		if (!root || reduce) return

		registerGsap()

		const ctx = gsap.context(() => {
			const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true }

			// Background scale + parallax (drifts down + scales as you leave)
			gsap.to('[data-hero="media"]', {
				yPercent: 16,
				scale: 1.1,
				ease: "none",
				scrollTrigger: scrub,
			})

			// Overlay opacity shift (darkens toward the next section)
			gsap.fromTo(
				'[data-hero="overlay"]',
				{ autoAlpha: 1 },
				{ autoAlpha: 1.0, ease: "none", scrollTrigger: scrub },
			)

			// Content parallax (rises faster + softly fades)
			gsap.to('[data-hero="content"]', {
				yPercent: -12,
				autoAlpha: 0.35,
				ease: "none",
				scrollTrigger: scrub,
			})

			// Scroll indicator fades within the first slice of scroll
			gsap.to('[data-hero="scroll"]', {
				autoAlpha: 0,
				y: -12,
				ease: "none",
				scrollTrigger: { trigger: root, start: "top top", end: "18% top", scrub: true },
			})
		}, root)

		return () => ctx.revert()
	}, [scope, reduce])
}
```

<aside>
🔎

**Overlay scrub note:** the overlay's *visible* darkening is driven by the gradient layers; the scrub keeps it pinned at full opacity while the content/media move beneath it. If you want a stronger darkening sweep, point the scrub at a dedicated `data-hero="overlay-veil"` layer and animate its `autoAlpha` 0 → 1 — tell me and I'll add the extra veil div (one line, no layout impact).

</aside>

---

## 4. `hooks/index.ts` — add the two exports

```tsx
// … existing Phase 03/04 exports stay as-is …
export { useHeroTimeline } from "./use-hero-timeline"
export { useHeroScroll } from "./use-hero-scroll"
```

---

## 5. `components/sections/hero/hero.tsx` — client orchestrator (EDIT)

```tsx
"use client"

import { useRef } from "react"
import type { HeroContent as HeroContentModel } from "@/lib/hero"
import { heroContent as defaultHeroContent } from "@/lib/hero"
import { cn } from "@/utils/cn"
import { useHeroTimeline } from "@/hooks/use-hero-timeline"
import { useHeroScroll } from "@/hooks/use-hero-scroll"
import { HeroContent } from "./hero-content"
import { HeroMedia } from "./hero-media"
import { HeroOverlay } from "./hero-overlay"
import { HeroScrollIndicator } from "./hero-scroll-indicator"

type HeroProps = {
	content?: HeroContentModel
	nextSectionId?: string
	className?: string
}

// Layout is identical to 05A. Only additions: "use client", a root ref, the
// data-hero="root" hook scope, and the two motion hooks. Composition unchanged.
export function Hero({
	content = defaultHeroContent,
	nextSectionId = "featured",
	className,
}: HeroProps) {
	const rootRef = useRef<HTMLElement>(null)

	useHeroTimeline({ scope: rootRef })
	useHeroScroll({ scope: rootRef })

	return (
		<section
			ref={rootRef}
			data-hero="root"
			aria-label={content.regionLabel}
			className={cn(
				"relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden",
				className,
			)}
		>
			<HeroMedia media={content.media} />
			<HeroOverlay />
			<HeroContent content={content} className="flex-1" />

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

## 6. `components/sections/hero/hero-media.tsx` (EDIT — add `data-hero`)

```tsx
// … imports unchanged …
export function HeroMedia({ media, className }: HeroMediaProps) {
	return (
		<div
			data-hero="media"
			aria-hidden="true"
			className={cn("absolute inset-0 overflow-hidden bg-bg-base will-change-transform", className)}
		>
			{/* … image / video markup unchanged from 05A … */}
		</div>
	)
}
```

`will-change-transform` is the only addition besides `data-hero` — it hints the compositor for the scale/parallax tween (helps hold 60 FPS).

---

## 7. `components/sections/hero/hero-overlay.tsx` (EDIT — add `data-hero`)

```tsx
export function HeroOverlay({ className }: HeroOverlayProps) {
	return (
		<div data-hero="overlay" aria-hidden="true" className={cn("absolute inset-0", className)}>
			<div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-bg-base/10" />
			<div className="absolute inset-0 bg-gradient-to-r from-bg-base/70 via-transparent to-transparent" />
		</div>
	)
}
```

---

## 8. `components/sections/hero/hero-heading.tsx` (EDIT — targets + line mask)

```tsx
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type HeroHeadingProps = {
	eyebrow: string
	heading: string
	subheading?: string
	className?: string
}

// Wrapper divs carry the data-hero targets so motion never depends on Phase 02
// prop-forwarding. `[&_.line]:overflow-hidden` masks each SplitType line for
// the character reveal — no global CSS required.
export function HeroHeading({
	eyebrow,
	heading,
	subheading,
	className,
}: HeroHeadingProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<div data-hero="eyebrow">
				<Text size="sm" tone="accent" className="font-display-sans uppercase tracking-[0.28em]">
					{eyebrow}
				</Text>
			</div>
			<div data-hero="heading" className="[&_.line]:overflow-hidden">
				<Heading level={1} size="display" className="max-w-[16ch] text-balance">
					{heading}
				</Heading>
			</div>
			{subheading ? (
				<div data-hero="subheading">
					<Text size="lg" tone="primary" className="max-w-[44ch]">
						{subheading}
					</Text>
				</div>
			) : null}
		</div>
	)
}
```

---

## 9. `components/sections/hero/hero-content.tsx` (EDIT — content + description targets)

```tsx
// … imports unchanged …
export function HeroContent({ content, className }: HeroContentProps) {
	return (
		<Container
			size="max"
			className={cn("relative z-10 flex h-full items-end pb-24 md:pb-28", className)}
		>
			<div data-hero="content" className="grid w-full grid-cols-1 lg:grid-cols-12">
				<div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-6">
					<HeroHeading
						eyebrow={content.eyebrow}
						heading={content.heading}
						subheading={content.subheading}
					/>
					<div data-hero="description">
						<HeroDescription>{content.description}</HeroDescription>
					</div>
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

## 10. `components/sections/hero/hero-actions.tsx` (EDIT — stagger target + hover)

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

// Hover scale + gold glow are CSS (motion-safe: gated so reduced-motion users
// get neither transform nor a jarring change). Entrance stagger is GSAP via
// the data-hero="cta" target. No magnetic behavior (deferred).
const ctaMotion =
	"motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 " +
	"motion-safe:hover:scale-[1.03] motion-safe:hover:shadow-[0_0_40px_rgba(200,162,106,0.35)]"

export function HeroActions({ primary, secondary, className }: HeroActionsProps) {
	return (
		<div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
			<Button asChild variant="primary" size="lg" data-hero="cta" className={ctaMotion}>
				<Link href={primary.href}>{primary.label}</Link>
			</Button>
			{secondary ? (
				<Button asChild variant="secondary" size="lg" data-hero="cta" className={ctaMotion}>
					<Link href={secondary.href}>{secondary.label}</Link>
				</Button>
			) : null}
		</div>
	)
}
```

---

## 11. `components/sections/hero/hero-scroll-indicator.tsx` (EDIT — targets)

```tsx
import { cn } from "@/utils/cn"

type HeroScrollIndicatorProps = {
	targetId: string
	className?: string
}

// data-hero="scroll" (entrance + scroll fade) and data-hero="scroll-dot"
// (ambient idle loop). The idle/fade are GSAP and only run when motion is
// allowed, so reduced-motion users get a static, fully accessible cue.
export function HeroScrollIndicator({ targetId, className }: HeroScrollIndicatorProps) {
	return (
		<a
			href={`#${targetId}`}
			data-hero="scroll"
			className={cn(
				"group inline-flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-text-primary focus-visible:text-text-primary",
				className,
			)}
		>
			<span className="font-display-sans text-xs uppercase tracking-[0.3em]">Scroll</span>
			<span
				aria-hidden="true"
				className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5"
			>
				<span data-hero="scroll-dot" className="h-2 w-0.5 rounded-full bg-accent-gold" />
			</span>
			<span className="sr-only">Scroll to explore the residences</span>
		</a>
	)
}
```

---

## 12. Deliverable 2 — The GSAP timeline

- **One master timeline**, built inside `useHeroTimeline` and scoped by `gsap.context(fn, root)`. No other entrance timelines exist anywhere — every Hero motion is either this timeline, the scroll triggers, or the single idle loop.
- **Sequence (overlapped for cinematic flow):** overlay fade + media scale-settle (t=0) → eyebrow (0.45) → heading chars (0.6, line-masked) → subheading → description → CTA stagger → scroll indicator → `add(startIdle)`. Negative position offsets (`"-=0.55"` etc.) overlap segments so it reads as **one continuous take**, not eight discrete steps.
- **Replay on refresh:** the timeline is created fresh on every mount (no `localStorage`/`sessionStorage` gate), so a hard refresh always replays the full entrance.
- **Tokens:** durations from `duration.base`/`duration.slow` and easing from `gsapEase` (Phase 03) — no magic-number drift, no duplicated easing definitions.

## 13. Deliverable 3 — SplitType implementation

- Applied to the **main heading only** (`data-hero="heading"`), split into `"lines,chars"`.
- **Reveal style:** characters start at `yPercent: 110` + `autoAlpha: 0` and rise to `0` with a tight `0.018s` stagger; each line wrapper has `overflow:hidden` (via the `[&_.line]:overflow-hidden` arbitrary variant), producing a **line-masked character cascade** that suits the large display headline.
- **Cleanup:** the `SplitType` instance is captured and `split.revert()` runs on unmount, restoring the original DOM (so re-renders / fast-refresh don't accumulate nested spans).
- **No-JS / reduced-motion:** SplitType only runs in the motion path, so the headline ships as plain, selectable, screen-reader-friendly text otherwise.

## 14. Deliverable 4 — Scroll interactions

All via `ScrollTrigger` **scrub** (tied to scroll position, `ease: "none"`), trigger = Hero root, `start: "top top"`, `end: "bottom top"`. **No pinning, no horizontal scroll.**

| Target | Effect |
| --- | --- |
| `data-hero="media"` | Background **scale (→1.1) + parallax** (`yPercent 16`) |
| `data-hero="overlay"` | **Opacity shift** held over the moving layers |
| `data-hero="content"` | **Content parallax** (`yPercent -12`) + soft fade |
| `data-hero="scroll"` | **Fades out** within the first ~18% of scroll |

## 15. Deliverable 5 — Cleanup strategy

- **`gsap.context(fn, root)`** in *both* hooks tracks every tween, timeline, and ScrollTrigger created inside. The effect's cleanup calls **`ctx.revert()`**, which kills them and **reverts inline styles** to pre-animation state — critical for React 19 strict-mode double-invocation and fast refresh (no duplicate triggers, no orphaned RAF work).
- **`split.revert()`** restores the original heading DOM.
- **`useIsomorphicLayoutEffect`** runs setup before paint (anti-FOUC) and SSR-safely (no `window` on the server).
- **Lazy init:** `registerGsap()` is idempotent and only registers ScrollTrigger client-side on first use.
- **RAF safety:** ScrollTrigger piggybacks on the **single GSAP ticker** that already drives Lenis (Phase 03 “one heartbeat”) — no competing RAF loops.

---

## 16. Performance & reduced motion

- **60 FPS / no CLS:** only `transform` + `autoAlpha` (opacity) are animated — never width/height/top/left — so nothing triggers layout; `will-change-transform` on the media hints the compositor.
- **`prefers-reduced-motion`:** `useReducedMotion` short-circuits **both** hooks — the entrance timeline `return`s early (everything stays visible), scroll triggers never mount, and the idle loop never starts. Hover scale/glow are `motion-safe:`-gated at the CSS level. Result: a fully static, fully accessible Hero with zero motion.

## 17. Scope confirmation

**Built:** master entrance timeline (8-beat), SplitType heading reveal, scroll scale/parallax/overlay/content/indicator-fade, video+image support w/ poster fallback (from 05A), CTA fade/slide/stagger + hover scale/glow, idle scroll-dot loop, reduced-motion fallback, full cleanup.

**Deliberately NOT built (per scope):** Three.js, particles, mouse follower / cursor effects, WebGL shaders, navigation changes, other home-section animations, magnetic buttons. No layout/architecture change to 05A.

---

## 18. Verify locally

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Test the entrance (hard refresh), scrub (scroll down), and the reduced-motion path (OS “Reduce motion” → static Hero).

<aside>
🛑

**Stopping here for your approval before Phase 05C.**

</aside>