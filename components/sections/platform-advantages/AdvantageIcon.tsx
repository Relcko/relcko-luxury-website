import type { ReactNode } from "react"
import type { AdvantageIconName } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<AdvantageIconName, ReactNode> = {
	curated: (
		<>
			<path d="M6 3h12l3 6-9 12L3 9l3-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M3 9h18M9 3L6 9l6 12 6-12-3-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		</>
	),
	ownership: (
		<>
			<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	diligence: (
		<>
			<rect x="6" y="4" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M9 4.5V3.5h6v1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	global: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
	secure: (
		<>
			<rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</>
	),
	vision: (
		<>
			<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
}

type AdvantageIconProps = {
	icon: AdvantageIconName
	className?: string
}

export function AdvantageIcon({ icon, className }: AdvantageIconProps) {
	return (
		<span
			className={cn(
				"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-base text-accent-gold",
				className,
			)}
		>
			<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
				{ICONS[icon]}
			</svg>
		</span>
	)
}
