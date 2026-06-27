"use client";

import { motion } from "framer-motion";
import type { ProjectPricing, OwnershipModel } from "@/lib/project";
import { fadeVariants, revealVariants } from "@/lib/animation";
import { Container, Section, Heading, Text, Button } from "@/components/ui";

export type ProjectInvestmentProps = {
  pricing: ProjectPricing;
  ownershipModel: OwnershipModel;
  className?: string;
};

const OWNERSHIP_LABELS: Record<OwnershipModel, string> = {
  freehold: "Freehold",
  leasehold: "Leasehold",
  "co-ownership": "Co-Ownership",
  strata: "Strata Title",
  fractional: "Fractional Ownership",
};

/**
 * Format price with currency symbol.
 */
function formatPrice(
  price: number,
  currency: string,
  priceUnit: "sqft" | "sqm" | "total"
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.replace("$", "USD"),
    maximumFractionDigits: 0,
  }).format(price);

  if (priceUnit === "total") {
    return formatted;
  }

  return `${formatted} per sq ${priceUnit === "sqft" ? "ft" : "m"}`;
}

/**
 * ProjectInvestment displays pricing, ownership model,
 * and investment inquiry CTA.
 */
export function ProjectInvestment({
  pricing,
  ownershipModel,
  className,
}: ProjectInvestmentProps) {
  const formattedPrice = formatPrice(
    pricing.startingPrice,
    pricing.currency,
    pricing.priceUnit
  );

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
            Investment
          </Text>
          <Heading level={2} size="xl" className="max-w-[32ch]">
            Exceptional Value
          </Heading>
        </motion.div>
      </Container>

      <Container className="mt-12">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-bg-elevated p-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Pricing */}
            <div>
              <Text className="mb-2 font-display-sans text-xs uppercase tracking-[0.24em] text-text-muted">
                Starting From
              </Text>
              <p className="font-display-sans text-3xl font-medium text-text-primary lg:text-4xl">
                {pricing.priceLabel || formattedPrice}
              </p>
            </div>

            {/* Ownership */}
            <div>
              <Text className="mb-2 font-display-sans text-xs uppercase tracking-[0.24em] text-text-muted">
                Ownership
              </Text>
              <p className="font-display-sans text-xl text-text-primary">
                {OWNERSHIP_LABELS[ownershipModel]}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <a href="/contact">Schedule Viewing</a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#inquiry">Request Pricing</a>
            </Button>
          </div>
        </motion.div>
      </Container>

      {/* Digital Ownership Benefits */}
      <Container className="mt-12">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-border bg-bg-elevated p-6 text-center">
            <p className="mb-3 text-2xl">🔒</p>
            <p className="font-display-sans text-sm font-medium text-text-primary">
              Secure Blockchain Title
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Digital property title secured on blockchain
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-elevated p-6 text-center">
            <p className="mb-3 text-2xl">🌐</p>
            <p className="font-display-sans text-sm font-medium text-text-primary">
              Global Accessibility
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Manage ownership from anywhere
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-elevated p-6 text-center">
            <p className="mb-3 text-2xl">📊</p>
            <p className="font-display-sans text-sm font-medium text-text-primary">
              Real-Time Analytics
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Track investment performance live
            </p>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
