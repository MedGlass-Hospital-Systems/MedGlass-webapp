import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-4 md:px-8 pt-20 pb-24 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          <Badge tone="primary" className="mb-6">
            <Icon name="bolt" className="text-[14px] mr-1" />
            Nouveau · Génération de planning par IA
          </Badge>
          <h1 className="text-[44px] md:text-[64px] leading-[1.05] font-bold tracking-tight mb-6">
            La planification médicale,{" "}
            <span className="text-gradient">enfin sereine.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto">
            MedGlass Pro automatise les plannings de gardes, astreintes et roulements
            pour les services hospitaliers. Conçu avec des praticiens, des cadres et
            des DRH d'établissements de santé français.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button href="/dashboard" size="lg" icon="arrow_forward" iconPosition="right">
              Essayer la démo
            </Button>
            <Button href="/contact" variant="secondary" size="lg" icon="play_circle">
              Demander une présentation
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Icon name="check_circle" className="text-success text-[18px]" />
              Hébergement HDS
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check_circle" className="text-success text-[18px]" />
              Conforme RGPD
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check_circle" className="text-success text-[18px]" />
              Sans engagement
            </span>
          </div>
        </div>

        {/* Hero visual: fake dashboard */}
        <div className="mt-20 relative">
          <GlassPanel className="p-2 md:p-4 mx-auto max-w-5xl shadow-2xl shadow-primary/10">
            <div className="rounded-lg overflow-hidden bg-surface-container/50 border border-white/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-error/60" />
                <span className="w-3 h-3 rounded-full bg-warning/60" />
                <span className="w-3 h-3 rounded-full bg-success/60" />
                <span className="ml-3 text-body-sm text-on-surface-variant">
                  app.medglass.fr/planning
                </span>
              </div>
              <div className="p-6 grid grid-cols-12 gap-3">
                <div className="col-span-3 space-y-3">
                  <div className="h-8 rounded bg-primary/15" />
                  <div className="h-6 rounded bg-white/5" />
                  <div className="h-6 rounded bg-white/5" />
                  <div className="h-6 rounded bg-primary/10" />
                  <div className="h-6 rounded bg-white/5" />
                </div>
                <div className="col-span-9 space-y-3">
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-8 rounded bg-white/5" />
                    ))}
                  </div>
                  {Array.from({ length: 5 }).map((_, row) => (
                    <div key={row} className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, col) => {
                        const filled = (row + col) % 3 !== 0;
                        const tone = (row + col) % 4 === 0 ? "tertiary" : "primary";
                        return (
                          <div
                            key={col}
                            className={`h-12 rounded ${
                              filled
                                ? tone === "primary"
                                  ? "bg-primary/15 border border-primary/20"
                                  : "bg-tertiary/15 border border-tertiary/20"
                                : "bg-white/[0.02]"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* KEY METRICS */}
      <section className="px-4 md:px-8 py-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "120+", l: "Établissements clients" },
            { v: "8 500", l: "Soignants planifiés" },
            { v: "-72%", l: "Temps de planification" },
            { v: "99,98%", l: "Disponibilité" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-[40px] font-bold text-gradient leading-none mb-2">{s.v}</div>
              <div className="text-body-sm text-on-surface-variant">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="fonctionnalites" className="px-4 md:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge tone="primary" className="mb-4">Fonctionnalités</Badge>
          <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight mb-4">
            Tout ce qu'il faut pour un planning hospitalier{" "}
            <span className="text-gradient">qui tient la route</span>
          </h2>
          <p className="text-on-surface-variant text-lg">
            Pensé avec les services qui fonctionnent en 24/7, multi-sites, multi-conventions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              i: "auto_fix",
              t: "Génération automatique",
              d: "Un assistant IA propose un planning optimal en quelques secondes en respectant vos règles de service, contrats et compétences.",
            },
            {
              i: "swap_horiz",
              t: "Échange de gardes",
              d: "Demandes d'échange et remplacements validés par le cadre, traçabilité complète et notifications instantanées.",
            },
            {
              i: "event_busy",
              t: "Congés & absences",
              d: "Demandes de congés, RTT, formation, maladie. Validation hiérarchique et impact temps réel sur le planning.",
            },
            {
              i: "warning",
              t: "Détection des conflits",
              d: "Repos non respectés, gardes consécutives, sous-effectif : l'application alerte avant publication.",
            },
            {
              i: "psychology",
              t: "Matrice de compétences",
              d: "Garantissez qu'un soignant qualifié est toujours présent (réa, bloc, néonat, urgences vitales).",
            },
            {
              i: "schedule",
              t: "Compteurs d'heures",
              d: "Suivi des heures sup, du temps de travail effectif, du forfait jours et des récupérations en temps réel.",
            },
            {
              i: "groups",
              t: "Multi-services & sites",
              d: "Gérez plusieurs pôles, services et établissements depuis une seule plateforme avec droits d'accès fins.",
            },
            {
              i: "phone_iphone",
              t: "Application mobile",
              d: "Vos soignants consultent leur planning, posent leurs congés et échangent leurs gardes depuis leur téléphone.",
            },
            {
              i: "lock",
              t: "Sécurité & conformité",
              d: "Hébergement de Données de Santé certifié, double authentification et journalisation des accès.",
            },
          ].map((f) => (
            <GlassPanel key={f.t} className="p-6 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                <Icon name={f.i} className="text-primary text-[24px]" filled />
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">{f.t}</h3>
              <p className="text-body-sm text-on-surface-variant">{f.d}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="metiers" className="px-4 md:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge tone="tertiary" className="mb-4">Pour qui ?</Badge>
          <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight mb-4">
            Conçu pour <span className="text-gradient">tous les métiers</span> de l'hôpital
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: "medical_services", t: "Praticiens", d: "Gardes, astreintes, plages opératoires." },
            { i: "school", t: "Internes", d: "Maquettes, semestres, gardes obligatoires." },
            { i: "vaccines", t: "IDE & cadres", d: "Roulements, transmissions, encadrement." },
            { i: "support_agent", t: "DRH & directions", d: "Pilotage, conformité, prévisionnel." },
          ].map((m) => (
            <GlassPanel key={m.t} className="p-6">
              <Icon name={m.i} className="text-primary text-[28px] mb-3" filled />
              <h3 className="font-semibold text-lg mb-1">{m.t}</h3>
              <p className="text-body-sm text-on-surface-variant">{m.d}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* SECURITY */}
      <section id="securite" className="px-4 md:px-8 py-20 max-w-7xl mx-auto w-full">
        <GlassPanel className="p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge tone="success" className="mb-4">Sécurité & conformité</Badge>
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-4">
              Vos données patients ne quittent jamais la France
            </h2>
            <p className="text-on-surface-variant mb-6">
              MedGlass Pro est hébergé chez un Hébergeur de Données de Santé (HDS)
              certifié, en conformité avec le RGPD. Toutes les communications sont
              chiffrées de bout en bout.
            </p>
            <ul className="space-y-3 text-body-base">
              {[
                "Hébergement HDS certifié",
                "Conformité RGPD documentée",
                "Authentification forte (MFA, SSO)",
                "Journalisation et traçabilité complète",
                "Sauvegardes chiffrées quotidiennes",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-success text-[20px] mt-0.5" filled />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["HDS", "RGPD", "ISO 27001", "ANSSI"].map((label) => (
              <div
                key={label}
                className="aspect-square rounded-xl glass-strong flex items-center justify-center text-2xl font-bold text-primary"
              >
                {label}
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 py-24 max-w-4xl mx-auto w-full text-center">
        <h2 className="text-[36px] md:text-[48px] font-bold tracking-tight mb-4">
          Prêt à libérer du temps soignant ?
        </h2>
        <p className="text-on-surface-variant text-lg mb-8 max-w-xl mx-auto">
          Démonstration personnalisée sur votre service, sans engagement.
          Migration assistée depuis votre outil actuel.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/dashboard" size="lg" icon="arrow_forward" iconPosition="right">
            Lancer la démo
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Parler à un expert
          </Button>
        </div>
      </section>
    </>
  );
}
