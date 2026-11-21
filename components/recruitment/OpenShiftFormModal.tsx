"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { ROLE_LABELS, SHIFT_LABELS } from "@/lib/utils/labels";
import { addDaysISO, todayISO } from "@/lib/utils/dates";
import type { ShiftType, StaffRole } from "@/lib/types/planning";

const PRESETS: { label: string; type: ShiftType; start: string; end: string }[] = [
  { label: "Jour 07h – 19h", type: "jour", start: "07:00", end: "19:00" },
  { label: "Nuit 19h – 07h", type: "nuit", start: "19:00", end: "07:00" },
  { label: "Garde 18h30 – 08h30", type: "garde", start: "18:30", end: "08:30" },
  { label: "Astreinte 08h – 20h", type: "astreinte", start: "08:00", end: "20:00" },
  { label: "Matin 07h – 15h", type: "jour", start: "07:00", end: "15:00" },
  { label: "Après-midi 13h – 21h", type: "jour", start: "13:00", end: "21:00" },
];
const ROLES: StaffRole[] = ["ide", "as", "praticien", "interne", "cadre", "secretaire"];

/** Publier un créneau vacant dans la bourse aux remplacements. */
export function OpenShiftFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useCurrentUser();
  const services = useDemoStore((s) => s.services);
  const addOpenShift = useDemoStore((s) => s.addOpenShift);
  const init = () => ({ date: addDaysISO(todayISO(), 3), preset: 0, service: user.service, role: "ide" as StaffRole, bonus: "" });
  const [f, setF] = useState(init);
  useEffect(() => {
    if (open) setF(init());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = PRESETS[f.preset];
    addOpenShift({ conflictId: null, date: f.date, startTime: p.start, endTime: p.end, type: p.type, service: f.service, requiredRole: f.role, bonus: f.bonus.trim() || null });
    toast("Créneau publié — les collaborateurs compatibles sont notifiés");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="campaign"
      title="Publier un créneau à pourvoir"
      description="Les collaborateurs du métier concerné reçoivent une notification et peuvent se porter volontaires."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="open-shift-form" icon="campaign">
            Publier
          </Button>
        </>
      }
    >
      <form id="open-shift-form" onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Date">
          <Input type="date" required min={todayISO()} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        </Field>
        <Field label="Créneau">
          <Select value={f.preset} onChange={(e) => setF({ ...f, preset: Number(e.target.value) })}>
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label} ({SHIFT_LABELS[p.type]})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Service">
          <Select value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Métier requis">
          <Select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as StaffRole })}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Prime / avantage (optionnel)" className="md:col-span-2">
          <Input value={f.bonus} onChange={(e) => setF({ ...f, bonus: e.target.value })} placeholder="Ex. Prime de nuit + 15 %" />
        </Field>
      </form>
    </Modal>
  );
}
