import { cn } from "@/lib/utils/cn";

/** Jauge 5 barres pour un niveau de compétence. */
export function SkillLevel({ level, className }: { level: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 items-end", className)} aria-label={`Niveau ${level} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn("w-1.5 rounded-sm", i < level ? "bg-primary" : "bg-white/10")} style={{ height: 6 + i * 2 }} />
      ))}
    </span>
  );
}
