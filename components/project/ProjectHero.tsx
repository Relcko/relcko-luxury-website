"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Text, Badge } from "@/components/ui"
import type { Project } from "@/lib/project"
import { useProjectHeroTimeline } from "@/hooks/use-project-hero-timeline"
import { useHeroVideo } from "@/hooks/use-hero-video"
import { cn } from "@/utils/cn"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type ProjectHeroProps = {
	project: Project
	className?: string
}

/**
 * Cinematic Project Hero — replaces the placeholder shell.
 * Supports both image and video media with SplitType title reveal.
 * Reuses hooks: useProjectHeroTimeline (entrance), useHeroVideo (lazy video).
 */
export function ProjectHero({ project, className }: ProjectHeroProps) {
	const rootRef = useRef<HTMLElement>(null)
	const { media, title, tagline, location, category, status } = project

	useProjectHeroTimeline({ scope: rootRef })

	const heroUrl = media.featuredImage?.url || "/images/projects/placeholder-hero.jpg"
	const heroAlt = media.featuredImage?.alt || `${title} hero`
	const blurDataUrl = media.featuredImage?.blurDataUrl ?? FALLBACK_BLUR

	// Check if we have video content
	const hasVideo = media.video && media.video.sources && media.video.sources.length > 0

	return (
		<motion.header
			ref={rootRef}
			data-project-hero="root"
			aria-label={title}
			initial="hidden"
			animate="visible"
			className={cn(
				"relative isolate flex min-h-[85svh] w-full flex-col overflow-hidden rounded-3xl border border-border",
				className,
			)}
		>
			{/* Background media layer (image or video) */}
			{hasVideo ? (
				<ProjectVideoHero media={media} />
			) : (
				<div data-project-hero="media" className="absolute inset-0">
					<Image
						src={heroUrl}
						alt={heroAlt}
						fill
						priority
						sizes="100vw"
						placeholder="blur"
						blurDataURL={blurDataUrl}
						className="object-cover"
					/>
				</div>
			)}

			{/* Gradient overlay */}
			<div
				data-project-hero="overlay"
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent"
			/>

			{/* Gradient edge for ambient idle */}
			<div
				data-project-hero="edge"
				aria-hidden="true"
				className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-base to-transparent opacity-100"
			/>

			{/* Content layer */}
			<div className="relative z-10 flex flex-1 flex-col justify-end p-6 md:p-10 lg:p-14">
				{/* Badges */}
				<div data-project-hero="badges" className="mb-4 flex flex-wrap gap-2">
					<Badge>{category}</Badge>
					<Badge>{status}</Badge>
				</div>

				{/* Title */}
				<h1
					data-project-hero="title"
					className="mb-4 text-balance font-display-serif text-4xl font-medium leading-[1.1] tracking-tight text-text-primary md:text-5xl lg:text-6xl"
				>
					{title}
				</h1>

{/* Tagline */}
				{tagline && (
					<Text
						data-project-hero="tagline"
						size="lg"
						tone="muted"
						className="mb-3 max-w-2xl"
					>
						{tagline}
					</Text>
				)}

				{/* Location */}
				<Text
					data-project-hero="location"
					size="sm"
					tone="subtle"
					className="font-medium"
				>
					{location.city}, {location.country}
				</Text>
			</div>
		</motion.header>
	)
}

/** Video hero with lazy loading */
function ProjectVideoHero({ media }: { media: Project["media"] }) {
	const video = media.video
	const posterUrl = video?.poster?.url || media.featuredImage?.url || "/images/projects/placeholder-hero.jpg"
	const posterAlt = video?.poster?.alt || "Project video poster"
	const posterBlur = video?.poster?.blurDataUrl ?? media.featuredImage?.blurDataUrl ?? FALLBACK_BLUR

	const { videoRef, shouldLoad, ready, onReady } = useHeroVideo()

	return (
		<div data-project-hero="media" className="absolute inset-0">
			{/* Poster (LCP) */}
			<Image
				src={posterUrl}
				alt={posterAlt}
				fill
				priority
				sizes="100vw"
				placeholder="blur"
				blurDataURL={posterBlur}
				className={cn(
					"object-cover transition-opacity duration-700",
					ready ? "opacity-0" : "opacity-100",
				)}
			/>

			{/* Video lazy-loaded */}
			{shouldLoad && video?.sources ? (
				<video
					ref={videoRef}
					className={cn(
						"absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
						ready ? "opacity-100" : "opacity-0",
					)}
					poster={posterUrl}
					muted
					loop
					playsInline
					preload="auto"
					aria-label={video.poster?.alt || "Project walkthrough"}
					onCanPlay={onReady}
				>
					{video.sources.map((source) => (
						<source key={source.url} src={source.url} type={source.type} />
					))}
				</video>
			) : null}
		</div>
	)
}
