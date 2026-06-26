"use client";

/**
 * Hero — orchestrator component.
 */
import { useRef } from "react";
import type { HeroContent as HeroContentModel } from "@/lib/hero";
import { heroContent as defaultHeroContent } from "@/lib/hero";
import { cn } from "@/utils/cn";
import { useHeroTimeline } from "@/hooks/use-hero-timeline";
import { useHeroScroll } from "@/hooks/use-hero-scroll";
import { HeroContent } from "./hero-content";
import { HeroMedia } from "./hero-media";
import { HeroOverlay } from "./hero-overlay";
import { HeroScrollIndicator } from "./hero-scroll-indicator";

export type HeroProps = {
	/** CMS-injectable; falls back to placeholder content. */
	content?: HeroContentModel;
	/** Anchor id of the section the scroll indicator points to. */
	nextSectionId?: string;
	className?: string;
};

/**
 * Layer order (back -> front):
 *   media -> overlay -> content -> scroll indicator
 * `min-h` uses svh/dvh to avoid mobile URL-bar CLS while keeping ~100vh.
 */
export function Hero({
	content = defaultHeroContent,
	nextSectionId = "featured",
	className,
}: HeroProps) {
	const rootRef = useRef<HTMLElement>(null);

	useHeroTimeline({ scope: rootRef });
	useHeroScroll({ scope: rootRef });

	return (
		<section
			ref={rootRef}
			data-hero="root"
			aria-label={content.regionLabel}
			className={cn(
				"relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden",
				className,
			)}
		>
			{/* Background media layer */}
			<HeroMedia media={content.media} />

			{/* Overlay layer */}
			<HeroOverlay />

			{/* Content + CTA layers */}
			<HeroContent content={content} className="flex-1" />

			{/* Decorative + scroll-indicator layer */}
			<div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
				<div className="pointer-events-auto">
					<HeroScrollIndicator targetId={nextSectionId} />
				</div>
			</div>
		</section>
	);
}
