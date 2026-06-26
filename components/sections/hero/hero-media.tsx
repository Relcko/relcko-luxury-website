"use client";

import Image from "next/image";
import type { HeroMediaSource } from "@/lib/hero";
import { cn } from "@/utils/cn";
import { useHeroVideo } from "@/hooks/use-hero-video";

export type HeroMediaProps = {
	media: HeroMediaSource;
	className?: string;
};

/**
 * Background layer only. Fills the hero, sits behind overlay + content.
 * Uses poster-as-LCP strategy: the poster is a priority-loaded, optimized image
 * that serves as LCP. Video lazy-loads on idle and cross-fades in.
 * will-change is applied transiently by the motion hooks.
 */
export function HeroMedia({ media, className }: HeroMediaProps) {
	return (
		<div
			data-hero="media"
			aria-hidden="true"
			className={cn("absolute inset-0 overflow-hidden bg-bg-base", className)}
		>
			{media.kind === "image" ? (
				<Image
					src={media.src}
					alt={media.alt}
					fill
					priority
					fetchPriority="high"
					sizes="100vw"
					quality={82}
					className="object-cover"
					{...(media.blurDataURL
						? { placeholder: "blur", blurDataURL: media.blurDataURL }
						: {})}
				/>
			) : (
				<HeroVideo media={media} />
			)}
		</div>
	);
}

/** Video component with lazy loading and cross-fade. */
function HeroVideo({
	media,
}: {
	media: Extract<HeroMediaSource, { kind: "video" }>;
}) {
	const { videoRef, shouldLoad, ready, onReady } = useHeroVideo();

	return (
		<>
			{/* Poster is the LCP element: an optimized, priority next/image. */}
			<Image
				src={media.poster}
				alt=""
				fill
				priority
				fetchPriority="high"
				sizes="100vw"
				quality={78}
				className={cn(
					"object-cover transition-opacity duration-700",
					ready ? "opacity-0" : "opacity-100",
				)}
				{...(media.blurDataURL
					? { placeholder: "blur", blurDataURL: media.blurDataURL }
					: {})}
			/>

			{/* Video lazy-mounts on idle and fades in once it can play. */}
			{shouldLoad ? (
				<video
					ref={videoRef}
					className={cn(
						"absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
						ready ? "opacity-100" : "opacity-0",
					)}
					poster={media.poster}
					muted
					loop
					playsInline
					preload="auto"
					aria-label={media.label}
					onCanPlay={onReady}
				>
					{media.sources.map((source) => (
						<source key={source.src} src={source.src} type={source.type} />
					))}
				</video>
			) : null}
		</>
	);
}
