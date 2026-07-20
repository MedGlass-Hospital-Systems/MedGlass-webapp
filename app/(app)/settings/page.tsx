import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/layout/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";

const sections = [
  { id: "profile", label: "Profil", icon: "person" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "billing", label: "Facturation", icon: "receipt_long" },
  { id: "security", label: "Sécurité", icon: "lock" },
];

export default function SettingsPage() {
  return (
    <>
      <header>
        <h1 className="text-display-lg text-on-surface mb-1">Paramètres</h1>
        <p className="text-on-surface-variant">
          Personnalisez votre service, vos règles RH et la sécurité du compte.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar sections */}
        <GlassPanel className="lg:col-span-3 p-3 h-fit sticky top-24">
          <nav className="flex flex-col gap-1">
            {sections.map((s, i) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 text-body-sm transition-colors ${
                  i === 0 ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                <Icon name={s.icon} className="text-[20px]" filled={i === 0} />
                {s.label}
              </Link>
            ))}
          </nav>
        </GlassPanel>

        <div className="lg:col-span-9 space-y-6">
          {/* Profile */}
          <GlassPanel id="profile" className="p-6">
            <h2 className="font-headline-md text-headline-md mb-1">Profil</h2>
            <p className="text-on-surface-variant text-body-sm mb-6">
              Vos informations personnelles et professionnelles.
            </p>
            <div className="flex items-center gap-6 mb-8">
              <Avatar initials="SJ" size="lg" />
              <div>
                <p className="font-semibold text-lg">Dr. Sarah Jenkins</p>
                <p className="text-on-surface-variant text-body-sm">Chef de service · Chirurgie générale</p>
                <Button variant="ghost" size="sm" className="mt-2" icon="upload">
                  Changer la photo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { l: "Nom", v: "Jenkins" },
                { l: "Prénom", v: "Sarah" },
                { l: "Email", v: "contact@paulrobain.fr" },
                { l: "Téléphone", v: "+33 6 00 00 00 00" },
                { l: "RPPS", v: "10001234567" },
                { l: "Établissement", v: "CHU Saint-Marie" },
              ].map((f) => (
                <label key={f.l} className="block">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">
                    {f.l}
                  </span>
                  <input
                    type="text"
                    defaultValue={f.v}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface focus-ring"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button>Enregistrer</Button>
            </div>
          </GlassPanel>



          {/* Security */}
          <GlassPanel id="security" className="p-6">
            <h2 className="font-headline-md text-headline-md mb-1">Sécurité</h2>
            <p className="text-on-surface-variant text-body-sm mb-6">
              Authentification et accès au compte.
            </p>
            <div className="space-y-3">
              {[
                { t: "Mot de passe", d: "Modifié il y a 3 mois", action: "Modifier" },
                { t: "Authentification à deux facteurs", d: "Activée via app", action: "Gérer", on: true },
                { t: "Sessions actives", d: "2 appareils connectés", action: "Voir" },
                { t: "Journal d'accès", d: "Dernière connexion il y a 2h", action: "Consulter" },
              ].map((s) => (
                <div
                  key={s.t}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        {s.t}
                        {s.on && <Badge tone="success">Actif</Badge>}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">{s.d}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">{s.action}</Button>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </>
  );
}
