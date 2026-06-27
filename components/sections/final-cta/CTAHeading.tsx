"use client";

import { Heading } from "@/components/ui/heading";

interface CTAHeadingProps {
	eyebrow: string;
	heading: string;
}

export function CTAHeading({ eyebrow, heading }: CTAHeadingProps) {
	return (
		<div className="text-center">
			<span className="mb-4 block font-mono text-sm uppercase tracking-widest text-text-muted">
				{eyebrow}
			</span>
<Heading as="h2" size="display" className="font-display max-w-[20ch] mx-auto">
				{heading}
			</Heading>
		</div>
	);
}
