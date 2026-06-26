import { HeroAnimation } from "@/components/sections/hero";

export default function HomePage() {
	return (
		<>
			<HeroAnimation nextSectionId="featured" />

			{/* Phase 06+ sections mount below this anchor. */}
			<section id="featured" aria-hidden="true" className="min-h-px" />
		</>
	);
}
