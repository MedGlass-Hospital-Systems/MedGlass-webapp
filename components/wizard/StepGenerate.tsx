"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { toast } from "@/lib/store/toastStore";
import { cn } from "@/lib/utils/cn";
import type { Planning } from "@/lib/types/planning";

const PHASES = ["Lecture des règles RH", "Prise en compte des souhaits", "Répartition des gardes", "Vérification de la couverture"];

export function StepGenerate({ planning, onDone }: { planning: Planning; onDone: () => void }) {
  const generate = useDemoStore((s) => s.generatePlanning);
  const rulesCount = useDemoStore((s) => s.rules.filter((r) => r.enabled).length);
  const wishesCount = useDemoStore((s) => s.wishes.filter((w) => w.planningId === planning.id).length);
  const [phase, setPhase] = useState(-1);
  const generating = phase >= 0;

  const run = () => {
    setPhase(0);
    PHASES.forEach((_, i) => setTimeout(() => setPhase(i), i * 450));
    setTimeout(() => {
      const stats = generate(planning.id);
      setPhase(-1);
      if (stats) toast(`Planning généré : ${stats.shiftCount} postes`);
      onDone();
    }, PHASES.length * 450 + 300);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className={cn("w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mb-6", generating && "animate-pulse")}>
        <Icon name="auto_fix" className={cn("text-primary text-[44px]", generating && "animate-spin")} filled />
      </div>
      <h2 className="text-headline-md font-headline-md mb-2">{generating ? "Génération en cours…" : "Prêt à générer"}</h2>
      <p className="text-on-surface-variant max-w-md mb-6">
        L&apos;assistant croise {rulesCount} règle(s) active(s), {wishesCount} saisie(s) de souhaits et les compétences de l&apos;équipe.
        Vous pourrez ajuster avant publication.
      </p>
      {planning.status === "collecte" && !generating && wishesCount < planning.requestedStaffIds.length && (
        <p className="text-[12px] text-warning mb-4 flex items-center gap-1.5">
          <Icon name="info" className="text-[16px]" />
          {planning.requestedStaffIds.length - wishesCount} collaborateur(s) n&apos;ont pas encore répondu : la génération clôturera la collecte.
        </p>
      )}
      {generating ? (
        <ul className="space-y-2 text-left">
          {PHASES.map((p, i) => (
            <li key={p} className={cn("flex items-center gap-2 text-body-sm", i <= phase ? "text-on-surface" : "text-on-surface-variant/50")}>
              <Icon name={i < phase ? "check_circle" : i === phase ? "progress_activity" : "radio_button_unchecked"} className={cn("text-[18px]", i < phase && "text-success", i === phase && "animate-spin text-primary")} />
              {p}
            </li>
          ))}
        </ul>
      ) : (
        <Button size="lg" icon="auto_fix" onClick={run}>
          {planning.status === "revision" ? "Régénérer le planning" : "Générer le planning"}
        </Button>
      )}
    </div>
  );
}
