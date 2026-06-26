/**
 * HeroContent — content layer (grid).
 */
import { Container } from "@/components/ui";
import type { HeroContent as HeroContentModel } from "@/lib/hero";
import { cn } from "@/utils/cn";
import { HeroActions } from "./hero-actions";
import { HeroDescription } from "./hero-description";
import { HeroHeading } from "./hero-heading";

export type HeroContentProps = {
	content: HeroContentModel;
	className?: string;
};

/**
 * Editorial composition layer. Grid-based: on large screens the copy sits in
 * the lower-left editorial column; on small screens it stacks centered-bottom.
 */
export function HeroContent({ content, className }: HeroContentProps) {
	return (
		<Container
			size="max"
			className={cn("relative z-10 flex h-full items-end pb-24 md:pb-28", className)}
		>
			<div className="grid w-full grid-cols-1 lg:grid-cols-12">
				<div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-6">
					<HeroHeading
						eyebrow={content.eyebrow}
						heading={content.heading}
						subheading={content.subheading}
					/>
					<HeroDescription>{content.description}</HeroDescription>
					<HeroActions
						primary={content.primaryCta}
						secondary={content.secondaryCta}
						className="mt-2"
					/>
				</div>
			</div>
		</Container>
	);
}
