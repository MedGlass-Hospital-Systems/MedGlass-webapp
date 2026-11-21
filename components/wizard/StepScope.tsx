"use client";

import { Field, Input, Select } from "@/components/ui/Form";
import { useDemoStore } from "@/lib/store/demoStore";
import { addDaysISO, daysBetween, monthEndISO } from "@/lib/utils/dates";
import type { PlanningPeriod } from "@/lib/types/planning";

export interface ScopeForm {
  name: string;
  serviceId: string;
  period: PlanningPeriod;
  startDate: string;
  endDate: string;
}

const PERIODS: { id: PlanningPeriod; label: string }[] = [
  { id: "hebdomadaire", label: "Hebdomadaire" },
  { id: "bi-hebdomadaire", label: "Bi-hebdomadaire" },
  { id: "mensuel", label: "Mensuel" },
];

const endFor = (period: PlanningPeriod, start: string) =>
  period === "hebdomadaire" ? addDaysISO(start, 6) : period === "bi-hebdomadaire" ? addDaysISO(start, 13) : monthEndISO(start);

export function StepScope({ value, onChange }: { value: ScopeForm; onChange: (v: ScopeForm) => void }) {
  const services = useDemoStore((s) => s.services);
  const set = (patch: Partial<ScopeForm>) => onChange({ ...value, ...patch });
  const days = daysBetween(value.startDate, value.endDate) + 1;

  return (
    <div>
      <h2 className="text-headline-md font-headline-md mb-2">Service & période</h2>
      <p className="text-on-surface-variant mb-8">Sélectionnez le périmètre du planning à générer.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Nom du planning" className="md:col-span-2">
          <Input required value={value.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="Service">
          <Select
            value={value.serviceId}
            onChange={(e) => {
              const s = services.find((x) => x.id === e.target.value);
              set({ serviceId: e.target.value, name: `${s?.name ?? ""} — ${value.startDate.slice(0, 7)}` });
            }}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Type de cycle">
          <Select
            value={value.period}
            onChange={(e) => {
              const period = e.target.value as PlanningPeriod;
              set({ period, endDate: endFor(period, value.startDate) });
            }}
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Date de début">
          <Input
            type="date"
            value={value.startDate}
            onChange={(e) => e.target.value && set({ startDate: e.target.value, endDate: endFor(value.period, e.target.value) })}
          />
        </Field>
        <Field label="Date de fin" hint={days > 0 ? `${days} jours` : "La fin doit suivre le début"}>
          <Input type="date" min={value.startDate} value={value.endDate} onChange={(e) => set({ endDate: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}
