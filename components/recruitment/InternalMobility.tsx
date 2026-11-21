"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Textarea } from "@/components/ui/Form";
import { EmptyState } from "@/components/ui/Layout";
import { JobCard } from "./JobCard";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, usePermissions } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";

/** Offres réservées au personnel : consultation, candidature avec message. */
export function InternalMobility({ onOpenJob, applyFor, setApplyFor }: { onOpenJob: (id: string) => void; applyFor: string | null; setApplyFor: (id: string | null) => void }) {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const jobs = useDemoStore((s) => s.jobs.filter((j) => j.scope === "interne"));
  const applications = useDemoStore((s) => s.internalApplications);
  const services = useDemoStore((s) => s.services);
  const apply = useDemoStore((s) => s.applyInternal);
  const [message, setMessage] = useState("");
  const target = jobs.find((j) => j.id === applyFor);

  if (!jobs.length) {
    return (
      <GlassPanel>
        <EmptyState icon="move_up" title="Aucune offre de mobilité interne" />
      </GlassPanel>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {jobs.map((job, i) => {
          const count = applications.filter((a) => a.jobId === job.id).length;
          const applied = applications.some((a) => a.jobId === job.id && a.staffId === user.id);
          return (
            <JobCard
              key={job.id}
              job={job}
              index={i}
              serviceName={services.find((s) => s.id === job.service)?.name ?? ""}
              applications={count}
              onOpen={() => onOpenJob(job.id)}
              footerExtra={
                isManager ? undefined : applied ? (
                  <Badge tone="success">Candidature envoyée</Badge>
                ) : (
                  <Button
                    size="sm"
                    icon="send"
                    disabled={job.status !== "ouvert"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplyFor(job.id);
                    }}
                  >
                    Postuler
                  </Button>
                )
              }
            />
          );
        })}
      </div>

      <Modal
        open={!!target}
        onClose={() => setApplyFor(null)}
        icon="send"
        title="Postuler en interne"
        description={target?.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setApplyFor(null)}>
              Annuler
            </Button>
            <Button
              icon="send"
              onClick={() => {
                if (!target) return;
                apply(target.id, user.id, message.trim());
                toast("Candidature transmise au manager du service");
                setMessage("");
                setApplyFor(null);
              }}
            >
              Envoyer ma candidature
            </Button>
          </>
        }
      >
        <p className="text-body-sm text-on-surface-variant mb-4">
          Votre profil MedGlass (compétences, ancienneté, certifications) est joint automatiquement.
        </p>
        <Field label="Message au recruteur (optionnel)">
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ce poste m'intéresse car…" />
        </Field>
      </Modal>
    </>
  );
}
