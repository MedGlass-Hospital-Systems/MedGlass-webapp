import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/layout/Icon";

const plans = [
  {
    name: "Service",
    price: "490",
    desc: "Pour un service hospitalier",
    features: ["Jusqu'à 30 soignants", "Génération IA", "Échange de gardes", "Support email"],
    cta: "Démarrer",
  },
  {
    name: "Établissement",
    price: "1 990",
    desc: "Multi-services, sites uniques",
    features: ["Jusqu'à 300 soignants", "Multi-services", "Compétences avancées", "Support prioritaire", "Intégration SIH"],
    highlighted: true,
    cta: "Choisir",
  },
  {
    name: "Groupe",
    price: "Sur devis",
    desc: "GHT, multi-établissements",
    features: ["Soignants illimités", "Multi-sites", "SSO Pro Santé", "SLA dédié", "Accompagnement"],
    cta: "Nous contacter",
  },
];

export default function PricingPage() {
  return (
    <section className="px-4 py-20 max-w-7xl mx-auto w-full">
      <div className="text-center mb-14">
        <Badge tone="primary" className="mb-4">Tarifs</Badge>
        <h1 className="text-[40px] md:text-[52px] font-bold tracking-tight mb-4">
          Une formule pour <span className="text-gradient">chaque structure</span>
        </h1>
        <p className="text-on-surface-variant text-lg">Tarifs HT mensuels. Sans engagement, résiliable à tout moment.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <GlassPanel
            key={p.name}
            className={`p-8 flex flex-col ${p.highlighted ? "border-primary/40 shadow-2xl shadow-primary/10" : ""}`}
          >
            {p.highlighted && <Badge tone="primary" className="mb-3 self-start">Recommandé</Badge>}
            <h3 className="text-headline-md font-headline-md mb-1">{p.name}</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">{p.desc}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{p.price}</span>
              {p.price !== "Sur devis" && <span className="text-on-surface-variant"> €/mois</span>}
            </div>
            <ul className="space-y-2 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-body-sm">
                  <Icon name="check" className="text-success text-[18px] mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button href="/contact" variant={p.highlighted ? "primary" : "secondary"} className="w-full">
              {p.cta}
            </Button>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
