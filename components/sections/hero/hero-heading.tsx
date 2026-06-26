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
 * data-hero attributes target elements for animation.
 * The heading wrapper uses line overflow-hidden for SplitType line masking.
 */
export function HeroHeading({
	eyebrow,
	heading,
	subheading,
	className,
}: HeroHeadingProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<div data-hero="eyebrow">
				<Text
					size="sm"
					tone="accent"
					className="font-display-sans uppercase tracking-[0.28em]"
				>
					{eyebrow}
				</Text>
			</div>
			<div data-hero="heading" className="[&_.line]:overflow-hidden">
				<Heading level={1} size="display" className="max-w-[16ch] text-balance">
					{heading}
				</Heading>
			</div>
			{subheading ? (
				<div data-hero="subheading">
					<Text size="lg" tone="primary" className="max-w-[44ch]">
						{subheading}
					</Text>
				</div>
			) : null}
		</div>
	);
}
