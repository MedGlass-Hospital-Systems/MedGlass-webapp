import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  style?: CSSProperties;
}

/** Icône Material Symbols (police chargée dans app/layout.tsx). */
export function Icon({ name, className, filled, style }: IconProps) {
  return (
    <span className={cn("material-symbols-outlined select-none", filled && "filled", className)} style={style} aria-hidden>
      {name}
    </span>
  );
}
