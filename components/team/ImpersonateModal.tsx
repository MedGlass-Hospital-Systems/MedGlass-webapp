"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Layout";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { APP_ROLE_LABELS } from "@/lib/utils/labels";

export function ImpersonateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const staff = useDemoStore((s) => s.staff);
  const services = useDemoStore((s) => s.services);
  const meId = useDemoStore((s) => s.meId);
  const current = useDemoStore((s) => s.impersonatingId);
  const impersonate = useDemoStore((s) => s.impersonate);
  const router = useRouter();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return staff
      .filter((s) => s.id !== meId)
      .filter((s) => !needle || `${s.firstName} ${s.lastName} ${s.roleLabel}`.toLowerCase().includes(needle));
  }, [staff, meId, q]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="supervised_user_circle"
      title="Incarner une personne"
      description="Naviguez dans l'application avec les droits et les données de ce collaborateur. Vos actions sont faites en son nom."
    >
      <SearchInput value={q} onChange={setQ} placeholder="Rechercher un collaborateur…" className="mb-4" />
      <ul className="space-y-2">
        {list.map((s) => (
          <li key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/5">
            <Avatar initials={s.initials} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold truncate">{fullName(s, true)}</p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {s.roleLabel} · {services.find((x) => x.id === s.service)?.shortName}
              </p>
            </div>
            <Badge tone={s.appRole === "soignant" ? "neutral" : "primary"}>{APP_ROLE_LABELS[s.appRole]}</Badge>
            <Button
              size="sm"
              variant={current === s.id ? "success" : "secondary"}
              disabled={current === s.id}
              onClick={() => {
                impersonate(s.id);
                toast(`Vous incarnez ${s.firstName} ${s.lastName}`);
                onClose();
                router.push("/dashboard");
              }}
            >
              {current === s.id ? "En cours" : "Incarner"}
            </Button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
