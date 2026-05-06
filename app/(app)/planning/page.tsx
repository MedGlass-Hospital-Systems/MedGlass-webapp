import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { ScheduleGrid } from "@/components/planning/ScheduleGrid";
import { api } from "@/lib/api/client";
import { getWeekDates, formatWeekRange, getISOWeek } from "@/lib/utils/dates";

export default async function PlanningPage() {
  const me = await api.auth.me();
  const services = await api.services.list();
  const teamStaff = await api.staff.byService(me.service);
  const shifts = await api.planning.weekShifts(me.service, "2026-05-04");
  const gaps = await api.planning.gaps(me.service);

  const weekStart = new Date("2026-05-04");
  const weekDates = getWeekDates(weekStart);
  const weekNum = getISOWeek(weekStart);

  return (
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-lg text-on-surface mb-1">Planning</h1>
          <p className="text-on-surface-variant">
            Gérez les rotations, gardes et affectations de votre service.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              defaultValue={me.service}
              className="appearance-none glass-button rounded-full pl-6 pr-10 py-2.5 font-label-caps text-label-caps text-primary cursor-pointer outline-none focus:ring-2 focus:ring-primary/50"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id} className="bg-background">
                  {s.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-[20px]">
              expand_more
            </span>
          </div>
          <Button variant="secondary" icon="calendar_today">
            {formatWeekRange(weekStart)}
          </Button>
          <Button icon="auto_fix" href="/wizard">
            Générer
          </Button>
        </div>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-2">
        <span className="text-body-sm text-on-surface-variant">Légende :</span>
        {[
          { c: "bg-primary/30 border-primary/40", l: "Jour" },
          { c: "bg-tertiary/30 border-tertiary/40", l: "Nuit" },
          { c: "bg-error/30 border-error/40", l: "Garde" },
          { c: "bg-warning/30 border-warning/40", l: "Astreinte" },
          { c: "bg-success/30 border-success/40", l: "Congés" },
          { c: "bg-secondary/30 border-secondary/40", l: "Formation" },
        ].map((it) => (
          <span key={it.l} className="flex items-center gap-2 text-body-sm">
            <span className={`w-3 h-3 rounded border ${it.c}`} />
            {it.l}
          </span>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planning grid */}
        <GlassPanel className="lg:col-span-9 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-background/40 flex justify-between items-center sticky top-0 z-10">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Roulement — Semaine {weekNum}
            </h3>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-on-surface-variant">
                <Icon name="chevron_left" className="text-[18px]" />
              </button>
              <span className="font-label-caps text-label-caps text-on-surface-variant px-2">
                Semaine {weekNum}
              </span>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-on-surface-variant">
                <Icon name="chevron_right" className="text-[18px]" />
              </button>
              <button className="ml-2 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-on-surface-variant">
                <Icon name="download" className="text-[18px]" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <ScheduleGrid staff={teamStaff} shifts={shifts} weekDates={weekDates} />
          </div>
        </GlassPanel>

        {/* Sidebar conflicts + actions */}
        <div className="lg:col-span-3 space-y-6">
          <GlassPanel className="p-5">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
              <h3 className="font-semibold text-on-surface">Conflits</h3>
              <Badge tone="error">{gaps.length}</Badge>
            </div>
            <div className="space-y-3">
              {gaps.map((g) => (
                <div key={g.id} className="p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="flex items-start gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full mt-2 ${
                        g.severity === "critique" ? "bg-error" : g.severity === "elevee" ? "bg-warning" : "bg-white/30"
                      }`}
                    />
                    <div>
                      <p className="text-body-sm font-semibold">{g.shift}</p>
                      <p className="text-[11px] text-on-surface-variant">
                        {new Date(g.date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">{g.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5 bg-gradient-to-br from-background/70 to-primary/10 border-primary/20">
            <h3 className="font-label-caps text-label-caps text-primary mb-3">Actions</h3>
            <div className="space-y-2">
              {[
                { i: "swap_horiz", t: "Échanger une garde" },
                { i: "edit_calendar", t: "Saisir un congé" },
                { i: "person_add", t: "Ajouter un vacataire" },
                { i: "share", t: "Publier le planning" },
              ].map((a) => (
                <button
                  key={a.t}
                  className="w-full glass-button rounded-lg p-3 text-left hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  <Icon name={a.i} className="text-primary text-[20px]" />
                  <span className="text-body-sm">{a.t}</span>
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>
    </>
  );
}
