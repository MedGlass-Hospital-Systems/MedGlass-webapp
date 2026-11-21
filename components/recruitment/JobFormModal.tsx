"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { CONTRACT_TYPES, JOB_CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/utils/labels";
import { HOSPITAL } from "@/lib/store/seed";
import { addDaysISO, todayISO } from "@/lib/utils/dates";
import type { ContractType, JobCategory, JobPriority, JobScope } from "@/lib/types/recruitment";

const ICONS: Record<JobCategory, string> = { medecin: "stethoscope", paramedical: "vaccines", cadre: "supervisor_account" };

export function JobFormModal({ open, onClose, scope = "externe" }: { open: boolean; onClose: () => void; scope?: JobScope }) {
  const user = useCurrentUser();
  const services = useDemoStore((s) => s.services);
  const addJob = useDemoStore((s) => s.addJob);
  const init = () => ({
    title: "",
    service: user.service,
    site: `${HOSPITAL.name} · ${HOSPITAL.sites[0]}`,
    contractType: "CDI" as ContractType,
    category: "paramedical" as JobCategory,
    scope,
    priority: "normale" as JobPriority,
    closesAt: addDaysISO(todayISO(), 30),
    description: "",
    requirements: "",
  });
  const [f, setF] = useState(init);
  useEffect(() => {
    if (open) setF(init());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scope]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addJob({
      title: f.title.trim(),
      service: f.service,
      site: f.site,
      contractType: f.contractType,
      category: f.category,
      scope: f.scope,
      priority: f.priority,
      closesAt: f.closesAt || null,
      icon: ICONS[f.category],
      description: f.description.trim(),
      requirements: f.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
      serviceLabel: "",
      applications: 0
    });
    toast(f.scope === "interne" ? "Offre de mobilité interne publiée" : "Poste publié");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon="post_add"
      title="Publier un poste"
      description="L'offre apparaît immédiatement dans la liste des postes ouverts."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="job-form" icon="publish">
            Publier
          </Button>
        </>
      }
    >
      <form id="job-form" onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Intitulé du poste" className="md:col-span-2">
          <Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Ex. IDE de nuit — Réanimation" />
        </Field>
        <Field label="Diffusion">
          <Select value={f.scope} onChange={(e) => setF({ ...f, scope: e.target.value as JobScope })}>
            <option value="externe">Offre externe (publique)</option>
            <option value="interne">Mobilité interne (personnel du CHU)</option>
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
        <Field label="Catégorie">
          <Select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as JobCategory })}>
            {(Object.keys(JOB_CATEGORY_LABELS) as JobCategory[]).map((c) => (
              <option key={c} value={c}>
                {JOB_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Contrat">
          <Select value={f.contractType} onChange={(e) => setF({ ...f, contractType: e.target.value as ContractType })}>
            {CONTRACT_TYPES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Priorité">
          <Select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as JobPriority })}>
            {(Object.keys(PRIORITY_LABELS) as JobPriority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Clôture des candidatures" hint="Laisser vide : au fil de l'eau">
          <Input type="date" value={f.closesAt} onChange={(e) => setF({ ...f, closesAt: e.target.value })} />
        </Field>
        <Field label="Site" className="md:col-span-2">
          <Select value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })}>
            {HOSPITAL.sites.map((s) => (
              <option key={s} value={`${HOSPITAL.name} · ${s}`}>
                {HOSPITAL.name} · {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea required value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </Field>
        <Field label="Prérequis" hint="Un par ligne" className="md:col-span-2">
          <Textarea value={f.requirements} onChange={(e) => setF({ ...f, requirements: e.target.value })} placeholder={"DE infirmier\nExpérience bloc 2 ans"} />
        </Field>
      </form>
    </Modal>
  );
}
