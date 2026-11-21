"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Layout";
import { FilterPills } from "@/components/ui/Tabs";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, useMyNotifications } from "@/lib/store/hooks";
import { NOTIFICATION_ICONS, NOTIFICATION_LABELS } from "@/lib/utils/labels";
import { fmt, fromNow } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { NotificationType } from "@/lib/types/notifications";

type Filter = "non-lues" | "toutes" | NotificationType;

export function NotificationsCenter() {
  const user = useCurrentUser();
  const router = useRouter();
  const notifications = useMyNotifications();
  const markRead = useDemoStore((s) => s.markNotificationRead);
  const markAll = useDemoStore((s) => s.markAllRead);
  const unread = notifications.filter((n) => !n.read).length;
  const [filter, setFilter] = useState<Filter>(unread ? "non-lues" : "toutes");

  const list = notifications.filter((n) => (filter === "toutes" ? true : filter === "non-lues" ? !n.read : n.type === filter));
  const count = (t: NotificationType) => notifications.filter((n) => n.type === t).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <FilterPills
          value={filter}
          onChange={setFilter}
          items={[
            { id: "non-lues", label: "Nouvelles", count: unread },
            { id: "toutes", label: "Toutes", count: notifications.length },
            { id: "mail", label: "Messages", icon: "mail", count: count("mail") },
            { id: "poste", label: "Postes", icon: "work", count: count("poste") },
            { id: "planning", label: "Planning", icon: "calendar_month", count: count("planning") },
            { id: "souhaits", label: "Souhaits", icon: "favorite", count: count("souhaits") },
            { id: "demande", label: "Demandes", icon: "edit_calendar", count: count("demande") },
          ]}
        />
        {unread > 0 && (
          <Button size="sm" variant="ghost" icon="done_all" onClick={() => markAll(user.id)}>
            Tout marquer comme lu
          </Button>
        )}
      </div>
      {list.length ? (
        <ul className="space-y-2">
          {list.map((n) => (
            <li
              key={n.id}
              className={cn("flex gap-3 p-4 rounded-lg border transition-colors", n.read ? "border-white/5 bg-white/[0.01]" : "border-primary/20 bg-primary/[0.05]")}
            >
              <span className="w-10 h-10 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Icon name={NOTIFICATION_ICONS[n.type]} className="text-[20px]" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-on-surface">{n.title}</span>
                  {!n.read && <span className="text-[10px] font-label-caps text-primary">Nouveau</span>}
                </p>
                <p className="text-body-sm text-on-surface-variant">{n.body}</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-1" title={fmt(n.createdAt, "d MMMM yyyy HH:mm")}>
                  {NOTIFICATION_LABELS[n.type]} · {fromNow(n.createdAt)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 items-end sm:items-start">
                {n.link && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      markRead(n.id);
                      router.push(n.link!);
                    }}
                  >
                    Ouvrir
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => markRead(n.id, !n.read)}
                  className="p-2 rounded-full text-on-surface-variant hover:bg-white/5"
                  aria-label={n.read ? "Marquer comme non lu" : "Marquer comme lu"}
                  title={n.read ? "Marquer comme non lu" : "Marquer comme lu"}
                >
                  <Icon name={n.read ? "mark_email_unread" : "drafts"} className="text-[18px]" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon="notifications_off" title="Aucune notification" description="Vous êtes à jour." />
      )}
    </div>
  );
}
