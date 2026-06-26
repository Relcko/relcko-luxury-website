"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { registerGsap } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type UseHeroScrollArgs = {
	scope: RefObject<HTMLElement | null>;
};

/**
 * Scroll-driven effects for the Hero section.
 * - Background scale + parallax
 * - Content parallax + fade
 * - Scroll indicator fade
 * - Respects prefers-reduced-motion
 */
export function useHeroScroll({ scope }: UseHeroScrollArgs) {
	const reduce = useReducedMotion();

useIsomorphicLayoutEffect(() => {
		const root = scope.current;
		if (!root || reduce) return;

		registerGsap();

		const ctx = gsap.context(() => {
			const scrub = {
				trigger: root,
				start: "top top",
				end: "bottom top",
				scrub: true,
				// Transient will-change: present only while in the scrub zone.
				toggleClass: {
					targets: '[data-hero="media"]',
					className: "will-change-transform",
				},
			};

			// Background scale + parallax (drifts down + scales as you scroll)
			gsap.to('[data-hero="media"]', {
				yPercent: 16,
				scale: 1.1,
				ease: "none",
				scrollTrigger: scrub,
			});

			// Overlay opacity shift (darkens toward the next section)
			gsap.fromTo(
				'[data-hero="overlay"]',
				{ autoAlpha: 1 },
				{ autoAlpha: 1.0, ease: "none", scrollTrigger: scrub },
			);

			// Content parallax (rises faster + softly fades)
			gsap.to('[data-hero="content"]', {
				yPercent: -12,
				autoAlpha: 0.35,
				ease: "none",
				scrollTrigger: scrub,
			});

			// Scroll indicator fades within the first slice of scroll
			gsap.to('[data-hero="scroll"]', {
				autoAlpha: 0,
				y: -12,
				ease: "none",
				scrollTrigger: { trigger: root, start: "top top", end: "18% top", scrub: true },
			});
		}, root);

		return () => ctx.revert();
	}, [scope, reduce]);
}
