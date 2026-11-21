import { Suspense } from "react";
import { WizardView } from "@/components/wizard/WizardView";

export const metadata = { title: "Assistant de planning · MedGlass" };

export default function WizardPage() {
  return (
    <Suspense>
      <WizardView />
    </Suspense>
  );
}
