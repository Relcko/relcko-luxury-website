/**
 * useFocusTrap — traps Tab focus inside a container, restores focus on close.
 */
"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
	ref: RefObject<HTMLElement | null>,
	active: boolean,
	onEscape?: () => void,
): void {
	useEffect(() => {
		if (!active) {
			return;
		}
		const node = ref.current;
		if (!node) {
			return;
		}

		const previous = document.activeElement as HTMLElement | null;
		const getItems = () =>
			Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(el) => el.offsetParent !== null,
			);

		getItems()[0]?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onEscape?.();
				return;
			}
			if (event.key !== "Tab") {
				return;
			}
			const items = getItems();
			const first = items[0];
			const last = items[items.length - 1];
			if (!first || !last) {
				return;
			}
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		node.addEventListener("keydown", onKeyDown);
		return () => {
			node.removeEventListener("keydown", onKeyDown);
			previous?.focus();
		};
	}, [ref, active, onEscape]);
}
