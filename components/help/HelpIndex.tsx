"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, PageHeader, SearchInput } from "@/components/ui/Layout";
import { FilterPills } from "@/components/ui/Tabs";
import { Icon } from "@/components/layout/Icon";
import { HELP_ARTICLES, HELP_CATEGORIES } from "@/lib/help";
import { useDemoStore } from "@/lib/store/demoStore";
import { usePermissions } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";

const AUDIENCE = { tous: "Tout le monde", manager: "Managers", soignant: "Collaborateurs" } as const;

export function HelpIndex() {
  const { isManager } = usePermissions();
  const setTutorialSeen = useDemoStore((s) => s.setTutorialSeen);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("toutes");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return HELP_ARTICLES.filter((a) => cat === "toutes" || a.category === cat).filter(
      (a) => !needle || `${a.title} ${a.summary} ${a.steps.map((s) => `${s.title} ${s.body}`).join(" ")}`.toLowerCase().includes(needle),
    );
  }, [q, cat]);

  const featured = HELP_ARTICLES.filter((a) => (isManager ? a.audience !== "soignant" : a.audience !== "manager")).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Centre d'aide"
        title="Tutos & aide"
        description="Des guides pas à pas, avec captures d'écran, pour prendre en main chaque fonctionnalité."
        actions={
          <Button
            variant="secondary"
            icon="school"
            onClick={() => {
              setTutorialSeen("welcome", false);
              setTutorialSeen("generation", false);
              toast("Les tutoriels interactifs seront réaffichés");
            }}
          >
            Relancer les tutoriels interactifs
          </Button>
        }
      />

      <GlassPanel className="p-6 bg-gradient-to-br from-background/70 to-primary/10 border-primary/20">
        <p className="font-label-caps text-label-caps text-primary mb-4">Pour bien démarrer</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((a) => (
            <Link key={a.slug} href={`/aide/${a.slug}`} className="glass-button rounded-lg p-4 hover:bg-white/10 transition-colors flex gap-3">
              <Icon name={a.icon} className="text-primary text-[24px]" />
              <span>
                <span className="block font-semibold text-on-surface">{a.title}</span>
                <span className="block text-[12px] text-on-surface-variant">{a.readingMinutes} min de lecture</span>
              </span>
            </Link>
          ))}
        </div>
      </GlassPanel>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
        <FilterPills
          value={cat}
          onChange={setCat}
          items={[{ id: "toutes", label: "Toutes", count: HELP_ARTICLES.length }, ...HELP_CATEGORIES.map((c) => ({ id: c, label: c, count: HELP_ARTICLES.filter((a) => a.category === c).length }))]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="Rechercher dans l'aide…" className="lg:w-80" />
      </div>

      {list.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((a) => (
            <Link key={a.slug} href={`/aide/${a.slug}`} className="glass-panel rounded-xl p-6 flex flex-col gap-3 hover:border-white/20 hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between">
                <span className="w-11 h-11 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Icon name={a.icon} className="text-[22px]" />
                </span>
                <Badge tone="neutral">{a.category}</Badge>
              </div>
              <h2 className="text-lg font-semibold text-on-surface leading-snug">{a.title}</h2>
              <p className="text-body-sm text-on-surface-variant flex-1">{a.summary}</p>
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant pt-3 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Icon name="format_list_numbered" className="text-[14px]" /> {a.steps.length} étapes · {a.readingMinutes} min
                </span>
                <span>{AUDIENCE[a.audience]}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <GlassPanel>
          <EmptyState icon="search_off" title="Aucun article trouvé" description="Essayez un autre mot-clé." />
        </GlassPanel>
      )}
    </>
  );
}
