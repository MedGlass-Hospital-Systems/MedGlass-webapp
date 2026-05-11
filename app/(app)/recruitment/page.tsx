import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/layout/Icon";
import { JobCard } from "@/components/recruitment/JobCard";
import { CandidateKanban } from "@/components/recruitment/CandidateKanban";
import { api } from "@/lib/api/client";

export const metadata = {
  title: "Recrutement · MedGlass",
};

export default async function RecruitmentPage() {
  const jobs = await api.recruitment.jobs();
  const allCandidates = await api.recruitment.candidates();

  const urgentJobs = jobs.filter((j) => j.priority === "urgent").length;
  const totalApps = jobs.reduce((sum, j) => sum + j.applications, 0);
  const inInterview = allCandidates.filter((c) => c.stage === "entretien").length;
  const hired = allCandidates.filter((c) => c.stage === "embauche").length;

  return (
    <>
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">
            Talent & Compétences
          </p>
          <h1 className="text-display-lg text-on-surface mb-2">Recrutement</h1>
          <p className="text-on-surface-variant max-w-2xl">
            Gérez les postes ouverts, suivez les candidatures et synchronisez les
            embauches avec votre planning de service.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" icon="download">
            Exporter le rapport
          </Button>
          <Button icon="add">Publier un poste</Button>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Postes ouverts", value: jobs.length, icon: "work", tone: "primary" },
          { label: "Postes urgents", value: urgentJobs, icon: "priority_high", tone: "error" },
          { label: "Candidatures actives", value: totalApps, icon: "group", tone: "tertiary" },
          { label: "En entretien", value: inInterview, icon: "forum", tone: "secondary" },
        ].map((s) => (
          <GlassPanel
            key={s.label}
            className="p-5 flex items-center gap-4 hover:border-white/15 transition-colors"
          >
            <span
              className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                s.tone === "error"
                  ? "bg-error/15 text-error"
                  : s.tone === "tertiary"
                  ? "bg-tertiary/15 text-tertiary"
                  : s.tone === "secondary"
                  ? "bg-secondary/15 text-secondary"
                  : "bg-primary/15 text-primary"
              }`}
            >
              <Icon name={s.icon} className="text-[24px]" filled />
            </span>
            <div className="min-w-0">
              <p className="text-3xl font-bold leading-none tabular-nums tracking-tight">
                {s.value}
              </p>
              <p className="text-body-sm text-on-surface-variant mt-1">{s.label}</p>
            </div>
          </GlassPanel>
        ))}
      </section>

      {/* Postes ouverts */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Postes ouverts
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {jobs.length} offres actives sur l'ensemble des services
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FilterPills />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      </section>

      {/* Pipeline candidatures */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Pipeline de candidatures
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Faites glisser une carte pour faire avancer un candidat dans le processus
            </p>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Icon name="verified" className="text-success text-[16px]" filled />
              RPPS vérifié
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Icon name="pending" className="text-warning text-[16px]" />
              En attente
            </span>
          </div>
        </div>

        <CandidateKanban candidates={allCandidates} />
      </section>

      {/* Vivier & embauches récentes */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-6">
          <header className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <div>
              <h2 className="font-headline-md text-headline-md">Vivier de talents</h2>
              <p className="text-body-sm text-on-surface-variant">
                Profils sauvegardés à recontacter
              </p>
            </div>
            <Button variant="ghost" size="sm" icon="filter_list">
              Filtrer
            </Button>
          </header>
          <div className="space-y-2">
            {allCandidates.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-body-sm text-on-surface-variant truncate">
                    {c.currentRole} · {c.experience} ans d'expérience
                  </p>
                </div>
                <Badge tone={c.matchScore >= 85 ? "success" : c.matchScore >= 70 ? "primary" : "neutral"}>
                  Match {c.matchScore}%
                </Badge>
                <button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-white/5">
                  <Icon name="bookmark" className="text-[18px]" />
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 bg-gradient-to-br from-background/70 to-primary/10 border-primary/20">
          <h3 className="font-label-caps text-label-caps text-primary mb-3">
            Actions rapides
          </h3>
          <div className="space-y-2">
            {[
              { i: "campaign", t: "Diffuser sur les jobboards" },
              { i: "share", t: "Partager le poste" },
              { i: "calendar_add_on", t: "Planifier un entretien" },
              { i: "assignment_ind", t: "Vérifier un RPPS" },
              { i: "history", t: "Historique des embauches" },
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
      </section>
    </>
  );
}

function FilterPills() {
  const filters = ["Tous", "Urgent", "Médecins", "Paramédical", "Cadre"];
  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((f, i) => (
        <button
          key={f}
          className={
            i === 0
              ? "px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/30 text-[11px] font-label-caps"
              : "px-3 py-1.5 rounded-full bg-white/[0.03] text-on-surface-variant border border-white/10 hover:bg-white/[0.06] text-[11px] font-label-caps transition-colors"
          }
        >
          {f}
        </button>
      ))}
    </div>
  );
}
