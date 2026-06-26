/**
 * HeroAnimation — scroll-driven animations.
 */
"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsapEase } from "@/lib/animation/easing";
import { duration } from "@/lib/animation/tokens";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import type { HeroProps } from "./hero";
import { Hero } from "./hero";

export type HeroAnimationProps = Omit<HeroProps, "className">;

/**
 * Animated Hero wrapper. Handles:
 * - masked headline reveal (via SplitType or line/word/char fallback)
 * - scroll parallax on media
 * - fade + bounce on scroll indicator
 * - reduced motion: instant visible, no animation
 *
 * NOTE: assumes Lenis is running and gsap.registerPlugin(ScrollTrigger) was called.
 */
export function HeroAnimation(props: HeroAnimationProps) {
	const reducedMotion = useReducedMotion();
	const containerRef = useRef<HTMLDivElement>(null);

	// Animate on mount when motion is allowed
	useGSAP(
		() => {
			if (reducedMotion) return;

			// 1. Headline reveal — words slide up + fade in
			const words = document.querySelectorAll(
				"[data-hero-heading] .word",
			);
			if (words.length) {
				gsap.fromTo(
					words,
					{ y: "100%", opacity: 0 },
					{
						y: "0%",
						opacity: 1,
						duration: duration.slower,
						stagger: 0.04,
						ease: gsapEase.out,
						// Delay after media loads (placeholder: immediate)
						delay: duration.base,
					},
				);
			} else {
				// Fallback: simple fade up if SplitType didn't split
				const heading = document.querySelector("[data-hero-heading]");
				if (heading) {
					gsap.fromTo(
						heading,
						{ y: 40, opacity: 0 },
						{
							y: 0,
							opacity: 1,
							duration: duration.slow,
							ease: gsapEase.out,
							delay: duration.base,
						},
					);
				}
			}

			// 2. Description reveal — fade in after heading
			const description = document.querySelector(
				"[data-hero-description]",
			);
			if (description) {
				gsap.fromTo(
					description,
					{ y: 20, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: duration.slow,
						ease: gsapEase.out,
						delay: duration.base * 2,
					},
				);
			}

			// 3. CTA buttons — scale + fade in after description
			const cta = document.querySelector("[data-hero-actions]");
			if (cta) {
				gsap.fromTo(
					cta,
					{ y: 20, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: duration.slow,
						ease: gsapEase.out,
						delay: duration.base * 3,
					},
				);
			}

			// 4. Scroll indicator — bounce + fade loop
			const scrollIndicator = document.querySelector(
				"[data-hero-scroll-indicator]",
			);
			if (scrollIndicator) {
				gsap.fromTo(
					scrollIndicator,
					{ opacity: 0, y: 10 },
					{
						opacity: 1,
						y: 0,
						duration: duration.base,
						ease: gsapEase.out,
						delay: duration.base * 4,
						onComplete: () => {
							// Bounce animation loop
							gsap.to(scrollIndicator, {
								y: 6,
								duration: 0.8,
								yoyo: true,
								repeat: -1,
								ease: "power1.inOut",
							});
						},
					},
				);
			}
		},
		{ scope: containerRef, dependencies: [reducedMotion] },
	);

	// If reduced motion, render plain Hero with no animation refs
	if (reducedMotion) {
		return <Hero {...props} />;
	}

	return (
		<div ref={containerRef}>
			<Hero {...props} />
		</div>
	);
}
