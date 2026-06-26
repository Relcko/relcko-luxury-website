# Phase 03 Build — Animation Engine (Output)

<aside>
🎬

**Phase 03 — Animation Engine.** Global animation infrastructure only. Implements Lenis, GSAP + ScrollTrigger config, Framer Motion wrappers, SplitType utilities, motion architecture (presets/easing/duration/delay/timeline/ScrollTrigger helpers), page-transition infrastructure (no visuals), reduced-motion support, and performance-safe cleanup hooks. **No** hero/nav/scroll-reveal/cursor/card/gallery/Three.js or any page-specific animation. Built on the Phase 02 design system; no new dependencies added (all libraries were installed in Phase 01).

</aside>

## 1. Files created (full source)

### `lib/animation/tokens.ts` (expanded — supersedes Phase 01 stub)

Motion **values only**. Easing curves moved to `easing.ts`.

```tsx
// Motion value tokens — durations, delays, distances, stagger.
// Values only; no animation runs here. Easing curves live in ./easing.

export const duration = {
	instant: 0.1,
	fast: 0.2,
	base: 0.4,
	slow: 0.6,
	slower: 0.9,
} as const

export const delay = {
	none: 0,
	xs: 0.05,
	sm: 0.1,
	md: 0.2,
	lg: 0.3,
} as const

export const distance = {
	sm: 16,
	md: 32,
	lg: 64,
	xl: 96,
} as const

export const stagger = {
	tight: 0.04,
	base: 0.08,
	loose: 0.14,
} as const

export type Duration = keyof typeof duration
export type Delay = keyof typeof delay
export type Distance = keyof typeof distance
```

### `lib/animation/easing.ts`

Shared cubic-bezier tuples (Framer) + matching GSAP ease strings — one source of truth for curves.

```tsx
// Easing presets. Cubic-bezier tuples for Framer Motion + GSAP ease strings.
export type CubicBezier = [number, number, number, number]

export const easing = {
	out: [0.22, 1, 0.36, 1] as CubicBezier,
	inOut: [0.65, 0, 0.35, 1] as CubicBezier,
	in: [0.5, 0, 0.75, 0] as CubicBezier,
	expoOut: [0.16, 1, 0.3, 1] as CubicBezier,
}

export type EasingName = keyof typeof easing

// GSAP uses string eases; keep them mapped 1:1 to the Framer tuples above.
export const gsapEase: Record<EasingName, string> = {
	out: "power3.out",
	inOut: "power2.inOut",
	in: "power2.in",
	expoOut: "expo.out",
}
```

### `lib/animation/presets.ts`

Framer Motion variant presets, all built from tokens + easing (no magic values).

```tsx
import type { Variants } from "framer-motion"
import { duration, distance } from "./tokens"
import { easing } from "./easing"

export type SlideDirection = "up" | "down" | "left" | "right"

export const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: duration.base, ease: easing.out },
	},
}

export function slideVariants(
	direction: SlideDirection = "up",
	dist: number = distance.md,
): Variants {
	const axis: "x" | "y" =
		direction === "left" || direction === "right" ? "x" : "y"
	const sign = direction === "down" || direction === "right" ? 1 : -1

	return {
		hidden: { opacity: 0, [axis]: sign * dist },
		visible: {
			opacity: 1,
			x: 0,
			y: 0,
			transition: { duration: duration.base, ease: easing.out },
		},
	}
}

export const scaleVariants: Variants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: duration.base, ease: easing.out },
	},
}

export const revealVariants: Variants = {
	hidden: { clipPath: "inset(0 0 100% 0)" },
	visible: {
		clipPath: "inset(0 0 0% 0)",
		transition: { duration: duration.slow, ease: easing.expoOut },
	},
}

export function staggerContainer(
	staggerChildren: number = 0.08,
	delayChildren: number = 0,
): Variants {
	return {
		hidden: {},
		visible: {
			transition: { staggerChildren, delayChildren },
		},
	}
}

// Default child variant for use inside <Stagger>.
export const childVariants: Variants = {
	hidden: { opacity: 0, y: distance.sm },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: duration.base, ease: easing.out },
	},
}
```

### `lib/animation/gsap.ts`

Global, idempotent GSAP + ScrollTrigger registration and matchMedia factory. SSR-safe.

```tsx
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let registered = false

// Idempotent, SSR-safe global registration.
export function registerGsap(): typeof gsap {
	if (typeof window === "undefined" || registered) {
		return gsap
	}
	gsap.registerPlugin(ScrollTrigger)
	gsap.ticker.lagSmoothing(0)
	registered = true
	return gsap
}

export function createMatchMedia(
	scope?: Element | string | object,
): gsap.MatchMedia {
	registerGsap()
	return gsap.matchMedia(scope)
}

export { gsap, ScrollTrigger }
```

### `lib/animation/scroll-trigger.ts`

Pure config factories — they return `ScrollTrigger.Vars`, they do **not** instantiate triggers.

```tsx
import type { ScrollTrigger } from "gsap/ScrollTrigger"

export type ScrollTriggerConfig = ScrollTrigger.Vars

export function revealTrigger(
	trigger: Element,
	overrides: Partial<ScrollTrigger.Vars> = {},
): ScrollTrigger.Vars {
	return {
		trigger,
		start: "top 80%",
		end: "bottom 20%",
		toggleActions: "play none none reverse",
		...overrides,
	}
}

export function scrubTrigger(
	trigger: Element,
	overrides: Partial<ScrollTrigger.Vars> = {},
): ScrollTrigger.Vars {
	return {
		trigger,
		start: "top bottom",
		end: "bottom top",
		scrub: true,
		...overrides,
	}
}

export function pinTrigger(
	trigger: Element,
	overrides: Partial<ScrollTrigger.Vars> = {},
): ScrollTrigger.Vars {
	return {
		trigger,
		start: "top top",
		end: "+=100%",
		pin: true,
		...overrides,
	}
}
```

### `lib/animation/timeline.ts`

```tsx
import { gsap, registerGsap } from "./gsap"

export function createTimeline(
	vars?: gsap.TimelineVars,
): gsap.core.Timeline {
	registerGsap()
	return gsap.timeline(vars)
}

export function killTimeline(timeline: gsap.core.Timeline | null): void {
	timeline?.kill()
}
```

### `lib/animation/split-text.ts`

SplitType utilities only — char / word / line. No usage, with a revert helper for cleanup.

```tsx
import SplitType from "split-type"
import type { SplitTypeOptions } from "split-type"

export type SplitMode = "chars" | "words" | "lines"
type SplitTarget = string | Element | Element[] | NodeListOf<Element>

function split(
	target: SplitTarget,
	modes: SplitMode[],
	options: Partial<SplitTypeOptions> = {},
): SplitType {
	return new SplitType(target, {
		types: modes.join(", ") as SplitTypeOptions["types"],
		...options,
	})
}

export function splitChars(
	target: SplitTarget,
	options?: Partial<SplitTypeOptions>,
): SplitType {
	return split(target, ["words", "chars"], options)
}

export function splitWords(
	target: SplitTarget,
	options?: Partial<SplitTypeOptions>,
): SplitType {
	return split(target, ["words"], options)
}

export function splitLines(
	target: SplitTarget,
	options?: Partial<SplitTypeOptions>,
): SplitType {
	return split(target, ["lines"], options)
}

export function splitAll(
	target: SplitTarget,
	options?: Partial<SplitTypeOptions>,
): SplitType {
	return split(target, ["lines", "words", "chars"], options)
}

export function revertSplit(instance: SplitType | null): void {
	instance?.revert()
}
```

### `lib/animation/index.ts` (barrel)

```tsx
export * from "./tokens"
export * from "./easing"
export * from "./presets"
export * from "./gsap"
export * from "./timeline"
export * from "./scroll-trigger"
export * from "./split-text"
```

---

### `hooks/use-isomorphic-layout-effect.ts`

Avoids React's SSR `useLayoutEffect` warning.

```tsx
import { useEffect, useLayoutEffect } from "react"

export const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect
```

### `hooks/use-reduced-motion.ts`

```tsx
"use client"
import { useEffect, useState } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

export function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false)

	useEffect(() => {
		const mql = window.matchMedia(QUERY)
		setReduced(mql.matches)
		const onChange = (event: MediaQueryListEvent) => {
			setReduced(event.matches)
		}
		mql.addEventListener("change", onChange)
		return () => {
			mql.removeEventListener("change", onChange)
		}
	}, [])

	return reduced
}
```

### `hooks/use-gsap-context.ts`

Scoped `gsap.context` with automatic `revert()` cleanup — the primary GSAP entry point for components.

```tsx
"use client"
import type { RefObject } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"
import { gsap, registerGsap } from "@/lib/animation/gsap"

export function useGsapContext(
	setup: (self: gsap.Context) => void,
	scope: RefObject<Element | null>,
	deps: ReadonlyArray<unknown> = [],
): void {
	useIsomorphicLayoutEffect(() => {
		registerGsap()
		const ctx = gsap.context(setup, scope)
		return () => {
			ctx.revert()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}
```

### `hooks/use-match-media.ts`

Responsive GSAP via `gsap.matchMedia` — auto-reverts per breakpoint and supports reduced-motion conditions.

```tsx
"use client"
import type { RefObject } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"
import { gsap, registerGsap } from "@/lib/animation/gsap"

export function useMatchMedia(
	conditions: Record<string, string>,
	setup: (context: gsap.Context) => void,
	scope?: RefObject<Element | null>,
	deps: ReadonlyArray<unknown> = [],
): void {
	useIsomorphicLayoutEffect(() => {
		registerGsap()
		const mm = gsap.matchMedia(scope ?? undefined)
		mm.add(conditions, setup)
		return () => {
			mm.revert()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}
```

### `hooks/use-lenis.ts`

Re-exports the Lenis accessor so consumers import from `@/hooks`.

```tsx
export { useLenis } from "@/providers/lenis-provider"
```

### `hooks/index.ts` (barrel)

```tsx
export * from "./use-isomorphic-layout-effect"
export * from "./use-reduced-motion"
export * from "./use-gsap-context"
export * from "./use-match-media"
export * from "./use-lenis"
```

---

### `providers/lenis-provider.tsx`

Global smooth scroll. Driven by the **single GSAP ticker** (no second RAF loop), syncs ScrollTrigger, handles resize, respects reduced motion, and tears everything down on unmount.

```tsx
"use client"
import Lenis from "lenis"
import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animation/gsap"

const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
	return useContext(LenisContext)
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export function LenisProvider({ children }: { children: ReactNode }) {
	const [lenis, setLenis] = useState<Lenis | null>(null)

	useIsomorphicLayoutEffect(() => {
		// Reduced motion: skip smooth scroll entirely, use native scrolling.
		if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
			return
		}

		registerGsap()
		const instance = new Lenis({
			duration: 1.1,
			smoothWheel: true,
			touchMultiplier: 1.5,
		})
		setLenis(instance)

		const onScroll = () => ScrollTrigger.update()
		instance.on("scroll", onScroll)

		// One animation loop for the whole app: GSAP's ticker drives Lenis.
		const update = (time: number) => {
			instance.raf(time * 1000)
		}
		gsap.ticker.add(update)

		const onResize = () => {
			instance.resize()
			ScrollTrigger.refresh()
		}
		window.addEventListener("resize", onResize)

		return () => {
			window.removeEventListener("resize", onResize)
			gsap.ticker.remove(update)
			instance.off("scroll", onScroll)
			instance.destroy()
			setLenis(null)
		}
	}, [])

	return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
```

### `providers/animation-provider.tsx`

Top-level composition: registers GSAP globally, applies Framer's `reducedMotion="user"`, and mounts Lenis.

```tsx
"use client"
import { MotionConfig } from "framer-motion"
import type { ReactNode } from "react"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { registerGsap } from "@/lib/animation/gsap"
import { LenisProvider } from "./lenis-provider"

export function AnimationProvider({ children }: { children: ReactNode }) {
	useIsomorphicLayoutEffect(() => {
		registerGsap()
	}, [])

	return (
		<MotionConfig reducedMotion="user">
			<LenisProvider>{children}</LenisProvider>
		</MotionConfig>
	)
}
```

---

### `components/motion/fade.tsx`

```tsx
"use client"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { fadeVariants } from "@/lib/animation/presets"

const VIEWPORT = { once: true, amount: 0.3 } as const

export type FadeProps = HTMLMotionProps<"div">

export function Fade({ children, ...props }: FadeProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			variants={fadeVariants}
			{...props}
		>
			{children}
		</motion.div>
	)
}
```

### `components/motion/slide.tsx`

```tsx
"use client"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { slideVariants } from "@/lib/animation/presets"
import type { SlideDirection } from "@/lib/animation/presets"

const VIEWPORT = { once: true, amount: 0.3 } as const

export type SlideProps = HTMLMotionProps<"div"> & {
	direction?: SlideDirection
	distance?: number
}

export function Slide({
	children,
	direction = "up",
	distance,
	...props
}: SlideProps) {
	const variants = slideVariants(direction, distance)
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			variants={variants}
			{...props}
		>
			{children}
		</motion.div>
	)
}
```

### `components/motion/scale.tsx`

```tsx
"use client"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { scaleVariants } from "@/lib/animation/presets"

const VIEWPORT = { once: true, amount: 0.3 } as const

export type ScaleProps = HTMLMotionProps<"div">

export function Scale({ children, ...props }: ScaleProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			variants={scaleVariants}
			{...props}
		>
			{children}
		</motion.div>
	)
}
```

### `components/motion/reveal.tsx`

Clip-path mask reveal; merges class names via the Phase 02 `cn` util.

```tsx
"use client"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { cn } from "@/utils/cn"
import { revealVariants } from "@/lib/animation/presets"

const VIEWPORT = { once: true, amount: 0.4 } as const

export type RevealProps = HTMLMotionProps<"div">

export function Reveal({ children, className, ...props }: RevealProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			variants={revealVariants}
			className={cn("will-change-[clip-path]", className)}
			{...props}
		>
			{children}
		</motion.div>
	)
}
```

### `components/motion/stagger.tsx`

Orchestrates children that use `childVariants` (or their own variants).

```tsx
"use client"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { staggerContainer } from "@/lib/animation/presets"
import { stagger as staggerTokens } from "@/lib/animation/tokens"

const VIEWPORT = { once: true, amount: 0.2 } as const

export type StaggerProps = HTMLMotionProps<"div"> & {
	stagger?: number
	delayChildren?: number
}

export function Stagger({
	children,
	stagger = staggerTokens.base,
	delayChildren = 0,
	...props
}: StaggerProps) {
	const variants = staggerContainer(stagger, delayChildren)
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			variants={variants}
			{...props}
		>
			{children}
		</motion.div>
	)
}
```

### `components/motion/presence.tsx`

Thin `AnimatePresence` wrapper for enter/exit transitions.

```tsx
"use client"
import { AnimatePresence } from "framer-motion"
import type { AnimatePresenceProps } from "framer-motion"

export type PresenceProps = AnimatePresenceProps

export function Presence({ children, ...props }: PresenceProps) {
	return <AnimatePresence {...props}>{children}</AnimatePresence>
}
```

### `components/motion/index.ts` (barrel)

```tsx
export * from "./fade"
export * from "./slide"
export * from "./scale"
export * from "./reveal"
export * from "./stagger"
export * from "./presence"
```

---

### `components/transitions/page-transition.tsx`

**Infrastructure only — no transition visuals yet.** Keyed by route so visuals can be added later by giving the inner `motion.div` variants.

```tsx
"use client"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const MODE = "wait" as const

export function PageTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	return (
		<AnimatePresence mode={MODE} initial={false}>
			<motion.div key={pathname}>{children}</motion.div>
		</AnimatePresence>
	)
}
```

### `components/transitions/index.ts` (barrel)

```tsx
export * from "./page-transition"
```

---

### `app/layout.tsx` (integration update)

Only the **provider wiring** is new vs. Phase 01 — `AnimationProvider` (Lenis + GSAP + Framer reduced-motion) wraps the page-transition shell inside the existing `ThemeProvider`.

```tsx
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { displayFont, bodyFont } from "@/lib/fonts"
import { siteConfig } from "@/lib/site"
import { ThemeProvider } from "@/providers/theme-provider"
import { AnimationProvider } from "@/providers/animation-provider"
import { PageTransition } from "@/components/transitions/page-transition"
import "@/app/globals.css"

export const metadata: Metadata = {
	title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
	description: siteConfig.description,
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${displayFont.variable} ${bodyFont.variable}`}
			suppressHydrationWarning
		>
			<body className="bg-bg-base text-text-primary antialiased">
				<ThemeProvider>
					<AnimationProvider>
						<PageTransition>{children}</PageTransition>
					</AnimationProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
```

---

## 2. Animation architecture

Four cooperating layers, each tree-shakeable and import-on-demand:

| Layer | Location | Responsibility |
| --- | --- | --- |
| **Value tokens** | `lib/animation/tokens.ts`, `easing.ts` | Single source of truth for durations, delays, distances, stagger, and easing curves. Shared by **both** Framer and GSAP (cubic-bezier ↔ GSAP ease string map). |
| **Engine config** | `lib/animation/gsap.ts`, `scroll-trigger.ts`, `timeline.ts`, `split-text.ts` | Idempotent GSAP/ScrollTrigger registration, matchMedia factory, ScrollTrigger config builders, timeline + SplitType helpers. |
| **Declarative presets** | `lib/animation/presets.ts` | Framer Motion `Variants` (fade/slide/scale/reveal/stagger) composed from tokens — no magic numbers. |
| **Runtime providers + hooks + wrappers** | `providers/*`, `hooks/*`, `components/motion/*`, `components/transitions/*` | Lenis smooth scroll, scoped GSAP contexts, reduced-motion detection, drop-in Framer components, page-transition shell. |

**Two engines, one heartbeat.** GSAP's ticker is the only animation loop; Lenis is driven from it (`gsap.ticker.add`), and Lenis scroll events drive `ScrollTrigger.update()`. This avoids competing RAF loops and keeps scroll + scroll-triggered animation perfectly in sync. Framer Motion handles micro-interactions and enter/exit declaratively.

## 3. How future components consume it

```tsx
"use client"
import { useRef } from "react"
import { Fade, Slide, Stagger } from "@/components/motion"
import { useGsapContext } from "@/hooks"
import { revealTrigger } from "@/lib/animation"

// Declarative (Framer) — zero config:
// <Fade><Heading>…</Heading></Fade>
// <Slide direction="up"><Card /></Slide>

// Imperative (GSAP) — scoped + auto-cleanup:
export function ExampleSection() {
	const scope = useRef<HTMLElement>(null)

	useGsapContext(
		(self) => {
			const target = self.selector?.(".target")
			if (!target) return
			// gsap.from(target, { y: 40, scrollTrigger: revealTrigger(...) })
		},
		scope,
	)

	return <section ref={scope}>…</section>
}
```

- **Declarative needs** → import a wrapper from `@/components/motion` (`Fade`, `Slide`, `Scale`, `Reveal`, `Stagger`, `Presence`). They self-handle in-view triggering and reduced motion (via `MotionConfig`).
- **Scroll-driven / sequenced needs** → `useGsapContext` (scoped) or `useMatchMedia` (responsive), with `revealTrigger`/`scrubTrigger`/`pinTrigger` configs and `createTimeline`.
- **Text effects** → `splitChars`/`splitWords`/`splitLines` + `revertSplit` in cleanup.
- **Scroll position / control** → `useLenis()` to read or programmatically scroll.
- Everything pulls timing/curves from the tokens, so global motion feel is tuned in one place.

## 4. Folder structure (Phase 03 additions)

```
lib/
└─ animation/
   ├─ tokens.ts          # durations, delays, distances, stagger (values only)
   ├─ easing.ts          # cubic-bezier tuples + GSAP ease strings
   ├─ presets.ts         # Framer Variants built from tokens
   ├─ gsap.ts            # register + matchMedia factory (SSR-safe, idempotent)
   ├─ scroll-trigger.ts  # ScrollTrigger.Vars config builders (no instances)
   ├─ timeline.ts        # timeline create/kill helpers
   ├─ split-text.ts      # SplitType char/word/line utilities + revert
   └─ index.ts           # barrel
hooks/
   ├─ use-isomorphic-layout-effect.ts
   ├─ use-reduced-motion.ts
   ├─ use-gsap-context.ts
   ├─ use-match-media.ts
   ├─ use-lenis.ts
   └─ index.ts           # barrel
providers/
   ├─ lenis-provider.tsx
   └─ animation-provider.tsx
components/
   ├─ motion/
   │  ├─ fade.tsx  slide.tsx  scale.tsx  reveal.tsx  stagger.tsx  presence.tsx
   │  └─ index.ts
   └─ transitions/
      ├─ page-transition.tsx
      └─ index.ts
app/
   └─ layout.tsx          # updated: AnimationProvider + PageTransition wiring
```

## 5. Cleanup strategy (no leaks, no thrashing)

- **Lenis** — single `gsap.ticker` callback removed on unmount; `scroll` listener detached via stored `onScroll`; `resize` listener removed; `instance.destroy()`; context reset to `null`.
- **GSAP** — all component animations live inside `gsap.context(...)`; the hook returns `() => ctx.revert()`, which kills tweens, ScrollTriggers, and restores inline styles automatically. Responsive work uses `gsap.matchMedia` whose `mm.revert()` runs on unmount and per breakpoint change.
- **RAF safety** — exactly one loop (GSAP ticker) for the whole app; no manual `requestAnimationFrame` chains left dangling.
- **Layout thrashing** — Lenis ↔ ScrollTrigger are synced (scroll → `ScrollTrigger.update`), and `ScrollTrigger.refresh()` runs only on resize, not per frame. Reveal uses `will-change: clip-path` to keep effects on the compositor.
- **SSR** — `registerGsap()` is a no-op on the server and idempotent on the client; all effects use `useIsomorphicLayoutEffect`.
- **SplitType** — `revertSplit(instance)` restores original DOM; call it inside the consuming hook's cleanup.
- **Reduced motion** — Lenis is skipped entirely; Framer disabled via `MotionConfig reducedMotion="user"`; GSAP work should branch on `useReducedMotion()` or a `gsap.matchMedia` reduced-motion condition.

## 6. Scope confirmation

✅ Built: Lenis provider, GSAP/ScrollTrigger config + helpers, Framer wrappers (Fade/Slide/Scale/Reveal/Stagger/Presence), SplitType utilities, motion presets (animation/easing/duration/delay/timeline/ScrollTrigger), page-transition **infrastructure**, reduced-motion support, cleanup hooks.

❌ Not built (as instructed): hero/nav/scroll-reveal/cursor/mouse-follower animations, project cards, image reveals, gallery, Three.js scenes, any page-specific animation or transition visual.

➕ No new dependencies — uses libraries installed in Phase 01; no `class-variance-authority` or similar added.

### Verification (run locally)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

🛑 **Phase 03 complete. Stopping for your approval before Phase 04.**