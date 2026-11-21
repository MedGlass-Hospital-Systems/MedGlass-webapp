"use client";

import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/layout/Icon";
import { ABSENCE_TYPES, SHIFT_LABELS, SHIFT_STYLES, isDoctor } from "@/lib/utils/labels";
import { addDaysISO, todayISO } from "@/lib/utils/dates";
import type { Conflict, Shift, Staff } from "@/lib/types/planning";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const pct = (min: number) => `${(min / 1440) * 100}%`;
const HOURS = Array.from({ length: 13 }, (_, i) => i * 2);

interface Segment {
  shift: Shift;
  from: number;
  to: number;
  continued: boolean;
}

function segmentsFor(shifts: Shift[], staffId: string, date: string): Segment[] {
  const prev = addDaysISO(date, -1);
  const segs: Segment[] = [];
  for (const s of shifts) {
    if (s.staffId !== staffId) continue;
    const overnight = toMin(s.endTime) <= toMin(s.startTime);
    if (s.date === date) {
      if (ABSENCE_TYPES.includes(s.type)) segs.push({ shift: s, from: 0, to: 1440, continued: false });
      else segs.push({ shift: s, from: toMin(s.startTime), to: overnight ? 1440 : toMin(s.endTime), continued: false });
    } else if (s.date === prev && overnight && !ABSENCE_TYPES.includes(s.type)) {
      segs.push({ shift: s, from: 0, to: toMin(s.endTime), continued: true });
    }
  }
  return segs;
}

/** Frise horaire 0 h → 24 h pour une journée, postes de nuit de la veille inclus. */
export function DayTimeline({
  staff,
  shifts,
  date,
  conflicts,
  highlightConflictId,
  highlightStaffId,
  onShiftClick,
  onConflictClick,
  onStaffClick,
}: {
  staff: Staff[];
  shifts: Shift[];
  date: string;
  conflicts: Conflict[];
  highlightConflictId?: string | null;
  highlightStaffId?: string;
  onShiftClick?: (s: Shift) => void;
  onConflictClick?: (c: Conflict) => void;
  onStaffClick?: (id: string) => void;
}) {
  const now = new Date();
  const nowMin = date === todayISO() ? now.getHours() * 60 + now.getMinutes() : null;
  const dayConflicts = conflicts.filter((c) => c.date === date);
  const rows = staff.map((p) => ({ p, segs: segmentsFor(shifts, p.id, date) }));
  const present = rows.filter((r) => r.segs.length);
  const off = rows.filter((r) => !r.segs.length);

  const Track = ({ children }: { children: React.ReactNode }) => (
    <div className="relative h-10 rounded-md bg-white/[0.02]">
      {HOURS.map((h) => (
        <span key={h} className="absolute top-0 bottom-0 w-px bg-white/5" style={{ left: pct(h * 60) }} />
      ))}
      {nowMin !== null && <span className="absolute top-0 bottom-0 w-0.5 bg-primary z-10" style={{ left: pct(nowMin) }} />}
      {children}
    </div>
  );

  return (
    <div className="overflow-auto scrollbar-thin">
      <div className="min-w-[860px] space-y-1">
        <div className="grid grid-cols-[200px_1fr] gap-3 mb-2">
          <div />
          <div className="relative h-5">
            {HOURS.map((h) => (
              <span key={h} className="absolute -translate-x-1/2 text-[10px] text-on-surface-variant tabular-nums" style={{ left: pct(h * 60) }}>
                {String(h).padStart(2, "0")}h
              </span>
            ))}
          </div>
        </div>

        {dayConflicts.length > 0 && (
          <div className="grid grid-cols-[200px_1fr] gap-3 items-center py-1 border-y border-error/20 bg-error/[0.03]">
            <div className="flex items-center gap-2 px-2 text-error">
              <Icon name="warning" className="text-[18px]" filled />
              <span className="font-label-caps text-[10px]">Besoins non couverts</span>
            </div>
            <Track>
              {dayConflicts.map((c) => {
                const from = toMin(c.slot.startTime);
                const end = toMin(c.slot.endTime);
                const to = end <= from ? 1440 : end;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onConflictClick?.(c)}
                    className={cn(
                      "absolute top-1 bottom-1 rounded-md border border-dashed text-[10px] px-2 truncate text-left",
                      c.status === "resolu" ? "border-success/50 bg-success/10 text-success" : "border-error/60 bg-error/15 text-error",
                      c.id === highlightConflictId && "ring-2 ring-error animate-pulse-ring",
                    )}
                    style={{ left: pct(from), width: pct(to - from) }}
                    title={c.reason}
                  >
                    {c.label}
                  </button>
                );
              })}
            </Track>
          </div>
        )}

        {[...present, ...off].map(({ p, segs }) => (
          <div
            key={p.id}
            className={cn("grid grid-cols-[200px_1fr] gap-3 items-center py-1", p.id === highlightStaffId && "bg-primary/[0.06] rounded-lg", !segs.length && "opacity-50")}
          >
            <button type="button" onClick={() => onStaffClick?.(p.id)} className="flex items-center gap-2 px-2 min-w-0 text-left hover:text-primary">
              <Avatar initials={p.initials} size="sm" />
              <span className="min-w-0">
                <span className="block text-body-sm font-semibold truncate">
                  {isDoctor(p.role) ? "Dr " : ""}
                  {p.firstName[0]}. {p.lastName}
                </span>
                <span className="block text-[10px] text-on-surface-variant truncate">{segs.length ? p.roleLabel : "Repos"}</span>
              </span>
            </button>
            <Track>
              {segs.map((s) => (
                <button
                  key={s.shift.id + (s.continued ? "-c" : "")}
                  type="button"
                  onClick={() => onShiftClick?.(s.shift)}
                  className={cn(
                    "absolute top-1 bottom-1 rounded-md border text-[10px] px-2 truncate text-left hover:brightness-125",
                    SHIFT_STYLES[s.shift.type],
                    s.continued && "border-l-0 rounded-l-none",
                  )}
                  style={{ left: pct(s.from), width: pct(s.to - s.from) }}
                  title={`${SHIFT_LABELS[s.shift.type]} ${s.shift.startTime}–${s.shift.endTime}`}
                >
                  {ABSENCE_TYPES.includes(s.shift.type)
                    ? SHIFT_LABELS[s.shift.type]
                    : `${SHIFT_LABELS[s.shift.type]} ${s.shift.startTime}–${s.shift.endTime}${s.continued ? " (veille)" : ""}`}
                </button>
              ))}
            </Track>
          </div>
        ))}
      </div>
    </div>
  );
}
