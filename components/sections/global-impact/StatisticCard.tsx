import type { ReactNode } from "react"
import type { Statistic, StatIconName } from "@/lib/global-impact"
import { cn } from "@/utils/cn"
import { StatisticValue } from "./StatisticValue"
import { StatisticLabel } from "./StatisticLabel"
import { StatisticDescription } from "./StatisticDescription"

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<StatIconName, ReactNode> = {
	properties: (
		<>
			<path d="M5 21V6l7-3 7 3v15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M9.5 10h.01M14.5 10h.01M9.5 14h.01M14.5 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	cities: (
		<>
			<path d="M3 21V10l5-3v14M8 21V4l6 2v15M14 21v-8l5 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M2 21h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	investors: (
		<>
			<circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M16 5.2a3 3 0 0 1 0 5.6M16.5 14.2a5.5 5.5 0 0 1 4 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	aum: (
		<>
			<ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" />
			<path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="1.5" />
			<path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
	countries: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
	experience: (
		<>
			<circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
			<path d="M8.5 13l-1 8 4.5-2.5L16.5 21l-1-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
}

type StatisticCardProps = {
	statistic: Statistic
	className?: string
}

export function StatisticCard({ statistic, className }: StatisticCardProps) {
	const { value, label, description, prefix, suffix, decimals, icon } = statistic
	return (
		<div className={cn("flex flex-col items-center gap-3 px-4 text-center", className)}>
			{icon ? (
				<span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent-gold">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
						{ICONS[icon]}
					</svg>
				</span>
			) : null}
			<StatisticValue value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
			<StatisticLabel>{label}</StatisticLabel>
			{description ? <StatisticDescription>{description}</StatisticDescription> : null}
		</div>
	)
}
