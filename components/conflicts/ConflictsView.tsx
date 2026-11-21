"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { EmptyState, PageHeader, PanelHeader } from "@/components/ui/Layout";
import { FilterPills } from "@/components/ui/Tabs";
import { QuickActions } from "@/components/ui/QuickActions";
import { ConflictItem } from "./ConflictItem";
import { ResolveConflictModal } from "./ResolveConflictModal";
import { RulesModal } from "@/components/rules/RulesModal";
import { CollaboratorModal } from "@/components/team/CollaboratorModal";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser } from "@/lib/store/hooks";
import { SEVERITY_ORDER } from "@/lib/utils/labels";
import type { Severity } from "@/lib/types/planning";

export function ConflictsView() {
  const user = useCurrentUser();
  const conflicts = useDemoStore((s) => s.conflicts);
  const [filter, setFilter] = useState<Severity | "tous" | "resolu">("tous");
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [modal, setModal] = useState<"rules" | "collaborator" | null>(null);

  const mine = useMemo(() => conflicts.filter((c) => c.service === user.service), [conflicts, user.service]);
  const list = mine
    .filter((c) => (filter === "resolu" ? c.status === "resolu" : c.status === "ouvert" && (filter === "tous" || c.severity === filter)))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.date.localeCompare(b.date));
  const open = mine.filter((c) => c.status === "ouvert");

  return (
    <>
      <PageHeader
        eyebrow="Couverture"
        title="Conflits & sous-effectifs"
        description="Créneaux sans personnel suffisant et règles non respectées. Résolvez-les en affectant un remplaçant ou via la bourse au poste."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-6">
          <PanelHeader title="Conflits de couverture" subtitle={`${open.length} ouvert(s)`} href="/planning" linkLabel="Voir le planning" />
          <FilterPills
            value={filter}
            onChange={setFilter}
            items={[
              { id: "tous", label: "Ouverts", count: open.length },
              { id: "critique", label: "Critiques", count: open.filter((c) => c.severity === "critique").length },
              { id: "elevee", label: "Élevés", count: open.filter((c) => c.severity === "elevee").length },
              { id: "moyenne", label: "Moyens", count: open.filter((c) => c.severity === "moyenne").length },
              { id: "resolu", label: "Résolus", count: mine.length - open.length },
            ]}
          />
          <div className="space-y-3 mt-4">
            {list.length ? (
              list.map((c) => (
                <ConflictItem key={c.id} conflict={c} onResolve={() => setResolveId(c.id)} showOnPlanningHref={`/planning?conflit=${c.id}`} />
              ))
            ) : (
              <EmptyState icon="verified" title="Aucun conflit" description="Rien à traiter pour ce filtre." />
            )}
          </div>
        </GlassPanel>

        <QuickActions
          className="h-fit"
          actions={[
            { icon: "swap_horizontal_circle", label: "Bourse au poste", href: "/recruitment?onglet=bourse" },
            { icon: "person_add", label: "Vacataire", onClick: () => setModal("collaborator") },
            { icon: "rule", label: "Règles", onClick: () => setModal("rules") },
            { icon: "calendar_month", label: "Planning", href: "/planning" },
          ]}
        />
      </div>

      <ResolveConflictModal conflictId={resolveId} onClose={() => setResolveId(null)} />
      <RulesModal open={modal === "rules"} onClose={() => setModal(null)} />
      <CollaboratorModal open={modal === "collaborator"} onClose={() => setModal(null)} />
    </>
  );
}
