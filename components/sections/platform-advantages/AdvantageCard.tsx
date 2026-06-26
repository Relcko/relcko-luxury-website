import type { Advantage } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"
import { AdvantageIcon } from "./AdvantageIcon"
import { AdvantageTitle } from "./AdvantageTitle"
import { AdvantageDescription } from "./AdvantageDescription"

type AdvantageCardProps = {
	advantage: Advantage
	className?: string
}

// Pure presentational card. Subtle hover lift is CSS-only and gated behind
// motion-safe:, so reduced-motion users get no transform and the component
// stays server-renderable (the grid wrapper owns the scroll reveal).
export function AdvantageCard({ advantage, className }: AdvantageCardProps) {
	return (
		<div
			className={cn(
				"flex h-full flex-col gap-4 rounded-2xl border border-border bg-bg-elevated/50 p-6",
				"motion-safe:transition motion-safe:duration-300 hover:border-accent-gold/40 motion-safe:hover:-translate-y-1",
				className,
			)}
		>
			<AdvantageIcon icon={advantage.icon} />
			<div className="flex flex-col gap-2">
				<AdvantageTitle>{advantage.title}</AdvantageTitle>
				<AdvantageDescription>{advantage.description}</AdvantageDescription>
			</div>
		</div>
	)
}
