"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/layout/Icon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { JobRole } from "@/lib/types/recruitment";

const priorityTone: Record<JobRole["priority"], "error" | "warning" | "neutral"> = {
  urgent: "error",
  haute: "warning",
  normale: "neutral",
};

const priorityLabel: Record<JobRole["priority"], string> = {
  urgent: "Urgent",
  haute: "Priorité haute",
  normale: "Normale",
};

const accentByPriority: Record<JobRole["priority"], string> = {
  urgent: "bg-error/15",
  haute: "bg-warning/15",
  normale: "bg-primary/10",
};

function daysUntil(iso: string | null): string {
  if (!iso) return "Au fil de l'eau";
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return "Clôturé";
  if (diff === 0) return "Clôt aujourd'hui";
  if (diff === 1) return "Clôt demain";
  return `Clôt dans ${diff} jours`;
}

interface Props {
  job: JobRole;
  index: number;
}

export function JobCard({ job, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer"
      whileHover={{ y: -2 }}
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-colors",
          accentByPriority[job.priority],
          "group-hover:opacity-150",
        )}
      />

      <header className="flex justify-between items-start gap-3 relative z-10">
        <div className="w-12 h-12 rounded-lg bg-background/60 border border-white/10 flex items-center justify-center text-primary shadow-sm">
          <Icon name={job.icon} className="text-[24px]" filled />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge tone={priorityTone[job.priority]}>{priorityLabel[job.priority]}</Badge>
          <span className="px-3 py-1 bg-white/5 text-on-surface-variant font-label-caps text-[10px] rounded-full border border-white/10">
            {job.contractType}
          </span>
        </div>
      </header>

      <div className="relative z-10">
        <h3 className="text-headline-md font-headline-md text-on-surface mb-1 leading-tight">
          {job.title}
        </h3>
        <p className="text-body-sm text-on-surface-variant">
          {job.serviceLabel} · {job.site}
        </p>
      </div>

      <ul className="relative z-10 flex flex-wrap gap-1.5 mt-1">
        {job.requirements.slice(0, 3).map((r) => (
          <li
            key={r}
            className="text-[11px] text-on-surface-variant px-2 py-1 rounded-md bg-white/[0.03] border border-white/5"
          >
            {r}
          </li>
        ))}
      </ul>

      <footer className="mt-auto pt-4 flex items-center justify-between border-t border-white/10 relative z-10">
        <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Icon name="schedule" className="text-[16px]" />
            {daysUntil(job.closesAt)}
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1">
            <Icon name="group" className="text-[16px]" />
            {job.applications}
          </span>
        </div>
        <button className="glass-button px-3 py-1.5 rounded-lg font-label-caps text-label-caps text-primary hover:bg-white/10 transition-colors flex items-center gap-1.5">
          Voir
          <Icon name="arrow_forward" className="text-[14px] transition-transform group-hover:translate-x-0.5" />
        </button>
      </footer>
    </motion.article>
  );
}
