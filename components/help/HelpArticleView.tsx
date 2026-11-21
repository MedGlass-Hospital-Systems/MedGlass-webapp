import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { HelpImage } from "./HelpImage";
import { HELP_ARTICLES } from "@/lib/help";
import type { HelpArticle } from "@/lib/types/help";

export function HelpArticleView({ article }: { article: HelpArticle }) {
  const related = HELP_ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);
  const index = HELP_ARTICLES.findIndex((a) => a.slug === article.slug);
  const next = HELP_ARTICLES[index + 1];

  return (
    <>
      <Link href="/aide" className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline">
        <Icon name="arrow_back" className="text-[16px]" /> Tous les tutos
      </Link>

      <header className="flex flex-col md:flex-row md:items-center gap-5">
        <span className="w-16 h-16 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Icon name={article.icon} className="text-[32px]" />
        </span>
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge tone="primary">{article.category}</Badge>
            <Badge tone="neutral">
              {article.steps.length} étapes · {article.readingMinutes} min
            </Badge>
          </div>
          <h1 className="text-[28px] md:text-display-lg font-bold text-on-surface leading-tight">{article.title}</h1>
          <p className="text-on-surface-variant mt-1">{article.summary}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-9 space-y-6">
          {article.steps.map((step, i) => (
            <GlassPanel key={step.title} id={`etape-${i + 1}`} className="p-6 scroll-mt-24">
              <div className="flex items-start gap-4">
                <span className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <h2 className="text-[20px] font-semibold text-on-surface">{step.title}</h2>
                    <p className="text-on-surface-variant leading-relaxed mt-1">{step.body}</p>
                  </div>
                  {step.image && <HelpImage src={step.image} alt={`${article.title} — étape ${i + 1} : ${step.title}`} />}
                </div>
              </div>
            </GlassPanel>
          ))}
          {next && (
            <div className="flex justify-end">
              <Button href={`/aide/${next.slug}`} variant="secondary" icon="arrow_forward" iconPosition="right">
                Tuto suivant : {next.title}
              </Button>
            </div>
          )}
        </div>

        <aside className="xl:col-span-3 space-y-6">
          <GlassPanel className="p-5 xl:sticky xl:top-24">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-3">Dans ce tuto</p>
            <ol className="space-y-2">
              {article.steps.map((s, i) => (
                <li key={s.title}>
                  <a href={`#etape-${i + 1}`} className="flex gap-2 text-body-sm text-on-surface-variant hover:text-primary">
                    <span className="tabular-nums">{i + 1}.</span> {s.title}
                  </a>
                </li>
              ))}
            </ol>
            {related.length > 0 && (
              <>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-6 mb-3">À lire aussi</p>
                <ul className="space-y-2">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/aide/${a.slug}`} className="flex items-center gap-2 text-body-sm hover:text-primary">
                        <Icon name={a.icon} className="text-[16px] text-primary" /> {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </GlassPanel>
        </aside>
      </div>
    </>
  );
}
