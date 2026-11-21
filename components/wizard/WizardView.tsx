"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { PageHeader, Stepper } from "@/components/ui/Layout";
import { GenerationTutorial } from "@/components/onboarding/GenerationTutorial";
import { StepScope, type ScopeForm } from "./StepScope";
import { StepRules } from "./StepRules";
import { StepWishes } from "./StepWishes";
import { StepGenerate } from "./StepGenerate";
import { StepReview } from "./StepReview";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { addMonthsISO, monthEndISO, monthStartISO, todayISO } from "@/lib/utils/dates";
import type { PlanningStatus } from "@/lib/types/planning";

const STEPS = [
  { title: "Service & période", icon: "tune" },
  { title: "Règles métier", icon: "rule" },
  { title: "Souhaits de l'équipe", icon: "groups" },
  { title: "Génération IA", icon: "auto_fix" },
  { title: "Révision & publication", icon: "publish" },
];

const stepForStatus: Record<PlanningStatus, number> = { brouillon: 1, collecte: 2, generation: 3, revision: 4, publie: 4 };

function defaultScope(serviceId: string, serviceName: string): ScopeForm {
  const start = monthStartISO(addMonthsISO(todayISO(), 1));
  return { name: `${serviceName} — ${start.slice(0, 7)}`, serviceId, period: "mensuel", startDate: start, endDate: monthEndISO(start) };
}

export function WizardView() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useCurrentUser();
  const services = useDemoStore((s) => s.services);
  const createPlanning = useDemoStore((s) => s.createPlanning);
  const updatePlanning = useDemoStore((s) => s.updatePlanning);
  const rules = useDemoStore((s) => s.rules);

  const [planningId, setPlanningId] = useState<string | null>(params.get("planning"));
  const planning = useDemoStore((s) => s.plannings.find((p) => p.id === planningId));
  const serviceName = services.find((s) => s.id === user.service)?.name ?? "";
  const [scope, setScope] = useState<ScopeForm>(() => defaultScope(user.service, serviceName));
  const [step, setStep] = useState(0);

  // Reprise d'un planning existant (?planning=…) ou nouveau planning (?nouveau=1)
  useEffect(() => {
    const id = params.get("planning");
    if (params.get("nouveau")) {
      setPlanningId(null);
      setScope(defaultScope(user.service, serviceName));
      setStep(0);
    } else if (id) {
      setPlanningId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (!planning) return;
    setScope({ name: planning.name, serviceId: planning.serviceId, period: planning.period, startDate: planning.startDate, endDate: planning.endDate });
    setStep(stepForStatus[planning.status]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planning?.id]);

  const canNext = useMemo(() => {
    if (step === 0) return scope.name.trim() && scope.endDate >= scope.startDate;
    if (step === 3) return planning?.status === "revision";
    return step < 4;
  }, [step, scope, planning?.status]);

  const next = () => {
    if (step === 0) {
      if (planning) {
        updatePlanning(planning.id, scope);
      } else {
        const id = createPlanning(scope);
        setPlanningId(id);
        router.replace(`/wizard?planning=${id}`);
        toast("Brouillon de planning créé");
      }
    }
    if (step === 1 && planning) updatePlanning(planning.id, { ruleIds: rules.filter((r) => r.enabled).map((r) => r.id) });
    // Sans demande de souhaits, on passe directement en « prêt à générer ».
    // Si la collecte est en cours, elle reste ouverte jusqu'à la génération effective.
    if (step === 2 && planning?.status === "brouillon") {
      updatePlanning(planning.id, { status: "generation" });
    }
    setStep((s) => Math.min(4, s + 1));
  };

  return (
    <>
      <PageHeader
        title="Assistant de planning"
        description={planning ? `${planning.name}` : "Génération automatique d'un planning optimal en 5 étapes."}
        actions={
          <Button variant="secondary" icon="pending_actions" href="/planning?onglet=preparation">
            Plannings en préparation
          </Button>
        }
      />
      <GenerationTutorial />

      <GlassPanel className="p-4 md:p-6">
        <Stepper steps={STEPS} current={step} onSelect={planning ? setStep : undefined} />
      </GlassPanel>

      <GlassPanel className="p-5 md:p-8 min-h-[420px]">
        {step === 0 && <StepScope value={scope} onChange={setScope} />}
        {step === 1 && <StepRules />}
        {step === 2 && planning && <StepWishes planning={planning} />}
        {step === 3 && planning && <StepGenerate planning={planning} onDone={() => setStep(4)} />}
        {step === 4 && planning && <StepReview planning={planning} onRegenerate={() => setStep(3)} />}
      </GlassPanel>

      {step < 4 && (
        <div className="flex justify-between items-center">
          <Button onClick={() => setStep((s) => Math.max(0, s - 1))} variant="secondary" icon="arrow_back" disabled={step === 0}>
            Précédent
          </Button>
          {step !== 3 && (
            <Button onClick={next} icon="arrow_forward" iconPosition="right" disabled={!canNext}>
              {step === 0 && !planning ? "Créer le brouillon" : step === 2 ? "Passer à la génération" : "Suivant"}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
