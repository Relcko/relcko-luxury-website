"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { fadeVariants, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { GlobalImpactContent } from "@/lib/global-impact"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type ImpactHeaderProps = {
	content: Pick<GlobalImpactContent, "eyebrow" | "heading" | "description">
	className?: string
}

// Centered intro. One stagger trigger: eyebrow/heading then description fade-up.
export function ImpactHeader({ content, className }: ImpactHeaderProps) {
	return (
		<motion.div
			variants={fadeVariants as Variants}
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
				<Text size="lg" tone="muted" className="text-balance">
					{content.description}
				</Text>
			</motion.div>
		</motion.div>
	)
}
