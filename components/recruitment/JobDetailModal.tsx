"use client";

import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { FavoriteButton } from "./FavoriteButton";
import { closingLabel } from "./JobCard";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, usePermissions, useStaffMap } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { PRIORITY_LABELS, PRIORITY_TONES, STAGE_LABELS, scoreTone } from "@/lib/utils/labels";
import { fmt } from "@/lib/utils/dates";
import { initialsOf } from "@/lib/utils/id";

/** Détail d'un poste : description, prérequis, candidats (externe) ou candidatures internes. */
export function JobDetailModal({
  jobId,
  onClose,
  onOpenCandidate,
  onApply,
}: {
  jobId: string | null;
  onClose: () => void;
  onOpenCandidate: (id: string) => void;
  onApply?: (jobId: string) => void;
}) {
  const job = useDemoStore((s) => s.jobs.find((j) => j.id === jobId));
  const service = useDemoStore((s) => s.services.find((x) => x.id === job?.service));
  const candidates = useDemoStore((s) => s.candidates.filter((c) => c.jobId === jobId));
  const internal = useDemoStore((s) => s.internalApplications.filter((a) => a.jobId === jobId));
  const closeJob = useDemoStore((s) => s.closeJob);
  const staffMap = useStaffMap();
  const { isManager } = usePermissions();

  return (
    <Modal
      open={!!job}
      onClose={onClose}
      size="lg"
      icon={job?.icon}
      title={job?.title}
      description={job && `${service?.name ?? ""} · ${job.site}`}
      footer={
        job && (
          <>
            {isManager && job.status === "ouvert" && (
              <Button variant="ghost" icon="block" onClick={() => { closeJob(job.id); toast("Offre clôturée"); }}>
                Clôturer l&apos;offre
              </Button>
            )}
            {!isManager && job.scope === "interne" && onApply && (
              <Button icon="send" onClick={() => onApply(job.id)}>
                Postuler
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </>
        )
      }
    >
      {job && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone={PRIORITY_TONES[job.priority]}>{PRIORITY_LABELS[job.priority]}</Badge>
            <Badge tone="neutral">{job.contractType}</Badge>
            <Badge tone={job.scope === "interne" ? "tertiary" : "primary"}>{job.scope === "interne" ? "Mobilité interne" : "Offre externe"}</Badge>
            <Badge tone="neutral">
              <Icon name="schedule" className="text-[12px]" /> {closingLabel(job.closesAt)}
            </Badge>
            <Badge tone="neutral">Publié le {fmt(job.postedAt, "d MMM yyyy")}</Badge>
          </div>

          <section>
            <h3 className="font-semibold mb-2">Description du poste</h3>
            <p className="text-on-surface-variant leading-relaxed">{job.description}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Prérequis</h3>
            <ul className="space-y-1.5">
              {job.requirements.map((r) => (
                <li key={r} className="flex items-center gap-2 text-body-sm">
                  <Icon name="check_circle" className="text-success text-[16px]" /> {r}
                </li>
              ))}
            </ul>
          </section>

          {isManager && (
            <section>
              <h3 className="font-semibold mb-3">
                {job.scope === "interne" ? "Candidatures internes" : "Candidats"} ({job.scope === "interne" ? internal.length : candidates.length})
              </h3>
              {job.scope === "interne" ? (
                internal.length ? (
                  <ul className="space-y-2">
                    {internal.map((a) => {
                      const p = staffMap.get(a.staffId);
                      return (
                        <li key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <Avatar initials={p?.initials ?? "?"} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-semibold">{fullName(p)}</p>
                            <p className="text-[11px] text-on-surface-variant truncate">{a.message || p?.roleLabel}</p>
                          </div>
                          <span className="text-[11px] text-on-surface-variant">{fmt(a.createdAt, "d MMM")}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <EmptyState icon="inbox" title="Aucune candidature interne pour le moment" className="py-6" />
                )
              ) : candidates.length ? (
                <ul className="space-y-2">
                  {candidates.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => onOpenCandidate(c.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-left"
                      >
                        <Avatar initials={initialsOf(c.firstName, c.lastName)} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-semibold">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="text-[11px] text-on-surface-variant truncate">{c.currentRole}</p>
                        </div>
                        <Badge tone={scoreTone(c.matchScore)}>{c.matchScore}%</Badge>
                        <Badge tone="neutral">{STAGE_LABELS[c.stage]}</Badge>
                        <FavoriteButton candidateId={c.id} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon="inbox" title="Aucune candidature pour le moment" className="py-6" />
              )}
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}
