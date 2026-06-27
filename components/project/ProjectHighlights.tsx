"use client"

import { motion } from "framer-motion"
import { Heading, Text } from "@/components/ui"
import type { Project } from "@/lib/project"
import { staggerContainer, childVariants } from "@/lib/animation"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectHighlightsProps = {
	project: Project
	className?: string
}

/**
 * Project Highlights — displays key selling points as a list.
 * Uses simple fade-in animation with stagger.
 */
export function ProjectHighlights({ project, className }: ProjectHighlightsProps) {
	const { highlights } = project

	return (
		<motion.section
			aria-label="Project highlights"
			variants={staggerContainer(0.08, 0)}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("grid gap-8 py-14 md:py-20 lg:grid-cols-12", className)}
		>
			<motion.div variants={childVariants} className="lg:col-span-4">
				<Heading level={2} size="lg">
					Highlights
				</Heading>
			</motion.div>

			<motion.ul
				variants={childVariants}
				className="lg:col-span-8 grid gap-4 sm:grid-cols-2"
			>
				{highlights.map((highlight, index) => (
					<li
						key={index}
						className="flex items-start gap-3 rounded-lg border border-border/60 bg-bg-subtle p-4"
					>
						<CheckIcon />
						<Text>{highlight}</Text>
					</li>
				))}
			</motion.ul>
		</motion.section>
	)
}

/** SVG checkmark icon */
function CheckIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold"
			aria-hidden="true"
		>
			<path
				fillRule="evenodd"
				d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.893 3.893 7.48-9.817a.75.75 0 011.05-.143z"
				clipRule="evenodd"
			/>
		</svg>
	)
}
