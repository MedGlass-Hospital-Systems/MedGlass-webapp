"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { NotificationsCenter } from "./NotificationsCenter";
import { ProfileForm } from "./ProfileForm";
import { NotificationPrefsPanel } from "./NotificationPrefsPanel";
import { useDemoStore } from "@/lib/store/demoStore";
import { useMyNotifications } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { cn } from "@/lib/utils/cn";

const SECTIONS = [
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "profile", label: "Profil", icon: "person" },
  { id: "preferences", label: "Préférences", icon: "tune" },
  { id: "security", label: "Sécurité", icon: "lock" },
  { id: "demo", label: "Démo", icon: "science" },
];

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <GlassPanel id={id} className="p-6 scroll-mt-24">
      <h2 className="font-headline-md text-headline-md mb-1">{title}</h2>
      <p className="text-on-surface-variant text-body-sm mb-6">{description}</p>
      {children}
    </GlassPanel>
  );
}

export function SettingsView() {
  const [active, setActive] = useState("notifications");
  const unread = useMyNotifications().filter((n) => !n.read).length;
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const setTutorialSeen = useDemoStore((s) => s.setTutorialSeen);

  // Ancre depuis l'URL (#profile, #notifications) + section active au défilement
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 50);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <PageHeader title="Réglages" description="Vos notifications, votre profil et la sécurité de votre compte." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassPanel className="lg:col-span-3 p-3 h-fit lg:sticky lg:top-24">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                className={cn(
                  "px-4 py-3 rounded-lg flex items-center gap-3 text-body-sm transition-colors whitespace-nowrap",
                  active === s.id ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
                )}
              >
                <Icon name={s.icon} className="text-[20px]" filled={active === s.id} />
                <span className="flex-1">{s.label}</span>
                {s.id === "notifications" && unread > 0 && <Badge tone="primary">{unread}</Badge>}
              </a>
            ))}
          </nav>
        </GlassPanel>

        <div className="lg:col-span-9 space-y-6">
          <Section id="notifications" title="Notifications" description="Nouveaux messages, acceptations de postes, demandes et plannings.">
            <NotificationsCenter />
          </Section>

          <Section id="profile" title="Profil" description="Vos informations personnelles et professionnelles.">
            <ProfileForm />
          </Section>

          <Section id="preferences" title="Préférences de notifications" description="Choisissez comment être prévenu pour chaque type d'événement.">
            <NotificationPrefsPanel />
          </Section>

          <Section id="security" title="Sécurité" description="Authentification et accès au compte.">
            <div className="space-y-3">
              {[
                { t: "Mot de passe", d: "Modifié il y a 3 mois", action: "Modifier" },
                { t: "Authentification à deux facteurs", d: "Activée via application", action: "Gérer", on: true },
                { t: "Sessions actives", d: "2 appareils connectés", action: "Voir" },
                { t: "Journal d'accès", d: "Dernière connexion il y a 2 h", action: "Consulter" },
              ].map((s) => (
                <div key={s.t} className="flex items-center justify-between gap-3 p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      {s.t}
                      {s.on && <Badge tone="success">Actif</Badge>}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">{s.d}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast("Disponible dans la version connectée à votre annuaire", "warning")}>
                    {s.action}
                  </Button>
                </div>
              ))}
            </div>
          </Section>

          <Section id="demo" title="Démo" description="Les données de la démo sont conservées dans ce navigateur.">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                icon="school"
                onClick={() => {
                  setTutorialSeen("welcome", false);
                  setTutorialSeen("generation", false);
                  toast("Les tutoriels seront réaffichés");
                }}
              >
                Revoir les tutoriels
              </Button>
              <Button
                variant="danger"
                icon="restart_alt"
                onClick={() => {
                  resetDemo();
                  toast("Démo réinitialisée");
                }}
              >
                Réinitialiser les données
              </Button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
