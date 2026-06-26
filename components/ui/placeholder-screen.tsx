import { Section } from "@/components/ui/section";
import { Stack } from "@/components/ui/stack";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface PlaceholderScreenProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Shared scaffold screen for Phase 01 placeholder routes. Keeps every route DRY
 * and visually consistent; real sections replace these in later phases.
 * Dogfoods the design system primitives.
 */
export function PlaceholderScreen({
  eyebrow,
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <Section spacing="lg" className="flex min-h-[70vh] items-center">
      <Stack gap="md" align="start">
        <Badge variant="outline">{eyebrow}</Badge>
        <Heading level={1} size="display">
          {title}
        </Heading>
        {description ? (
          <Text size="lg" className="max-w-xl">
            {description}
          </Text>
        ) : null}
      </Stack>
    </Section>
  );
}
