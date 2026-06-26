import { cn } from "@/utils/cn"

type JourneyConnectorProps = {
	className?: string
}

/**
 * Purely decorative rail between steps.
 * Fills the height of its (animated) wrapper; the reveal is driven by the timeline via Framer variants.
 */
export function JourneyConnector({ className }: JourneyConnectorProps) {
	return (
		<div
			aria-hidden="true"
			className={cn("h-full w-px bg-gradient-to-b from-accent-gold/50 to-border", className)}
		/>
	)
}
