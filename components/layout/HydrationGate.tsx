"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useDemoStore } from "@/lib/store/demoStore";
import { Icon } from "./Icon";

/**
 * Le site est exporté en statique : on n'affiche l'application qu'une fois
 * le store relu depuis le localStorage (évite les écarts serveur / navigateur).
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.resolve(useDemoStore.persist.rehydrate()).finally(() => {
      useDemoStore.getState().realignDates();
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-on-surface-variant">
        <Icon name="local_hospital" className="text-primary text-[40px] animate-pulse" filled />
        <p className="text-body-sm">Chargement de MedGlass…</p>
      </div>
    );
  }
  return <>{children}</>;
}
