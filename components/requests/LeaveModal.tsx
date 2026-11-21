"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, Toggle } from "@/components/ui/Form";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, usePermissions } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { LEAVE_LABELS } from "@/lib/utils/labels";
import { addDaysISO, rangeDates, todayISO } from "@/lib/utils/dates";
import type { LeaveType } from "@/lib/types/planning";

const TYPES: LeaveType[] = ["conges", "rtt", "formation", "maladie", "maternite"];

export function LeaveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const staff = useDemoStore((s) => s.staff);
  const addLeave = useDemoStore((s) => s.addLeave);

  const initial = () => ({
    staffId: user.id,
    type: "conges" as LeaveType,
    startDate: addDaysISO(todayISO(), 7),
    endDate: addDaysISO(todayISO(), 9),
    reason: "",
    autoValidate: false,
  });
  const [form, setForm] = useState(initial);
  useEffect(() => {
    if (open) setForm(initial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user.id]);

  const person = staff.find((s) => s.id === form.staffId) ?? user;
  const team = staff.filter((s) => s.service === user.service);
  const workingDays = form.endDate >= form.startDate ? rangeDates(form.startDate, form.endDate).filter((d) => !d.isWeekend).length : 0;
  const balance = form.type === "conges" || form.type === "rtt" ? person.leaveBalance[form.type] : null;
  const exceeds = balance !== null && workingDays > balance;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.endDate < form.startDate) return toast("La date de fin doit suivre la date de début", "error");
    addLeave(
      { staffId: form.staffId, type: form.type, startDate: form.startDate, endDate: form.endDate, reason: form.reason || undefined },
      isManager && form.autoValidate,
    );
    toast(isManager && form.autoValidate ? "Absence enregistrée et validée" : "Demande envoyée à votre cadre");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="edit_calendar"
      title="Poser une absence"
      description="Congés, RTT, formation… La demande est transmise au manager du service."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="leave-form" icon="send">
            Envoyer la demande
          </Button>
        </>
      }
    >
      <form id="leave-form" onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isManager && (
          <Field label="Collaborateur" className="md:col-span-2">
            <Select value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
              {team.map((s) => (
                <option key={s.id} value={s.id}>
                  {fullName(s)} — {s.roleLabel}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Type d'absence" className="md:col-span-2">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LeaveType })}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {LEAVE_LABELS[t]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Du">
          <Input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </Field>
        <Field label="Au">
          <Input type="date" required min={form.startDate} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </Field>
        <div className="md:col-span-2 p-3 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-3 text-body-sm">
          <Icon name="event_available" className="text-primary text-[20px]" />
          <span className="flex-1">
            <strong className="text-on-surface">{workingDays}</strong> jour(s) ouvré(s)
            {balance !== null && (
              <>
                {" "}· solde {LEAVE_LABELS[form.type].toLowerCase()} : <strong className="text-on-surface">{balance} j</strong>
              </>
            )}
          </span>
          {exceeds && <span className="text-warning text-[12px]">Solde insuffisant</span>}
        </div>
        <Field label="Motif (optionnel)" className="md:col-span-2">
          <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Ex. vacances en famille" />
        </Field>
        {isManager && (
          <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg border border-white/10">
            <span className="text-body-sm">Valider immédiatement (saisie par le manager)</span>
            <Toggle label="Valider immédiatement" checked={form.autoValidate} onChange={(v) => setForm({ ...form, autoValidate: v })} />
          </div>
        )}
      </form>
    </Modal>
  );
}
