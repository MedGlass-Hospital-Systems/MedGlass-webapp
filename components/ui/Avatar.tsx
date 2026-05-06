import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  tone?: "primary" | "tertiary" | "neutral";
}

const sizes = { sm: "w-8 h-8 text-[11px]", md: "w-10 h-10 text-xs", lg: "w-14 h-14 text-sm" };
const tones = {
  primary: "bg-primary/20 text-primary",
  tertiary: "bg-tertiary/20 text-tertiary",
  neutral: "bg-white/5 text-on-surface-variant",
};

export function Avatar({ initials, size = "md", className, tone = "primary" }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-label-caps border border-white/10",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {initials}
    </div>
  );
}
