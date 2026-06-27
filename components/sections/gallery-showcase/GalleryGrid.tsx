"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { GalleryItemData } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"
import { GalleryItem } from "./GalleryItem"

const VIEWPORT = { once: true, margin: "-10% 0px" } as const

type GalleryGridProps = {
	items: GalleryItemData[]
	className?: string
}

/**
 * Editorial masonry grid:
 * - 6-column grid with grid-flow-dense at lg+
 * - Stagger-trigger on <ul> cascades each tile (fade-up)
 * - Responsive: 1-col mobile, 2-col tablet, 6-col desktop
 */
export function GalleryGrid({ items, className }: GalleryGridProps) {
	return (
		<motion.ul
			variants={staggerContainer()}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"grid grid-cols-1 gap-4",
				"sm:grid-cols-2 sm:gap-5",
				"lg:grid-cols-6 lg:grid-flow-row-dense lg:gap-6",
				className,
			)}
		>
			{items.map((item) => (
				<GalleryItem key={item.id} item={item} variants={childVariants} />
			))}
		</motion.ul>
	)
}
