"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Form";
import { EmptyState, PageHeader, Stepper } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { HoursPanel } from "./HoursPanel";
import { PreferenceGrid } from "./PreferenceGrid";
import { DateRangeList, type RangeItem } from "./DateRangeList";
import { WishSummary } from "./WishSummary";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, useStaffMap } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { LEAVE_LABELS } from "@/lib/utils/labels";
import { fmt, fmtRange } from "@/lib/utils/dates";
import type { LeaveType, Planning, Wish } from "@/lib/types/planning";

const STEPS = [
  { title: "Congés", icon: "beach_access" },
  { title: "Moments prioritaires", icon: "star" },
  { title: "Absences", icon: "event_busy" },
  { title: "Récapitulatif", icon: "send" },
];

type Draft = Pick<Wish, "leaves" | "preferences" | "absences" | "comment">;
const emptyDraft: Draft = { leaves: [], preferences: [], absences: [], comment: "" };

export function WishesView() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useCurrentUser();
  const plannings = useDemoStore((s) => s.plannings);
  const wishes = useDemoStore((s) => s.wishes);
  const services = useDemoStore((s) => s.services);
  const staffMap = useStaffMap();

  const requests = useMemo(
    () => plannings.filter((p) => p.requestedStaffIds.includes(user.id)).sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [plannings, user.id],
  );
  const selectedId = params.get("planning");
  const planning = requests.find((p) => p.id === selectedId);

  return (
    <>
      <PageHeader
        eyebrow="Préparation des plannings"
        title="Mes souhaits"
        description="Quand votre cadre prépare un planning, indiquez ici vos congés, vos créneaux préférés et vos indisponibilités."
        actions={
          planning && (
            <Button variant="secondary" icon="arrow_back" onClick={() => router.push("/souhaits")}>
              Toutes mes demandes
            </Button>
          )
        }
      />
      {planning ? (
        <WishForm key={`${planning.id}-${user.id}`} planning={planning} />
      ) : (
        <GlassPanel className="p-6">
          {requests.length ? (
            <ul className="space-y-3">
              {requests.map((p) => {
                const wish = wishes.find((w) => w.planningId === p.id && w.staffId === user.id);
                const open = p.status === "collecte";
                return (
                  <li key={p.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                    <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${wish ? "bg-success/15 text-success" : "bg-primary/15 text-primary"}`}>
                      <Icon name={wish ? "task_alt" : "favorite"} filled />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-body-sm text-on-surface-variant">
                        {services.find((s) => s.id === p.serviceId)?.name} · {fmtRange(p.startDate, p.endDate)} · demandé par {fullName(staffMap.get(p.createdBy))}
                      </p>
                    </div>
                    {wish ? <Badge tone="success">Envoyé le {fmt(wish.submittedAt, "d MMM")}</Badge> : open ? <Badge tone="warning">À compléter{p.wishesDeadline ? ` avant le ${fmt(p.wishesDeadline, "d MMM")}` : ""}</Badge> : <Badge tone="neutral">Clôturé</Badge>}
                    {open && (
                      <Button size="sm" href={`/souhaits?planning=${p.id}`} icon={wish ? "edit" : "arrow_forward"} iconPosition={wish ? "left" : "right"}>
                        {wish ? "Modifier" : "Saisir mes souhaits"}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon="favorite"
              title="Aucune demande de souhaits en cours"
              description="Vous recevrez une notification dès que votre cadre préparera un nouveau planning vous concernant. Astuce démo : incarnez Camille Roux (IDE) pour voir une demande en attente."
            />
          )}
        </GlassPanel>
      )}
    </>
  );
}

function WishForm({ planning }: { planning: Planning }) {
  const user = useCurrentUser();
  const existing = useDemoStore((s) => s.wishes.find((w) => w.planningId === planning.id && w.staffId === user.id));
  const submit = useDemoStore((s) => s.submitWish);
  const author = useDemoStore((s) => s.staff.find((x) => x.id === planning.createdBy));
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(existing ? { leaves: existing.leaves, preferences: existing.preferences, absences: existing.absences, comment: existing.comment } : emptyDraft);
  const [sent, setSent] = useState(false);
  const closed = planning.status !== "collecte";

  // Accolades obligatoires : scrollTo renvoie une Promise dans les Chromium récents,
  // que React prendrait pour une fonction de nettoyage.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const leaveItems: RangeItem[] = draft.leaves.map((l) => ({ startDate: l.startDate, endDate: l.endDate, extra: l.type }));
  const absenceItems: RangeItem[] = draft.absences.map((a) => ({ startDate: a.startDate, endDate: a.endDate, extra: a.reason }));

  if (sent) {
    return (
      <GlassPanel className="p-10 text-center">
        <span className="w-16 h-16 rounded-full bg-success/15 text-success inline-flex items-center justify-center mb-4">
          <Icon name="task_alt" filled className="text-[32px]" />
        </span>
        <h2 className="text-headline-md font-headline-md mb-2">Souhaits envoyés !</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-6">
          {fullName(author)} a été notifié(e). Vous pouvez modifier vos souhaits tant que la collecte est ouverte.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={() => { setSent(false); setStep(0); }}>
            Modifier
          </Button>
          <Button href="/dashboard" icon="home">
            Retour à l&apos;accueil
          </Button>
        </div>
      </GlassPanel>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-primary/20 bg-primary/[0.06] px-5 py-4 flex flex-col md:flex-row md:items-center gap-3">
        <Icon name="info" className="text-primary" />
        <p className="flex-1 text-body-sm">
          <strong>{planning.name}</strong> · {fmtRange(planning.startDate, planning.endDate)} — {fullName(author)} attend vos souhaits
          {planning.wishesDeadline ? ` avant le ${fmt(planning.wishesDeadline, "d MMMM")}` : ""}.
        </p>
        {existing && <Badge tone="success">Déjà envoyé — modification</Badge>}
        {closed && <Badge tone="neutral">Collecte clôturée</Badge>}
      </div>

      <GlassPanel className="p-4 md:p-6">
        <Stepper steps={STEPS} current={step} onSelect={setStep} />
      </GlassPanel>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <GlassPanel className="xl:col-span-8 p-5 md:p-8 min-h-[420px] flex flex-col">
          <div className="flex-1">
            {step === 0 && (
              <>
                <h2 className="text-headline-md font-headline-md mb-2">Vos congés sur la période</h2>
                <p className="text-on-surface-variant mb-6">Indiquez les jours de congés ou de RTT que vous souhaitez poser. Le solde à droite se met à jour.</p>
                <DateRangeList
                  items={leaveItems}
                  onChange={(items) => setDraft({ ...draft, leaves: items.map((i) => ({ startDate: i.startDate, endDate: i.endDate, type: (i.extra || "conges") as LeaveType })) })}
                  min={planning.startDate}
                  max={planning.endDate}
                  extraLabel="Type"
                  extraOptions={(["conges", "rtt", "formation"] as LeaveType[]).map((t) => ({ value: t, label: LEAVE_LABELS[t] }))}
                  emptyTitle="Aucun congé souhaité"
                  addLabel="Ajouter une période de congés"
                />
              </>
            )}
            {step === 1 && (
              <>
                <h2 className="text-headline-md font-headline-md mb-2">Quand préférez-vous travailler ?</h2>
                <p className="text-on-surface-variant mb-6">Vos préférences sont appliquées autant que possible, dans le respect des règles du service.</p>
                <PreferenceGrid value={draft.preferences} onChange={(preferences) => setDraft({ ...draft, preferences })} />
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-headline-md font-headline-md mb-2">Vos indisponibilités</h2>
                <p className="text-on-surface-variant mb-6">Rendez-vous, formation externe, contrainte familiale… Ces jours ne vous seront pas attribués.</p>
                <DateRangeList
                  items={absenceItems}
                  onChange={(items) => setDraft({ ...draft, absences: items.map((i) => ({ startDate: i.startDate, endDate: i.endDate, reason: i.extra })) })}
                  min={planning.startDate}
                  max={planning.endDate}
                  extraLabel="Motif"
                  extraPlaceholder="Ex. rendez-vous médical"
                  emptyTitle="Aucune indisponibilité"
                  addLabel="Je suis absent(e) sur une période"
                />
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-headline-md font-headline-md mb-2">Récapitulatif</h2>
                <p className="text-on-surface-variant mb-6">Vérifiez vos souhaits avant de les envoyer à {fullName(author)}.</p>
                <WishSummary wish={draft} />
                <Field label="Commentaire pour votre cadre (optionnel)" className="mt-6">
                  <Textarea value={draft.comment} onChange={(e) => setDraft({ ...draft, comment: e.target.value })} placeholder="Ex. disponible pour des nuits en début de mois" />
                </Field>
              </>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
            <Button variant="secondary" icon="arrow_back" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Précédent
            </Button>
            {step < 3 ? (
              <Button icon="arrow_forward" iconPosition="right" onClick={() => setStep((s) => s + 1)}>
                Suivant
              </Button>
            ) : (
              <Button
                icon="send"
                disabled={closed}
                onClick={() => {
                  const bad = [...draft.leaves, ...draft.absences].some((r) => r.endDate < r.startDate);
                  if (bad) return toast("Une période a une date de fin avant la date de début", "error");
                  submit({ planningId: planning.id, staffId: user.id, ...draft });
                  toast("Souhaits envoyés");
                  setSent(true);
                }}
              >
                {existing ? "Mettre à jour mes souhaits" : "Envoyer mes souhaits"}
              </Button>
            )}
          </div>
        </GlassPanel>

        <div className="xl:col-span-4">
          <HoursPanel person={user} planning={planning} draft={draft} />
        </div>
      </div>
    </>
  );
}
