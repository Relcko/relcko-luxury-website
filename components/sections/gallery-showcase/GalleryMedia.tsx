"use client"

import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { revealVariants, easing } from "@/lib/animation"
import type { GalleryImage } from "@/lib/gallery-showcase"
import { cn } from "@/utils/cn"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

/** Image reveal: gentle scale settle from easing.out */
const imageRevealVariants: Variants = {
	hidden: { opacity: 0, scale: 1.08 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.8, ease: easing.out },
	},
}

export type GalleryMediaProps = {
	image: GalleryImage
	hasVideo?: boolean
	aspectClassName?: string
	sizes?: string
	className?: string
}

/**
 * Three layers:
 * - outer: mask reveal (clipPath) + aspect-ratio box
 * - middle: image reveal (scale settle)
 * - innermost: hover zoom (CSS transform independent of framer)
 */
export function GalleryMedia({
	image,
	hasVideo = false,
	aspectClassName,
	sizes,
	className,
}: GalleryMediaProps) {
	return (
		<motion.div
			variants={revealVariants}
			className={cn(
				"relative w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated",
				aspectClassName,
				className,
			)}
		>
			<motion.div variants={imageRevealVariants} className="absolute inset-0">
				<div
					className={cn(
						"relative h-full w-full",
						"transition-transform duration-700 ease-out",
						"will-change-transform",
						"motion-safe:group-hover:scale-105",
						"motion-safe:group-focus-visible:scale-105",
					)}
				>
					<Image
						src={image.src}
						alt={image.alt}
						fill
						loading="lazy"
						placeholder="blur"
						blurDataURL={image.blurDataURL ?? FALLBACK_BLUR}
						sizes={
							sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						}
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
