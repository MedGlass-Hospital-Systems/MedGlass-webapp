import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconPosition?: "left" | "right";
  children?: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:opacity-90 shadow-sm",
  secondary: "glass-button text-on-surface hover:text-primary",
  ghost: "text-primary hover:bg-primary/10",
  danger: "bg-error/20 text-error border border-error/30 hover:bg-error/30",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-label-caps font-label-caps",
  md: "px-4 py-2.5 text-label-caps font-label-caps",
  lg: "px-6 py-3 text-body-base font-semibold",
};

interface AnchorProps extends BaseProps, Omit<React.ComponentProps<typeof Link>, keyof BaseProps> {
  href: string;
}
interface ButtonElProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}

export function Button(props: AnchorProps | ButtonElProps) {
  const { variant = "primary", size = "md", icon, iconPosition = "left", className, children, ...rest } = props;
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full transition-all focus-ring",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link className={cls} {...(rest as React.ComponentProps<typeof Link>)} href={props.href}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
