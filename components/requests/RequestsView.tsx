"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { EmptyState, PageHeader } from "@/components/ui/Layout";
import { FilterPills, Tabs } from "@/components/ui/Tabs";
import { LeaveRow, SwapRow } from "./RequestRows";
import { LeaveModal } from "./LeaveModal";
import { SwapModal } from "./SwapModal";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, usePermissions, useStaffMap } from "@/lib/store/hooks";

type Status = "tous" | "en-attente" | "traite";

export function RequestsView() {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const staffMap = useStaffMap();
  const leaves = useDemoStore((s) => s.leaves);
  const swaps = useDemoStore((s) => s.swaps);
  const [tab, setTab] = useState<"conges" | "echanges">("conges");
  const [status, setStatus] = useState<Status>("en-attente");
  const [modal, setModal] = useState<"leave" | "swap" | null>(null);

  const visibleLeaves = useMemo(
    () =>
      leaves
        .filter((l) => (isManager ? staffMap.get(l.staffId)?.service === user.service : l.staffId === user.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [leaves, isManager, staffMap, user],
  );
  const visibleSwaps = useMemo(
    () =>
      swaps
        .filter((s) =>
          isManager ? staffMap.get(s.fromStaffId)?.service === user.service : s.fromStaffId === user.id || s.toStaffId === user.id,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [swaps, isManager, staffMap, user],
  );

  const byStatus = <T extends { status: string }>(list: T[]) =>
    list.filter((x) => status === "tous" || (status === "en-attente" ? x.status === "en-attente" : x.status !== "en-attente"));

  const leavesShown = byStatus(visibleLeaves);
  const swapsShown = byStatus(visibleSwaps);

  return (
    <>
      <PageHeader
        eyebrow={isManager ? "Équipe" : "Mes demandes"}
        title="Demandes"
        description={
          isManager
            ? "Validez les absences et suivez les échanges de postes de votre service."
            : "Suivez vos demandes d'absence et répondez aux propositions d'échange."
        }
        actions={
          <>
            <Button variant="secondary" icon="swap_horiz" onClick={() => setModal("swap")}>
              Échanger un poste
            </Button>
            <Button icon="edit_calendar" onClick={() => setModal("leave")}>
              Poser une absence
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: "conges", label: "Absences", icon: "beach_access", count: visibleLeaves.filter((l) => l.status === "en-attente").length },
            { id: "echanges", label: "Échanges", icon: "swap_horiz", count: visibleSwaps.filter((s) => s.status === "en-attente").length },
          ]}
        />
        <FilterPills
          value={status}
          onChange={setStatus}
          items={[
            { id: "en-attente", label: "En attente" },
            { id: "traite", label: "Traitées" },
            { id: "tous", label: "Toutes" },
          ]}
        />
      </div>

      <GlassPanel className="p-4 md:p-6 space-y-2">
        {tab === "conges" &&
          (leavesShown.length ? (
            leavesShown.map((l) => <LeaveRow key={l.id} leave={l} canDecide={isManager} />)
          ) : (
            <EmptyState icon="beach_access" title="Aucune demande d'absence" description="Rien à afficher pour ce filtre." />
          ))}
        {tab === "echanges" &&
          (swapsShown.length ? (
            swapsShown.map((s) => <SwapRow key={s.id} swap={s} canDecide={isManager || s.toStaffId === user.id} />)
          ) : (
            <EmptyState icon="swap_horiz" title="Aucun échange" description="Rien à afficher pour ce filtre." />
          ))}
      </GlassPanel>

      <LeaveModal open={modal === "leave"} onClose={() => setModal(null)} />
      <SwapModal open={modal === "swap"} onClose={() => setModal(null)} />
    </>
  );
}
