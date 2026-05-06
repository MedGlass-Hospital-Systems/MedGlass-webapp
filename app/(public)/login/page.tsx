import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";

export default function LoginPage() {
  return (
    <section className="px-4 py-20 max-w-md mx-auto w-full">
      <GlassPanel className="p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Icon name="local_hospital" className="text-primary text-[28px]" filled />
          </div>
          <h1 className="text-headline-md font-headline-md mb-1">Connexion</h1>
          <p className="text-on-surface-variant text-body-sm">Accédez à votre espace MedGlass Pro</p>
        </div>
        <form className="space-y-4" action="/dashboard">
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Email</span>
            <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-ring" />
          </label>
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Mot de passe</span>
            <input type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-ring" />
          </label>
          <div className="flex justify-between items-center text-body-sm">
            <label className="flex items-center gap-2 text-on-surface-variant">
              <input type="checkbox" className="rounded text-primary bg-transparent border-white/20" />
              Se souvenir
            </label>
            <Link href="/forgot-password" className="text-primary hover:underline">Mot de passe oublié ?</Link>
          </div>
          <Button className="w-full" size="lg">Se connecter</Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-body-sm text-on-surface-variant">
          <span className="flex-1 h-px bg-white/10" />ou<span className="flex-1 h-px bg-white/10" />
        </div>
        <Button variant="secondary" className="w-full" icon="key">Connexion SSO (Pro Santé)</Button>
        <p className="text-center text-body-sm text-on-surface-variant mt-6">
          Pas de compte ? <Link href="/contact" className="text-primary hover:underline">Demandez une démo</Link>
        </p>
      </GlassPanel>
    </section>
  );
}
