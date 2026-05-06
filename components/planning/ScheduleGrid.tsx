import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import type { Shift, Staff } from "@/lib/types/planning";

interface ScheduleGridProps {
  staff: Staff[];
  shifts: Shift[];
  weekDates: { date: string; day: string; dayNum: string; isWeekend: boolean }[];
}

const shiftStyles: Record<string, string> = {
  jour: "bg-primary/20 border-primary/30 text-primary",
  nuit: "bg-tertiary/20 border-tertiary/30 text-tertiary",
  garde: "bg-error/20 border-error/30 text-error",
  astreinte: "bg-warning/15 border-warning/30 text-warning",
  admin: "bg-white/5 border-white/10 text-on-surface-variant",
  conges: "bg-success/15 border-success/30 text-success",
  rtt: "bg-success/15 border-success/30 text-success",
  formation: "bg-secondary/15 border-secondary/30 text-secondary",
};

const shiftLabels: Record<string, string> = {
  jour: "Jour",
  nuit: "Nuit",
  garde: "Garde",
  astreinte: "Astreinte",
  admin: "Admin",
  conges: "Congés",
  rtt: "RTT",
  formation: "Formation",
};

export function ScheduleGrid({ staff, shifts, weekDates }: ScheduleGridProps) {
  const totalCols = weekDates.length + 2;

  return (
    <div className="overflow-auto">
      <div className="min-w-[860px]">
        <div
          className="grid gap-1 mb-3"
          style={{ gridTemplateColumns: `2fr repeat(${weekDates.length}, 1fr)` }}
        >
          <div className="px-2" />
          {weekDates.map((d) => (
            <div
              key={d.date}
              className={cn("text-center pb-2", d.isWeekend && "opacity-50")}
            >
              <p className="font-label-caps text-label-caps text-primary">{d.day}</p>
              <p className="text-on-surface text-sm">{d.dayNum}</p>
            </div>
          ))}
        </div>

        {staff.map((person) => {
          const personShifts = shifts.filter((s) => s.staffId === person.id);
          return (
            <div
              key={person.id}
              className="grid gap-1 mb-2 items-center py-2 border-b border-white/5"
              style={{ gridTemplateColumns: `2fr repeat(${weekDates.length}, 1fr)` }}
            >
              <div className="flex items-center gap-3 px-2">
                <Avatar initials={person.initials} size="sm" />
                <div className="min-w-0">
                  <p className="font-semibold text-body-sm text-on-surface truncate">
                    {person.role === "praticien" || person.role === "interne" ? "Dr. " : ""}
                    {person.firstName[0]}. {person.lastName}
                  </p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant truncate">
                    {person.roleLabel}
                  </p>
                </div>
              </div>
              {weekDates.map((d) => {
                const shift = personShifts.find((s) => s.date === d.date);
                if (!shift) return <div key={d.date} className="h-9" />;
                return (
                  <div
                    key={d.date}
                    className={cn(
                      "rounded-md px-1 py-1.5 text-center border shadow-sm cursor-pointer hover:scale-[1.03] transition-transform",
                      shiftStyles[shift.type],
                    )}
                    title={`${shiftLabels[shift.type]} · ${shift.startTime}-${shift.endTime}`}
                  >
                    <p className="font-label-caps text-[9px] leading-tight">
                      {shift.type === "conges" || shift.type === "rtt"
                        ? shiftLabels[shift.type]
                        : shift.type === "admin"
                        ? "Admin"
                        : `${shift.startTime}–${shift.endTime}`}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
