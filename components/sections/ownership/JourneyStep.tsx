import type { ReactNode } from "react"
import { Heading, Text } from "@/components/ui"
import type { JourneyIconName, JourneyStep as JourneyStepData } from "@/lib/ownership"
import { cn } from "@/utils/cn"

/* Inline icon registry: CMS sends a typed icon name, the component owns the art. */
const ICONS: Record<JourneyIconName, ReactNode> = {
	explore: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
	invest: (
		<>
			<path d="M4 15l5-5 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M15 6h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	own: (
		<>
			<circle cx="8" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" />
			<path d="M10.5 11.5L20 4M17 6l2 2M14 8l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	track: (
		<>
			<path d="M4 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M8 16l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	grow: (
		<>
			<path d="M12 21v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M12 13c0-3 2.2-5.2 5-5.2-.2 2.8-2.2 5.2-5 5.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M12 15c0-3-2.2-5.2-5-5.2.2 2.8 2.2 5.2 5 5.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
}

type JourneyStepProps = {
	step: JourneyStepData
	className?: string
}

export function JourneyStep({ step, className }: JourneyStepProps) {
	return (
		<div className={cn("flex gap-5", className)}>
			<span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-accent-gold">
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
					{ICONS[step.icon]}
				</svg>
			</span>
			<div className="flex flex-col gap-1 pt-1">
				<span className="font-display-sans text-xs uppercase tracking-[0.24em] text-text-muted">
					Step {step.step}
				</span>
				<Heading level={3} size="sm">
					{step.title}
				</Heading>
				<Text size="sm" tone="muted" className="max-w-[46ch]">
					{step.description}
				</Text>
			</div>
		</div>
	)
}
