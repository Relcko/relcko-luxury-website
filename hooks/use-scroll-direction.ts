/**
 * useScrollDirection — rAF-throttled scroll direction + at-top detection.
 */
"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

export type ScrollState = {
	direction: ScrollDirection;
	atTop: boolean;
};

const TOP_THRESHOLD = 24;
const DELTA = 6;

export function useScrollDirection(): ScrollState {
	const [state, setState] = useState<ScrollState>({
		direction: "up",
		atTop: true,
	});

	useEffect(() => {
		let last = window.scrollY;
		let ticking = false;

		const update = () => {
			const current = window.scrollY;
			const atTop = current <= TOP_THRESHOLD;
			const diff = current - last;
			let nextDirection: ScrollDirection | null = null;
			if (Math.abs(diff) >= DELTA) {
				nextDirection = diff > 0 ? "down" : "up";
				last = current;
			}
			setState((prev) => {
				const direction = nextDirection ?? prev.direction;
				if (prev.direction === direction && prev.atTop === atTop) {
					return prev;
				}
				return { direction, atTop };
			});
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(update);
			}
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return state;
}
