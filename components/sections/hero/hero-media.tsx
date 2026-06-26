/**
 * HeroMedia — background media layer (image OR video).
 */
import Image from "next/image";
import type { HeroMediaSource } from "@/lib/hero";
import { cn } from "@/utils/cn";

export type HeroMediaProps = {
	media: HeroMediaSource;
	className?: string;
};

/**
 * Background layer only. Fills the hero, sits behind overlay + content.
 * No animation here (Phase 05B adds zoom/parallax). Poster + fixed fill
 * guarantee zero CLS for both image and video.
 */
export function HeroMedia({ media, className }: HeroMediaProps) {
	return (
		<div
			aria-hidden="true"
			className={cn("absolute inset-0 overflow-hidden bg-bg-base", className)}
		>
			{media.kind === "image" ? (
				<Image
					src={media.src}
					alt={media.alt}
					fill
					priority
					sizes="100vw"
					className="object-cover"
					{...(media.blurDataURL
						? { placeholder: "blur", blurDataURL: media.blurDataURL }
						: {})}
				/>
			) : (
				<video
					className="h-full w-full object-cover"
					poster={media.poster}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					aria-label={media.label}
				>
					<source src={media.src} type="video/mp4" />
				</video>
			)}
		</div>
	);
}
