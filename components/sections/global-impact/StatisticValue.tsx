"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { useReducedMotion } from "@/hooks"
import { cn } from "@/utils/cn"

// Local tween constant — a number, not shared animation infrastructure.
const DURATION_MS = 1600

// Grouped, fixed-precision formatting for readable numbers (e.g. 8,500 / 1.2).
function formatValue(value: number, decimals: number) {
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value)
}

type StatisticValueProps = {
	value: number
	prefix?: string
	suffix?: string
	decimals?: number
	className?: string
}

export function StatisticValue({
	value,
	prefix = "",
	suffix = "",
	decimals = 0,
	className,
}: StatisticValueProps) {
	const ref = useRef<HTMLSpanElement>(null)
	// Count-up runs only when the value scrolls into view, once.
	const inView = useInView(ref, { once: true, margin: "-15% 0px" })
	const prefersReducedMotion = useReducedMotion()
	const [display, setDisplay] = useState(0)

	useEffect(() => {
		if (!inView) return
		// Reduced-motion fallback: show the final value immediately.
		if (prefersReducedMotion) {
			setDisplay(value)
			return
		}
		let frame = 0
		const start = performance.now()
		const tick = (now: number) => {
			const progress = Math.min((now - start) / DURATION_MS, 1)
			const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
			setDisplay(value * eased)
			if (progress < 1) {
				frame = requestAnimationFrame(tick)
			} else {
				setDisplay(value)
			}
		}
		frame = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(frame)
	}, [inView, prefersReducedMotion, value])

const finalText = `${prefix}${formatValue(value, decimals)}${suffix}`

	return (
		<span
			ref={ref}
			className={cn(
				"font-display-sans text-5xl font-semibold tracking-tight text-text-primary tabular-nums md:text-6xl",
				className,
			)}
		>
			{/* Animated, decorative; the static final value is exposed to AT below. */}
			<span aria-hidden="true">
				{prefix}
				{formatValue(display, decimals)}
				{suffix}
			</span>
			<span className="sr-only">{finalText}</span>
		</span>
	)
}
