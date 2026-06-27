"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { ProjectFeatures } from "@/lib/project";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Grid } from "@/components/ui/grid";
import { Surface } from "@/components/ui/surface";

/**
 * Amenities feature labels and icons
 */
const AMENITY_LABELS: Record<string, string> = {
  hasVirtualTour: "Virtual Tour",
  hasSmartHome: "Smart Home",
  hasInfinityPool: "Infinity Pool",
  hasConcierge: "Concierge",
  hasPrivateElevator: "Private Elevator",
  hasRooftopAccess: "Rooftop Access",
  hasWineCellar: "Wine Cellar",
  hasHomeTheater: "Home Theater",
  hasGym: "Private Gym",
  hasSpa: "Spa & Wellness",
  hasEVCharging: "EV Charging",
  hasHelipad: "Private Helipad",
};

/**
 * Get only the enabled amenities as an array
 */
function getEnabledAmenities(features: ProjectFeatures): string[] {
  return Object.entries(features)
    .filter(([, enabled]) => enabled === true)
    .map(([key]) => AMENITY_LABELS[key] ?? key)
    .filter(Boolean);
}

export type AmenitiesContentProps = {
  features: ProjectFeatures;
  className?: string;
};

/**
 * AmenitiesContent displays the project features/amenities as a grid of cards.
 * Uses the existing ProjectFeatures interface from lib/project.
 */
export function AmenitiesContent({ features, className }: AmenitiesContentProps) {
  const enabledAmenities = getEnabledAmenities(features);

  if (enabledAmenities.length === 0) {
    return null;
  }

  return (
    <section
      data-project="amenities"
      className={cn("py-24 lg:py-32", className)}
      aria-label="Project amenities"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <Heading level={2} size="lg" className="mb-4">
            World-Class Amenities
          </Heading>
          <Text className="text-lg text-text-muted">
            Experience luxury living with our carefully curated collection of
            premium amenities designed for the discerning resident.
          </Text>
        </div>

        <Grid cols={4} gap="md">
          {enabledAmenities.map((amenity, index) => (
            <motion.div
              key={amenity}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Surface className="flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <svg
                    className="h-5 w-5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <Text className="text-sm font-medium">{amenity}</Text>
              </Surface>
            </motion.div>
          ))}
        </Grid>
      </div>
    </section>
  );
}
