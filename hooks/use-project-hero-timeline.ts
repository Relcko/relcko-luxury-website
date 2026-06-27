"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { duration } from "@/lib/animation/tokens";
import { gsapEase } from "@/lib/animation/easing";
import { registerGsap } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type UseProjectHeroTimelineArgs = {
	scope: RefObject<HTMLElement | null>;
};

/**
 * Cinematic Project Hero entrance timeline.
 * - Uses SplitType for title reveal (character stagger)
 * - Animates badges, location, and scroll indicator in sequence
 * - Ambient idle animation on scroll indicator
 * - Respects prefers-reduced-motion
 * - Adaptable to both image and video media
 */
export function useProjectHeroTimeline({ scope }: UseProjectHeroTimelineArgs) {
	const reduce = useReducedMotion();

	useIsomorphicLayoutEffect(() => {
		const root = scope.current;
		if (!root) return;

		registerGsap();

		const titleEl = root.querySelector<HTMLElement>('[data-project-hero="title"]');
		let split: SplitType | null = null;

		const ctx = gsap.context(() => {
			// Reduced motion: skip all entrance + idle motion
			if (reduce) return;

			// SplitType: split the title into lines + chars
			if (titleEl) {
				split = new SplitType(titleEl, {
					types: "lines,chars",
					tagName: "span",
				});
			}

			// Initial states (transform + opacity only)
			gsap.set('[data-project-hero="media"]', { autoAlpha: 0, scale: 1.12 });
			gsap.set('[data-project-hero="overlay"]', { autoAlpha: 0 });
			gsap.set('[data-project-hero="badges"]', { autoAlpha: 0, y: 12 });
			gsap.set('[data-project-hero="tagline"]', { autoAlpha: 0, y: 16 });
			gsap.set('[data-project-hero="location"]', { autoAlpha: 0, y: 10 });
			if (split?.chars) {
				gsap.set(split.chars, { autoAlpha: 0, yPercent: 110 });
			}

			// Promote to GPU layer during entrance, release after lands.
			const animated =
				'[data-project-hero="media"], [data-project-hero="badges"], ' +
				'[data-project-hero="tagline"], [data-project-hero="location"]';
			gsap.set(animated, { willChange: "transform, opacity" });

			// MASTER ENTRANCE TIMELINE
			const tl = gsap.timeline({
				defaults: { ease: gsapEase.out, duration: duration.slow },
			});

			// Release will-change after entrance completes.
			tl.eventCallback("onComplete", () => {
				gsap.set(animated, { willChange: "auto" });
			});

			const chars = split?.chars;
			if (chars) {
				tl
					// 1: overlay fade-in
					.to('[data-project-hero="overlay"]', { autoAlpha: 1, duration: duration.base }, 0)
					// 2: background media reveal
					.to('[data-project-hero="media"]', { autoAlpha: 1, scale: 1, duration: 1.6 }, 0)
					// 3: badges stagger
					.to(
						'[data-project-hero="badges"]',
						{ autoAlpha: 1, y: 0, duration: duration.base, stagger: 0.1 },
						0.4,
					)
					// 4: title SplitType character reveal
					.to(
						chars,
						{ autoAlpha: 1, yPercent: 0, duration: duration.slow, stagger: 0.012 },
						0.55,
					)
					// 5: tagline fade + slide
					.to('[data-project-hero="tagline"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.4")
					// 6: location fade
					.to(
						'[data-project-hero="location"]',
						{ autoAlpha: 1, y: 0, duration: duration.base },
						"-=0.25",
					)
					// 7: ambient idle motion
					.add(startIdle);
			} else {
				// No SplitType - still run other animations
				tl
					.to('[data-project-hero="overlay"]', { autoAlpha: 1, duration: duration.base }, 0)
					.to('[data-project-hero="media"]', { autoAlpha: 1, scale: 1, duration: 1.6 }, 0)
					.to('[data-project-hero="badges"]', { autoAlpha: 1, y: 0, duration: duration.base, stagger: 0.1 }, 0.4)
					.to('[data-project-hero="tagline"]', { autoAlpha: 1, y: 0, duration: duration.base }, 0.55)
					.to('[data-project-hero="location"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.25")
					.add(startIdle);
			}

			// Ambient idle: subtle breathing on the gradient edge
			function startIdle() {
				if (!root) return;
				const edge = root.querySelector('[data-project-hero="edge"]');
				if (!edge) return;
				gsap.to(edge, {
					opacity: 0.6,
					duration: 2,
					ease: gsapEase.inOut,
					repeat: -1,
					yoyo: true,
				});
			}
		}, root);

		return () => {
			ctx.revert();
			split?.revert();
		};
	}, [scope, reduce]);
}
