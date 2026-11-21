"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { ScheduleGrid } from "@/components/planning/ScheduleGrid";
import { ExportMenu } from "@/components/planning/ExportMenu";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { computeStats } from "@/lib/planning/generator";
import { addDaysISO, fmtRange, rangeDates } from "@/lib/utils/dates";
import type { Planning } from "@/lib/types/planning";

export function StepReview({ planning, onRegenerate }: { planning: Planning; onRegenerate: () => void }) {
  const user = useCurrentUser();
  const staff = useDemoStore((s) => s.staff);
  const allShifts = useDemoStore((s) => s.shifts);
  const rules = useDemoStore((s) => s.rules);
  const services = useDemoStore((s) => s.services);
  const publish = useDemoStore((s) => s.publishPlanning);
  const [weekOffset, setWeekOffset] = useState(0);

  const team = useMemo(() => staff.filter((s) => s.service === planning.serviceId && s.contract !== "prestataire"), [staff, planning.serviceId]);
  const shifts = useMemo(() => allShifts.filter((s) => s.planningId === planning.id), [allShifts, planning.id]);
  const stats = useMemo(() => computeStats(shifts, team, planning), [shifts, team, planning]);
  const published = planning.status === "publie";
  const activeRules = rules.filter((r) => planning.ruleIds.includes(r.id) && r.enabled);

  const weekStart = addDaysISO(planning.startDate, weekOffset * 7);
  const weekEnd = [addDaysISO(weekStart, 6), planning.endDate].sort()[0];
  const maxOffset = Math.floor((rangeDates(planning.startDate, planning.endDate).length - 1) / 7);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div>
          <Badge tone={published ? "success" : "primary"} className="mb-3">
            <Icon name={published ? "check_circle" : "fact_check"} className="text-[14px]" filled />
            {published ? "Planning publié" : "Planning généré — en révision"}
          </Badge>
          <h2 className="text-headline-md font-headline-md mb-1">Aperçu du planning</h2>
          <p className="text-on-surface-variant">
            {services.find((s) => s.id === planning.serviceId)?.name} · {fmtRange(planning.startDate, planning.endDate)} · {stats.staffCount} soignants ·{" "}
            {stats.shiftCount} postes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!published && (
            <Button variant="secondary" size="sm" icon="refresh" onClick={onRegenerate}>
              Régénérer
            </Button>
          )}
          <ExportMenu
            shifts={shifts}
            team={team}
            start={planning.startDate}
            end={planning.endDate}
            serviceName={services.find((s) => s.id === planning.serviceId)?.name ?? ""}
            myId={user.id}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Heures planifiées", v: `${stats.plannedHours}h` },
          { l: "Heures sup.", v: `${stats.overtimeHours}h` },
          { l: "Couverture jour + nuit", v: `${stats.coverage}%` },
          { l: "Équité des gardes", v: `${stats.equity}%` },
        ].map((s) => (
          <div key={s.l} className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <p className="text-body-sm text-on-surface-variant">{s.l}</p>
            <p className="text-2xl font-bold text-on-surface mt-1 tabular-nums">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 p-3 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="font-semibold text-body-sm">Semaine du {fmtRange(weekStart, weekEnd)}</p>
          <div className="flex gap-1">
            <button type="button" aria-label="Semaine précédente" disabled={weekOffset === 0} onClick={() => setWeekOffset((w) => w - 1)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            <button type="button" aria-label="Semaine suivante" disabled={weekOffset >= maxOffset} onClick={() => setWeekOffset((w) => w + 1)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
        <ScheduleGrid staff={team} shifts={shifts} days={rangeDates(weekStart, weekEnd)} conflicts={[]} density="week" />
      </div>

      <div className={`p-4 rounded-lg flex items-start gap-3 mb-6 ${published ? "bg-success/10 border border-success/20" : "bg-primary/10 border border-primary/20"}`}>
        <Icon name="verified" className={`text-[24px] mt-0.5 ${published ? "text-success" : "text-primary"}`} filled />
        <div>
          <p className={`font-semibold ${published ? "text-success" : "text-primary"}`}>
            {activeRules.length} règle(s) RH appliquée(s) · {stats.wishesApplied} souhait(s) pris en compte
          </p>
          <p className="text-body-sm text-on-surface-variant">
            {published
              ? "Les soignants ont reçu une notification et peuvent demander des échanges."
              : "Une fois publié, les soignants reçoivent une notification et peuvent demander des échanges."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {published ? (
          <Button href={`/planning?date=${planning.startDate}`} icon="calendar_month">
            Voir dans le planning
          </Button>
        ) : (
          <Button
            icon="publish"
            onClick={() => {
              publish(planning.id);
              toast("Planning publié — l'équipe est notifiée");
            }}
          >
            Publier le planning
          </Button>
        )}
      </div>
    </div>
  );
}
