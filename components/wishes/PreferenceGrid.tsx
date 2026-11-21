"use client";

import { Icon } from "@/components/layout/Icon";
import { WEEKDAYS_LONG } from "@/lib/utils/dates";
import { WISH_LEVEL_LABELS, WISH_SLOT_LABELS } from "@/lib/utils/labels";
import { cn } from "@/lib/utils/cn";
import type { Wish, WishLevel, WishSlot } from "@/lib/types/planning";

type Pref = Wish["preferences"][number];
const SLOTS: WishSlot[] = ["matin", "apres-midi", "nuit"];
const NEXT: Record<string, WishLevel | null> = { none: "prioritaire", prioritaire: "possible", possible: "eviter", eviter: null };

const STYLE: Record<WishLevel, string> = {
  prioritaire: "bg-primary/25 border-primary/50 text-primary",
  possible: "bg-white/10 border-white/20 text-on-surface",
  eviter: "bg-warning/15 border-warning/40 text-warning",
};
const ICON: Record<WishLevel, string> = { prioritaire: "star", possible: "check", eviter: "do_not_disturb_on" };

/** Grille jours × créneaux : chaque clic fait tourner Prioritaire → Possible → À éviter → vide. */
export function PreferenceGrid({ value, onChange }: { value: Pref[]; onChange: (v: Pref[]) => void }) {
  const levelOf = (weekday: number, slot: WishSlot) => value.find((p) => p.weekday === weekday && p.slot === slot)?.level;
  const cycle = (weekday: number, slot: WishSlot) => {
    const next = NEXT[levelOf(weekday, slot) ?? "none"];
    const rest = value.filter((p) => !(p.weekday === weekday && p.slot === slot));
    onChange(next ? [...rest, { weekday, slot, level: next }] : rest);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 text-[12px]">
        {(Object.keys(STYLE) as WishLevel[]).map((l) => (
          <span key={l} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border", STYLE[l])}>
            <Icon name={ICON[l]} className="text-[14px]" filled={l === "prioritaire"} /> {WISH_LEVEL_LABELS[l]}
          </span>
        ))}
        <span className="text-on-surface-variant self-center">Cliquez sur une case pour changer.</span>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[110px_repeat(3,minmax(110px,1fr))] gap-2 min-w-[480px]">
          <div />
          {SLOTS.map((s) => (
            <p key={s} className="font-label-caps text-label-caps text-on-surface-variant text-center">
              {WISH_SLOT_LABELS[s]}
            </p>
          ))}
          {WEEKDAYS_LONG.map((day, wd) => (
            <div key={day} className="contents">
              <p className={cn("text-body-sm self-center", wd >= 5 && "text-on-surface-variant")}>{day}</p>
              {SLOTS.map((slot) => {
                const level = levelOf(wd, slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => cycle(wd, slot)}
                    aria-label={`${day} ${WISH_SLOT_LABELS[slot]} : ${level ? WISH_LEVEL_LABELS[level] : "sans préférence"}`}
                    className={cn(
                      "h-11 rounded-lg border flex items-center justify-center gap-1.5 text-[12px] transition-colors focus-ring",
                      level ? STYLE[level] : "border-white/10 bg-white/[0.02] text-on-surface-variant/40 hover:bg-white/5",
                    )}
                  >
                    {level ? (
                      <>
                        <Icon name={ICON[level]} className="text-[16px]" filled={level === "prioritaire"} />
                        {WISH_LEVEL_LABELS[level]}
                      </>
                    ) : (
                      "—"
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
