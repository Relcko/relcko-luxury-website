"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealVariants } from "@/lib/animation";
import type { AboutAccent, AboutImage } from "@/lib/about";
import { cn } from "@/utils/cn";

const VIEWPORT = { once: true, margin: "-15% 0px" } as const;

type AboutMediaProps = {
	image: AboutImage;
	accent?: AboutAccent;
	className?: string;
};

export function AboutMedia({ image, accent, className }: AboutMediaProps) {
	return (
		<motion.div
			variants={revealVariants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("relative", className)}
		>
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border">
				<Image
					src={image.src}
					alt={image.alt}
					fill
					sizes="(max-width: 1024px) 100vw, 50vw"
					loading="lazy"
					{...(image.blurDataURL
						? { placeholder: "blur", blurDataURL: image.blurDataURL }
						: {})}
					className="object-cover"
				/>
				<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent" />
			</div>
			{accent ? (
				<div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-bg-elevated/90 px-6 py-4 backdrop-blur md:block">
					<div className="font-display-sans text-3xl text-accent-gold">{accent.value}</div>
					<div className="text-sm text-text-muted">{accent.label}</div>
				</div>
			) : null}
		</motion.div>
	);
}
