/**
 * MegaMenu — multi-column panel with featured image card.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { duration, easing } from "@/lib/animation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { NavItemData } from "@/lib/navigation";

const OFFSET_Y = 8;

const panelVariants: Variants = {
	hidden: { opacity: 0, y: -OFFSET_Y },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: duration.fast, ease: easing.out },
	},
	exit: {
		opacity: 0,
		y: -OFFSET_Y,
		transition: { duration: duration.fast, ease: easing.out },
	},
};

export type MegaMenuProps = {
	item: NavItemData;
	onNavigate: () => void;
};

export function MegaMenu({ item, onNavigate }: MegaMenuProps) {
	const menu = item.megaMenu;
	if (!menu) {
		return null;
	}

	return (
		<motion.div
			variants={panelVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="absolute inset-x-0 top-full border-t border-border bg-bg-elevated/95 shadow-lg backdrop-blur-md"
		>
			<Container
				size="max"
				className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-12"
			>
				<div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-3">
					{menu.columns.map((column) => (
						<div key={column.heading} className="flex flex-col gap-3">
<Text
								size="sm"
								tone="subtle"
								className="uppercase tracking-[0.18em]"
							>
								{column.heading}
							</Text>
							<ul className="flex flex-col gap-2">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={onNavigate}
											className="text-sm text-text-primary/80 transition-colors duration-200 ease-out hover:text-accent-gold motion-reduce:transition-none"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Link
					href={menu.featured.href}
					onClick={onNavigate}
					className="group lg:col-span-4"
				>
					<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
						<Image
							src={menu.featured.image}
							alt={menu.featured.imageAlt}
							fill
							sizes="(min-width: 1024px) 33vw, 100vw"
							className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
						/>
					</div>
					<Heading level={3} size="sm" className="mt-4">
						{menu.featured.title}
					</Heading>
					<Text size="sm" tone="muted" className="mt-1">
						{menu.featured.description}
					</Text>
				</Link>
			</Container>
		</motion.div>
	);
}
