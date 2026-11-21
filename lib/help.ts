import helpJson from "@/data/mocks/help.json";
import type { HelpArticle } from "@/lib/types/help";

export const HELP_ARTICLES = helpJson as HelpArticle[];
export const HELP_CATEGORIES = [...new Set(HELP_ARTICLES.map((a) => a.category))];
export const getHelpArticle = (slug: string) => HELP_ARTICLES.find((a) => a.slug === slug);
