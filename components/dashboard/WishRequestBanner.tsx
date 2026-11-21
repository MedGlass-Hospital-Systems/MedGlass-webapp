"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, usePendingWishRequests, useStaffMap } from "@/lib/store/hooks";
import { fmt, fmtRange } from "@/lib/utils/dates";

/** Encart « vos souhaits sont attendus » quand un planning en préparation concerne l'utilisateur. */
export function WishRequestBanner() {
  const pending = usePendingWishRequests();
  const staffMap = useStaffMap();
  const services = useDemoStore((s) => s.services);
  if (!pending.length) return null;

  return (
    <div className="space-y-3">
      {pending.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 to-tertiary/10 p-5 flex flex-col md:flex-row md:items-center gap-4"
        >
          <span className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Icon name="favorite" filled className="text-[24px]" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-on-surface">Vos souhaits sont attendus pour « {p.name} »</p>
            <p className="text-body-sm text-on-surface-variant">
              {fullName(staffMap.get(p.createdBy))} prépare le planning {services.find((s) => s.id === p.serviceId)?.name} du{" "}
              {fmtRange(p.startDate, p.endDate)}
              {p.wishesDeadline ? ` · réponse avant le ${fmt(p.wishesDeadline, "d MMMM")}` : ""}.
            </p>
          </div>
          <Button href={`/souhaits?planning=${p.id}`} icon="arrow_forward" iconPosition="right">
            Saisir mes souhaits
          </Button>
        </div>
      ))}
    </div>
  );
}
