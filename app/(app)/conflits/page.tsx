import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { api } from "@/lib/api/client";

export default async function ConflitsNotifications() {
  const gaps = await api.planning.gaps("chir-gen"); 

  return (
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-display-lg text-on-surface">Conflits et Notifications</h1>
        </div>
      </header>

      <div className="flex">
        <section className="w-full">
        {/* Conflicts */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <div>
              <h2 className="font-headline-md text-headline-md">Conflits & couvertures</h2>
              <p className="text-body-sm text-on-surface-variant">
                Sous-effectifs et règles non respectées
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {gaps.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    g.severity === "critique"
                      ? "bg-error/20 text-error"
                      : g.severity === "elevee"
                      ? "bg-warning/15 text-warning"
                      : "bg-white/5 text-on-surface-variant"
                  }`}
                >
                  <Icon name="warning" filled={g.severity === "critique"} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface">{g.shift}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    {new Date(g.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} · {g.reason}
                  </p>
                </div>
                <Badge
                  tone={g.severity === "critique" ? "error" : g.severity === "elevee" ? "warning" : "neutral"}
                >
                  {g.severity}
                </Badge>
                <Button href={`/planning?gap=${g.id}`} variant="secondary" size="sm">
                  Résoudre
                </Button>
              </div>
            ))}
          </div>
        </GlassPanel>

        </section>

        {/* Team + quick actions */}
        <section className="mx-5 lg:min-w-52">

        <GlassPanel className="p-6 bg-gradient-to-br from-background/70 to-primary/10 border-primary/20">
          <h2 className="font-label-caps text-label-caps text-primary mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { i: "swap_horiz", t: "Échange", h: "/planning?action=swap" },
              { i: "edit_calendar", t: "Congé", h: "/planning?action=leave" },
              { i: "person_add", t: "Vacataire", h: "/recruitment" },
              { i: "rule", t: "Règles", h: "/settings" },
            ].map((a) => (
              <Link
                key={a.t}
                href={a.h}
                className="glass-button rounded-lg p-3 text-left hover:bg-white/10 transition-all"
              >
                <Icon name={a.i} className="text-primary mb-1 text-[20px]" />
                <p className="text-body-sm text-on-surface">{a.t}</p>
              </Link>
            ))}
          </div>
        </GlassPanel>
        </section>
      </div>

    </>
  );
}
