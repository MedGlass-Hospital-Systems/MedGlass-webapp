import { Suspense } from "react";
import { PlanningView } from "@/components/planning/PlanningView";

export const metadata = { title: "Planning · MedGlass" };

export default function PlanningPage() {
  return (
    <Suspense>
      <PlanningView />
    </Suspense>
  );
}
