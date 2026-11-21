"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Form";
import { EmptyState, PageHeader, PanelHeader } from "@/components/ui/Layout";
import { FilterPills, Tabs } from "@/components/ui/Tabs";
import { QuickActions } from "@/components/ui/QuickActions";
import { Icon } from "@/components/layout/Icon";
import { JobCard } from "./JobCard";
import { CandidateKanban } from "./CandidateKanban";
import { CandidateDrawer } from "./CandidateDrawer";
import { JobDetailModal } from "./JobDetailModal";
import { JobFormModal } from "./JobFormModal";
import { OpenShiftsBoard } from "./OpenShiftsBoard";
import { OpenShiftFormModal } from "./OpenShiftFormModal";
import { InternalMobility } from "./InternalMobility";
import { FavoriteButton } from "./FavoriteButton";
import { useDemoStore } from "@/lib/store/demoStore";
import { usePermissions } from "@/lib/store/hooks";
import { scoreTone } from "@/lib/utils/labels";
import { initialsOf } from "@/lib/utils/id";
import type { JobCategory } from "@/lib/types/recruitment";

type JobFilter = "tous" | "urgent" | JobCategory;
type Tab = "recrutement" | "bourse";
type BourseTab = "creneaux" | "mobilite";

export function RecruitmentView() {
  const params = useSearchParams();
  const { isManager } = usePermissions();
  const jobs = useDemoStore((s) => s.jobs);
  const candidates = useDemoStore((s) => s.candidates);
  const favorites = useDemoStore((s) => s.favorites);
  const services = useDemoStore((s) => s.services);
  const openShifts = useDemoStore((s) => s.openShifts);

  const [tab, setTab] = useState<Tab>(isManager ? "recrutement" : "bourse");
  const [bourseTab, setBourseTab] = useState<BourseTab>("creneaux");
  const [jobFilter, setJobFilter] = useState<JobFilter>("tous");
  const [pipelineFilter, setPipelineFilter] = useState<"tous" | "favoris">("tous");
  const [pipelineJob, setPipelineJob] = useState("tous");
  const [jobId, setJobId] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [applyFor, setApplyFor] = useState<string | null>(null);
  const [modal, setModal] = useState<"job" | "job-interne" | "creneau" | null>(null);
  const pipelineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (params.get("onglet") === "bourse" || !isManager) setTab("bourse");
    if (params.get("nouveau") && isManager) setModal(params.get("onglet") === "bourse" ? "creneau" : "job");
  }, [params, isManager]);

  const external = jobs.filter((j) => j.scope === "externe");
  const openExternal = external.filter((j) => j.status === "ouvert");
  const filteredJobs = external.filter((j) =>
    jobFilter === "tous" ? true : jobFilter === "urgent" ? j.priority === "urgent" : j.category === jobFilter,
  );
  const externalIds = new Set(external.map((j) => j.id));
  const pipeline = useMemo(
    () =>
      candidates
        .filter((c) => externalIds.has(c.jobId))
        .filter((c) => pipelineFilter === "tous" || favorites.includes(c.id))
        .filter((c) => pipelineJob === "tous" || c.jobId === pipelineJob),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [candidates, pipelineFilter, favorites, pipelineJob, jobs],
  );
  const favCandidates = candidates.filter((c) => favorites.includes(c.id));
  const appsByJob = (id: string) => candidates.filter((c) => c.jobId === id && c.stage !== "refuse").length;
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;

  const showFavorites = () => {
    setTab("recrutement");
    setPipelineFilter("favoris");
    setTimeout(() => pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <>
      <PageHeader
        eyebrow="Talents & mobilité"
        title={isManager ? "Recrutement" : "Bourse au poste"}
        description={
          isManager
            ? "Gérez les postes ouverts, suivez les candidatures et pourvoyez les créneaux vacants."
            : "Portez-vous volontaire sur des créneaux vacants ou postulez aux offres de mobilité interne."
        }
        actions={
          isManager && (
            <>
              <Button variant="secondary" icon="campaign" onClick={() => setModal("creneau")}>
                Publier un créneau
              </Button>
              <Button icon="add" onClick={() => setModal("job")}>
                Publier un poste
              </Button>
            </>
          )
        }
      />

      {isManager && (
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: "recrutement", label: "Recrutement externe", icon: "work", count: openExternal.length },
            { id: "bourse", label: "Bourse au poste", icon: "swap_horizontal_circle", count: openShifts.filter((o) => o.status === "ouvert").length },
          ]}
        />
      )}

      {tab === "recrutement" && isManager ? (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Postes ouverts", value: openExternal.length, icon: "work", cls: "bg-primary/15 text-primary" },
              { label: "Postes urgents", value: openExternal.filter((j) => j.priority === "urgent").length, icon: "priority_high", cls: "bg-error/15 text-error" },
              { label: "Candidatures actives", value: candidates.filter((c) => !["refuse", "embauche"].includes(c.stage)).length, icon: "group", cls: "bg-tertiary/15 text-tertiary" },
              { label: "En entretien", value: candidates.filter((c) => c.stage === "entretien").length, icon: "forum", cls: "bg-secondary/15 text-secondary" },
            ].map((s) => (
              <GlassPanel key={s.label} className="p-5 flex items-center gap-4">
                <span className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${s.cls}`}>
                  <Icon name={s.icon} className="text-[24px]" filled />
                </span>
                <div className="min-w-0">
                  <p className="text-3xl font-bold leading-none tabular-nums tracking-tight">{s.value}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">{s.label}</p>
                </div>
              </GlassPanel>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Postes ouverts</h2>
                <p className="text-body-sm text-on-surface-variant mt-1">{filteredJobs.length} offre(s) affichée(s)</p>
              </div>
              <FilterPills
                value={jobFilter}
                onChange={setJobFilter}
                items={[
                  { id: "tous", label: "Tous", count: external.length },
                  { id: "urgent", label: "Urgent", count: external.filter((j) => j.priority === "urgent").length },
                  { id: "medecin", label: "Médecins", count: external.filter((j) => j.category === "medecin").length },
                  { id: "paramedical", label: "Paramédical", count: external.filter((j) => j.category === "paramedical").length },
                  { id: "cadre", label: "Cadre", count: external.filter((j) => j.category === "cadre").length },
                ]}
              />
            </div>
            {filteredJobs.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} serviceName={serviceName(job.service)} applications={appsByJob(job.id)} onOpen={() => setJobId(job.id)} />
                ))}
              </div>
            ) : (
              <GlassPanel>
                <EmptyState icon="work_off" title="Aucun poste pour ce filtre" />
              </GlassPanel>
            )}
          </section>

          <section ref={pipelineRef} className="space-y-4 scroll-mt-24">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-3">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Pipeline de candidatures</h2>
                <p className="text-body-sm text-on-surface-variant mt-1">Faites glisser une carte pour faire avancer un candidat ; cliquez pour voir sa candidature.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Select value={pipelineJob} onChange={(e) => setPipelineJob(e.target.value)} className="sm:w-64 py-1.5 rounded-full text-body-sm" aria-label="Filtrer par poste">
                  <option value="tous">Tous les postes</option>
                  {external.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </Select>
                <FilterPills
                  value={pipelineFilter}
                  onChange={setPipelineFilter}
                  items={[
                    { id: "tous", label: "Tous" },
                    { id: "favoris", label: "Favoris", icon: "star", count: favorites.length },
                  ]}
                />
              </div>
            </div>
            {pipeline.length ? (
              <CandidateKanban candidates={pipeline} onOpen={setCandidateId} />
            ) : (
              <GlassPanel>
                <EmptyState icon="star" title="Aucun candidat" description={pipelineFilter === "favoris" ? "Ajoutez des favoris avec l'étoile sur une carte candidat." : undefined} />
              </GlassPanel>
            )}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassPanel className="lg:col-span-2 p-6">
              <PanelHeader title="Mes favoris" subtitle="Profils sauvegardés à recontacter" action={<Badge tone="warning">{favCandidates.length}</Badge>} />
              <div className="space-y-2">
                {favCandidates.length ? (
                  favCandidates.map((c) => (
                    <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5">
                      <Avatar initials={initialsOf(c.firstName, c.lastName)} />
                      <button type="button" onClick={() => setCandidateId(c.id)} className="flex-1 min-w-0 text-left">
                        <p className="font-semibold text-on-surface">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-body-sm text-on-surface-variant truncate">
                          {c.currentRole} · {c.experience} an(s) d&apos;expérience
                        </p>
                      </button>
                      <Badge tone={scoreTone(c.matchScore)}>Match {c.matchScore}%</Badge>
                      <FavoriteButton candidateId={c.id} />
                    </div>
                  ))
                ) : (
                  <EmptyState icon="star" title="Aucun favori" description="Cliquez sur l'étoile d'un candidat pour le retrouver ici." />
                )}
              </div>
            </GlassPanel>
            <QuickActions
              layout="list"
              actions={[
                { icon: "post_add", label: "Publier un poste", onClick: () => setModal("job") },
                { icon: "campaign", label: "Publier un créneau à pourvoir", onClick: () => setModal("creneau") },
                { icon: "star", label: "Afficher mes favoris", onClick: showFavorites },
                { icon: "move_up", label: "Publier une offre interne", onClick: () => setModal("job-interne") },
                { icon: "swap_horizontal_circle", label: "Ouvrir la bourse au poste", onClick: () => setTab("bourse") },
              ]}
            />
          </section>
        </>
      ) : (
        <>
          <Tabs
            size="sm"
            value={bourseTab}
            onChange={setBourseTab}
            items={[
              { id: "creneaux", label: "Créneaux à pourvoir", icon: "event_upcoming" },
              { id: "mobilite", label: "Mobilité interne", icon: "move_up" },
            ]}
          />
          {bourseTab === "creneaux" ? (
            <OpenShiftsBoard />
          ) : (
            <InternalMobility onOpenJob={setJobId} applyFor={applyFor} setApplyFor={setApplyFor} />
          )}
        </>
      )}

      <JobDetailModal
        jobId={jobId}
        onClose={() => setJobId(null)}
        onOpenCandidate={(id) => {
          setJobId(null);
          setCandidateId(id);
        }}
        onApply={(id) => {
          setJobId(null);
          setApplyFor(id);
        }}
      />
      <CandidateDrawer candidateId={candidateId} onClose={() => setCandidateId(null)} />
      <JobFormModal open={modal === "job" || modal === "job-interne"} scope={modal === "job-interne" ? "interne" : "externe"} onClose={() => setModal(null)} />
      <OpenShiftFormModal open={modal === "creneau"} onClose={() => setModal(null)} />
    </>
  );
}
