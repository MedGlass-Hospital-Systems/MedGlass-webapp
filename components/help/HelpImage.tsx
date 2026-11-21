"use client";

import { useState } from "react";
import { Icon } from "@/components/layout/Icon";

/** Capture d'écran d'un tuto ; affiche un cadre neutre si l'image n'existe pas encore. */
export function HelpImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="aspect-video rounded-lg border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-on-surface-variant gap-2">
        <Icon name="image" className="text-[32px]" />
        <span className="text-[12px]">Capture à venir</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="w-full rounded-lg border border-white/10 shadow-2xl" />
  );
}
