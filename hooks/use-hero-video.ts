"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Video must never compete with LCP. Strategy:
 * - reduced-motion / Save-Data / 2g → never load video (poster only)
 * - otherwise load on requestIdleCallback (after the poster paints)
 * - pause when offscreen (IntersectionObserver) to save CPU/battery
 */
export function useHeroVideo() {
	const reduce = useReducedMotion();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);
	const [ready, setReady] = useState(false);

	// Determine if we should load the video based on network conditions.
	useEffect(() => {
		if (reduce) return;

		const nav = navigator as Navigator & { connection?: NetworkInformation };
		const conn = nav.connection;

		// Don't load if user prefers reduced data.
		if (conn?.saveData) return;

		// Don't load on slow connections.
		if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

		// Load on idle, after the poster has painted.
		const w = window as Window & typeof globalThis;
		if (typeof w.requestIdleCallback === "function") {
			const id = w.requestIdleCallback(() => setShouldLoad(true));
			return () => w.cancelIdleCallback?.(id);
		}

		// Fallback: load after 1.2s.
		const id = w.setTimeout(() => setShouldLoad(true), 1200);
		return () => w.clearTimeout(id);
	}, [reduce]);

	// Set up IntersectionObserver to pause video when offscreen.
	useEffect(() => {
		const el = videoRef.current;
		if (!el || !shouldLoad) return;

		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				if (entry.isIntersecting) {
					void el.play().catch(() => undefined);
				} else {
					el.pause();
				}
			},
			{ threshold: 0.1 },
		);

		io.observe(el);
		return () => io.disconnect();
	}, [shouldLoad]);

	return {
		videoRef,
		shouldLoad,
		ready,
		onReady: () => setReady(true),
	};
}
