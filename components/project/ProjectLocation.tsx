"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ProjectLocation as ProjectLocationType } from "@/lib/project";
import { fadeVariants, revealVariants } from "@/lib/animation";
import { Container, Section, Heading, Text } from "@/components/ui";

export type ProjectLocationProps = {
  location: ProjectLocationType;
  className?: string;
};

const DESTINATION_CATEGORIES = [
  { label: "Airport", icon: "✈️", time: "25 min" },
  { label: "Metro", icon: "🚇", time: "5 min" },
  { label: "Downtown", icon: "🏙️", time: "15 min" },
  { label: "Dining", icon: "🍽️", time: "3 min" },
  { label: "Shopping", icon: "🛍️", time: "8 min" },
  { label: "Park", icon: "🌳", time: "10 min" },
] as const;

/**
 * ProjectLocation displays location details, connectivity information,
 * and a static map placeholder for the project.
 */
export function ProjectLocation({ location, className }: ProjectLocationProps) {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );

  const { address, city, state, country, postalCode } = location;
  const fullAddress = `${address}, ${city}, ${state} ${postalCode}, ${country}`;

  return (
    <Section className={className}>
      <Container>
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="text-center"
        >
          <Text
            as="span"
            className="mb-4 font-display-sans text-xs uppercase tracking-[0.24em] text-accent"
          >
            Location
          </Text>
          <Heading level={2} size="xl" className="max-w-[32ch]">
            Perfectly Positioned
          </Heading>
        </motion.div>
      </Container>

      <Container className="mt-12">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Address Card */}
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="rounded-2xl border border-border bg-bg-elevated p-8"
          >
            <Heading level={3} size="lg">
              Address
            </Heading>
            <address className="mt-4 not-italic">
              <p className="text-lg text-text-primary">{address}</p>
              <p className="text-text-secondary">
                {city}, {state} {postalCode}
              </p>
              <p className="text-text-secondary">{country}</p>
            </address>

            {location.coordinates && (
              <div className="mt-6 flex items-center gap-2 text-sm text-text-muted">
                <span className="font-mono">
                  {location.coordinates.lat.toFixed(4)}°N,{" "}
                  {location.coordinates.lng.toFixed(4)}°W
                </span>
              </div>
            )}
          </motion.div>

          {/* Connectivity */}
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="rounded-2xl border border-border bg-bg-elevated p-8"
          >
            <Heading level={3} size="lg">
              Connectivity
            </Heading>
            <ul className="mt-4 space-y-3">
              {DESTINATION_CATEGORIES.map((dest) => (
                <li key={dest.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDestination(
                        selectedDestination === dest.label ? null : dest.label
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                      selectedDestination === dest.label
                        ? "bg-accent/10 text-accent"
                        : "hover:bg-bg-base text-text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{dest.icon}</span>
                      <span>{dest.label}</span>
                    </span>
                    <span className="text-sm text-text-secondary">{dest.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>

      {/* Static Map Placeholder */}
      <Container className="mt-12">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-bg-elevated lg:aspect-[21/9]"
        >
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-base to-bg-elevated">
            <div className="text-center">
              <p className="mb-2 text-4xl">📍</p>
              <p className="font-display-sans text-lg font-medium text-text-primary">
                {fullAddress}
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Map integration available in Phase 08 (CMS)
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
