import { Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

type TimelineContentProps = {
	year: string;
	title: string;
	description: string;
	className?: string;
};

/**
 * Pure, server-renderable. Year as a restrained eyebrow, title as the
 * milestone heading (h3), description as muted supporting copy.
 */
export function TimelineContent({ year, title, description, className }: TimelineContentProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
				{year}
			</span>
			<Heading level={3} size="md">
				{title}
			</Heading>
			<Text size="sm" tone="muted" className="max-w-[48ch]">
				{description}
			</Text>
		</div>
	);
}
