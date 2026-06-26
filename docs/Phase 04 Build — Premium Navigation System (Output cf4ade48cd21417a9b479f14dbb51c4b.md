# Phase 04 Build — Premium Navigation System (Output)

<aside>
🧭

**Phase 04 — Premium Navigation System.** Functional luxury navigation built on Phases 01–03: CMS-ready data, scroll/route/state hooks, desktop navbar with animated underline + transparent↔solid + hide/show + logo scaling, full multi-column mega menu (placeholder data, images, featured card), full-screen mobile overlay (scroll lock + focus trap + close-on-route-change), search **UI only**, and accessible interactions. Reuses Phase 02 components (Container, Button, Heading, Text, Input, Label) and Phase 03 motion tokens. **No** hero/footer/sections/cards/gallery/CMS/forms/Three.js.

</aside>

## 1. Files created (full source)

### `lib/navigation.ts` (CMS-ready menu data + types)

```tsx
export type NavLink = {
	label: string
	href: string
}

export type MegaColumn = {
	heading: string
	links: NavLink[]
}

export type MegaFeatured = {
	title: string
	description: string
	href: string
	image: string
	imageAlt: string
}

export type NavItemData = {
	id: string
	label: string
	href: string
	megaMenu?: {
		columns: MegaColumn[]
		featured: MegaFeatured
	}
}

// Placeholder data — shaped to be replaced 1:1 by a CMS query later.
export const navItems: NavItemData[] = [
	{
		id: "projects",
		label: "Projects",
		href: "/projects",
		megaMenu: {
			columns: [
				{
					heading: "By Status",
					links: [
						{ label: "Ready to Move", href: "/projects?status=ready" },
						{ label: "Under Construction", href: "/projects?status=building" },
						{ label: "New Launches", href: "/projects?status=launch" },
					],
				},
				{
					heading: "By Type",
					links: [
						{ label: "Apartments", href: "/projects?type=apartments" },
						{ label: "Villas", href: "/projects?type=villas" },
						{ label: "Penthouses", href: "/projects?type=penthouses" },
					],
				},
				{
					heading: "By City",
					links: [
						{ label: "Mumbai", href: "/projects?city=mumbai" },
						{ label: "Goa", href: "/projects?city=goa" },
						{ label: "Dubai", href: "/projects?city=dubai" },
					],
				},
			],
			featured: {
				title: "Azure Bay Residences",
				description: "Limited waterfront collection — now previewing.",
				href: "/projects/azure-bay",
				image: "/images/nav/projects.jpg",
				imageAlt: "Azure Bay Residences waterfront facade",
			},
		},
	},
	{
		id: "communities",
		label: "Communities",
		href: "/communities",
		megaMenu: {
			columns: [
				{
					heading: "Featured",
					links: [
						{ label: "Marina District", href: "/communities/marina" },
						{ label: "Hillside Estates", href: "/communities/hillside" },
						{ label: "Coastal Greens", href: "/communities/coastal" },
					],
				},
				{
					heading: "Lifestyle",
					links: [
						{ label: "Waterfront Living", href: "/communities?lifestyle=waterfront" },
						{ label: "Golf & Leisure", href: "/communities?lifestyle=golf" },
						{ label: "Wellness", href: "/communities?lifestyle=wellness" },
					],
				},
			],
			featured: {
				title: "Marina District",
				description: "A waterfront neighbourhood designed around the promenade.",
				href: "/communities/marina",
				image: "/images/nav/communities.jpg",
				imageAlt: "Marina District promenade at dusk",
			},
		},
	},
	{
		id: "about",
		label: "About",
		href: "/about",
		megaMenu: {
			columns: [
				{
					heading: "Company",
					links: [
						{ label: "Our Story", href: "/about/story" },
						{ label: "Leadership", href: "/about/leadership" },
						{ label: "Careers", href: "/about/careers" },
					],
				},
				{
					heading: "Approach",
					links: [
						{ label: "Design Philosophy", href: "/about/design" },
						{ label: "Sustainability", href: "/about/sustainability" },
						{ label: "Craftsmanship", href: "/about/craft" },
					],
				},
			],
			featured: {
				title: "The Lumière Standard",
				description: "How we design, build, and deliver enduring value.",
				href: "/about/standard",
				image: "/images/nav/about.jpg",
				imageAlt: "Architectural detail of a Lumière residence",
			},
		},
	},
	{
		id: "contact",
		label: "Contact",
		href: "/contact",
		megaMenu: {
			columns: [
				{
					heading: "Get in touch",
					links: [
						{ label: "Sales Enquiries", href: "/contact?topic=sales" },
						{ label: "Schedule a Visit", href: "/contact?topic=visit" },
						{ label: "Press", href: "/contact?topic=press" },
					],
				},
				{
					heading: "Offices",
					links: [
						{ label: "Mumbai", href: "/contact/mumbai" },
						{ label: "Dubai", href: "/contact/dubai" },
					],
				},
			],
			featured: {
				title: "Visit the Gallery",
				description: "Experience materials and finishes in person.",
				href: "/contact/gallery",
				image: "/images/nav/contact.jpg",
				imageAlt: "Lumière experience gallery interior",
			},
		},
	},
]
```

### `hooks/use-scroll-direction.ts`

rAF-throttled scroll-direction + at-top detection (drives hide/show + transparent↔solid).

```tsx
"use client"
import { useEffect, useState } from "react"

export type ScrollDirection = "up" | "down"

export type ScrollState = {
	direction: ScrollDirection
	atTop: boolean
}

const TOP_THRESHOLD = 24
const DELTA = 6

export function useScrollDirection(): ScrollState {
	const [state, setState] = useState<ScrollState>({
		direction: "up",
		atTop: true,
	})

	useEffect(() => {
		let last = window.scrollY
		let ticking = false

		const update = () => {
			const current = window.scrollY
			const atTop = current <= TOP_THRESHOLD
			const diff = current - last
			let nextDirection: ScrollDirection | null = null
			if (Math.abs(diff) >= DELTA) {
				nextDirection = diff > 0 ? "down" : "up"
				last = current
			}
			setState((prev) => {
				const direction = nextDirection ?? prev.direction
				if (prev.direction === direction && prev.atTop === atTop) {
					return prev
				}
				return { direction, atTop }
			})
			ticking = false
		}

		const onScroll = () => {
			if (!ticking) {
				ticking = true
				window.requestAnimationFrame(update)
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true })
		return () => {
			window.removeEventListener("scroll", onScroll)
		}
	}, [])

	return state
}
```

### `hooks/use-scroll-lock.ts`

Locks body scroll and pauses Lenis (Phase 03) while an overlay is open.

```tsx
"use client"
import { useEffect } from "react"
import { useLenis } from "@/hooks/use-lenis"

export function useScrollLock(locked: boolean): void {
	const lenis = useLenis()

	useEffect(() => {
		if (!locked) {
			return
		}
		const { body } = document
		const previousOverflow = body.style.overflow
		body.style.overflow = "hidden"
		lenis?.stop()

		return () => {
			body.style.overflow = previousOverflow
			lenis?.start()
		}
	}, [locked, lenis])
}
```

### `hooks/use-focus-trap.ts`

Traps Tab focus inside a container, restores focus on close, and fires `onEscape`.

```tsx
"use client"
import { useEffect } from "react"
import type { RefObject } from "react"

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(
	ref: RefObject<HTMLElement | null>,
	active: boolean,
	onEscape?: () => void,
): void {
	useEffect(() => {
		if (!active) {
			return
		}
		const node = ref.current
		if (!node) {
			return
		}

		const previous = document.activeElement as HTMLElement | null
		const getItems = () =>
			Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(el) => el.offsetParent !== null,
			)

		getItems()[0]?.focus()

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onEscape?.()
				return
			}
			if (event.key !== "Tab") {
				return
			}
			const items = getItems()
			const first = items[0]
			const last = items[items.length - 1]
			if (!first || !last) {
				return
			}
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}

		node.addEventListener("keydown", onKeyDown)
		return () => {
			node.removeEventListener("keydown", onKeyDown)
			previous?.focus()
		}
	}, [ref, active, onEscape])
}
```

### `hooks/index.ts` (updated barrel)

```tsx
export * from "./use-isomorphic-layout-effect"
export * from "./use-reduced-motion"
export * from "./use-gsap-context"
export * from "./use-match-media"
export * from "./use-lenis"
export * from "./use-scroll-direction"
export * from "./use-scroll-lock"
export * from "./use-focus-trap"
```

---

### `components/navigation/portal.tsx`

Renders overlays to `document.body` so they escape the transformed (animated) `<header>` stacking/containing block.

```tsx
"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { ReactNode } from "react"

export function Portal({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => {
			setMounted(false)
		}
	}, [])

	if (!mounted) {
		return null
	}
	return createPortal(children, document.body)
}
```

### `components/navigation/logo.tsx`

```tsx
import Link from "next/link"
import { cn } from "@/utils/cn"

export type LogoProps = {
	scaled?: boolean
	className?: string
}

export function Logo({ scaled = false, className }: LogoProps) {
	return (
		<Link
			href="/"
			aria-label="Lumière Estates — home"
			className={cn(
				"font-display-sans text-lg font-semibold tracking-[0.22em] text-text-primary",
				"origin-left transition-transform duration-300 ease-out motion-reduce:transition-none",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
				scaled ? "scale-90" : "scale-100",
				className,
			)}
		>
			LUMIÈRE
		</Link>
	)
}
```

### `components/navigation/nav-item.tsx`

Desktop link with animated gold underline; opens its mega menu on hover/focus.

```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import type { NavItemData } from "@/lib/navigation"

export type NavItemProps = {
	item: NavItemData
	isOpen: boolean
	onOpen: (id: string) => void
	onClose: () => void
}

export function NavItem({ item, isOpen, onOpen, onClose }: NavItemProps) {
	const pathname = usePathname()
	const isActive =
		item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
	const hasMenu = Boolean(item.megaMenu)

	return (
		<li
			className="relative"
			onMouseEnter={() => onOpen(item.id)}
			onMouseLeave={onClose}
		>
			<Link
				href={item.href}
				aria-current={isActive ? "page" : undefined}
				aria-haspopup={hasMenu || undefined}
				aria-expanded={hasMenu ? isOpen : undefined}
				onFocus={() => onOpen(item.id)}
				className={cn(
					"group relative inline-flex items-center py-2 text-sm tracking-wide",
					"text-text-primary/80 hover:text-text-primary",
					"transition-colors duration-200 ease-out motion-reduce:transition-none",
					"focus-visible:outline-none focus-visible:text-text-primary",
					isActive && "text-text-primary",
				)}
			>
				{item.label}
				<span
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-gold",
						"scale-x-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
						"group-hover:scale-x-100 group-focus-visible:scale-x-100",
						(isActive || isOpen) && "scale-x-100",
					)}
				/>
			</Link>
		</li>
	)
}
```

### `components/navigation/mega-menu.tsx`

Multi-column panel + featured image card. Animated with Phase 03 tokens; reuses Container/Heading/Text.

```tsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { duration, easing } from "@/lib/animation"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import type { NavItemData } from "@/lib/navigation"

const OFFSET_Y = 8

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
}

export type MegaMenuProps = {
	item: NavItemData
	onNavigate: () => void
}

export function MegaMenu({ item, onNavigate }: MegaMenuProps) {
	const menu = item.megaMenu
	if (!menu) {
		return null
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
	)
}
```

### `components/navigation/navbar.tsx`

```tsx
"use client"
import { NavItem } from "./nav-item"
import { navItems } from "@/lib/navigation"

export type NavbarProps = {
	activeMenu: string | null
	onOpen: (id: string) => void
	onClose: () => void
}

export function Navbar({ activeMenu, onOpen, onClose }: NavbarProps) {
	return (
		<nav aria-label="Primary" className="hidden lg:block">
			<ul className="flex items-center gap-8">
				{navItems.map((item) => (
					<NavItem
						key={item.id}
						item={item}
						isOpen={activeMenu === item.id}
						onOpen={onOpen}
						onClose={onClose}
					/>
				))}
			</ul>
		</nav>
	)
}
```

### `components/navigation/search-button.tsx`

Icon button + full-screen search overlay (**UI only**, no backend). Scroll-locked + focus-trapped + Escape-to-close.

```tsx
"use client"
import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { duration, easing } from "@/lib/animation"
import { cn } from "@/utils/cn"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import { Container } from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"
import { Portal } from "./portal"

const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: duration.fast, ease: easing.out } },
	exit: { opacity: 0, transition: { duration: duration.fast, ease: easing.out } },
}

export type SearchButtonProps = {
	className?: string
}

export function SearchButton({ className }: SearchButtonProps) {
	const [open, setOpen] = useState(false)
	const overlayRef = useRef<HTMLDivElement>(null)
	const close = useCallback(() => setOpen(false), [])

	useScrollLock(open)
	useFocusTrap(overlayRef, open, close)

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
	)
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
	)
}
```

### `components/navigation/hamburger-button.tsx`

Animated hamburger ↔ close, mobile only.

```tsx
"use client"
import { cn } from "@/utils/cn"

export type HamburgerButtonProps = {
	open: boolean
	onToggle: () => void
	controls: string
	className?: string
}

export function HamburgerButton({
	open,
	onToggle,
	controls,
	className,
}: HamburgerButtonProps) {
	return (
		<button
			type="button"
			aria-label={open ? "Close menu" : "Open menu"}
			aria-expanded={open}
			aria-controls={controls}
			onClick={onToggle}
			className={cn(
				"relative inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
				"text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
				className,
			)}
		>
			<span aria-hidden="true" className="relative block h-4 w-6">
				<span
					className={cn(
						"absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none",
						open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
					)}
				/>
				<span
					className={cn(
						"absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-current transition-opacity duration-200 ease-out motion-reduce:transition-none",
						open ? "opacity-0" : "opacity-100",
					)}
				/>
				<span
					className={cn(
						"absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none",
						open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0",
					)}
				/>
			</span>
		</button>
	)
}
```

### `components/navigation/nav-actions.tsx`

Search + desktop CTA (reuses Phase 02 `Button`) + hamburger.

```tsx
"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchButton } from "./search-button"
import { HamburgerButton } from "./hamburger-button"

export type NavActionsProps = {
	mobileOpen: boolean
	onToggleMobile: () => void
	mobileMenuId: string
}

export function NavActions({
	mobileOpen,
	onToggleMobile,
	mobileMenuId,
}: NavActionsProps) {
	const router = useRouter()

	return (
		<div className="flex items-center gap-2">
			<SearchButton />
			<Button
				variant="primary"
				size="sm"
				className="hidden lg:inline-flex"
				onClick={() => router.push("/contact")}
			>
				Enquire
			</Button>
			<HamburgerButton
				open={mobileOpen}
				onToggle={onToggleMobile}
				controls={mobileMenuId}
			/>
		</div>
	)
}
```

### `components/navigation/mobile-menu.tsx`

Full-screen overlay, staggered links, scroll lock, focus trap, close-on-route-change. Portaled out of the header.

```tsx
"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { duration, easing, stagger } from "@/lib/animation"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { navItems } from "@/lib/navigation"
import { Portal } from "./portal"

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
}

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: duration.base, ease: easing.out },
	},
	exit: { opacity: 0, y: 16 },
}

export type MobileMenuProps = {
	open: boolean
	onClose: () => void
	id: string
}

export function MobileMenu({ open, onClose, id }: MobileMenuProps) {
	const pathname = usePathname()
	const panelRef = useRef<HTMLDivElement>(null)

	useScrollLock(open)
	useFocusTrap(panelRef, open, onClose)

	// Close whenever the route changes.
	useEffect(() => {
		if (open) {
			onClose()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

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
												: pathname.startsWith(item.href)
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
										)
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
	)
}
```

### `components/navigation/header.tsx`

Sticky orchestrator: scroll-driven transparent↔solid + height reduction + hide/show, owns mega + mobile state.

```tsx
"use client"
import { useCallback, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { duration, easing } from "@/lib/animation"
import { cn } from "@/utils/cn"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { Container } from "@/components/ui/container"
import { Logo } from "./logo"
import { Navbar } from "./navbar"
import { NavActions } from "./nav-actions"
import { MegaMenu } from "./mega-menu"
import { MobileMenu } from "./mobile-menu"
import { navItems } from "@/lib/navigation"

const CLOSE_DELAY = 120

const headerVariants: Variants = {
	visible: { y: 0, transition: { duration: duration.base, ease: easing.out } },
	hidden: {
		y: "-100%",
		transition: { duration: duration.base, ease: easing.out },
	},
}

export function Header() {
	const { direction, atTop } = useScrollDirection()
	const [activeMenu, setActiveMenu] = useState<string | null>(null)
	const [mobileOpen, setMobileOpen] = useState(false)
	const mobileMenuId = useId()
	const closeTimer = useRef<number | null>(null)

	const openMenu = useCallback((id: string) => {
		if (closeTimer.current !== null) {
			window.clearTimeout(closeTimer.current)
			closeTimer.current = null
		}
		setActiveMenu(id)
	}, [])

	const closeMenu = useCallback(() => {
		if (closeTimer.current !== null) {
			window.clearTimeout(closeTimer.current)
		}
		closeTimer.current = window.setTimeout(() => {
			setActiveMenu(null)
		}, CLOSE_DELAY)
	}, [])

	const closeMobile = useCallback(() => setMobileOpen(false), [])
	const toggleMobile = useCallback(() => setMobileOpen((value) => !value), [])
	const closeMega = useCallback(() => setActiveMenu(null), [])

	const activeItem = navItems.find((item) => item.id === activeMenu) ?? null
	const hasMega = Boolean(activeItem?.megaMenu)
	const hidden =
		direction === "down" && !atTop && !mobileOpen && activeMenu === null
	const solid = !atTop || activeMenu !== null

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
	)
}
```

### `components/navigation/index.ts` (barrel)

```tsx
export * from "./header"
export * from "./logo"
export * from "./navbar"
export * from "./nav-item"
export * from "./nav-actions"
export * from "./mega-menu"
export * from "./mobile-menu"
export * from "./search-button"
export * from "./hamburger-button"
export * from "./portal"
```

### `app/layout.tsx` (integration update)

Adds a skip-link, the persistent `<Header />`, and a `<main id="main">` wrapper around the Phase 03 page-transition shell.

```tsx
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { displayFont, bodyFont } from "@/lib/fonts"
import { siteConfig } from "@/lib/site"
import { ThemeProvider } from "@/providers/theme-provider"
import { AnimationProvider } from "@/providers/animation-provider"
import { Header } from "@/components/navigation/header"
import { PageTransition } from "@/components/transitions/page-transition"
import "@/app/globals.css"

export const metadata: Metadata = {
	title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
	description: siteConfig.description,
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${displayFont.variable} ${bodyFont.variable}`}
			suppressHydrationWarning
		>
			<body className="bg-bg-base text-text-primary antialiased">
				<ThemeProvider>
					<AnimationProvider>
						<a
							href="#main"
							className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-text-primary"
						>
							Skip to content
						</a>
						<Header />
						<main id="main">
							<PageTransition>{children}</PageTransition>
						</main>
					</AnimationProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
```

---

## 2. Component hierarchy

```
<Header>                         client · fixed · motion.header (hide/show)
├─ <Container size="max">
│  └─ bar (h-20 → h-16)
│     ├─ <Logo scaled={!atTop} />
│     ├─ <Navbar> (lg+)
│     │  └─ <NavItem> × n        animated underline · opens mega on hover/focus
│     └─ <NavActions>
│        ├─ <SearchButton> → Portal → search overlay (Label + Input)
│        ├─ <Button> “Enquire”        (Phase 02 primitive)
│        └─ <HamburgerButton>        (mobile only)
├─ <AnimatePresence>
│  └─ <MegaMenu item={activeItem} />   absolute · full-width · columns + featured card
└─ <MobileMenu> → Portal → full-screen overlay (staggered links + CTA)
```

Every component is standalone and independently testable; **Header is the only stateful orchestrator**. `Navbar`, `NavItem`, `MegaMenu`, `MobileMenu`, `SearchButton`, `Logo`, `NavActions`, `HamburgerButton`, and `Portal` are all pure/prop-driven.

## 3. State management

All state is **local and colocated** — no global store needed:

- **Header** owns `activeMenu: string | null` (which mega is open), `mobileOpen: boolean`, and a `closeTimer` ref for hover-intent.
- **Scroll direction** → `useScrollDirection()` returns `{ direction, atTop }` (rAF-throttled). Header derives `solid = !atTop || activeMenu !== null` and `hidden = direction === "down" && !atTop && !mobileOpen && activeMenu === null`.
- **Active route** → derived from `usePathname()` inside `NavItem` and `MobileMenu` (exact match for `/`, prefix match otherwise).
- **Mega open/close** → stable `useCallback` handlers with a 120ms close delay so moving between a trigger and its panel doesn’t flicker; the whole header closes mega on `mouseLeave`.
- **Mobile** → `mobileOpen` toggled by the hamburger; while open, `useScrollLock` (locks `body` + pauses Lenis) and `useFocusTrap` run; it auto-closes on route change and on any link click.
- **Search** → fully self-contained `open` state inside `SearchButton`.

## 4. Animation usage (all Phase 03, all reduced-motion aware)

- **Background transition** — CSS `transition-[background-color,border-color,backdrop-filter]` toggled by `solid`.
- **Height reduction + logo scaling** — CSS transitions (`h-20→h-16`, `scale-100→scale-90`) keyed off `atTop`.
- **Underline** — CSS `scale-x` transform on a gold bar via `group-hover` / `group-focus-visible` / active.
- **Hide/show** — `motion.header` `y: 0 ↔ -100%` using `headerVariants` built from `duration`/`easing` tokens.
- **Mega menu** — Framer fade + slide (`panelVariants`) inside `AnimatePresence`.
- **Mobile menu** — Framer fade overlay + staggered slide-up items (`overlayVariants` + `itemVariants`, `stagger.base`).
- **Search overlay** — Framer fade (`overlayVariants`).
- Reduced motion is honored globally via Phase 03’s `MotionConfig reducedMotion="user"` plus `motion-reduce:transition-none` on every CSS transition.

## 5. Navigation folder structure

```
lib/navigation.ts                 # CMS-ready data + types
hooks/
  use-scroll-direction.ts
  use-scroll-lock.ts
  use-focus-trap.ts
components/navigation/
  header.tsx  navbar.tsx  nav-item.tsx  nav-actions.tsx
  mega-menu.tsx  mobile-menu.tsx  search-button.tsx
  hamburger-button.tsx  logo.tsx  portal.tsx  index.ts
app/layout.tsx                    # Header + skip-link + <main> wiring
```

## 6. Scope confirmation

✅ Built: Header, Navbar, NavItem, MegaMenu, MobileMenu, SearchButton, Logo, NavActions, HamburgerButton (+ Portal helper); desktop transparent↔solid/height/logo/underline/hide-show, full-screen mobile overlay with scroll-lock + focus-trap + close-on-route-change, 4-section mega menu with images/featured/multi-column placeholder data, search UI, full nav state, and accessibility (keyboard, ARIA, Escape, focus management, reduced motion).

❌ Not built (as instructed): hero, homepage sections, footer, gallery, project cards, CMS integration, contact form, scroll-triggered section animations, Three.js.

➕ No new dependencies; reuses Phase 02 (Container/Button/Heading/Text/Input/Label) and Phase 03 (motion tokens, MotionConfig, Lenis) only.

### Verification (run locally)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

> Note: featured images reference placeholder paths under `/public/images/nav/*.jpg`. Drop real assets there (or swap to a CMS URL) — missing files won’t break the build.
> 

---

🛑 **Phase 04 complete. Stopping for your approval before Phase 05.**