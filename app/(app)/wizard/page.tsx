"use clients"

import GenerationTutorial from "@/components/modals/GeneratePlanning";
import { WizardClient } from "@/components/wizard/WizardClient";

export default function WizardPage() {
  return (
    <>
      <header>
        <h1 className="text-display-lg text-on-surface mb-1">Assistant de planning</h1>
        <p className="text-on-surface-variant">
          Génération automatique d'un planning optimal en 5 étapes.
        </p>
      </header>
      <WizardClient />
    </>
  );
}
