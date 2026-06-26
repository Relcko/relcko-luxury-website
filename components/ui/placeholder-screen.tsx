import { Container } from "@/components/layout/container";

interface PlaceholderScreenProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Shared scaffold screen for Phase 01 placeholder routes. Keeps every route DRY
 * and visually consistent; real sections replace these in later phases.
 */
export function PlaceholderScreen({
  eyebrow,
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-32">
      <p className="text-sm uppercase tracking-[0.3em] text-accent-gold">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 max-w-xl text-lg text-text-muted">{description}</p>
      ) : null}
    </Container>
  );
}
