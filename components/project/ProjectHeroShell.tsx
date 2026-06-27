"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import { Heading, Text, Badge } from "@/components/ui"
import type { Project } from "@/lib/project"
import { cn } from "@/utils/cn"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type ProjectHeroShellProps = {
	project: Project
	className?: string
}

/**
 * Structural hero only — final cinematic visuals arrive in a later phase. Image
 * is a placeholder with a gradient scrim so the title/subtitle stay legible.
 */
export function ProjectHeroShell({ project, className }: ProjectHeroShellProps) {
	const { media, title, tagline, location, category, status } = project

	// Get image URL from the media structure
	const heroUrl = media.featuredImage?.url || "/images/projects/placeholder-hero.jpg"
	const heroAlt = media.featuredImage?.alt || `${title} hero`

	return (
		<motion.header
			variants={staggerContainer(0.1, 0)}
			initial="hidden"
			animate="visible"
			className={cn(
				"relative overflow-hidden rounded-3xl border border-border bg-bg-elevated",
				className,
			)}
		>
			<div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
				<Image
					src={heroUrl}
					alt={heroAlt}
					fill
					priority
					sizes="100vw"
					placeholder="blur"
					blurDataURL={media.featuredImage?.blurDataUrl ?? FALLBACK_BLUR}
					className="object-cover"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent"
				/>
			</div>
			<motion.div
				variants={childVariants}
				className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:p-10"
			>
				<div className="flex flex-wrap items-center gap-2">
					<Badge>{category}</Badge>
					<Badge>{status}</Badge>
				</div>
				<Heading level={1} size="xl" className="text-balance">
					{title}
				</Heading>
				<Text size="lg" tone="muted" className="max-w-2xl">
					{tagline}
				</Text>
				<Text size="sm" tone="subtle">
					{location.city}, {location.country}
				</Text>
			</motion.div>
		</motion.header>
	)
}
