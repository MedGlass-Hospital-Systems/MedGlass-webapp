"use client";

import { useMemo } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Layout";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useStaffMap } from "@/lib/store/hooks";
import { SHIFT_DOTS, SHIFT_LABELS, ABSENCE_TYPES } from "@/lib/utils/labels";
import { todayISO } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

/** Postes du jour pour un service, triés par heure de début ; absents en fin de liste. */
export function TodayShifts({ serviceId, limit = 8 }: { serviceId: string; limit?: number }) {
  const shifts = useDemoStore((s) => s.shifts);
  const staffMap = useStaffMap();
  const today = todayISO();
  const now = new Date();
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const list = useMemo(
    () =>
      shifts
        .filter((s) => s.date === today && s.service === serviceId)
        .sort((a, b) => {
          const aw = ABSENCE_TYPES.includes(a.type) ? 1 : 0;
          const bw = ABSENCE_TYPES.includes(b.type) ? 1 : 0;
          return aw - bw || a.startTime.localeCompare(b.startTime);
        }),
    [shifts, today, serviceId],
  );

  if (!list.length) return <EmptyState icon="event_available" title="Aucun poste aujourd'hui" />;

  return (
    <div className="space-y-2">
      {list.slice(0, limit).map((s) => {
        const person = staffMap.get(s.staffId);
        const absent = ABSENCE_TYPES.includes(s.type);
        const overnight = s.endTime <= s.startTime;
        const inProgress = !absent && s.startTime <= nowTime && (overnight || nowTime < s.endTime);
        return (
          <div key={s.id} className={cn("flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5", absent && "opacity-60")}>
            <span className={cn("w-1 h-9 rounded-full", SHIFT_DOTS[s.type])} />
            <Avatar initials={person?.initials ?? "?"} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold truncate">{fullName(person, true)}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{person?.roleLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-body-sm tabular-nums text-on-surface">{absent ? "—" : `${s.startTime} – ${s.endTime}`}</p>
              <p className="text-[11px] text-on-surface-variant">{SHIFT_LABELS[s.type]}</p>
            </div>
            {inProgress && <Badge tone="success">En poste</Badge>}
          </div>
        );
      })}
      {list.length > limit && (
        <p className="text-[11px] text-on-surface-variant text-center pt-1">+ {list.length - limit} autre(s) poste(s)</p>
      )}
    </div>
  );
}
