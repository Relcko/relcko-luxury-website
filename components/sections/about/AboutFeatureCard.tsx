import type { ReactNode } from "react";
import { Heading, Text } from "@/components/ui";
import type { AboutFeature, AboutIconName } from "@/lib/about";
import { cn } from "@/utils/cn";

// Inline icon registry: CMS sends a typed icon name, the component owns the art.
const ICONS: Record<AboutIconName, ReactNode> = {
	developments: (
		<path
			d="M3 21h18M5 21V7l6-4v18M11 21V11l8-3v13"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	),
	ownership: (
		<>
			<path
				d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	globe: (
		<>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
		</>
	),
};

type AboutFeatureCardProps = {
	feature: AboutFeature;
	className?: string;
};

export function AboutFeatureCard({ feature, className }: AboutFeatureCardProps) {
	return (
		<div className={cn("flex gap-4", className)}>
			<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent-gold">
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
					{ICONS[feature.icon]}
				</svg>
			</span>
			<div className="flex flex-col gap-1">
				<Heading level={3} size="sm">
					{feature.title}
				</Heading>
				<Text size="sm" tone="muted" className="max-w-[44ch]">
					{feature.description}
				</Text>
			</div>
		</div>
	);
}
