import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";

const VITRINE_URL = "https://medglass.fr";

export default function LoginPage() {
  return (
    <section className="px-4 py-20 max-w-md mx-auto w-full">
      <div className="text-center mb-8">
        <a href={VITRINE_URL} className="inline-flex items-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Icon name="local_hospital" className="text-primary text-[22px]" filled />
          </span>
          <span className="text-xl font-bold text-primary tracking-tight">MedGlass Pro</span>
        </a>
      </div>

      <GlassPanel className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-1">Connexion</h1>
          <p className="text-on-surface-variant text-sm">Accédez à votre espace de planification</p>
        </div>

        <form className="space-y-4" action="/dashboard">
          <label className="block">
            <span className="font-bold text-xs tracking-widest uppercase text-on-surface-variant block mb-2">
              Email professionnel
            </span>
            <input
              type="email"
              required
              placeholder="prenom.nom@chu-hopital.fr"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="block">
            <span className="font-bold text-xs tracking-widest uppercase text-on-surface-variant block mb-2">
              Mot de passe
            </span>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-transparent text-primary" />
              Se souvenir de moi
            </label>
            <Link href="/forgot-password" className="text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-on-primary font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Se connecter
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-sm text-on-surface-variant">
          <span className="flex-1 h-px bg-white/10" />ou<span className="flex-1 h-px bg-white/10" />
        </div>

        <Button variant="secondary" className="w-full" icon="key">
          Connexion SSO (Pro Santé Connect)
        </Button>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Pas encore client ?{" "}
          <a href={`${VITRINE_URL}/contact`} className="text-primary hover:underline">
            Demandez une démo
          </a>
        </p>
      </GlassPanel>
    </section>
  );
}
