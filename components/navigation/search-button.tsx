/**
 * SearchButton — icon button + full-screen search overlay (UI only).
 */
"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { duration, easing } from "@/lib/animation";
import { cn } from "@/utils/cn";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Portal } from "./portal";

const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: duration.fast, ease: easing.out } },
	exit: { opacity: 0, transition: { duration: duration.fast, ease: easing.out } },
};

export type SearchButtonProps = {
	className?: string;
};

export function SearchButton({ className }: SearchButtonProps) {
	const [open, setOpen] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const close = useCallback(() => setOpen(false), []);

	useScrollLock(open);
	useFocusTrap(overlayRef, open, close);

	return (
		<>
			<button
				type="button"
				aria-label="Open search"
				aria-expanded={open}
				onClick={() => setOpen(true)}
				className={cn(
					"inline-flex h-10 w-10 items-center justify-center rounded-full",
					"text-text-primary/80 hover:text-text-primary",
					"transition-colors duration-200 ease-out motion-reduce:transition-none",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
					className,
				)}
			>
				<SearchIcon />
			</button>
			<Portal>
				<AnimatePresence>
					{open ? (
						<motion.div
							ref={overlayRef}
							variants={overlayVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							role="dialog"
							aria-modal="true"
							aria-label="Site search"
							className="fixed inset-0 z-[60] bg-bg-base/95 backdrop-blur-md"
						>
							<Container size="content" className="pt-32">
								<div className="flex items-center justify-between">
									<Label htmlFor="site-search">Search</Label>
									<button
										type="button"
										aria-label="Close search"
										onClick={close}
										className="text-sm text-text-primary/70 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
									>
										Close
									</button>
								</div>
								<Input
									id="site-search"
									type="search"
									placeholder="Search projects, communities…"
									className="mt-4"
								/>
								<Text size="sm" tone="subtle" className="mt-3">
									Start typing to search. Press Escape to close.
								</Text>
							</Container>
						</motion.div>
					) : null}
				</AnimatePresence>
			</Portal>
		</>
	);
}

function SearchIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="7" />
			<line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
		</svg>
	);
}
