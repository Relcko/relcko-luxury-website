# Phase 05C Build — Hero Performance & Polish (Output)

<aside>
✨

**Phase 05C — Hero Performance & Polish.** The final Hero pass: loading strategy, video/image optimization, priority loading, font preload, responsive sizes, poster generation, reduced-motion verification, Lighthouse tuning, surgical `will-change`, and a full QA checklist. No layout/architecture change — these are config + targeted refinements on 05A/05B. No new runtime dependencies.

</aside>

## 1. Files in this phase

```
next.config.ts                         # EDIT — image formats, sizes, remotePatterns
app/layout.tsx                         # EDIT — font preload/swap + preconnect
lib/hero.ts                            # EDIT — multi-source video + blurDataURL
hooks/
  use-hero-video.ts                    # NEW — lazy/idle video, connection-aware
  use-hero-timeline.ts                 # PATCH — transient will-change
  use-hero-scroll.ts                   # PATCH — transient will-change (toggleClass)
  index.ts                             # EDIT — export useHeroVideo
components/sections/hero/
  hero-media.tsx                       # REPLACE — poster-as-LCP + lazy video
scripts/
  optimize-hero.mjs                    # NEW (optional dev) — poster/blur/encodes
```

---

## 2. `next.config.ts` — image pipeline + package import optimization

```tsx
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		// Serve modern formats first; Next negotiates per-browser.
		formats: ["image/avif", "image/webp"],
		// Tuned to our responsive breakpoints (360 → 2560).
		deviceSizes: [360, 640, 768, 828, 1024, 1280, 1440, 1920, 2560],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Cache optimized images aggressively at the edge.
		minimumCacheTTL: 60 * 60 * 24 * 30,
		// CMS image host (Sanity). Add others as needed.
		remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
	},
	experimental: {
		// Tree-shake heavy animation libs to trim the Hero's client bundle.
		optimizePackageImports: ["gsap", "split-type"],
	},
}

export default nextConfig
```

---

## 3. `app/layout.tsx` — font preload/swap + preconnect (EDIT)

```tsx
import { Inter, Space_Grotesk } from "next/font/google"

// next/font self-hosts, auto-preloads, and injects size-adjust fallback
// metrics → zero font-driven CLS, no render-blocking font CSS.
const fontBody = Inter({
	subsets: ["latin"],
	display: "swap",
	preload: true,
	variable: "--font-body",
})

const fontDisplay = Space_Grotesk({
	subsets: ["latin"],
	display: "swap",
	preload: true,
	weight: ["500", "600", "700"],
	variable: "--font-display",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
			<head>
				{/* Warm up the CMS image CDN before the poster request fires. */}
				<link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://cdn.sanity.io" />
			</head>
			<body>
				{/* … ThemeProvider > AnimationProvider > skip-link + Header + main … */}
				{children}
			</body>
		</html>
	)
}
```

<aside>
🔤

**Why no manual `<link rel="preload">` for fonts:** `next/font` already emits the preload links for the exact subsetted font files it generates. Adding manual ones would double-fetch. The only preconnect we add is for the **image CDN**, which `next/font` can't know about.

</aside>

---

## 4. `lib/hero.ts` — multi-source video + blur placeholder (EDIT)

Extend only the **video** variant so we can ship `webm` + `mp4` (codec negotiation) and a poster; add an optional `blurDataURL` to the image variant.

```tsx
export type HeroMediaSource =
	| {
			kind: "image"
			src: string
			alt: string
			blurDataURL?: string
	  }
	| {
			kind: "video"
			/** Ordered by preference; browser picks the first it can play. */
			sources: Array<{ src: string; type: "video/webm" | "video/mp4" }>
			/** Optimized still shown as the LCP element + video fallback. */
			poster: string
			/** Optional LQIP for the poster image. */
			blurDataURL?: string
			label: string
	  }

// Example video content (swap the placeholder image variant when ready):
// media: {
// 	kind: "video",
// 	sources: [
// 		{ src: "/video/hero.webm", type: "video/webm" },
// 		{ src: "/video/hero.mp4", type: "video/mp4" },
// 	],
// 	poster: "/images/hero/hero-poster.jpg",
// 	label: "Aerial dusk flythrough of the residence",
// },
```

<aside>
⚠️

This widens the 05A/05B video contract from a single `src` to a `sources[]` array. The 05B `HeroVideo` markup below already consumes `sources`, so keep the two in sync. The default placeholder content stays on the **image** variant, so nothing breaks until you opt into video.

</aside>

---

## 5. `hooks/use-hero-video.ts` — lazy, idle, connection-aware (NEW)

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

// Video must never compete with LCP. Strategy:
//  - reduced-motion / Save-Data / 2g  → never load video (poster only)
//  - otherwise load on requestIdleCallback (after the poster paints)
//  - pause when offscreen (IntersectionObserver) to save CPU/battery
export function useHeroVideo() {
	const reduce = useReducedMotion()
	const videoRef = useRef<HTMLVideoElement>(null)
	const [shouldLoad, setShouldLoad] = useState(false)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (reduce) return
		const nav = navigator as Navigator & { connection?: NetworkInformation }
		const conn = nav.connection
		if (conn?.saveData) return
		if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return

		const w = window as Window & typeof globalThis
		if (typeof w.requestIdleCallback === "function") {
			const id = w.requestIdleCallback(() => setShouldLoad(true))
			return () => w.cancelIdleCallback?.(id)
		}
		const id = w.setTimeout(() => setShouldLoad(true), 1200)
		return () => w.clearTimeout(id)
	}, [reduce])

	useEffect(() => {
		const el = videoRef.current
		if (!el || !shouldLoad) return
		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (!entry) return
				if (entry.isIntersecting) void el.play().catch(() => undefined)
				else el.pause()
			},
			{ threshold: 0.1 },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [shouldLoad])

	return {
		videoRef,
		shouldLoad,
		ready,
		onReady: () => setReady(true),
	}
}
```

Add to `hooks/index.ts`:

```tsx
export { useHeroVideo } from "./use-hero-video"
```

---

## 6. `components/sections/hero/hero-media.tsx` — poster-as-LCP + lazy video (REPLACE)

```tsx
"use client"

import Image from "next/image"
import type { HeroMediaSource } from "@/lib/hero"
import { cn } from "@/utils/cn"
import { useHeroVideo } from "@/hooks/use-hero-video"

type HeroMediaProps = {
	media: HeroMediaSource
	className?: string
}

// NOTE: static `will-change` was removed here (it was a 05B placeholder).
// will-change is now applied transiently by the motion hooks (§7).
export function HeroMedia({ media, className }: HeroMediaProps) {
	return (
		<div
			data-hero="media"
			aria-hidden="true"
			className={cn("absolute inset-0 overflow-hidden bg-bg-base", className)}
		>
			{media.kind === "image" ? (
				<Image
					src={media.src}
					alt={media.alt}
					fill
					priority
					fetchPriority="high"
					sizes="100vw"
					quality={82}
					className="object-cover"
					{...(media.blurDataURL
						? { placeholder: "blur", blurDataURL: media.blurDataURL }
						: {})}
				/>
			) : (
				<HeroVideo media={media} />
			)}
		</div>
	)
}

function HeroVideo({ media }: { media: Extract<HeroMediaSource, { kind: "video" }> }) {
	const { videoRef, shouldLoad, ready, onReady } = useHeroVideo()

	return (
		<>
			{/* Poster is the LCP element: an optimized, priority next/image. */}
			<Image
				src={media.poster}
				alt=""
				fill
				priority
				fetchPriority="high"
				sizes="100vw"
				quality={78}
				className={cn(
					"object-cover transition-opacity duration-700",
					ready ? "opacity-0" : "opacity-100",
				)}
				{...(media.blurDataURL
					? { placeholder: "blur", blurDataURL: media.blurDataURL }
					: {})}
			/>

			{/* Video lazy-mounts on idle and fades in once it can play. */}
			{shouldLoad ? (
				<video
					ref={videoRef}
					className={cn(
						"absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
						ready ? "opacity-100" : "opacity-0",
					)}
					poster={media.poster}
					muted
					loop
					playsInline
					preload="auto"
					aria-label={media.label}
					onCanPlay={onReady}
				>
					{media.sources.map((source) => (
						<source key={source.src} src={source.src} type={source.type} />
					))}
				</video>
			) : null}
		</>
	)
}
```

**Why this is fast:** the LCP is a tiny, AVIF/WebP, priority poster image — not a multi-MB video. The video downloads on idle (or never, on Save-Data / reduced-motion / 2g) and cross-fades in, so first paint and LCP stay cheap while the experience still reaches full cinematic video.

---

## 7. Surgical `will-change` (PATCH 05B hooks)

`will-change` is a budget — leaving it on permanently *hurts* performance. We apply it only during animation.

**`use-hero-timeline.ts`** — inside the `gsap.context` (motion path), right after creating `tl`:

```tsx
const animated =
	'[data-hero="media"], [data-hero="eyebrow"], [data-hero="subheading"], ' +
	'[data-hero="description"], [data-hero="cta"], [data-hero="scroll"]'

// Promote to a layer for the entrance, then release once it lands.
gsap.set(animated, { willChange: "transform, opacity" })
tl.eventCallback("onComplete", () => {
	gsap.set(animated, { willChange: "auto" })
})
```

**`use-hero-scroll.ts`** — add `toggleClass` so `will-change-transform` is present only while the Hero is within the scrub zone:

```tsx
const scrub = {
	trigger: root,
	start: "top top",
	end: "bottom top",
	scrub: true,
	toggleClass: { targets: '[data-hero="media"]', className: "will-change-transform" },
} as const
```

(Apply the same `toggleClass` pattern to the `data-hero="content"` tween's own trigger.) Net effect: GPU layers exist **only** during the entrance and while scrolling through the Hero — never idle.

---

## 8. `scripts/optimize-hero.mjs` — poster + blur + encodes (OPTIONAL dev)

```jsx
// Run: node scripts/optimize-hero.mjs
// Requires dev deps: sharp (image) + ffmpeg on PATH (video/poster).
// Generates: optimized poster, AVIF/WebP variants, and a base64 LQIP.
import { execSync } from "node:child_process"
import sharp from "sharp"

const SRC_VIDEO = "assets/hero-source.mp4"
const POSTER = "public/images/hero/hero-poster.jpg"

// 1) Extract a poster frame at ~1s (skips black intro frames).
execSync(`ffmpeg -y -i ${SRC_VIDEO} -ss 00:00:01 -frames:v 1 ${POSTER}`)

// 2) Encode web video variants (mp4 + webm) at 1080p, no audio.
execSync(
	`ffmpeg -y -i ${SRC_VIDEO} -an -vf scale=-2:1080 -crf 30 ` +
		`public/video/hero.mp4`,
)
execSync(
	`ffmpeg -y -i ${SRC_VIDEO} -an -vf scale=-2:1080 -b:v 0 -crf 34 ` +
		`-c:v libvpx-vp9 public/video/hero.webm`,
)

// 3) Generate a tiny blurDataURL (LQIP) for the poster.
const lqip = await sharp(POSTER).resize(16).webp({ quality: 40 }).toBuffer()
console.log(`blurDataURL: data:image/webp;base64,${lqip.toString("base64")}`)
```

Paste the printed `blurDataURL` into `heroContent.media.blurDataURL`. `next/image` produces the responsive AVIF/WebP variants automatically at request time — you don't need to pre-encode stills.

---

## 9. Reduced-motion verification

| Surface | reduced-motion behavior | Source |
| --- | --- | --- |
| Entrance timeline | Early `return` — everything visible, no motion | `use-hero-timeline` |
| Scroll parallax/scale | Hook returns before mounting triggers | `use-hero-scroll` |
| Idle scroll-dot loop | Never starts (inside the skipped path) | `use-hero-timeline` |
| Background video | **Never loads** — poster only | `use-hero-video` |
| CTA hover scale/glow | `motion-safe:` gated off at CSS level | `hero-actions` |
| Framer (global) | `MotionConfig reducedMotion="user"` | Phase 03 |

**Verify:** macOS *System Settings → Accessibility → Display → Reduce motion*, or DevTools *Rendering → Emulate `prefers-reduced-motion`*. Expect a fully static, fully readable Hero with a still poster.

---

## 10. Lighthouse tuning

- **LCP** → priority + `fetchPriority="high"` poster/image (modern formats); video deferred off the critical path; CDN preconnect.
- **CLS** → reserved boxes from 05A (`fill` + `100svh`); `next/font` size-adjust fallback; no late-loading layout shifts.
- **TBT/JS** → GSAP/SplitType tree-shaken (`optimizePackageImports`); animation init on idle/pre-paint; single shared ticker (no extra RAF loops).
- **Best practices** → `crossOrigin` preconnect; muted/playsInline video; AVIF/WebP; long edge-cache TTL.
- **A11y** → single H1, landmarks, ARIA labels, reduced-motion (§9).

**Targets:** Performance ≥ 90 (mobile), LCP < 2.5s on Fast 3G with the poster path, CLS < 0.01, TBT < 150ms.

---

## 11. Final Hero QA checklist

```
[ ] First paint shows poster/image instantly (no white flash, no FOUC)
[ ] Entrance timeline plays once, fully, on hard refresh
[ ] Heading SplitType reveals cleanly; text reverts (no orphan spans on nav back)
[ ] Scroll: media parallax/scale + content rise + indicator fade are smooth (60 FPS)
[ ] Video (if used) fades in after idle; pauses when scrolled offscreen
[ ] Save-Data / 2g / reduced-motion → poster only, never downloads video
[ ] No CLS at 360 / 768 / 1024 / 1440 / 1920 px (check Performance panel)
[ ] will-change present only during entrance + scrub (inspect computed styles at idle)
[ ] Keyboard: CTAs + scroll cue focusable; visible focus rings
[ ] Screen reader: one H1, hero landmark labeled, media aria-hidden / labeled
[ ] Contrast AA for headline + description over media (overlay scrim)
[ ] No console warnings (image sizes, hydration, missing alt)
```

---

## 12. Scope confirmation

**Built:** image pipeline (AVIF/WebP, responsive `deviceSizes`, remote CMS), font preload/swap + CDN preconnect, poster-as-LCP with idle/connection-aware lazy video + offscreen pause, multi-codec sources, blur LQIP + generation script, transient `will-change`, reduced-motion verification matrix, Lighthouse tuning notes, full QA checklist.

**Unchanged:** Hero layout (05A) and motion design (05B). No homepage sections, no new components, no new runtime deps.

---

## 13. Verify locally

```bash
npm run lint
npx tsc --noEmit
npm run build
npx next build && npx next start   # then run Lighthouse on "/"
```

<aside>
🛑

**Hero track complete (05A → 05B → 05C).** Stopping here for your approval before moving on to the homepage sections (Phase 06).

</aside>