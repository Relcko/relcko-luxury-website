"use client"

import { motion, type Variants } from "framer-motion"
import type { GalleryItemData, GallerySpan } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"
import { GalleryMedia } from "./GalleryMedia"
import { GalleryCategory } from "./GalleryCategory"
import { GalleryCaption } from "./GalleryCaption"

/** Desktop masonry footprint per span (grid-flow-dense packs gaps). */
const SPAN_CLASSES: Record<GallerySpan, string> = {
	hero: "sm:col-span-2 lg:col-span-3",
	tall: "lg:col-span-3",
	wide: "sm:col-span-2 lg:col-span-4",
	standard: "lg:col-span-2",
}

/** Mixed aspect ratios: uniform 4:3 below lg, editorial at lg+. */
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
	variants?: Variants
	className?: string
}

/**
 * One tile with span footprint and four hover interactions:
 * - zoom (inner media scale)
 * - overlay fade (gradient opacity)
 * - caption reveal (slide+fade up)
 * - soft elevation (translate-y + shadow)
 *
 * Keyboard users get identical reveal via group-focus-visible plus visible focus ring.
 * All transforms guarded by motion-safe: for reduced-motion users.
 */
export function GalleryItem({ item, variants, className }: GalleryItemProps) {
	const span: GallerySpan = item.span ?? "standard"

	const overlay = (
		<>
			{/* Gradient overlay */}
			<div
				className={cn(
					"pointer-events-none absolute inset-0 rounded-2xl",
					"bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent",
					"opacity-0 transition-opacity duration-500",
					"group-hover:opacity-100 group-focus-visible:opacity-100",
				)}
			/>
			{/* Caption reveal */}
			<div
				className={cn(
					"pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5",
					"opacity-0 transition-all duration-500",
					"group-hover:opacity-100 group-focus-visible:opacity-100",
					"motion-safe:translate-y-3",
					"motion-safe:group-hover:translate-y-0",
					"motion-safe:group-focus-visible:translate-y-0",
				)}
			>
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
			<motion.li
				variants={variants}
				className={cn(SPAN_CLASSES[span], className)}
			>
				{item.href ? (
					<a
						href={item.href}
						className={cn(
							"group relative block overflow-hidden rounded-2xl",
							"transition-[transform,box-shadow] duration-500",
							"hover:shadow-2xl hover:shadow-black/40",
							"focus:outline-none focus-visible:ring-2",
							"focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
							"motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1",
						)}
						aria-label={`${item.category}: ${item.caption}`}
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
