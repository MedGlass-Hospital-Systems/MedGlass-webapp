export interface HelpStep {
  title: string;
  body: string;
  /** Chemin dans /public, ex. "/help/planning-vues.png" */
  image?: string;
}

export interface HelpArticle {
  slug: string;
  category: string;
  title: string;
  summary: string;
  icon: string;
  readingMinutes: number;
  audience: "tous" | "manager" | "soignant";
  steps: HelpStep[];
}
