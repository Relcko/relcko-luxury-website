/**
 * useScrollLock — locks body scroll and pauses Lenis while an overlay is open.
 */
"use client";

import { useEffect } from "react";
import { useLenis } from "@/providers/lenis-provider";
import type Lenis from "lenis";

export function useScrollLock(locked: boolean): void {
	const lenis = useLenis() as Lenis | null;

	useEffect(() => {
		if (!locked) {
			return;
		}
		const { body } = document;
		const previousOverflow = body.style.overflow;
		body.style.overflow = "hidden";
		lenis?.stop();

		return () => {
			body.style.overflow = previousOverflow;
			lenis?.start();
		};
	}, [locked, lenis]);
}
