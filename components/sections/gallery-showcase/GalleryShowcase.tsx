"use client"

import { motion } from "framer-motion"
import type { GalleryShowcaseContent } from "@/lib/gallery-showcase"
import { fadeVariants, revealVariants } from "@/lib/animation"
import { Container, Section, Heading, Text } from "@/components/ui"
import { GalleryGrid } from "./GalleryGrid"
import { GalleryCTA } from "./GalleryCTA"

type GalleryShowcaseProps = {
	data: GalleryShowcaseContent
	className?: string
}

/**
 * Full gallery section:
 * - Header (animated fade-in on reveal)
 * - Masonry grid
 *
 * Uses fadeVariants on the wrapper for scroll-trigger reveal, while the inner
 * grid manages its own stagger via staggerContainer.
 */
export function GalleryShowcase({ data, className }: GalleryShowcaseProps) {
	return (
		<Section className={className}>
			<Container>
				<motion.div
					variants={fadeVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-10%" }}
					className="flex flex-col items-center text-center"
				>
					<Text
						as="span"
						className="mb-4 font-display-sans text-xs uppercase tracking-[0.24em] text-accent-gold"
					>
						{data.eyebrow}
					</Text>
<Heading
						level={2}
						className="max-w-[28ch] font-display-sans text-4xl font-medium leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
					>
						{data.heading}
					</Heading>
					<Text
						as="p"
						className="mt-6 max-w-[48ch] font-body-sans text-lg leading-relaxed text-text-secondary"
					>
						{data.description}
					</Text>
					{data.cta && (
						<div className="mt-10">
							<GalleryCTA label={data.cta.label} href={data.cta.href} />
						</div>
					)}
				</motion.div>
			</Container>

			<Container>
				<motion.div
					variants={revealVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-10%" }}
					className="pt-12"
				>
					<GalleryGrid items={data.items} />
				</motion.div>
			</Container>
		</Section>
	)
}

export { GalleryCategory } from "./GalleryCategory"
export { GalleryCaption } from "./GalleryCaption"
export { GalleryCTA } from "./GalleryCTA"
export { GalleryGrid } from "./GalleryGrid"
export { GalleryItem } from "./GalleryItem"
export { GalleryMedia } from "./GalleryMedia"
