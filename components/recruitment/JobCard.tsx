"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/layout/Icon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_LABELS, PRIORITY_TONES } from "@/lib/utils/labels";
import { daysBetween, todayISO } from "@/lib/utils/dates";
import type { JobRole } from "@/lib/types/recruitment";

const accentByPriority: Record<JobRole["priority"], string> = {
  urgent: "bg-error/15",
  haute: "bg-warning/15",
  normale: "bg-primary/10",
};

export function closingLabel(iso: string | null): string {
  if (!iso) return "Au fil de l'eau";
  const diff = daysBetween(todayISO(), iso);
  if (diff < 0) return "Clôturé";
  if (diff === 0) return "Clôt aujourd'hui";
  if (diff === 1) return "Clôt demain";
  return `Clôt dans ${diff} jours`;
}

export function JobCard({
  job,
  index,
  serviceName,
  applications,
  onOpen,
  footerExtra,
}: {
  job: JobRole;
  index: number;
  serviceName: string;
  applications: number;
  onOpen: () => void;
  footerExtra?: React.ReactNode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      onClick={onOpen}
      className={cn("glass-panel rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer", job.status !== "ouvert" && "opacity-60")}
    >
      <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none", accentByPriority[job.priority])} />

      <header className="flex justify-between items-start gap-3 relative z-10">
        <div className="w-12 h-12 rounded-lg bg-background/60 border border-white/10 flex items-center justify-center text-primary shadow-sm">
          <Icon name={job.icon} className="text-[24px]" filled />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge tone={job.status === "ouvert" ? PRIORITY_TONES[job.priority] : "neutral"}>
            {job.status === "ouvert" ? PRIORITY_LABELS[job.priority] : "Clôturé"}
          </Badge>
          <span className="px-3 py-1 bg-white/5 text-on-surface-variant font-label-caps text-[10px] rounded-full border border-white/10">
            {job.contractType}
          </span>
        </div>
      </header>

      <div className="relative z-10">
        <h3 className="text-[20px] font-semibold text-on-surface mb-1 leading-tight">{job.title}</h3>
        <p className="text-body-sm text-on-surface-variant">
          {serviceName} · {job.site}
        </p>
      </div>

      <ul className="relative z-10 flex flex-wrap gap-1.5">
        {job.requirements.slice(0, 3).map((r) => (
          <li key={r} className="text-[11px] text-on-surface-variant px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
            {r}
          </li>
        ))}
      </ul>

      <footer className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Icon name="schedule" className="text-[16px]" />
            {closingLabel(job.closesAt)}
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1" title="Candidatures">
            <Icon name="group" className="text-[16px]" />
            {applications}
          </span>
        </div>
        {footerExtra ?? (
          <span className="glass-button px-3 py-1.5 rounded-lg font-label-caps text-label-caps text-primary flex items-center gap-1.5">
            Voir
            <Icon name="arrow_forward" className="text-[14px] transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </footer>
    </motion.article>
  );
}
