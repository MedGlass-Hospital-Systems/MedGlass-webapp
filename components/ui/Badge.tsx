import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "tertiary";

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: "bg-white/5 text-on-surface-variant border-white/10",
  primary: "bg-primary/15 text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-error/20 text-error border-error/30",
  tertiary: "bg-tertiary/15 text-tertiary border-tertiary/30",
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full font-label-caps text-[10px] border",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
