"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ProgressBar } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useStaffMap } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { PLANNING_STATUS_LABELS, PLANNING_STATUS_ORDER, PLANNING_STATUS_TONES } from "@/lib/utils/labels";
import { fmt, fmtRange } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { Planning } from "@/lib/types/planning";

const STEP_ICONS = ["edit_note", "favorite", "auto_fix", "fact_check", "publish"];

/** Suivi de l'état de création de chaque planning (brouillon → publié). */
export function PlanningsBoard({ onShow }: { onShow: (p: Planning) => void }) {
  const plannings = useDemoStore((s) => s.plannings);
  const services = useDemoStore((s) => s.services);
  const wishes = useDemoStore((s) => s.wishes);
  const remove = useDemoStore((s) => s.deletePlanning);
  const staffMap = useStaffMap();

  const sorted = [...plannings].sort(
    (a, b) => Number(a.status === "publie") - Number(b.status === "publie") || b.createdAt.localeCompare(a.createdAt),
  );

  if (!sorted.length) {
    return (
      <GlassPanel>
        <EmptyState icon="calendar_add_on" title="Aucun planning" action={<Button href="/wizard?nouveau=1" icon="add">Nouveau planning</Button>} />
      </GlassPanel>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {sorted.map((p) => {
        const idx = PLANNING_STATUS_ORDER.indexOf(p.status);
        const received = wishes.filter((w) => w.planningId === p.id).length;
        const expected = p.requestedStaffIds.length;
        return (
          <GlassPanel key={p.id} className="p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-on-surface">{p.name}</h3>
                <p className="text-body-sm text-on-surface-variant">
                  {services.find((s) => s.id === p.serviceId)?.name} · {fmtRange(p.startDate, p.endDate)}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Créé par {fullName(staffMap.get(p.createdBy))} le {fmt(p.createdAt, "d MMM")}
                </p>
              </div>
              <Badge tone={PLANNING_STATUS_TONES[p.status]}>{PLANNING_STATUS_LABELS[p.status]}</Badge>
            </div>

            <ol className="grid grid-cols-5 gap-2">
              {PLANNING_STATUS_ORDER.map((st, i) => (
                <li key={st} className="flex flex-col items-center gap-1.5 text-center">
                  <span
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center border",
                      i < idx || p.status === "publie"
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : i === idx
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-white/5 border-white/10 text-on-surface-variant",
                    )}
                  >
                    <Icon name={i < idx || p.status === "publie" ? "check" : STEP_ICONS[i]} className="text-[18px]" />
                  </span>
                  <span className="text-[10px] leading-tight text-on-surface-variant">{PLANNING_STATUS_LABELS[st]}</span>
                </li>
              ))}
            </ol>

            {p.status === "collecte" && (
              <div>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="text-on-surface-variant">Souhaits reçus</span>
                  <span className="tabular-nums text-on-surface">
                    {received} / {expected}
                    {p.wishesDeadline ? ` · avant le ${fmt(p.wishesDeadline, "d MMM")}` : ""}
                  </span>
                </div>
                <ProgressBar value={expected ? (received / expected) * 100 : 0} tone={received === expected ? "success" : "warning"} />
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-end mt-auto">
              {p.status === "brouillon" && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="delete"
                  onClick={() => {
                    remove(p.id);
                    toast("Brouillon supprimé");
                  }}
                >
                  Supprimer
                </Button>
              )}
              {(p.status === "publie" || p.status === "revision") && (
                <Button size="sm" variant="secondary" icon="visibility" onClick={() => onShow(p)}>
                  Voir sur la grille
                </Button>
              )}
              {p.status !== "publie" && (
                <Button size="sm" href={`/wizard?planning=${p.id}`} icon="arrow_forward" iconPosition="right">
                  Continuer
                </Button>
              )}
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
}
