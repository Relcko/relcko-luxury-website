/**
 * Header — sticky orchestrator: scroll-driven transparent↔solid + height reduction + hide/show.
 */
"use client";

import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { duration, easing } from "@/lib/animation";
import { cn } from "@/utils/cn";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { Navbar } from "./navbar";
import { NavActions } from "./nav-actions";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { navItems } from "@/lib/navigation";

const CLOSE_DELAY = 120;

const headerVariants: Variants = {
	visible: { y: 0, transition: { duration: duration.base, ease: easing.out } },
	hidden: {
		y: "-100%",
		transition: { duration: duration.base, ease: easing.out },
	},
};

export function Header() {
	const { direction, atTop } = useScrollDirection();
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const mobileMenuId = useId();
	const closeTimer = useRef<number | null>(null);

	const openMenu = useCallback((id: string) => {
		if (closeTimer.current !== null) {
			window.clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
		setActiveMenu(id);
	}, []);

	const closeMenu = useCallback(() => {
		if (closeTimer.current !== null) {
			window.clearTimeout(closeTimer.current);
		}
		closeTimer.current = window.setTimeout(() => {
			setActiveMenu(null);
		}, CLOSE_DELAY);
	}, []);

	const closeMobile = useCallback(() => setMobileOpen(false), []);
	const toggleMobile = useCallback(() => setMobileOpen((value) => !value), []);
	const closeMega = useCallback(() => setActiveMenu(null), []);

	const activeItem = navItems.find((item) => item.id === activeMenu) ?? null;
	const hasMega = Boolean(activeItem?.megaMenu);
	const hidden =
		direction === "down" && !atTop && !mobileOpen && activeMenu === null;
	const solid = !atTop || activeMenu !== null;

	return (
		<motion.header
			initial={false}
			animate={hidden ? "hidden" : "visible"}
			variants={headerVariants}
			onMouseLeave={closeMenu}
			className={cn(
				"fixed inset-x-0 top-0 z-40",
				"transition-[background-color,border-color,backdrop-filter] duration-300 ease-out motion-reduce:transition-none",
				solid
					? "border-b border-border bg-bg-base/90 backdrop-blur-md"
					: "border-b border-transparent bg-transparent",
			)}
		>
			<Container size="max">
				<div
					className={cn(
						"flex items-center justify-between transition-[height] duration-300 ease-out motion-reduce:transition-none",
						atTop ? "h-20" : "h-16",
					)}
				>
					<Logo scaled={!atTop} />
					<Navbar
						activeMenu={activeMenu}
						onOpen={openMenu}
						onClose={closeMenu}
					/>
					<NavActions
						mobileOpen={mobileOpen}
						onToggleMobile={toggleMobile}
						mobileMenuId={mobileMenuId}
					/>
				</div>
			</Container>

			<AnimatePresence>
				{hasMega && activeItem ? (
					<MegaMenu
						key={activeItem.id}
						item={activeItem}
						onNavigate={closeMega}
					/>
				) : null}
			</AnimatePresence>

			<MobileMenu open={mobileOpen} onClose={closeMobile} id={mobileMenuId} />
		</motion.header>
	);
}
