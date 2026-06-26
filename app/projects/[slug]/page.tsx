import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

interface ProjectDetailPageProps {
  // Next 15: dynamic route params are async.
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  return (
    <PlaceholderScreen
      eyebrow="Project"
      title={slug}
      description="Project detail placeholder."
    />
  );
}
