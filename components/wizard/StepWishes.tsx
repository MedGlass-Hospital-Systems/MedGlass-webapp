"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { ProgressBar } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { WishSummary } from "@/components/wishes/WishSummary";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { addDaysISO, fmt, todayISO } from "@/lib/utils/dates";
import type { Planning } from "@/lib/types/planning";

export function StepWishes({ planning }: { planning: Planning }) {
  const staff = useDemoStore((s) => s.staff);
  const wishes = useDemoStore((s) => s.wishes);
  const leaves = useDemoStore((s) => s.leaves);
  const requestWishes = useDemoStore((s) => s.requestWishes);
  const notify = useDemoStore((s) => s.notify);

  const team = useMemo(
    () => staff.filter((s) => s.service === planning.serviceId && s.contract !== "prestataire" && s.id !== planning.createdBy),
    [staff, planning.serviceId, planning.createdBy],
  );
  const requested = planning.requestedStaffIds.length > 0;
  const [selected, setSelected] = useState<string[]>(requested ? planning.requestedStaffIds : team.map((t) => t.id));
  const defaultDeadline = [addDaysISO(planning.startDate, -7), addDaysISO(todayISO(), 7)].sort()[0];
  const [deadline, setDeadline] = useState(planning.wishesDeadline ?? defaultDeadline);
  const [openId, setOpenId] = useState<string | null>(null);

  const periodLeaves = leaves.filter(
    (l) => l.status === "valide" && team.some((t) => t.id === l.staffId) && l.endDate >= planning.startDate && l.startDate <= planning.endDate,
  );
  const received = wishes.filter((w) => w.planningId === planning.id);
  const list = requested ? team.filter((t) => planning.requestedStaffIds.includes(t.id)) : team;

  return (
    <div>
      <h2 className="text-headline-md font-headline-md mb-2">Souhaits et contraintes de l&apos;équipe</h2>
      <p className="text-on-surface-variant mb-6">
        Chaque collaborateur reçoit une notification et saisit ses congés, ses moments prioritaires et ses absences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { i: "event_busy", t: `${periodLeaves.length} absence(s) validée(s)`, d: "Sur la période du planning" },
          { i: "favorite", t: `${received.length} / ${requested ? planning.requestedStaffIds.length : team.length} souhaits`, d: requested ? "Réponses reçues" : "Demande non envoyée" },
          { i: "psychology", t: `${new Set(team.flatMap((t) => t.skills.map((s) => s.name))).size} compétences`, d: "Couvertes par l'équipe" },
        ].map((c) => (
          <div key={c.i} className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <Icon name={c.i} className="text-primary text-[24px] mb-2" filled />
            <p className="font-semibold mb-1">{c.t}</p>
            <p className="text-body-sm text-on-surface-variant">{c.d}</p>
          </div>
        ))}
      </div>

      {!requested ? (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/[0.04] flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <Field label="Date limite de réponse" className="md:w-56">
            <Input type="date" value={deadline} max={planning.startDate} onChange={(e) => setDeadline(e.target.value)} />
          </Field>
          <p className="flex-1 text-body-sm text-on-surface-variant">{selected.length} collaborateur(s) sélectionné(s) recevront une notification.</p>
          <Button
            icon="send"
            disabled={!selected.length}
            onClick={() => {
              requestWishes(planning.id, selected, deadline);
              toast(`Demande de souhaits envoyée à ${selected.length} personne(s)`);
            }}
          >
            Envoyer la demande
          </Button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex justify-between text-body-sm mb-2">
            <span className="text-on-surface-variant">
              Collecte en cours{planning.wishesDeadline ? ` · avant le ${fmt(planning.wishesDeadline, "d MMMM")}` : ""}
            </span>
            <span className="tabular-nums">
              {received.length}/{planning.requestedStaffIds.length}
            </span>
          </div>
          <ProgressBar value={(received.length / planning.requestedStaffIds.length) * 100} tone={received.length === planning.requestedStaffIds.length ? "success" : "warning"} />
          <p className="text-[12px] text-on-surface-variant mt-2 flex items-center gap-1">
            <Icon name="lightbulb" className="text-[14px]" /> Astuce démo : incarnez un collaborateur (menu de l&apos;avatar) pour saisir ses souhaits.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {list.map((p) => {
          const wish = received.find((w) => w.staffId === p.id);
          const checked = selected.includes(p.id);
          return (
            <li key={p.id} className="rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 p-3">
                {!requested && (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setSelected((s) => (checked ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                    className="w-5 h-5 rounded text-primary bg-transparent border-white/20"
                    aria-label={`Demander les souhaits de ${p.firstName} ${p.lastName}`}
                  />
                )}
                <Avatar initials={p.initials} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold truncate">{fullName(p, true)}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {p.roleLabel}
                    {periodLeaves.some((l) => l.staffId === p.id) && " · absence validée sur la période"}
                  </p>
                </div>
                {requested &&
                  (wish ? (
                    <>
                      <Badge tone="success">Reçu le {fmt(wish.submittedAt, "d MMM")}</Badge>
                      <button
                        type="button"
                        onClick={() => setOpenId(openId === p.id ? null : p.id)}
                        className="p-1.5 rounded-full hover:bg-white/10 text-on-surface-variant"
                        aria-label="Voir le détail"
                      >
                        <Icon name={openId === p.id ? "expand_less" : "expand_more"} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Badge tone="warning">En attente</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="notifications_active"
                        onClick={() => {
                          notify({
                            userId: p.id,
                            type: "souhaits",
                            title: "Rappel : vos souhaits sont attendus",
                            body: `Pensez à saisir vos souhaits pour « ${planning.name} ».`,
                            link: `/souhaits?planning=${planning.id}`,
                          });
                          toast(`Relance envoyée à ${p.firstName}`);
                        }}
                      >
                        Relancer
                      </Button>
                    </>
                  ))}
              </div>
              {wish && openId === p.id && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5">
                  <WishSummary wish={wish} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {periodLeaves.length > 0 && (
        <p className="text-[12px] text-on-surface-variant mt-4">
          Absences validées prises en compte :{" "}
          {periodLeaves.map((l) => `${staff.find((s) => s.id === l.staffId)?.firstName} (${fmt(l.startDate, "d MMM")})`).join(", ")}
        </p>
      )}
    </div>
  );
}
