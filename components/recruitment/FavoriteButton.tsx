"use client";

import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { toast } from "@/lib/store/toastStore";
import { cn } from "@/lib/utils/cn";

/** Étoile « favori » pour garder un profil de candidat à consulter plus tard. */
export function FavoriteButton({ candidateId, size = 18, className }: { candidateId: string; size?: number; className?: string }) {
  const isFav = useDemoStore((s) => s.favorites.includes(candidateId));
  const toggle = useDemoStore((s) => s.toggleFavorite);
  return (
    <button
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => {
        e.stopPropagation();
        toggle(candidateId);
        toast(isFav ? "Retiré des favoris" : "Ajouté aux favoris");
      }}
      className={cn(
        "p-1.5 rounded-full transition-colors focus-ring",
        isFav ? "text-warning hover:bg-warning/10" : "text-on-surface-variant hover:text-warning hover:bg-white/5",
        className,
      )}
    >
      <Icon name="star" filled={isFav} style={{ fontSize: size }} />
    </button>
  );
}
