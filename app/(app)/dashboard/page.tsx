import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { api } from "@/lib/api/client";
import WelcomeModal from "@/components/modals/WelcomeModal";

export default async function DashboardPage() {
  const me = await api.auth.me();
  const gaps = await api.planning.gaps("chir-gen");
  const leaves = await api.leaves.list();
  const teamStaff = await api.staff.byService("chir-gen");



  return (
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
            Bonjour, {me.firstName}
          </p>
          <h1 className="text-display-lg text-on-surface">Vue d'ensemble</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/planning" variant="secondary" icon="calendar_month">
            Voir le planning
          </Button>
          <Button href="/wizard" icon="auto_fix">
            Lancer l'assistant
          </Button>
        </div>
      </header>
      <WelcomeModal 

        />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Shifts actifs (semaine)" value={142} icon="group" badge="+2"  />
        <StatCard label="Soignants disponibles" value={18} icon="local_hospital" />
        <StatCard label="Demandes en attente" value={leaves.filter((l) => l.status === "en-attente").length} icon="pending_actions" />
        <StatCard label="Conflits détectés" value={gaps.length} icon="warning" tone="alert" badge="Action req." page="/conflits"/>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conflicts */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <div>
              <h2 className="font-headline-md text-headline-md">Postes d'Aujourd'hui</h2>
             
            </div>
            <Link href="/planning" className="text-primary text-body-sm hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-3">
            
          </div>
        </GlassPanel>

        {/* Requests */}
        <GlassPanel className="p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <h2 className="font-headline-md text-headline-md">Demandes</h2>
            <Link href="/leaves" className="text-primary text-body-sm hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-3">
            {leaves.slice(0, 4).map((l) => {
              const person = teamStaff.find((s) => s.id === l.staffId);
              return (
                <div key={l.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                  <Avatar initials={person?.initials ?? "??"} size="sm" tone="neutral" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold truncate">
                      {person ? `${person.firstName} ${person.lastName}` : "—"}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {l.type} · {new Date(l.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge
                    tone={l.status === "valide" ? "success" : l.status === "refuse" ? "error" : "warning"}
                  >
                    {l.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </section>

      {/* Team + quick actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <h2 className="font-headline-md text-headline-md">Équipe — Chirurgie générale</h2>
            <Link href="/skills" className="text-primary text-body-sm hover:underline">
              Compétences
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamStaff.map((s) => (
              <div key={s.id} className="text-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Avatar initials={s.initials} size="lg" className="mx-auto mb-2" />
                <p className="text-body-sm font-semibold truncate">
                  {s.role === "praticien" || s.role === "interne" ? "Dr. " : ""}
                  {s.lastName}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate">{s.roleLabel}</p>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  {s.weeklyHours}h / {s.contractedHours}h
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>

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
    </>
  );
}
