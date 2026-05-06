import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong";
}

export function GlassPanel({ className, variant = "default", ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        variant === "strong" ? "glass-strong" : "glass-panel",
        "rounded-xl",
        className,
      )}
      {...props}
    />
  );
}
