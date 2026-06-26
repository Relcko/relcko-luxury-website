"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { duration } from "@/lib/animation/tokens";
import { gsapEase } from "@/lib/animation/easing";
import { registerGsap } from "@/lib/animation/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type UseHeroTimelineArgs = {
	scope: RefObject<HTMLElement | null>;
};

/**
 * Master entrance timeline for the Hero section.
 * - Uses SplitType for heading reveal
 * - Animates all Hero elements in sequence
 * - Ambient idle animation on scroll indicator
 * - Respects prefers-reduced-motion
 */
export function useHeroTimeline({ scope }: UseHeroTimelineArgs) {
	const reduce = useReducedMotion();

	useIsomorphicLayoutEffect(() => {
		const root = scope.current;
		if (!root) return;

		registerGsap();

		const headingEl = root.querySelector<HTMLElement>('[data-hero="heading"]');
		let split: SplitType | null = null;

		const ctx = gsap.context(() => {
			// Reduced motion: skip all entrance + idle motion
			if (reduce) return;

			// SplitType: split the headline into lines + chars
			if (headingEl) {
				split = new SplitType(headingEl, {
					types: "lines,chars",
					tagName: "span",
});
			}

			// Initial states (transform + opacity only — never layout props)
			gsap.set('[data-hero="media"]', { autoAlpha: 0, scale: 1.12 });
			gsap.set('[data-hero="overlay"]', { autoAlpha: 0 });
			gsap.set('[data-hero="eyebrow"]', { autoAlpha: 0, y: 16 });
			gsap.set('[data-hero="subheading"]', { autoAlpha: 0, y: 18 });
			gsap.set('[data-hero="description"]', { autoAlpha: 0, y: 24 });
			gsap.set('[data-hero="cta"]', { autoAlpha: 0, y: 20 });
			gsap.set('[data-hero="scroll"]', { autoAlpha: 0, y: -8 });
			if (split?.chars) {
				gsap.set(split.chars, { autoAlpha: 0, yPercent: 110 });
			}

// Promote to a GPU layer for the entrance, then release once it lands.
			const animated =
				'[data-hero="media"], [data-hero="eyebrow"], [data-hero="subheading"], ' +
				'[data-hero="description"], [data-hero="cta"], [data-hero="scroll"]';
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
					// 1 + 2: overlay fade-in & background media reveal
					.to('[data-hero="overlay"]', { autoAlpha: 1, duration: duration.base }, 0)
					.to('[data-hero="media"]', { autoAlpha: 1, scale: 1, duration: 1.6 }, 0)
					// 3: eyebrow reveal
					.to('[data-hero="eyebrow"]', { autoAlpha: 1, y: 0, duration: duration.base }, 0.45)
					// 4: heading SplitType character reveal
					.to(
						chars,
						{ autoAlpha: 1, yPercent: 0, duration: duration.slow, stagger: 0.018 },
						0.6,
					)
					.to('[data-hero="subheading"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.55")
					// 5: description fade + slide
					.to('[data-hero="description"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.45")
					// 6: CTA stagger
					.to('[data-hero="cta"]', { autoAlpha: 1, y: 0, duration: duration.base, stagger: 0.12 }, "-=0.35")
					// 7: scroll indicator appearance
					.to('[data-hero="scroll"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.2")
					// 8: ambient idle motion
					.add(startIdle);
			} else {
				// No SplitType - still run the other animations
				tl
					.to('[data-hero="overlay"]', { autoAlpha: 1, duration: duration.base }, 0)
					.to('[data-hero="media"]', { autoAlpha: 1, scale: 1, duration: 1.6 }, 0)
					.to('[data-hero="eyebrow"]', { autoAlpha: 1, y: 0, duration: duration.base }, 0.45)
					.to('[data-hero="subheading"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.55")
					.to('[data-hero="description"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.45")
					.to('[data-hero="cta"]', { autoAlpha: 1, y: 0, duration: duration.base, stagger: 0.12 }, "-=0.35")
					.to('[data-hero="scroll"]', { autoAlpha: 1, y: 0, duration: duration.base }, "-=0.2")
					.add(startIdle);
			}

			// Ambient idle: looping tween on the scroll dot
			function startIdle() {
				if (!root) return;
				const dot = root.querySelector('[data-hero="scroll-dot"]');
				if (!dot) return;
				gsap.to(dot, {
					yPercent: 140,
					autoAlpha: 0.25,
					duration: 1.4,
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
