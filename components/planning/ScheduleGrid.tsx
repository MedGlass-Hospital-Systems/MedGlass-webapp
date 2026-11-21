"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/layout/Icon";
import { SEVERITY_ORDER, SHIFT_LABELS, SHIFT_SHORT, SHIFT_STYLES, isDoctor } from "@/lib/utils/labels";
import type { DayCell } from "@/lib/utils/dates";
import type { Conflict, Shift, Staff } from "@/lib/types/planning";

interface ScheduleGridProps {
  staff: Staff[];
  shifts: Shift[];
  days: DayCell[];
  conflicts: Conflict[];
  density: "week" | "month";
  highlightConflictId?: string | null;
  highlightStaffId?: string;
  onShiftClick?: (shift: Shift) => void;
  onConflictClick?: (conflict: Conflict) => void;
  onStaffClick?: (staffId: string) => void;
}

const conflictTone = (c: Conflict) =>
  c.status === "resolu"
    ? "border-success/40 bg-success/10 text-success"
    : c.severity === "critique"
      ? "border-error/60 bg-error/15 text-error"
      : c.severity === "elevee"
        ? "border-warning/60 bg-warning/10 text-warning"
        : "border-white/30 bg-white/5 text-on-surface-variant";

/** Grille collaborateurs × jours (vue semaine ou mois) avec ligne des besoins non couverts. */
export function ScheduleGrid({
  staff,
  shifts,
  days,
  conflicts,
  density,
  highlightConflictId,
  highlightStaffId,
  onShiftClick,
  onConflictClick,
  onStaffClick,
}: ScheduleGridProps) {
  const month = density === "month";
  const template = month ? `170px repeat(${days.length}, minmax(28px, 1fr))` : `minmax(190px, 2fr) repeat(${days.length}, minmax(0, 1fr))`;
  const highlighted = conflicts.find((c) => c.id === highlightConflictId);
  const highlightRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [highlightConflictId, days]);

  const byKey = new Map(shifts.map((s) => [`${s.staffId}|${s.date}`, s]));
  const colCls = (d: DayCell) =>
    cn(highlighted?.date === d.date && "bg-error/[0.07]", d.isToday && !highlighted && "bg-primary/[0.05]");

  return (
    <div className="overflow-auto scrollbar-thin">
      <div className={month ? "min-w-[1100px]" : "min-w-[860px]"}>
        {/* En-tête des jours */}
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: template }}>
          <div />
          {days.map((d) => (
            <div key={d.date} className={cn("text-center pb-2 rounded-t-md", d.isWeekend && "opacity-60", colCls(d))}>
              <p className={cn("font-label-caps text-primary", month ? "text-[9px]" : "text-label-caps")}>{month ? d.day[0] : d.day}</p>
              <p
                className={cn(
                  "text-on-surface mx-auto",
                  month ? "text-[11px]" : "text-sm",
                  d.isToday && "bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center font-bold",
                )}
              >
                {d.dayNum}
              </p>
            </div>
          ))}
        </div>

        {/* Besoins non couverts */}
        {conflicts.length > 0 && (
          <div className="grid gap-1 mb-2 items-center py-2 border-y border-error/20 bg-error/[0.03]" style={{ gridTemplateColumns: template }}>
            <div className="flex items-center gap-2 px-2 text-error">
              <Icon name="warning" className="text-[18px]" filled />
              <span className={cn("font-label-caps", month ? "text-[9px]" : "text-[10px]")}>Besoins non couverts</span>
            </div>
            {days.map((d) => {
              const dayConflicts = conflicts.filter((c) => c.date === d.date).sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
              return (
                <div key={d.date} className={cn("flex flex-col gap-1 min-h-[28px] justify-center", colCls(d))}>
                  {dayConflicts.map((c) => {
                    const isHl = c.id === highlightConflictId;
                    return (
                      <button
                        key={c.id}
                        ref={isHl ? highlightRef : undefined}
                        type="button"
                        onClick={() => onConflictClick?.(c)}
                        title={`${c.label} · ${c.reason}`}
                        className={cn(
                          "rounded-md border border-dashed text-center transition-transform hover:scale-[1.03]",
                          month ? "px-0 py-1 text-[9px]" : "px-1 py-1.5 text-[9px]",
                          conflictTone(c),
                          isHl && "ring-2 ring-error animate-pulse-ring",
                        )}
                      >
                        {month ? "!" : c.status === "resolu" ? "Couvert" : `${c.slot.startTime}–${c.slot.endTime}`}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Lignes collaborateurs */}
        {staff.map((person) => {
          const mine = person.id === highlightStaffId;
          return (
            <div
              key={person.id}
              className={cn("grid gap-1 items-center border-b border-white/5", month ? "py-1" : "py-2 mb-1", mine && "bg-primary/[0.06] rounded-lg")}
              style={{ gridTemplateColumns: template }}
            >
              <button
                type="button"
                onClick={() => onStaffClick?.(person.id)}
                className="flex items-center gap-3 px-2 text-left min-w-0 hover:text-primary"
              >
                {!month && <Avatar initials={person.initials} size="sm" />}
                <div className="min-w-0">
                  <p className={cn("font-semibold text-on-surface truncate", month ? "text-[12px]" : "text-body-sm")}>
                    {isDoctor(person.role) ? "Dr " : ""}
                    {person.firstName[0]}. {person.lastName}
                    {mine && <span className="text-primary"> (moi)</span>}
                  </p>
                  {!month && <p className="font-label-caps text-[10px] text-on-surface-variant truncate">{person.roleLabel}</p>}
                </div>
              </button>
              {days.map((d) => {
                const shift = byKey.get(`${person.id}|${d.date}`);
                if (!shift) return <div key={d.date} className={cn(month ? "h-7" : "h-9", "rounded-md", colCls(d))} />;
                return (
                  <button
                    type="button"
                    key={d.date}
                    onClick={() => onShiftClick?.(shift)}
                    className={cn(
                      "rounded-md text-center border shadow-sm hover:scale-[1.05] transition-transform focus-ring",
                      month ? "h-7 text-[10px] font-bold" : "px-1 py-1.5",
                      SHIFT_STYLES[shift.type],
                    )}
                    title={`${SHIFT_LABELS[shift.type]} · ${shift.startTime}–${shift.endTime}`}
                  >
                    {month ? (
                      SHIFT_SHORT[shift.type]
                    ) : (
                      <p className="font-label-caps text-[9px] leading-tight">
                        {shift.type === "conges" || shift.type === "rtt" || shift.type === "admin"
                          ? SHIFT_LABELS[shift.type]
                          : `${shift.startTime}–${shift.endTime}`}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
