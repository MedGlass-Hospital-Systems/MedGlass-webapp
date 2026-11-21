"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/layout/Icon";
import { cn } from "@/lib/utils/cn";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  icon?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

/** Échap + verrouillage du scroll + rendu dans <body>. */
function useOverlay(open: boolean, onClose: () => void) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return mounted;
}

function OverlayHeader({ title, description, icon, onClose }: Pick<OverlayProps, "title" | "description" | "icon" | "onClose">) {
  return (
    <div className="flex items-start gap-3 px-6 pt-6 pb-4 border-b border-white/10">
      {icon && (
        <span className="w-10 h-10 shrink-0 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
          <Icon name={icon} className="text-[22px]" />
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && <h2 className="text-headline-md font-headline-md text-on-surface leading-tight">{title}</h2>}
        {description && <p className="text-body-sm text-on-surface-variant mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="p-2 -mr-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors focus-ring"
      >
        <Icon name="close" className="text-[20px]" />
      </button>
    </div>
  );
}

export function Modal({ open, onClose, size = "md", ...props }: OverlayProps & { size?: keyof typeof sizes }) {
  const mounted = useOverlay(open, onClose);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "glass-strong rounded-xl w-full max-h-[90vh] flex flex-col shadow-2xl",
              sizes[size],
              props.className,
            )}
          >
            <OverlayHeader {...props} onClose={onClose} />
            <div className="px-6 py-5 overflow-y-auto scrollbar-thin flex-1">{props.children}</div>
            {props.footer && (
              <div className="px-6 py-4 border-t border-white/10 flex flex-wrap justify-end gap-3">{props.footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Drawer({ open, onClose, ...props }: OverlayProps) {
  const mounted = useOverlay(open, onClose);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "absolute right-0 top-0 h-full w-full sm:max-w-lg glass-strong border-l border-white/10 flex flex-col shadow-2xl",
              props.className,
            )}
          >
            <OverlayHeader {...props} onClose={onClose} />
            <div className="px-6 py-5 overflow-y-auto scrollbar-thin flex-1">{props.children}</div>
            {props.footer && (
              <div className="px-6 py-4 border-t border-white/10 flex flex-wrap justify-end gap-3">{props.footer}</div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
