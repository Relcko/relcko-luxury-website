"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

// Pre-computed variants (staggerContainer is a function, childVariants is Variants)
const containerVariants = staggerContainer(0.08, 0)

type ProjectSectionProps = {
	id: string
	title: string
	eyebrow?: string
	description?: string
	headingLevel?: 2 | 3
	className?: string
	contentClassName?: string
	children: ReactNode
}

/**
 * Every detail section reuses this shell: a semantic <section> with a stable
 * anchor id (for the sticky nav), scroll-margin, a heading, and a minimal
 * fade-up on enter. No cinematic motion — just Phase 03 fade.
 */
export function ProjectSection({
	id,
	title,
	eyebrow,
	description,
	headingLevel = 2,
	className,
	contentClassName,
	children,
}: ProjectSectionProps) {
	return (
		<motion.section
			id={id}
			aria-label={title}
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-14 md:py-20", className)}
		>
			<motion.div variants={childVariants} className="flex flex-col gap-3">
				{eyebrow ? (
					<span className="font-display-sans text-xs uppercase tracking-[0.24em] text-accent-gold">
						{eyebrow}
					</span>
				) : null}
				<Heading level={headingLevel} size="lg">
					{title}
				</Heading>
				{description ? (
					<Text tone="muted" className="max-w-2xl">
						{description}
					</Text>
				) : null}
			</motion.div>
			<motion.div variants={childVariants} className={cn("mt-8", contentClassName)}>
				{children}
			</motion.div>
		</motion.section>
	)
}
