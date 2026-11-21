"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDemoStore } from "@/lib/store/demoStore";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";

const STEPS = [
  {
    title: "Service et période",
    body: "Sélectionnez le service concerné et la plage de dates pour laquelle le planning sera actif. Le planning est enregistré en brouillon.",
  },
  {
    title: "Règles métier",
    body: "Activez les règles légales et internes : repos obligatoires, plafonds horaires, équité des gardes. Vous pouvez en ajouter.",
  },
  {
    title: "Souhaits de l'équipe",
    body: "Envoyez une demande de souhaits : chaque collaborateur est notifié et saisit ses congés, préférences et absences.",
  },
  {
    title: "Génération automatique",
    body: "L'assistant croise règles, compétences et souhaits pour proposer un planning en quelques secondes.",
  },
  {
    title: "Révision et publication",
    body: "Vérifiez les indicateurs, ajustez si besoin puis publiez : toute l'équipe reçoit une notification.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

/** Visite guidée de l'assistant : met en lumière chaque étape du stepper (#step-target-i). */
export function GenerationTutorial() {
  const seen = useDemoStore((s) => s.tutorials.generation);
  const setSeen = useDemoStore((s) => s.setTutorialSeen);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (seen) return;
    const update = () => {
      const el = document.getElementById(`step-target-${step}`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    document.getElementById(`step-target-${step}`)?.scrollIntoView({ block: "nearest", inline: "center" });
    const t = setTimeout(update, 60);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step, seen]);

  if (seen || !rect) return null;
  const close = () => setSeen("generation", true);
  const data = STEPS[step];
  const cardLeft = Math.min(Math.max(16, rect.left + rect.width / 2 - 170), window.innerWidth - 356);

  return createPortal(
    <div className="fixed inset-0 z-[65]">
      <div
        className="absolute rounded-full ring-[9999px] ring-black/65 transition-all duration-300 pointer-events-none"
        style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
      />
      <div
        className="absolute w-[340px] glass-strong rounded-xl p-5 shadow-2xl transition-all duration-300"
        style={{ top: rect.top + rect.height + 18, left: cardLeft }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-caps text-[10px] text-primary bg-primary/15 px-2 py-1 rounded-full">
            Étape {step + 1} sur {STEPS.length}
          </span>
          <button type="button" onClick={close} aria-label="Fermer le tutoriel" className="text-on-surface-variant hover:text-on-surface">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-1">{data.title}</h3>
        <p className="text-body-sm text-on-surface-variant mb-4">{data.body}</p>
        <div className="flex justify-between">
          <Button size="sm" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Précédent
          </Button>
          <Button size="sm" icon={step === STEPS.length - 1 ? "check" : "arrow_forward"} iconPosition="right" onClick={() => (step === STEPS.length - 1 ? close() : setStep((s) => s + 1))}>
            {step === STEPS.length - 1 ? "Terminer" : "Suivant"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
