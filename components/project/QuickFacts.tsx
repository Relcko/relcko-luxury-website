"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Text } from "@/components/ui"
import type { Project } from "@/lib/project"
import { cn } from "@/utils/cn"

const VIEWPORT = { once: true, margin: "-10% 0px" } as const

// Helper to extract quick facts from project - maps the existing Project interface fields
function extractQuickFacts(project: Project) {
	const facts = []

	facts.push({ id: "category", label: "Category", value: project.category })
	facts.push({ id: "status", label: "Status", value: project.status })
	facts.push({ id: "city", label: "City", value: project.location.city })
	facts.push({ id: "ownership", label: "Ownership", value: project.ownershipModel })
	facts.push({ id: "minimum", label: "From", value: `$${project.pricing.startingPrice.toLocaleString()}` })
	facts.push({ id: "availability", label: "Availability", value: project.status === 'sold-out' ? 'Sold Out' : 'Available' })

	return facts
}

type QuickFactsProps = {
	project: Project
	className?: string
}

/**
 * Semantic description list of headline facts; each cell fades up on a stagger.
 */
export function QuickFacts({ project, className }: QuickFactsProps) {
	const facts = extractQuickFacts(project)

	return (
		<motion.dl
			variants={staggerContainer(0.08, 0)}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			aria-label="Quick facts"
			className={cn(
				"grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 lg:grid-cols-6",
				className,
			)}
		>
			{facts.map((fact) => (
				<motion.div
					key={fact.id}
					variants={childVariants}
					className="flex flex-col gap-1 bg-bg-base p-4"
				>
					<dt>
						<Text size="sm" tone="subtle" className="uppercase tracking-[0.16em]">
							{fact.label}
						</Text>
					</dt>
					<dd>
						<Text size="sm" className="font-medium text-text-primary">
							{fact.value}
						</Text>
					</dd>
				</motion.div>
			))}
		</motion.dl>
	)
}
