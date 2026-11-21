"use client";

import { Toggle } from "@/components/ui/Form";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, useNotificationPrefs } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { NOTIFICATION_ICONS, NOTIFICATION_LABELS } from "@/lib/utils/labels";
import type { NotificationChannel, NotificationType } from "@/lib/types/notifications";

const DESCRIPTIONS: Record<NotificationType, string> = {
  mail: "Nouveaux messages de la direction, de la DRH ou de collègues.",
  poste: "Acceptation de postes, candidatures, créneaux de la bourse.",
  planning: "Publication d'un planning, conflits, postes attribués.",
  souhaits: "Demande de souhaits pour un planning en préparation.",
  demande: "Réponses à vos congés et propositions d'échange.",
};

export function NotificationPrefsPanel() {
  const user = useCurrentUser();
  const prefs = useNotificationPrefs(user.id);
  const setPref = useDemoStore((s) => s.setNotificationPref);
  const types = Object.keys(NOTIFICATION_LABELS) as NotificationType[];
  const channels: { id: NotificationChannel; label: string }[] = [
    { id: "app", label: "Application" },
    { id: "email", label: "E-mail" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 font-label-caps text-label-caps text-on-surface-variant">Événement</th>
            {channels.map((c) => (
              <th key={c.id} className="py-3 font-label-caps text-label-caps text-on-surface-variant w-28">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {types.map((t) => (
            <tr key={t} className="border-b border-white/5">
              <td className="py-4 pr-4">
                <p className="font-semibold flex items-center gap-2">
                  <Icon name={NOTIFICATION_ICONS[t]} className="text-primary text-[18px]" />
                  {NOTIFICATION_LABELS[t]}
                </p>
                <p className="text-[12px] text-on-surface-variant mt-0.5">{DESCRIPTIONS[t]}</p>
              </td>
              {channels.map((c) => (
                <td key={c.id} className="py-4 text-center">
                  <Toggle
                    label={`${NOTIFICATION_LABELS[t]} — ${c.label}`}
                    checked={prefs[t][c.id]}
                    onChange={(v) => {
                      setPref(user.id, t, c.id, v);
                      toast("Préférence enregistrée");
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
