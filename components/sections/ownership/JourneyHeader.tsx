"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { OwnershipContent } from "@/lib/ownership"
import { cn } from "@/utils/cn"
import { JourneyCTA } from "./JourneyCTA"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type JourneyHeaderProps = {
	content: Pick<OwnershipContent, "eyebrow" | "heading" | "description" | "cta">
	className?: string
}

/**
 * Sticky editorial column.
 * One stagger trigger: eyebrow/heading, description, and CTA each fade-up in sequence.
 */
export function JourneyHeader({ content, className }: JourneyHeaderProps) {
	return (
		<motion.div
			variants={staggerContainer()}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("flex flex-col gap-6 lg:sticky lg:top-32", className)}
		>
			<motion.div variants={childVariants} className="flex flex-col gap-3">
				<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
					{content.eyebrow}
				</span>
				<Heading level={2} size="xl" className="text-balance">
					{content.heading}
				</Heading>
			</motion.div>
			<motion.div variants={childVariants}>
				<Text size="lg" tone="muted" className="max-w-[52ch]">
					{content.description}
				</Text>
			</motion.div>
			<motion.div variants={childVariants}>
				<JourneyCTA label={content.cta.label} href={content.cta.href} />
			</motion.div>
		</motion.div>
	)
}
