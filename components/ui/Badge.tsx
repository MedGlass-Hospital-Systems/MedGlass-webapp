import { cn } from "@/lib/utils/cn";
import type { Tone } from "@/lib/utils/labels";

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const tones: Record<Tone, string> = {
  neutral: "bg-white/5 text-on-surface-variant border-white/10",
  primary: "bg-primary/15 text-primary border-primary/30",
  secondary: "bg-secondary/15 text-secondary border-secondary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-error/20 text-error border-error/30",
  tertiary: "bg-tertiary/15 text-tertiary border-tertiary/30",
};

export function Badge({ tone = "neutral", children, className, onClick }: BadgeProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-caps text-[10px] border whitespace-nowrap",
        tones[tone],
        onClick && "cursor-pointer hover:brightness-125 transition",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
