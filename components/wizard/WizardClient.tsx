"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const steps = [
  { id: 1, title: "Service & période", icon: "tune" },
  { id: 2, title: "Règles métier", icon: "rule" },
  { id: 3, title: "Contraintes équipe", icon: "groups" },
  { id: 4, title: "Génération IA", icon: "auto_fix" },
  { id: 5, title: "Révision & publication", icon: "publish" },
];

export function WizardClient() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  const next = () => {
    if (step === 4) {
      setGenerating(true);
      setTimeout(() => {
        setGenerating(false);
        setStep(5);
      }, 1800);
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <>
      {/* Stepper */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {steps.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-2 shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
                    active && "bg-primary text-on-primary",
                    done && "bg-primary/15 text-primary",
                    !active && !done && "text-on-surface-variant",
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                      active ? "bg-on-primary/20" : done ? "bg-primary/20" : "bg-white/5",
                    )}
                  >
                    {done ? <Icon name="check" className="text-[16px]" /> : s.id}
                  </span>
                  <span className="font-label-caps text-label-caps whitespace-nowrap">
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span className="w-6 h-px bg-white/10 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </GlassPanel>

      {/* Step */}
      <GlassPanel className="p-8 min-h-[480px]">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 generating={generating} />}
        {step === 5 && <Step5 />}
      </GlassPanel>

      {/* Footer actions */}
      <div className="flex justify-between items-center">
        <Button onClick={prev} variant="secondary" icon="arrow_back" disabled={step === 1}>
          Précédent
        </Button>
        {step < 5 ? (
          <Button onClick={next} icon={step === 4 ? "auto_fix" : "arrow_forward"} iconPosition="right">
            {step === 4 ? "Générer le planning" : "Suivant"}
          </Button>
        ) : (
          <Button href="/planning" icon="check">
            Publier le planning
          </Button>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
        {label}
      </span>
      {children}
      {hint && <span className="text-[11px] text-on-surface-variant mt-1 block">{hint}</span>}
    </label>
  );
}

function Step1() {
  return (
    <div>
      <h2 className="text-headline-md font-headline-md mb-2">Service & période</h2>
      <p className="text-on-surface-variant mb-8">Sélectionnez le périmètre du planning à générer.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Service">
          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface focus-ring">
            <option>Chirurgie générale</option>
            <option>Réanimation</option>
            <option>Cardiologie</option>
            <option>Urgences</option>
          </select>
        </Field>
        <Field label="Type de planning">
          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface focus-ring">
            <option>Hebdomadaire</option>
            <option>Bi-hebdomadaire</option>
            <option>Mensuel</option>
          </select>
        </Field>
        <Field label="Date de début">
          <input
            type="date"
            defaultValue="2026-05-04"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface focus-ring"
          />
        </Field>
        <Field label="Date de fin">
          <input
            type="date"
            defaultValue="2026-05-10"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface focus-ring"
          />
        </Field>
      </div>
    </div>
  );
}

function Step2() {
  const rules = [
    { t: "Repos quotidien minimum 11h", on: true },
    { t: "Repos hebdomadaire minimum 35h", on: true },
    { t: "Maximum 48h hebdomadaires", on: true },
    { t: "Pas plus de 6 jours travaillés consécutifs", on: true },
    { t: "Garde de nuit suivie d'un repos compensateur", on: true },
    { t: "Lissage des week-ends sur 6 mois", on: false },
  ];
  return (
    <div>
      <h2 className="text-headline-md font-headline-md mb-2">Règles métier</h2>
      <p className="text-on-surface-variant mb-8">
        Les règles RH appliquées à la génération du planning.
      </p>
      <div className="space-y-3">
        {rules.map((r, i) => (
          <label
            key={i}
            className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
          >
            <span className="text-on-surface">{r.t}</span>
            <input type="checkbox" defaultChecked={r.on} className="w-5 h-5 rounded text-primary bg-transparent border-white/20" />
          </label>
        ))}
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div>
      <h2 className="text-headline-md font-headline-md mb-2">Contraintes équipe</h2>
      <p className="text-on-surface-variant mb-8">
        Disponibilités, congés validés, préférences déclarées et compétences requises.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { i: "event_busy", t: "12 absences", d: "Congés et formations validés" },
          { i: "psychology", t: "5 compétences", d: "Spécialités requises au bloc" },
          { i: "favorite", t: "8 préférences", d: "Souhaits soignants pris en compte" },
        ].map((c) => (
          <div key={c.t} className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <Icon name={c.i} className="text-primary text-[24px] mb-2" filled />
            <p className="font-semibold mb-1">{c.t}</p>
            <p className="text-body-sm text-on-surface-variant">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4({ generating }: { generating: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div
        className={cn(
          "w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mb-6",
          generating && "animate-pulse",
        )}
      >
        <Icon name="auto_fix" className={cn("text-primary text-[44px]", generating && "animate-spin")} filled />
      </div>
      <h2 className="text-headline-md font-headline-md mb-2">
        {generating ? "Génération en cours…" : "Prêt à générer"}
      </h2>
      <p className="text-on-surface-variant max-w-md">
        {generating
          ? "L'assistant croise contraintes, compétences et règles RH pour proposer un planning optimal."
          : "L'assistant proposera un planning optimisé. Vous pourrez le modifier avant publication."}
      </p>
    </div>
  );
}

function Step5() {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Badge tone="success" className="mb-3">
            <Icon name="check_circle" className="text-[14px] mr-1" filled />
            Planning généré
          </Badge>
          <h2 className="text-headline-md font-headline-md mb-1">Aperçu du planning</h2>
          <p className="text-on-surface-variant">
            8 soignants · 142 shifts · 0 conflit critique
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon="edit">
            Ajuster
          </Button>
          <Button variant="secondary" size="sm" icon="download">
            Exporter
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Heures planifiées", v: "342h" },
          { l: "Heures sup", v: "8h" },
          { l: "Couverture", v: "100%" },
          { l: "Équité (gardes)", v: "92%" },
        ].map((s) => (
          <div key={s.l} className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <p className="text-body-sm text-on-surface-variant">{s.l}</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20 flex items-start gap-3">
        <Icon name="verified" className="text-success text-[24px] mt-0.5" filled />
        <div>
          <p className="font-semibold text-success">Toutes les règles RH respectées</p>
          <p className="text-body-sm text-on-surface-variant">
            Une fois publié, les soignants reçoivent une notification et peuvent demander des échanges.
          </p>
        </div>
      </div>
    </div>
  );
}
