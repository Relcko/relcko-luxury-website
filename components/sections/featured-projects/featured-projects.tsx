'use client';

import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Grid } from '@/components/ui/grid';
import { ProjectCard } from './project-card';
import { getFeaturedProjects } from '@/lib/projects';
import type { Project } from '@/lib/project';

export interface FeaturedProjectsProps {
  projects?: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const displayProjects = projects || getFeaturedProjects();

  return (
    <Section className="bg-bg-base py-24 md:py-32">
      <Container>
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <Text size="sm" className="text-accent-gold uppercase tracking-widest mb-2">
            Portfolio
          </Text>
          <Heading level={2} className="mb-4">
            Featured Projects
          </Heading>
          <Text size="lg" className="text-opacity-medium max-w-2xl">
            Discover our curated collection of exceptional properties,
            each representing the pinnacle of luxury living.
          </Text>
        </div>

        {/* Projects Grid */}
        <Grid cols={3} gap="lg">
          {displayProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 2}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
