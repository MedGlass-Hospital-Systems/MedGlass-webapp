import { cn } from "@/lib/utils/cn";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className, filled }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none",
        filled && "filled",
        className,
      )}
      aria-hidden
    >
      {name}
    </span>
  );
}
