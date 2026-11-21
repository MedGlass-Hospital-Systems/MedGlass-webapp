"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/layout/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { FavoriteButton } from "./FavoriteButton";
import { useDemoStore } from "@/lib/store/demoStore";
import { toast } from "@/lib/store/toastStore";
import { cn } from "@/lib/utils/cn";
import { STAGE_LABELS, STAGE_TEXT, scoreTone } from "@/lib/utils/labels";
import { initialsOf } from "@/lib/utils/id";
import type { ApplicationStage, Candidate } from "@/lib/types/recruitment";

const SCORE_TEXT: Record<string, string> = { success: "text-success", primary: "text-primary", neutral: "text-on-surface-variant" };
const STAGES: ApplicationStage[] =["nouveau", "preselection", "entretien", "validation", "embauche", "refuse"];

/** Pipeline en glisser-déposer : déposer une carte dans une colonne change l'étape du candidat. */
export function CandidateKanban({ candidates, onOpen }: { candidates: Candidate[]; onOpen: (id: string) => void }) {
  const move = useDemoStore((s) => s.moveCandidate);
  const jobs = useDemoStore((s) => s.jobs);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [over, setOver] = useState<ApplicationStage | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
      {STAGES.map((stage) => {
        const items = candidates.filter((c) => c.stage === stage);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(stage);
            }}
            onDragLeave={() => setOver((o) => (o === stage ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              const id = draggingId ?? e.dataTransfer.getData("text/plain");
              setOver(null);
              setDraggingId(null);
              const c = candidates.find((x) => x.id === id);
              if (c && c.stage !== stage) {
                move(id, stage);
                toast(`${c.firstName} ${c.lastName} → ${STAGE_LABELS[stage]}`);
              }
            }}
            className={cn(
              "glass-panel rounded-xl p-3 min-h-[300px] flex flex-col gap-3 transition-all",
              over === stage && "ring-2 ring-primary/40 bg-primary/[0.04]",
              stage === "refuse" && "opacity-80",
            )}
          >
            <header className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
              <span className={cn("font-label-caps text-label-caps", STAGE_TEXT[stage])}>{STAGE_LABELS[stage]}</span>
              <span className="text-[11px] tabular-nums text-on-surface-variant bg-white/5 rounded-full px-2 py-0.5">{items.length}</span>
            </header>

            <AnimatePresence initial={false}>
              {items.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: draggingId === c.id ? 0.5 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <article
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", c.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDraggingId(c.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => onOpen(c.id)}
                    className="rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-3 cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar initials={initialsOf(c.firstName, c.lastName)} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold truncate">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">{c.currentRole}</p>
                      </div>
                      <FavoriteButton candidateId={c.id} size={16} className="-mr-1" />
                    </div>
                    <p className="text-[11px] text-on-surface-variant line-clamp-1 mb-2">→ {jobs.find((j) => j.id === c.jobId)?.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                        <Icon name={c.rppsVerified ? "verified" : "pending"} className={cn("text-[14px]", c.rppsVerified ? "text-success" : "text-warning")} filled={c.rppsVerified} />
                        {c.experience} an{c.experience > 1 ? "s" : ""} d&apos;exp.
                      </span>
                      <span className={cn("text-[10px] font-bold tabular-nums", SCORE_TEXT[scoreTone(c.matchScore)])}>
                        {c.matchScore}%
                      </span>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-[11px] text-on-surface-variant/50 italic border border-dashed border-white/10 rounded-lg">
                Glisser-déposer ici
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
