"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { PlatformAdvantagesContent } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type AdvantagesHeaderProps = {
	content: Pick<PlatformAdvantagesContent, "eyebrow" | "heading" | "description">
	className?: string
}

// Sticky editorial column. One stagger trigger: eyebrow/heading then
// description fade-up in sequence.
export function AdvantagesHeader({ content, className }: AdvantagesHeaderProps) {
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
				<Text size="base" tone="muted" className="max-w-[52ch]">
					{content.description}
				</Text>
			</motion.div>
		</motion.div>
	)
}
