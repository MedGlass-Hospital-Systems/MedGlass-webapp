"use client";

import { useMemo } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/Layout";
import { SkillLevel } from "./SkillLevel";
import { fullName } from "@/lib/store/hooks";
import type { Staff } from "@/lib/types/planning";

/** Matrice collaborateurs × compétences avec niveau, colonnes limitées aux compétences présentes. */
export function SkillsMatrix({ people, onOpen }: { people: Staff[]; onOpen: (id: string) => void }) {
  const skills = useMemo(() => {
    const count = new Map<string, number>();
    people.forEach((p) => p.skills.forEach((s) => count.set(s.name, (count.get(s.name) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
  }, [people]);

  if (!people.length) return <EmptyState icon="psychology" title="Aucun collaborateur pour ce filtre" />;

  return (
    <div className="overflow-auto scrollbar-thin">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface-container text-left p-3 font-label-caps text-label-caps text-on-surface-variant min-w-[220px]">
              Collaborateur
            </th>
            {skills.map((s) => (
              <th key={s.name} className="p-2 align-bottom min-w-[44px]">
                <span className="block text-[11px] text-on-surface-variant font-medium whitespace-nowrap [writing-mode:vertical-rl] rotate-180 mx-auto">
                  {s.name} <span className="opacity-60">({s.n})</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.03] cursor-pointer" onClick={() => onOpen(p.id)}>
              <td className="sticky left-0 z-10 bg-surface-container/95 p-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Avatar initials={p.initials} size="sm" />
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold truncate">{fullName(p, true)}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{p.roleLabel}</p>
                  </div>
                </div>
              </td>
              {skills.map((s) => {
                const level = p.skills.find((x) => x.name === s.name)?.level;
                return (
                  <td key={s.name} className="p-2 text-center border-t border-white/5">
                    {level ? <SkillLevel level={level} /> : <span className="text-white/10">·</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
