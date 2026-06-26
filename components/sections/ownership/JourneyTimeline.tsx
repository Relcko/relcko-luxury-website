"use client"

import { motion, type Variants } from "framer-motion"
import { staggerContainer, childVariants, easing } from "@/lib/animation"
import type { JourneyStep as JourneyStepData } from "@/lib/ownership"
import { cn } from "@/utils/cn"
import { JourneyStep } from "./JourneyStep"
import { JourneyConnector } from "./JourneyConnector"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

/* Composed from the Phase 03 easing token — not new infrastructure.
 * The connector grows downward (origin-top) as each step settles in.
 */
const connectorReveal: Variants = {
	hidden: { scaleY: 0 },
	visible: { scaleY: 1, transition: { duration: 0.6, ease: easing.out } },
}

type JourneyTimelineProps = {
	steps: JourneyStepData[]
	className?: string
}

/**
 * Semantic ordered list.
 * One stagger trigger cascades hidden/visible to each <li> (step fade-up)
 * and to each connector (scaleY reveal) — step-by-step.
 */
export function JourneyTimeline({ steps, className }: JourneyTimelineProps) {
	return (
		<motion.ol
			variants={staggerContainer()}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("relative flex flex-col", className)}
		>
			{steps.map((step, index) => {
				const isLast = index === steps.length - 1
				return (
					<motion.li
						key={step.id}
						variants={childVariants}
						className="relative flex pb-10 last:pb-0"
					>
						{!isLast ? (
							<motion.div
								variants={connectorReveal}
								className="absolute left-[1.375rem] top-12 bottom-0 origin-top -translate-x-1/2"
							>
								<JourneyConnector />
							</motion.div>
						) : null}
						<JourneyStep step={step} />
					</motion.li>
				)
			})}
		</motion.ol>
	)
}
