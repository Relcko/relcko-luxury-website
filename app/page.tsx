import { HeroAnimation } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"
import { GlobalImpact } from "@/components/sections/global-impact"

export default function HomePage() {
	return (
		<>
			<HeroAnimation nextSectionId="featured" />

			{/* Phase 06+ sections mount below this anchor. */}
			<section id="featured" aria-hidden="true" className="min-h-px" />
			<AboutSection id="about" />
			<OwnershipJourney id="ownership" />
			<PlatformAdvantages id="advantages" />
			<GlobalImpact id="impact" />
		</>
	)
}
