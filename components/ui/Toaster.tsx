"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/lib/store/toastStore";
import { Icon } from "@/components/layout/Icon";
import { cn } from "@/lib/utils/cn";

const toneIcon: Record<string, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            className="glass-strong rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl"
          >
            <Icon
              name={toneIcon[t.tone] ?? "info"}
              filled
              className={cn(
                "text-[20px]",
                t.tone === "error" ? "text-error" : t.tone === "warning" ? "text-warning" : t.tone === "success" ? "text-success" : "text-primary",
              )}
            />
            <p className="text-body-sm text-on-surface flex-1">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Fermer" className="text-on-surface-variant hover:text-on-surface">
              <Icon name="close" className="text-[18px]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
