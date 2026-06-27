import { HeroAnimation } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { OwnershipJourney } from "@/components/sections/ownership"
import { PlatformAdvantages } from "@/components/sections/platform-advantages"
import { GlobalImpact } from "@/components/sections/global-impact"
import { VisionRoadmap } from "@/components/sections/vision-roadmap"
import { GalleryShowcase } from "@/components/sections/gallery-showcase"
import { FinalCTA } from "@/components/sections/final-cta"
import { Footer } from "@/components/navigation"
import { galleryShowcaseContent } from "@/lib/gallery-showcase"
import { finalCTAContent } from "@/lib/cta"

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
			<VisionRoadmap id="vision" />

			{/* Phase 06G — Gallery & Media Showcase */}
			<section id="gallery" aria-hidden="true" className="min-h-px" />
			<GalleryShowcase data={galleryShowcaseContent} />

			{/* Phase 06H — Final CTA + Footer */}
			<FinalCTA data={finalCTAContent} />
			<Footer />
		</>
	)
}
