"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Form";
import { EmptyState } from "@/components/ui/Layout";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, usePermissions } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { SHIFT_LABELS, WORKED_TYPES, isDoctor } from "@/lib/utils/labels";
import { addDaysISO, fmt, todayISO } from "@/lib/utils/dates";
import type { Staff } from "@/lib/types/planning";

const sameJob = (a: Staff, b: Staff) => a.role === b.role || (isDoctor(a.role) && isDoctor(b.role));

/** Proposer un de ses postes à un collègue du même métier, libre ce jour-là. */
export function SwapModal({ open, onClose, shiftId }: { open: boolean; onClose: () => void; shiftId?: string }) {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const staff = useDemoStore((s) => s.staff);
  const shifts = useDemoStore((s) => s.shifts);
  const addSwap = useDemoStore((s) => s.addSwap);

  const presetOwner = shiftId ? shifts.find((s) => s.id === shiftId)?.staffId : undefined;
  const [ownerId, setOwnerId] = useState(presetOwner ?? user.id);
  const [selectedShift, setSelectedShift] = useState(shiftId ?? "");
  const [toId, setToId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setOwnerId(presetOwner ?? user.id);
    setSelectedShift(shiftId ?? "");
    setToId("");
    setMessage("");
  }, [open, shiftId, presetOwner, user.id]);

  const owner = staff.find((s) => s.id === ownerId) ?? user;
  const today = todayISO();
  const myShifts = useMemo(
    () =>
      shifts
        .filter((s) => s.staffId === owner.id && WORKED_TYPES.includes(s.type) && s.date >= today && s.date <= addDaysISO(today, 45))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [shifts, owner.id, today],
  );
  const shift = shifts.find((s) => s.id === selectedShift);
  const colleagues = useMemo(() => {
    if (!shift) return [];
    return staff.filter(
      (s) =>
        s.id !== owner.id &&
        s.service === owner.service &&
        sameJob(s, owner) &&
        !shifts.some((x) => x.staffId === s.id && x.date === shift.date),
    );
  }, [shift, staff, shifts, owner]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!shift || !toId) return;
    addSwap({ fromStaffId: owner.id, toStaffId: toId, shiftId: shift.id, message: message || undefined });
    toast(`Proposition envoyée à ${fullName(staff.find((s) => s.id === toId))}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="swap_horiz"
      title="Échanger un poste"
      description="Le collègue sollicité reçoit une notification et peut accepter ou refuser."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="swap-form" icon="send" disabled={!shift || !toId}>
            Proposer l&apos;échange
          </Button>
        </>
      }
    >
      <form id="swap-form" onSubmit={submit} className="space-y-4">
        {isManager && !shiftId && (
          <Field label="Pour le collaborateur">
            <Select
              value={ownerId}
              onChange={(e) => {
                setOwnerId(e.target.value);
                setSelectedShift("");
                setToId("");
              }}
            >
              {staff
                .filter((s) => s.service === user.service)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {fullName(s)} — {s.roleLabel}
                  </option>
                ))}
            </Select>
          </Field>
        )}
        {myShifts.length === 0 && !shift ? (
          <EmptyState icon="event_busy" title="Aucun poste à venir" description="Aucun poste n'est planifié dans les 45 prochains jours." />
        ) : (
          <Field label="Poste à céder">
            <Select
              required
              value={selectedShift}
              onChange={(e) => {
                setSelectedShift(e.target.value);
                setToId("");
              }}
            >
              <option value="">Choisir un poste…</option>
              {(shift && !myShifts.includes(shift) ? [shift, ...myShifts] : myShifts).map((s) => (
                <option key={s.id} value={s.id}>
                  {fmt(s.date, "EEE d MMM")} · {SHIFT_LABELS[s.type]} {s.startTime}–{s.endTime}
                </option>
              ))}
            </Select>
          </Field>
        )}
        {shift && (
          <Field label="Proposer à" hint={colleagues.length ? `${colleagues.length} collègue(s) du même métier sont libres ce jour-là` : undefined}>
            {colleagues.length ? (
              <Select required value={toId} onChange={(e) => setToId(e.target.value)}>
                <option value="">Choisir un collègue…</option>
                {colleagues.map((c) => (
                  <option key={c.id} value={c.id}>
                    {fullName(c)} — {c.roleLabel}
                  </option>
                ))}
              </Select>
            ) : (
              <p className="text-body-sm text-warning">Aucun collègue du même métier n&apos;est disponible ce jour-là. Publiez plutôt le créneau dans la bourse au poste.</p>
            )}
          </Field>
        )}
        <Field label="Message (optionnel)">
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ex. je te rends ton mardi suivant" />
        </Field>
      </form>
    </Modal>
  );
}
