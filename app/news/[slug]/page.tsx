import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;
  return (
    <PlaceholderScreen
      eyebrow="Article"
      title={slug}
      description="News article placeholder."
    />
  );
}
