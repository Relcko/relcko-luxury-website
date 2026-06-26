# Phase 06G Build — Gallery & Media Showcase (Output)

<aside>
🌄

**Phase 06G — Gallery & Media Showcase.** A curated, cinematic visual editorial that follows Vision & Roadmap: a centered header above an **editorial masonry** of mixed-aspect imagery (large hero surrounded by supporting media), with a closing CTA. 8 pure, prop-driven, CMS-ready components + typed placeholder content. Hover interactions (zoom / overlay fade / caption reveal / soft elevation) are CSS `group` states guarded by `motion-safe:`; entrance motion (fade-up, stagger, mask reveal, image reveal) reuses Phase 03 — **no lightbox, carousel, or new animation infrastructure**. Previous phases untouched except the one-line homepage mount.

</aside>

## 1. Files in this phase

```
lib/
  gallery-showcase.ts           # Types + CMS-ready placeholder content
components/sections/gallery-showcase/
  GalleryShowcase.tsx           # Server orchestrator (section + header + grid + CTA)
  GalleryHeader.tsx             # Client: centered intro (eyebrow/h2/desc), fade-up
  GalleryGrid.tsx               # Client: editorial masonry, stagger reveal
  GalleryItem.tsx               # Client: one <li>, span + hover interactions
  GalleryMedia.tsx              # Client: next/image, mask + image reveal, hover zoom
  GalleryCaption.tsx            # Caption text (pure)
  GalleryCategory.tsx           # Category label (pure)
  GalleryCTA.tsx                # Closing call-to-action (pure)
  index.ts                      # Barrel
app/
  page.tsx                      # EDIT — mount below Vision & Roadmap
```

<aside>
⚠️

**Standing assumptions:** `@/components/ui` exports `Container`, `Heading`, `Text`, `Button` (with `asChild` for link-forwarding). `@/lib/animation` exports `staggerContainer`, `childVariants`, `reveal` (mask reveal), and `easing` (with `easing.out`). Images live under `/public/images/gallery/` (placeholders); a shared fallback blur data-URL guarantees blur placeholders even before per-item `blurDataURL` is authored. Composing a local image-reveal `Variants` from `easing.out` is the established pattern — not new infrastructure. To avoid name clashes the item type is `GalleryItemData` and the category type is `GalleryCategoryName` (the components keep the brief's names `GalleryItem` / `GalleryCategory`).

</aside>

<aside>
📑

Delivered in two parts to avoid truncation. **Part 1** below = data model + category/caption/media/CTA leaves. **Part 2** (appended next) = item, grid, header, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 2. `lib/gallery-showcase.ts` — typed CMS-ready content

```tsx
// CMS-ready content model for the Gallery & Media Showcase. Production sources
// this from Sanity; here we ship typed placeholders with the exact shape the
// CMS returns. No hardcoded copy lives inside the components.

export type GalleryCategoryName =
	| "Architecture"
	| "Interiors"
	| "Lifestyle"
	| "Construction"
	| "Community"
	| "Design"

// Controls the editorial masonry footprint on desktop.
export type GallerySpan = "hero" | "tall" | "wide" | "standard"

export type GalleryImage = {
	src: string
	alt: string
	width: number
	height: number
	blurDataURL?: string
}

export type GalleryVideo = {
	src: string
	poster?: string
}

export type GalleryItemData = {
	id: string
	image: GalleryImage
	video?: GalleryVideo
	category: GalleryCategoryName
	caption: string
	href?: string
	span?: GallerySpan
}

export type GalleryShowcaseContent = {
	eyebrow: string
	heading: string
	description: string
	cta?: { label: string; href: string }
	items: GalleryItemData[]
}

export const galleryShowcaseContent: GalleryShowcaseContent = {
	eyebrow: "Gallery",
	heading: "A closer look at the craft",
	description:
		"An editorial study of the spaces, materials, and moments that define the portfolio — from architecture and interiors to the lives lived within.",
	cta: { label: "Explore the full gallery", href: "/gallery" },
	items: [
		{
			id: "gallery-architecture",
			span: "hero",
			category: "Architecture",
			caption: "Sculptural facades that hold the skyline",
			href: "/gallery",
			image: {
				src: "/images/gallery/architecture.jpg",
				alt: "Dusk view of a sculptural residential tower facade",
				width: 1600,
				height: 1200,
			},
		},
		{
			id: "gallery-interiors",
			span: "standard",
			category: "Interiors",
			caption: "Interiors finished to the millimetre",
			href: "/gallery",
			image: {
				src: "/images/gallery/interiors.jpg",
				alt: "Warmly lit living room with bespoke joinery",
				width: 1200,
				height: 1200,
			},
		},
		{
			id: "gallery-lifestyle",
			span: "tall",
			category: "Lifestyle",
			caption: "A daily rhythm of light and calm",
			href: "/gallery",
			image: {
				src: "/images/gallery/lifestyle.jpg",
				alt: "Resident enjoying a sunlit terrace overlooking the city",
				width: 1000,
				height: 1300,
			},
		},
		{
			id: "gallery-construction",
			span: "standard",
			category: "Construction",
			caption: "Engineering held to a higher standard",
			href: "/gallery",
			video: { src: "/videos/gallery/construction.mp4" },
			image: {
				src: "/images/gallery/construction.jpg",
				alt: "Construction detail of a precision concrete structure",
				width: 1200,
				height: 900,
			},
		},
		{
			id: "gallery-design",
			span: "wide",
			category: "Design",
			caption: "Materials chosen to age beautifully",
			href: "/gallery",
			image: {
				src: "/images/gallery/design.jpg",
				alt: "Close study of natural stone and brushed brass detailing",
				width: 1600,
				height: 900,
			},
		},
		{
			id: "gallery-community",
			span: "standard",
			category: "Community",
			caption: "Spaces designed to bring people together",
			href: "/gallery",
			image: {
				src: "/images/gallery/community.jpg",
				alt: "Residents gathering in a landscaped communal courtyard",
				width: 1200,
				height: 900,
			},
		},
		{
			id: "gallery-detail",
			span: "standard",
			category: "Design",
			caption: "Detail that rewards a second glance",
			href: "/gallery",
			image: {
				src: "/images/gallery/detail.jpg",
				alt: "Macro photograph of a refined architectural junction",
				width: 1200,
				height: 1200,
			},
		},
	],
}
```

---

## 3. `GalleryCategory.tsx` — category label (pure)

```tsx
import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

type GalleryCategoryProps = {
	children: ReactNode
	className?: string
}

export function GalleryCategory({ children, className }: GalleryCategoryProps) {
	return (
		<span
			className={cn(
				"font-display-sans text-xs uppercase tracking-[0.24em] text-accent-gold",
				className,
			)}
		>
			{children}
		</span>
	)
}
```

---

## 4. `GalleryCaption.tsx` — caption text (pure)

```tsx
import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

type GalleryCaptionProps = {
	children: ReactNode
	className?: string
}

export function GalleryCaption({ children, className }: GalleryCaptionProps) {
	return (
		<p
			className={cn(
				"text-balance font-display-sans text-lg font-medium text-text-primary",
				className,
			)}
		>
			{children}
		</p>
	)
}
```

---

## 5. `GalleryCTA.tsx` — closing call-to-action (pure)

```tsx
import { Button } from "@/components/ui"

type GalleryCTAProps = {
	label: string
	href: string
	className?: string
}

// Reuses the Phase 02 Button via asChild so the anchor stays keyboard-accessible.
export function GalleryCTA({ label, href, className }: GalleryCTAProps) {
	return (
		<Button asChild variant="secondary" size="lg" className={className}>
			<a href={href}>{label}</a>
		</Button>
	)
}
```

---

## 6. `GalleryMedia.tsx` — image with mask + image reveal and hover zoom (client)

```tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { reveal, easing } from "@/lib/animation"
import type { GalleryImage } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"

// Shared 1x1 fallback so blur placeholders are guaranteed even before a
// per-item blurDataURL is authored in the CMS.
const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

// Image reveal: a gentle scale settle composed from the Phase 03 easing token.
const imageRevealVariants: Variants = {
	hidden: { opacity: 0, scale: 1.08 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: easing.out } },
}

type GalleryMediaProps = {
	image: GalleryImage
	hasVideo?: boolean
	aspectClassName?: string
	sizes?: string
	className?: string
}

export function GalleryMedia({
	image,
	hasVideo = false,
	aspectClassName,
	sizes,
	className,
}: GalleryMediaProps) {
	return (
		// Outer = mask reveal (clip) + the box that reserves aspect-ratio space.
		<motion.div
			variants={reveal}
			className={cn(
				"relative w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated",
				aspectClassName,
				className,
			)}
		>
			{/* Inner = image reveal (scale settle). */}
			<motion.div variants={imageRevealVariants} className="absolute inset-0">
				{/* Innermost = hover zoom only; transform is independent of framer. */}
				<div className="relative h-full w-full transition-transform duration-700 ease-out will-change-transform motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105">
					<Image
						src={image.src}
						alt={image.alt}
						fill
						loading="lazy"
						placeholder="blur"
						blurDataURL={image.blurDataURL ?? FALLBACK_BLUR}
						sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
						className="object-cover"
					/>
				</div>
			</motion.div>
			{hasVideo ? (
				<span
					aria-hidden="true"
					className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-base/60 backdrop-blur"
				>
					<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-text-primary">
						<path d="M8 5v14l11-7-11-7z" fill="currentColor" />
					</svg>
				</span>
			) : null}
		</motion.div>
	)
}
```

<aside>
🎬

Three layers, three concerns: the **outer** plays the Phase 03 `reveal` (mask) and reserves the aspect-ratio box (zero CLS); the **middle** plays the image-reveal scale settle; the **innermost** owns the hover/focus zoom so its CSS transform never collides with framer's inline transform. `placeholder="blur"` + `loading="lazy"` + `sizes` cover blur placeholders, lazy loading, and responsive sources.

</aside>

<aside>
⏭️

Part 2 (next) appends the item, grid, header, section orchestrator, barrel, homepage integration, and the six deliverable explanations.

</aside>

---

## 7. `GalleryItem.tsx` — one tile, span + hover interactions (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { childVariants } from "@/lib/animation"
import type { GalleryItemData, GallerySpan } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"
import { GalleryMedia } from "./GalleryMedia"
import { GalleryCategory } from "./GalleryCategory"
import { GalleryCaption } from "./GalleryCaption"

// Desktop masonry footprint per span (grid-flow-dense packs the gaps).
const SPAN_CLASSES: Record<GallerySpan, string> = {
	hero: "sm:col-span-2 lg:col-span-3",
	tall: "lg:col-span-3",
	wide: "sm:col-span-2 lg:col-span-4",
	standard: "lg:col-span-2",
}

// Mixed aspect ratios: uniform 4:3 below lg, editorial ratios at lg+.
const ASPECT_CLASSES: Record<GallerySpan, string> = {
	hero: "aspect-[4/3] lg:aspect-[3/2]",
	tall: "aspect-[4/3] lg:aspect-[4/5]",
	wide: "aspect-[4/3] lg:aspect-[16/9]",
	standard: "aspect-[4/3] lg:aspect-square",
}

const SIZES: Record<GallerySpan, string> = {
	hero: "(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw",
	tall: "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw",
	wide: "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw",
	standard: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}

type GalleryItemProps = {
	item: GalleryItemData
	className?: string
}

export function GalleryItem({ item, className }: GalleryItemProps) {
	const span: GallerySpan = item.span ?? "standard"

	// Overlay fade + caption reveal driven by the link's group hover/focus state.
	const overlay = (
		<>
			<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:translate-y-3 motion-safe:group-hover:translate-y-0 motion-safe:group-focus-visible:translate-y-0">
				<GalleryCategory>{item.category}</GalleryCategory>
				<GalleryCaption>{item.caption}</GalleryCaption>
			</div>
		</>
	)

	const media = (
		<GalleryMedia
			image={item.image}
			hasVideo={Boolean(item.video)}
			aspectClassName={ASPECT_CLASSES[span]}
			sizes={SIZES[span]}
		/>
	)

	return (
		<motion.li variants={childVariants} className={cn(SPAN_CLASSES[span], className)}>
			{item.href ? (
				<a
					href={item.href}
					aria-label={`${item.category}: ${item.caption}`}
					className="group relative block overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-500 hover:shadow-2xl hover:shadow-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
				>
					{media}
					{overlay}
				</a>
			) : (
				<div className="group relative block overflow-hidden rounded-2xl">
					{media}
					{overlay}
				</div>
			)}
		</motion.li>
	)
}
```

<aside>
✨

All four interactions live on the link's `group`: **zoom** (`group-hover:scale-105` on the inner media), **overlay fade** (gradient `group-hover:opacity-100`), **caption reveal** (slide+fade up), and **soft elevation** (`-translate-y-1` + shadow). Keyboard users get the identical reveal via `group-focus-visible:` plus a visible focus ring, and every transform is `motion-safe:` so reduced-motion users see none of it.

</aside>

---

## 8. `GalleryGrid.tsx` — editorial masonry, stagger reveal (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer } from "@/lib/animation"
import type { GalleryItemData } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"
import { GalleryItem } from "./GalleryItem"

const VIEWPORT = { once: true, margin: "-10% 0px" } as const

type GalleryGridProps = {
	items: GalleryItemData[]
	className?: string
}

// One stagger trigger on the <ul> cascades each tile (fade-up). The lg grid is
// 6 columns with dense flow so mixed spans pack into an editorial masonry.
export function GalleryGrid({ items, className }: GalleryGridProps) {
	return (
		<motion.ul
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6 lg:grid-flow-row-dense lg:gap-6",
				className,
			)}
		>
			{items.map((item) => (
				<GalleryItem key={item.id} item={item} />
			))}
		</motion.ul>
	)
}
```

---

## 9. `GalleryHeader.tsx` — centered editorial intro (client, fade-up)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { GalleryShowcaseContent } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type GalleryHeaderProps = {
	content: Pick<GalleryShowcaseContent, "eyebrow" | "heading" | "description">
	className?: string
}

export function GalleryHeader({ content, className }: GalleryHeaderProps) {
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

## 10. `GalleryShowcase.tsx` — orchestrator (server component)

```tsx
import { Container } from "@/components/ui"
import { galleryShowcaseContent, type GalleryShowcaseContent } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"
import { GalleryHeader } from "./GalleryHeader"
import { GalleryGrid } from "./GalleryGrid"
import { GalleryCTA } from "./GalleryCTA"

type GalleryShowcaseProps = {
	content?: GalleryShowcaseContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Header sits
// above the masonry grid, with an optional closing CTA.
export function GalleryShowcase({
	content = galleryShowcaseContent,
	id = "gallery",
	className,
}: GalleryShowcaseProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="flex flex-col gap-14 md:gap-20">
					<GalleryHeader content={content} />
					<GalleryGrid items={content.items} />
					{content.cta ? (
						<div className="flex justify-center">
							<GalleryCTA label={content.cta.label} href={content.cta.href} />
						</div>
					) : null}
				</div>
			</Container>
		</section>
	)
}
```

---

## 11. `index.ts` — barrel

```tsx
export { GalleryShowcase } from "./GalleryShowcase"
export { GalleryHeader } from "./GalleryHeader"
export { GalleryGrid } from "./GalleryGrid"
export { GalleryItem } from "./GalleryItem"
export { GalleryMedia } from "./GalleryMedia"
export { GalleryCaption } from "./GalleryCaption"
export { GalleryCategory } from "./GalleryCategory"
export { GalleryCTA } from "./GalleryCTA"
```

---

## 12. `app/page.tsx` — integrate below Vision & Roadmap (EDIT)

```tsx
import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"
import { GlobalImpact } from "@/components/sections/global-impact"
import { VisionRoadmap } from "@/components/sections/vision-roadmap"
import { GalleryShowcase } from "@/components/sections/gallery-showcase"

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
		</>
	)
}
```

<aside>
🔗

Pure addition — one import + one element below the existing Vision & Roadmap mount. All earlier sections are untouched.

</aside>

---

## 13. Deliverable 3 — Component hierarchy

```
GalleryShowcase                    (server: section + Container + header/grid/CTA)
 ├── GalleryHeader                 (client: centered intro, stagger trigger)
 ├── GalleryGrid                   (client: <ul> masonry, stagger trigger)
 │    └── GalleryItem <li> ×7      (fade-up; span footprint; group hover/focus)
 │         ├── GalleryMedia        (client: mask + image reveal, hover zoom, video badge)
 │         ├── GalleryCategory     (category label — pure)
 │         └── GalleryCaption      (caption — pure)
 └── GalleryCTA                    (closing call-to-action — pure)
```

- **Client only where needed**: `GalleryHeader`, `GalleryGrid`, `GalleryItem`, and `GalleryMedia` opt into motion; `GalleryShowcase`, `GalleryCategory`, `GalleryCaption`, and `GalleryCTA` are server-renderable and pure.
- `GalleryItem` composes media + category + caption and owns the interaction surface; each leaf is independently reusable and strictly typed.

## 14. Deliverable 4 — CMS data model

- All content lives in `lib/gallery-showcase.ts` as `GalleryShowcaseContent`; **zero hardcoded copy in components**.
- Supports every required field: `heading` (+ `eyebrow`), `description`, and the `items` array (plus an optional `cta`).
- Each item is a typed `GalleryItemData` supporting `image` (with `alt` text), an **optional** `video` thumbnail, `category`, `caption`, an optional `href`, and an optional `span` that drives the masonry footprint.
- `category` is a typed union (`GalleryCategoryName`) and `span` a typed union (`GallerySpan`), so the CMS only sends known strings.
- Add, remove, or reorder items purely from data — `grid-flow-dense` re-packs the masonry automatically.
- Swap `galleryShowcaseContent` for a Sanity fetch returning the same shape and the section renders unchanged.

## 15. Deliverable 5 — Animation approach (Phase 03 only)

- **Fade-up + stagger reveal** → `GalleryGrid` is a single `staggerContainer` trigger on the `<ul>`; each `GalleryItem` rises in via `childVariants`.
- **Mask reveal** → `GalleryMedia`'s outer wrapper plays the Phase 03 `reveal` (clip) Variant.
- **Image reveal** → the inner wrapper plays a local scale-settle Variant composed from `easing.out`.
- **Interactions are not entrance motion** — zoom / overlay / caption / elevation are pure CSS `group-hover` + `group-focus-visible` states, layered separately from framer transforms so they never conflict.
- All entrances and transforms are neutralized for reduced-motion users via the global `MotionConfig reducedMotion="user"` and `motion-safe:` guards; the gallery stays fully visible and legible.
- **No parallax, no pinning, no horizontal scroll, no new infrastructure.**

## 16. Deliverable 6 — Responsive behavior (no CLS)

- **Mobile (`<640`)**: single-column stack; every tile a uniform 4:3 with generous spacing.
- **Tablet (`640–1023`)**: balanced two-column grid; `hero` and `wide` items span both columns for rhythm.
- **Desktop (`≥1024`)**: six-column editorial masonry with `grid-flow-dense`; mixed aspect ratios (`hero` 3:2, `tall` 4:5, `wide` 16:9, `standard` 1:1) create the large-hero-plus-supporting composition.
- **No CLS**: every tile reserves a fixed aspect-ratio box; `next/image` `fill` + `sizes` + `placeholder="blur"` + `loading="lazy"` deliver responsive, lazily-loaded sources without reflow.

## 17. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  Section renders directly below Vision & Roadmap
- [ ]  Centered header above an editorial masonry (hero + supporting tiles)
- [ ]  Desktop mixed aspect ratios; tablet 2-col; mobile single column
- [ ]  Hover: subtle zoom + overlay fade + caption reveal + soft elevation
- [ ]  Keyboard: links focusable, visible focus ring, same reveal on focus
- [ ]  Video items show the play badge
- [ ]  `prefers-reduced-motion`: no zoom/translate/entrance; content fully visible
- [ ]  Blur placeholders show; no layout shift as images load

<aside>
🧩

**Assumptions to reconcile against your real exports:** `@/lib/animation` exports `staggerContainer`, `childVariants`, `reveal`, `easing` (`easing.out`); `@/components/ui` exports `Container`, `Heading`, `Text`, `Button` (with `asChild`). Gallery media are placeholders under `/public/images/gallery/` (+ `/public/videos/gallery/`). If a name differs, only the import line changes — component logic is unaffected.

</aside>

<aside>
🛑

**STOP — Phase 06G complete. Awaiting approval before Phase 06H.** I author these as Notion pages but cannot run `lint`/`tsc`/`build` myself; run the verify block and paste any errors and I'll fix the exact file(s).

</aside>