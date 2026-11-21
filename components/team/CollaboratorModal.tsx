"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { CONTRACT_LABELS, ROLE_LABELS } from "@/lib/utils/labels";
import { initialsOf } from "@/lib/utils/id";
import { todayISO } from "@/lib/utils/dates";
import type { ContractKind, StaffRole } from "@/lib/types/planning";

const ROLES: StaffRole[] = ["ide", "as", "praticien", "interne", "cadre", "secretaire"];
const CONTRACTS: ContractKind[] = ["vacataire", "interimaire", "prestataire", "contractuel", "titulaire"];

const empty = {
  firstName: "",
  lastName: "",
  role: "ide" as StaffRole,
  roleLabel: "",
  contract: "vacataire" as ContractKind,
  company: "",
  email: "",
  phone: "",
  contractedHours: 24,
  skills: "",
};

/** Ajout d'un vacataire, intérimaire, prestataire ou nouveau collaborateur. */
export function CollaboratorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useCurrentUser();
  const services = useDemoStore((s) => s.services);
  const addStaff = useDemoStore((s) => s.addStaff);
  const [form, setForm] = useState({ ...empty, service: user.service });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const external = form.contract === "interimaire" || form.contract === "prestataire";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addStaff({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      initials: initialsOf(form.firstName, form.lastName),
      role: form.role,
      roleLabel: form.roleLabel.trim() || `${ROLE_LABELS[form.role]} ${CONTRACT_LABELS[form.contract].toLowerCase()}`,
      service: form.service,
      appRole: "soignant",
      contract: form.contract,
      company: external ? form.company.trim() || undefined : undefined,
      email: form.email.trim(),
      phone: form.phone.trim(),
      contractedHours: Number(form.contractedHours) || 0,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name, level: 3 })),
      certifications: [],
      leaveBalance: { conges: 0, rtt: 0 },
      joinedAt: todayISO(),
      weeklyHours: 0
    });
    toast(`${form.firstName} ${form.lastName} a été ajouté(e) à l'annuaire`);
    setForm({ ...empty, service: user.service });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon="person_add"
      title="Ajouter un collaborateur"
      description="Vacataire, intérimaire, prestataire ou nouvel arrivant : il apparaîtra dans l'annuaire et pourra être planifié."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="collaborator-form" icon="check">
            Ajouter
          </Button>
        </>
      }
    >
      <form id="collaborator-form" onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Prénom">
          <Input required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        </Field>
        <Field label="Nom">
          <Input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </Field>
        <Field label="Type de contrat">
          <Select value={form.contract} onChange={(e) => set("contract", e.target.value as ContractKind)}>
            {CONTRACTS.map((c) => (
              <option key={c} value={c}>
                {CONTRACT_LABELS[c]}
              </option>
            ))}
          </Select>
        </Field>
        {external ? (
          <Field label="Société / agence">
            <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Ex. MediTemp Intérim" />
          </Field>
        ) : (
          <Field label="Heures contractuelles / semaine">
            <Input type="number" min={0} max={60} value={form.contractedHours} onChange={(e) => set("contractedHours", Number(e.target.value))} />
          </Field>
        )}
        <Field label="Métier">
          <Select value={form.role} onChange={(e) => set("role", e.target.value as StaffRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Intitulé du poste" hint="Laisser vide pour un intitulé automatique">
          <Input value={form.roleLabel} onChange={(e) => set("roleLabel", e.target.value)} placeholder="Ex. IDE de nuit" />
        </Field>
        <Field label="Service">
          <Select value={form.service} onChange={(e) => set("service", e.target.value)}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Téléphone">
          <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="06 00 00 00 00" />
        </Field>
        <Field label="E-mail" className="md:col-span-2">
          <Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Compétences" hint="Séparées par des virgules" className="md:col-span-2">
          <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Soins post-op, Hygiène" />
        </Field>
      </form>
    </Modal>
  );
}
