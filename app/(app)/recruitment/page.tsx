import { Suspense } from "react";
import { RecruitmentView } from "@/components/recruitment/RecruitmentView";

export const metadata = { title: "Recrutement · MedGlass" };

export default function RecruitmentPage() {
  return (
    <Suspense>
      <RecruitmentView />
    </Suspense>
  );
}
