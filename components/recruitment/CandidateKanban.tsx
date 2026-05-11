"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/layout/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import type { Candidate, ApplicationStage } from "@/lib/types/recruitment";

const stages: { id: ApplicationStage; label: string; tone: string }[] = [
  { id: "nouveau", label: "Nouveau", tone: "text-on-surface-variant" },
  { id: "preselection", label: "Présélection", tone: "text-primary" },
  { id: "entretien", label: "Entretien", tone: "text-tertiary" },
  { id: "validation", label: "Validation RH", tone: "text-secondary" },
  { id: "embauche", label: "Embauché", tone: "text-success" },
];

interface Props {
  candidates: Candidate[];
}

export function CandidateKanban({ candidates: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function moveCandidate(id: string, toStage: ApplicationStage) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, stage: toStage } : c)));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
      {stages.map((stage) => {
        const stageItems = items.filter((c) => c.stage === stage.id);
        return (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            items={stageItems}
            draggingId={draggingId}
            onDragStart={setDraggingId}
            onDrop={(id) => {
              moveCandidate(id, stage.id);
              setDraggingId(null);
            }}
          />
        );
      })}
    </div>
  );
}

function KanbanColumn({
  stage,
  items,
  draggingId,
  onDragStart,
  onDrop,
}: {
  stage: { id: ApplicationStage; label: string; tone: string };
  items: Candidate[];
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={() => {
        setOver(false);
        if (draggingId) onDrop(draggingId);
      }}
      className={cn(
        "glass-panel rounded-xl p-3 min-h-[320px] flex flex-col gap-3 transition-all",
        over && "ring-2 ring-primary/40 bg-primary/[0.04]",
      )}
    >
      <header className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
        <span className={cn("font-label-caps text-label-caps", stage.tone)}>{stage.label}</span>
        <span className="text-[11px] tabular-nums text-on-surface-variant bg-white/5 rounded-full px-2 py-0.5">
          {items.length}
        </span>
      </header>

      <AnimatePresence initial={false}>
        {items.map((c) => (
          <motion.article
            key={c.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            draggable
            onDragStart={() => onDragStart(c.id)}
            onDragEnd={() => onDragStart("")}
            className="rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-3 cursor-grab active:cursor-grabbing transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Avatar initials={c.initials} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold truncate">
                  {c.firstName} {c.lastName}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate">{c.currentRole}</p>
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant line-clamp-1 mb-2">
              → {c.jobTitle}
            </p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                {c.rppsVerified ? (
                  <Icon name="verified" className="text-success text-[14px]" filled />
                ) : (
                  <Icon name="pending" className="text-warning text-[14px]" />
                )}
                {c.experience}a exp.
              </span>
              <MatchScore value={c.matchScore} />
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[11px] text-on-surface-variant/50 italic">
          Glisser-déposer ici
        </div>
      )}
    </div>
  );
}

function MatchScore({ value }: { value: number }) {
  const tone =
    value >= 85 ? "text-success" : value >= 70 ? "text-primary" : "text-on-surface-variant";
  return (
    <span className={cn("text-[10px] font-bold tabular-nums tracking-wide", tone)}>
      {value}%
    </span>
  );
}
