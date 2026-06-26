import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return <PlaceholderScreen eyebrow="Journal" title="News" />;
}
