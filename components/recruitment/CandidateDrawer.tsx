"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { Icon } from "@/components/layout/Icon";
import { FavoriteButton } from "./FavoriteButton";
import { useDemoStore } from "@/lib/store/demoStore";
import { toast } from "@/lib/store/toastStore";
import { STAGE_LABELS, scoreTone } from "@/lib/utils/labels";
import { fmt } from "@/lib/utils/dates";
import { initialsOf } from "@/lib/utils/id";
import type { ApplicationStage } from "@/lib/types/recruitment";

const STAGES = Object.keys(STAGE_LABELS) as ApplicationStage[];

/** Détail d'une candidature : profil, motivation, étapes, RPPS, entretien. */
export function CandidateDrawer({ candidateId, onClose }: { candidateId: string | null; onClose: () => void }) {
  const c = useDemoStore((s) => s.candidates.find((x) => x.id === candidateId));
  const job = useDemoStore((s) => s.jobs.find((j) => j.id === c?.jobId));
  const move = useDemoStore((s) => s.moveCandidate);
  const update = useDemoStore((s) => s.updateCandidate);
  const [interview, setInterview] = useState("");

  const timeline = c
    ? [
        { date: c.appliedAt, label: "Candidature reçue", icon: "inbox", done: true },
        { date: c.interviewAt, label: "Entretien", icon: "forum", done: !!c.interviewAt },
        { date: null, label: STAGE_LABELS[c.stage], icon: c.stage === "refuse" ? "cancel" : "flag", done: c.stage === "embauche" || c.stage === "refuse" },
      ]
    : [];

  return (
    <Drawer
      open={!!c}
      onClose={onClose}
      title={c ? `${c.firstName} ${c.lastName}` : ""}
      description={c ? `${c.currentRole} · ${c.location}` : ""}
      footer={
        c && (
          <>
            {c.stage !== "refuse" && (
              <Button variant="danger" onClick={() => { move(c.id, "refuse"); toast("Candidature refusée", "warning"); }}>
                Refuser
              </Button>
            )}
            {c.stage !== "embauche" && (
              <Button variant="success" icon="how_to_reg" onClick={() => { move(c.id, "embauche"); toast(`${c.firstName} ${c.lastName} est embauché(e)`); }}>
                Embaucher
              </Button>
            )}
          </>
        )
      }
    >
      {c && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar initials={initialsOf(c.firstName, c.lastName)} size="lg" />
            <div className="flex-1 flex flex-wrap gap-2">
              <Badge tone={scoreTone(c.matchScore)}>Match {c.matchScore}%</Badge>
              <Badge tone="neutral">{c.experience} an(s) d&apos;expérience</Badge>
              <Badge tone={c.rppsVerified ? "success" : "warning"}>
                <Icon name={c.rppsVerified ? "verified" : "pending"} className="text-[12px]" filled={c.rppsVerified} />
                {c.rppsVerified ? "RPPS vérifié" : "RPPS à vérifier"}
              </Badge>
            </div>
            <FavoriteButton candidateId={c.id} size={22} />
          </div>

          <section className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <p className="text-[11px] text-on-surface-variant">Poste visé</p>
            <p className="font-semibold">{job?.title}</p>
            <p className="text-body-sm text-on-surface-variant">{job?.site} · {job?.contractType}</p>
          </section>

          <section className="space-y-2">
            <a href={`mailto:${c.email}`} className="flex items-center gap-3 text-body-sm hover:text-primary">
              <Icon name="mail" className="text-[18px] text-on-surface-variant" /> {c.email}
            </a>
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-body-sm hover:text-primary">
              <Icon name="call" className="text-[18px] text-on-surface-variant" /> {c.phone}
            </a>
          </section>

          <section>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2">Motivation</h3>
            <p className="text-body-sm text-on-surface leading-relaxed">{c.motivation}</p>
          </section>

          <section>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Suivi</h3>
            <ol className="space-y-3">
              {timeline.map((t) => (
                <li key={t.label} className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${t.done ? "bg-primary/20 text-primary" : "bg-white/5 text-on-surface-variant"}`}>
                    <Icon name={t.icon} className="text-[16px]" />
                  </span>
                  <span className="flex-1 text-body-sm">{t.label}</span>
                  <span className="text-[12px] text-on-surface-variant">{t.date ? fmt(t.date, "d MMM yyyy") : t.done ? "" : "À planifier"}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Étape">
              <Select value={c.stage} onChange={(e) => { move(c.id, e.target.value as ApplicationStage); toast(`Étape : ${STAGE_LABELS[e.target.value as ApplicationStage]}`); }}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Planifier un entretien">
              <div className="flex gap-2">
                <Input type="date" value={interview || c.interviewAt || ""} onChange={(e) => setInterview(e.target.value)} />
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!interview}
                  onClick={() => {
                    update(c.id, { interviewAt: interview });
                    if (c.stage === "nouveau" || c.stage === "preselection") move(c.id, "entretien");
                    toast(`Entretien planifié le ${fmt(interview, "d MMMM")}`);
                    setInterview("");
                  }}
                >
                  OK
                </Button>
              </div>
            </Field>
          </section>

          {!c.rppsVerified && (
            <Button
              variant="secondary"
              icon="assignment_ind"
              onClick={() => {
                update(c.id, { rppsVerified: true });
                toast("Numéro RPPS vérifié dans l'annuaire santé");
              }}
            >
              Vérifier le RPPS
            </Button>
          )}
        </div>
      )}
    </Drawer>
  );
}
