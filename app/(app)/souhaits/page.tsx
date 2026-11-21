import { Suspense } from "react";
import { WishesView } from "@/components/wishes/WishesView";

export const metadata = { title: "Mes souhaits · MedGlass" };

export default function SouhaitsPage() {
  return (
    <Suspense>
      <WishesView />
    </Suspense>
  );
}
