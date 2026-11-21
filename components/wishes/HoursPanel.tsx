"use client";

import { useMemo } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProgressBar } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { hoursByWeek } from "@/lib/planning/hours";
import { addDaysISO, fmt, isBetween, rangeDates, todayISO, weekStartISO } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { Planning, Staff, Wish } from "@/lib/types/planning";

type Draft = Pick<Wish, "leaves" | "absences">;

/** Décompte d'heures par semaine (réalisé + estimation sur le planning) et solde de congés en direct. */
export function HoursPanel({ person, planning, draft }: { person: Staff; planning: Planning; draft: Draft }) {
  const shifts = useDemoStore((s) => s.shifts);
  const today = todayISO();

  const past = useMemo(() => hoursByWeek(shifts, person.id, addDaysISO(weekStartISO(today), -21), addDaysISO(weekStartISO(today), 6)), [shifts, person.id, today]);

  const daily = person.contractedHours / 5;
  const planningWeeks = useMemo(() => {
    const weeks: { weekStart: string; hours: number; off: number }[] = [];
    for (let w = weekStartISO(planning.startDate); w <= planning.endDate; w = addDaysISO(w, 7)) {
      const days = rangeDates(w, addDaysISO(w, 6)).filter((d) => !d.isWeekend && isBetween(d.date, planning.startDate, planning.endDate));
      const off = days.filter((d) => [...draft.leaves, ...draft.absences].some((l) => isBetween(d.date, l.startDate, l.endDate))).length;
      weeks.push({ weekStart: w, hours: Math.max(0, Math.round((days.length - off) * daily)), off });
    }
    return weeks;
  }, [planning, draft, daily]);

  const requested = (type: "conges" | "rtt") =>
    draft.leaves
      .filter((l) => l.type === type)
      .reduce((sum, l) => sum + (l.endDate >= l.startDate ? rangeDates(l.startDate, l.endDate).filter((d) => !d.isWeekend).length : 0), 0);

  const max = Math.max(person.contractedHours + 12, ...past.map((w) => w.hours), ...planningWeeks.map((w) => w.hours));
  const Bar = ({ hours, label, estimate }: { hours: number; label: string; estimate?: boolean }) => (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <span className="text-[10px] tabular-nums text-on-surface-variant">{hours}h</span>
      <div className="w-full h-28 flex items-end rounded bg-white/[0.03] relative">
        <span className="absolute left-0 right-0 border-t border-dashed border-warning/50" style={{ bottom: `${(person.contractedHours / max) * 100}%` }} />
        <div
          className={cn("w-full rounded transition-all duration-500", estimate ? "bg-tertiary/40 border border-dashed border-tertiary/60" : hours > person.contractedHours ? "bg-warning/70" : "bg-primary/70")}
          style={{ height: `${(hours / max) * 100}%` }}
        />
      </div>
      <span className="text-[9px] text-on-surface-variant truncate w-full text-center">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <GlassPanel className="p-5">
        <h3 className="font-semibold flex items-center gap-2 mb-1">
          <Icon name="schedule" className="text-primary text-[20px]" /> Mon décompte d&apos;heures
        </h3>
        <p className="text-[12px] text-on-surface-variant mb-4">
          Contrat : {person.contractedHours} h / semaine <span className="inline-block w-3 border-t border-dashed border-warning align-middle ml-1" />
        </p>
        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2">4 dernières semaines</p>
        <div className="flex gap-2 mb-5">
          {past.map((w) => (
            <Bar key={w.weekStart} hours={w.hours} label={fmt(w.weekStart, "d MMM")} />
          ))}
        </div>
        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2">Estimation sur le planning</p>
        <div className="flex gap-2">
          {planningWeeks.map((w) => (
            <Bar key={w.weekStart} hours={w.hours} label={fmt(w.weekStart, "d MMM")} estimate />
          ))}
        </div>
        <p className="text-[11px] text-on-surface-variant mt-3">L&apos;estimation se met à jour avec vos congés et absences.</p>
      </GlassPanel>

      <GlassPanel className="p-5 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Icon name="beach_access" className="text-success text-[20px]" /> Congés possibles
        </h3>
        {(["conges", "rtt"] as const).map((t) => {
          const total = person.leaveBalance[t];
          const used = requested(t);
          const left = total - used;
          return (
            <div key={t}>
              <div className="flex justify-between text-body-sm mb-1.5">
                <span>{t === "conges" ? "Congés payés" : "RTT"}</span>
                <span className={cn("tabular-nums", left < 0 ? "text-error" : "text-on-surface")}>
                  {left} j restants <span className="text-on-surface-variant">/ {total}</span>
                </span>
              </div>
              <ProgressBar value={total ? (used / total) * 100 : used ? 100 : 0} tone={left < 0 ? "error" : "success"} />
              {used > 0 && <p className="text-[11px] text-on-surface-variant mt-1">{used} j demandés dans ce planning</p>}
            </div>
          );
        })}
      </GlassPanel>
    </div>
  );
}
