import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CTAHeading } from "./CTAHeading";
import { CTADescription } from "./CTADescription";
import { CTAActions } from "./CTAActions";
import type { FinalCTAData } from "@/lib/cta";

interface FinalCTAProps {
	data: FinalCTAData;
}

export function FinalCTA({ data }: FinalCTAProps) {
	return (
		<Section className="bg-bg-surface">
			<Container className="flex flex-col items-center gap-8 py-24">
				<CTAHeading eyebrow={data.eyebrow} heading={data.heading} />
				<CTADescription description={data.description} />
				<CTAActions
					primary={data.cta.primary}
					secondary={data.cta.secondary}
				/>
			</Container>
		</Section>
	);
}
