/**
 * Portal — renders overlays to document.body so they escape transformed containers.
 */
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export function Portal({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => {
			setMounted(false);
		};
	}, []);

	if (!mounted) {
		return null;
	}
	return createPortal(children, document.body);
}
