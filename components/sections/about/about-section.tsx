"use client";

import { Container, Section } from "@/components/ui";
import { cn } from "@/utils/cn";
import { AboutContent } from "./AboutContent";
import { AboutMedia } from "./AboutMedia";
import { aboutContent } from "@/lib/about";

type AboutSectionProps = {
	className?: string;
};

export function AboutSection({ className }: AboutSectionProps) {
	return (
		<Section className={cn("relative overflow-hidden py-20 md:py-32", className)}>
			<Container>
				<div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
					<AboutContent
						content={{
							eyebrow: aboutContent.eyebrow,
							heading: aboutContent.heading,
							paragraphs: aboutContent.paragraphs,
							features: aboutContent.features,
							cta: aboutContent.cta,
						}}
					/>
					<AboutMedia
						image={aboutContent.image}
						accent={aboutContent.accent}
						className="hidden md:block"
					/>
				</div>
			</Container>
		</Section>
	);
}
