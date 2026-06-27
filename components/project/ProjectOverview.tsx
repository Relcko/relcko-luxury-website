"use client"

import { motion } from "framer-motion"
import { Text } from "@/components/ui"
import type { Project } from "@/lib/project"
import { staggerContainer, childVariants } from "@/lib/animation"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectOverviewProps = {
	project: Project
	className?: string
}

/**
 * Project Overview — displays the full project description.
 * Uses simple fade-in animation on scroll (Phase 03 style).
 */
export function ProjectOverview({ project, className }: ProjectOverviewProps) {
	const { description } = project

	return (
		<motion.section
			aria-label="Project overview"
			variants={staggerContainer(0.06, 0)}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("grid gap-8 py-14 md:py-20 lg:grid-cols-12", className)}
		>
			<motion.div
				variants={childVariants}
				className="lg:col-span-8"
			>
				<Text
					size="xl"
					className="leading-relaxed text-balance"
				>
					{description}
				</Text>
			</motion.div>
		</motion.section>
	)
}
