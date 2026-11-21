"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Form";
import { FilterPills } from "@/components/ui/Tabs";
import { SearchInput } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { APP_ROLE_DESCRIPTIONS, APP_ROLE_LABELS } from "@/lib/utils/labels";
import type { AppRole } from "@/lib/types/planning";

const ROLES: AppRole[] = ["admin", "manager", "soignant"];

export function RoleManagementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const staff = useDemoStore((s) => s.staff);
  const meId = useDemoStore((s) => s.meId);
  const setAppRole = useDemoStore((s) => s.setAppRole);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<AppRole | "tous">("tous");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return staff
      .filter((s) => filter === "tous" || s.appRole === filter)
      .filter((s) => !needle || `${s.firstName} ${s.lastName} ${s.roleLabel}`.toLowerCase().includes(needle));
  }, [staff, q, filter]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon="admin_panel_settings"
      title="Gestion des rôles"
      description="Définissez ce que chaque personne peut faire dans MedGlass."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {ROLES.map((r) => (
          <div key={r} className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <p className="font-semibold text-on-surface text-body-sm flex items-center justify-between">
              {APP_ROLE_LABELS[r]}
              <span className="text-[11px] text-on-surface-variant tabular-nums">
                {staff.filter((s) => s.appRole === r).length}
              </span>
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1">{APP_ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <FilterPills
          value={filter}
          onChange={setFilter}
          items={[{ id: "tous", label: "Tous" }, ...ROLES.map((r) => ({ id: r, label: APP_ROLE_LABELS[r] }))]}
        />
        <SearchInput value={q} onChange={setQ} className="sm:w-64" />
      </div>
      <ul className="divide-y divide-white/5">
        {list.map((s) => (
          <li key={s.id} className="flex items-center gap-3 py-3">
            <Avatar initials={s.initials} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold truncate">{fullName(s, true)}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{s.roleLabel}</p>
            </div>
            {s.id === meId ? (
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <Icon name="lock" className="text-[14px]" /> Votre compte
              </span>
            ) : (
              <Select
                value={s.appRole}
                aria-label={`Rôle de ${s.firstName} ${s.lastName}`}
                className="w-44 py-2 text-body-sm"
                onChange={(e) => {
                  setAppRole(s.id, e.target.value as AppRole);
                  toast(`${s.firstName} ${s.lastName} est maintenant ${APP_ROLE_LABELS[e.target.value as AppRole].toLowerCase()}`);
                }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {APP_ROLE_LABELS[r]}
                  </option>
                ))}
              </Select>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
