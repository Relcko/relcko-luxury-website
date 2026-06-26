/**
 * HeroHeading — Eyebrow + Heading + Subheading.
 */
import { Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

export type HeroHeadingProps = {
	eyebrow: string;
	heading: string;
	subheading?: string;
	className?: string;
};

/**
 * The page's single H1 lives here (proper heading hierarchy).
 * Eyebrow is decorative-but-readable; subheading is an H2-weighted lead.
 */
export function HeroHeading({
	eyebrow,
	heading,
	subheading,
	className,
}: HeroHeadingProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<Text
				size="sm"
				tone="accent"
				className="font-display-sans uppercase tracking-[0.28em]"
			>
				{eyebrow}
			</Text>
			<Heading
				level={1}
				size="display"
				className="max-w-[16ch] text-balance"
			>
				{heading}
			</Heading>
			{subheading ? (
				<Text size="lg" tone="primary" className="max-w-[44ch]">
					{subheading}
				</Text>
			) : null}
		</div>
	);
}
