import { Heading } from "@/components/ui";
import { cn } from "@/utils/cn";

type AboutHeadingProps = {
	eyebrow: string;
	heading: string;
	className?: string;
};

export function AboutHeading({ eyebrow, heading, className }: AboutHeadingProps) {
	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
				{eyebrow}
			</span>
			<Heading level={2} size="xl" className="text-balance">
				{heading}
			</Heading>
		</div>
	);
}
