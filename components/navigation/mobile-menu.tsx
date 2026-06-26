/**
 * MobileMenu — full-screen overlay with staggered links.
 */
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { duration, easing, stagger } from "@/lib/animation";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";
import { Portal } from "./portal";

const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: duration.base,
			ease: easing.out,
			when: "beforeChildren",
			staggerChildren: stagger.base,
		},
	},
	exit: {
		opacity: 0,
		transition: { duration: duration.fast, ease: easing.out },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: duration.base, ease: easing.out },
	},
	exit: { opacity: 0, y: 16 },
};

export type MobileMenuProps = {
	open: boolean;
	onClose: () => void;
	id: string;
};

export function MobileMenu({ open, onClose, id }: MobileMenuProps) {
	const pathname = usePathname();
	const panelRef = useRef<HTMLDivElement>(null);

	useScrollLock(open);
	useFocusTrap(panelRef, open, onClose);

	// Close whenever the route changes.
	useEffect(() => {
		if (open) {
			onClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	return (
		<Portal>
			<AnimatePresence>
				{open ? (
					<motion.div
						id={id}
						ref={panelRef}
						variants={overlayVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						role="dialog"
						aria-modal="true"
						aria-label="Site navigation"
						className="fixed inset-0 z-50 flex flex-col bg-bg-base lg:hidden"
					>
						<Container
							size="content"
							className="flex h-full flex-col pb-10 pt-24"
						>
							<nav aria-label="Mobile primary" className="flex-1">
								<ul className="flex flex-col gap-1">
									{navItems.map((item) => {
										const isActive =
											item.href === "/"
												? pathname === "/"
												: pathname.startsWith(item.href);
										return (
											<motion.li key={item.id} variants={itemVariants}>
												<Link
													href={item.href}
													onClick={onClose}
													aria-current={isActive ? "page" : undefined}
													className="block py-3 font-display-sans text-3xl text-text-primary"
												>
													{item.label}
												</Link>
											</motion.li>
										);
									})}
								</ul>
							</nav>
							<motion.div variants={itemVariants}>
								<Button
									variant="primary"
									size="lg"
									className="w-full"
									onClick={onClose}
								>
									Enquire
								</Button>
							</motion.div>
						</Container>
					</motion.div>
				) : null}
			</AnimatePresence>
		</Portal>
	);
}
