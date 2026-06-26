/**
 * LanguageSelector — dropdown for locale switching.
 */
"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/utils/cn";
import { Portal } from "./portal";

const languages = [
	{ code: "en", label: "EN" },
	{ code: "de", label: "DE" },
	{ code: "fr", label: "FR" },
] as const;

const dropdownVariants: Variants = {
	hidden: { opacity: 0, y: -8, scale: 0.96 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: "spring", stiffness: 400, damping: 32 },
	},
	exit: {
		opacity: 0,
		scale: 0.96,
		transition: { duration: 0.15 },
	},
};

export function LanguageSelector({
	className,
}: {
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const activeLang = languages[0]!; // Default to EN
	const dropdownRef = useRef<HTMLDivElement>(null);
	const close = useCallback(() => setOpen(false), []);

	useFocusTrap(dropdownRef, open, close);

	return (
		<div className={cn("relative", className)}>
			<button
				type="button"
				aria-label="Select language"
				aria-expanded={open}
				aria-haspopup="listbox"
				onClick={() => setOpen(!open)}
				className={cn(
					"inline-flex h-10 items-center justify-center rounded-full px-3",
					"text-sm font-medium tracking-wider text-text-primary/80",
					"hover:text-text-primary",
					"transition-colors duration-200 ease-out motion-reduce:transition-none",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
				)}
			>
				{activeLang.label}
				<span aria-hidden="true" className="ml-1 text-[10px]">
					▾
				</span>
			</button>
			<AnimatePresence>
				{open ? (
					<Portal>
						<motion.div
							ref={dropdownRef}
							role="listbox"
							aria-label="Language options"
							variants={dropdownVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="absolute right-0 top-full z-50 mt-2 rounded-lg border border-border bg-bg-elevated/95 py-1 shadow-lg backdrop-blur-md"
						>
							{languages.map((lang) => (
								<button
									key={lang.code}
									type="button"
									role="option"
									aria-selected={lang.code === activeLang.code}
									className={cn(
										"block w-full px-4 py-2 text-left text-sm tracking-wider",
										"text-text-primary/80 hover:bg-bg-base hover:text-text-primary",
										"transition-colors duration-150 ease-out",
										"focus-visible:bg-bg-base focus-visible:text-text-primary focus-visible:outline-none",
										lang.code === activeLang.code && "text-accent-gold",
									)}
								>
									{lang.label}
								</button>
							))}
						</motion.div>
					</Portal>
				) : null}
			</AnimatePresence>
		</div>
	);
}
