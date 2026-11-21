import { notFound } from "next/navigation";
import { HelpArticleView } from "@/components/help/HelpArticleView";
import { HELP_ARTICLES, getHelpArticle } from "@/lib/help";

/** Export statique : une page HTML par article de /data/mocks/help.json */
export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getHelpArticle(params.slug);
  return { title: article ? `${article.title} · Aide MedGlass` : "Aide · MedGlass" };
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = getHelpArticle(params.slug);
  if (!article) notFound();
  return <HelpArticleView article={article} />;
}
