"use client";

import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { SkillLevel } from "./SkillLevel";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useMe, usePermissions } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { weekHours } from "@/lib/planning/hours";
import { APP_ROLE_LABELS, CONTRACT_LABELS, CONTRACT_TONES, SHIFT_DOTS, SHIFT_LABELS } from "@/lib/utils/labels";
import { addDaysISO, fmt, fromNow, todayISO } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

function InfoTile({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
      <p className="text-[11px] text-on-surface-variant">{label}</p>
      <p className="text-lg font-bold text-on-surface tabular-nums">{value}</p>
      {children}
    </div>
  );
}

/** Fiche profil d'un collaborateur ou prestataire (ouvert depuis l'annuaire, l'accueil, le planning). */
export function ProfileDrawer({ staffId, onClose }: { staffId: string | null; onClose: () => void }) {
  const person = useDemoStore((s) => s.staff.find((x) => x.id === staffId));
  const service = useDemoStore((s) => s.services.find((x) => x.id === person?.service));
  const shifts = useDemoStore((s) => s.shifts);
  const impersonate = useDemoStore((s) => s.impersonate);
  const me = useMe();
  const { canImpersonate } = usePermissions();
  const router = useRouter();
  const today = todayISO();

  const upcoming = person
    ? shifts
        .filter((s) => s.staffId === person.id && s.date >= today && s.date <= addDaysISO(today, 14))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6)
    : [];
  const hours = person ? weekHours(shifts, person.id, today) : 0;

  return (
    <Drawer
      open={!!person}
      onClose={onClose}
      title={person ? fullName(person, true) : ""}
      description={person ? `${person.roleLabel} · ${service?.name ?? ""}` : ""}
      footer={
        person && (
          <>
            {canImpersonate && person.id !== me.id && (
              <Button
                variant="secondary"
                icon="supervised_user_circle"
                onClick={() => {
                  impersonate(person.id);
                  toast(`Vous incarnez ${person.firstName} ${person.lastName}`);
                  onClose();
                  router.push("/dashboard");
                }}
              >
                Incarner
              </Button>
            )}
            <Button href={`mailto:${person.email}`} icon="mail">
              Contacter
            </Button>
          </>
        )
      }
    >
      {person && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar initials={person.initials} size="lg" />
            <div className="flex flex-wrap gap-2">
              <Badge tone={CONTRACT_TONES[person.contract]}>{CONTRACT_LABELS[person.contract]}</Badge>
              {person.company && <Badge tone="neutral">{person.company}</Badge>}
              <Badge tone={person.appRole === "soignant" ? "neutral" : "primary"}>{APP_ROLE_LABELS[person.appRole]}</Badge>
            </div>
          </div>

          <section className="space-y-2">
            <a href={`mailto:${person.email}`} className="flex items-center gap-3 text-body-sm hover:text-primary">
              <Icon name="mail" className="text-[18px] text-on-surface-variant" /> {person.email}
            </a>
            <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-body-sm hover:text-primary">
              <Icon name="call" className="text-[18px] text-on-surface-variant" /> {person.phone}
            </a>
            <p className="flex items-center gap-3 text-body-sm text-on-surface-variant">
              <Icon name="badge" className="text-[18px]" /> Arrivé(e) {fromNow(person.joinedAt)} ({fmt(person.joinedAt, "MMMM yyyy")})
            </p>
          </section>

          <section className="grid grid-cols-3 gap-3">
            <InfoTile label="Cette semaine" value={`${hours}h`}>
              <ProgressBar value={person.contractedHours ? (hours / person.contractedHours) * 100 : 0} className="mt-2" />
            </InfoTile>
            <InfoTile label="Congés restants" value={`${person.leaveBalance.conges} j`} />
            <InfoTile label="RTT restants" value={`${person.leaveBalance.rtt} j`} />
          </section>

          <section>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Compétences</h3>
            <ul className="space-y-2">
              {person.skills.map((sk) => (
                <li key={sk.name} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                  <span className="text-body-sm">{sk.name}</span>
                  <SkillLevel level={sk.level} />
                </li>
              ))}
              {!person.skills.length && <li className="text-body-sm text-on-surface-variant">Aucune compétence renseignée.</li>}
            </ul>
          </section>

          {person.certifications.length > 0 && (
            <section>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Diplômes & certifications</h3>
              <div className="flex flex-wrap gap-2">
                {person.certifications.map((c) => (
                  <Badge key={c} tone="success">
                    <Icon name="verified" className="text-[12px]" filled /> {c}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Prochains postes</h3>
            {upcoming.length ? (
              <ul className="space-y-1.5">
                {upcoming.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 text-body-sm">
                    <span className={cn("w-2 h-2 rounded-full", SHIFT_DOTS[s.type])} />
                    <span className="w-28 text-on-surface-variant">{fmt(s.date, "EEE d MMM")}</span>
                    <span className="flex-1">{SHIFT_LABELS[s.type]}</span>
                    <span className="tabular-nums text-on-surface-variant">
                      {s.type === "conges" || s.type === "rtt" ? "" : `${s.startTime}–${s.endTime}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-body-sm text-on-surface-variant">Aucun poste dans les 14 prochains jours.</p>
            )}
          </section>
        </div>
      )}
    </Drawer>
  );
}
