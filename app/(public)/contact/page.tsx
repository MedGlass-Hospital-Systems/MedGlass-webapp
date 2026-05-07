import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";

export default function ContactPage() {
  return (
    <section className="px-4 py-20 max-w-7xl mx-auto w-full">
      {/* En-tête de la page */}
      <div className="mb-14">
        <h1 className="text-[40px] md:text-[52px] font-bold tracking-tight mb-4 text-primary">
          Contactez notre équipe
        </h1>
        <p className="text-on-surface-variant text-lg max-w-3xl">
          Que vous ayez besoin d'une assistance technique, de renseignements commerciaux ou que vous souhaitiez explorer des opportunités de partenariat, notre équipe dédiée est là pour vous accompagner avec précision et soin.
        </p>
      </div>

      {/* Contenu principal : Grille */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne de gauche : Formulaire (occupe 2/3 de l'espace sur grand écran) */}
        <div className="lg:col-span-2">
          <GlassPanel className="p-8 h-full">
            <h2 className="text-headline-md font-bold text-primary mb-8">Envoyez-nous un message</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom complet */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Nom Complet
                  </label>
                  <input 
                    type="text" 
                    placeholder="Dr. Jeanne Dupont" 
                    className="w-full bg-transparent border border-surface-variant/50 rounded-lg p-3 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
                  />
                </div>

                {/* Nom Hôpital/Clinique */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Établissement / Service
                  </label>
                  <input 
                    type="text" 
                    placeholder="Hôpital Mémorial" 
                    className="w-full bg-transparent border border-surface-variant/50 rounded-lg p-3 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
                  />
                </div>

                {/* Email Pro */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Email Professionnel
                  </label>
                  <input 
                    type="email" 
                    placeholder="jeanne.dupont@hopital.org" 
                    className="w-full bg-transparent border border-surface-variant/50 rounded-lg p-3 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
                  />
                </div>

                {/* Sujet */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Sujet
                  </label>
                  <select 
                    className="w-full bg-transparent border border-surface-variant/50 rounded-lg p-3 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-on-surface-variant appearance-none"
                  >
                    <option value="" disabled selected>Sélectionnez un sujet...</option>
                    <option value="support">Support Technique</option>
                    <option value="sales">Ventes & Démonstration</option>
                    <option value="partnership">Partenariat</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Message
                </label>
                <textarea 
                  rows={5} 
                  placeholder="Comment pouvons-nous vous aider aujourd'hui ?" 
                  className="w-full bg-transparent border border-surface-variant/50 rounded-lg p-3 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                ></textarea>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-end pt-4">
                <Button variant="primary" className="flex items-center gap-2 px-8">
                  Envoyer la demande
                  <Icon name="send" className="text-[18px]" />
                </Button>
              </div>
            </form>
          </GlassPanel>
        </div>

        {/* Colonne de droite : Informations de contact */}
        <div className="space-y-10">
          
          {/* Canaux de support */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-5 border-l-4 border-primary pl-3">
              Canaux de support
            </h3>
            <div className="space-y-4">
              {/* Carte Support Technique */}
              <GlassPanel className="p-5 flex items-start gap-4">
                <div className="bg-primary/10 p-2.5 rounded-full text-primary shrink-0">
                   <Icon name="headset_mic" className="text-[20px]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Priorité 24/7
                  </p>
                  <h4 className="font-semibold text-body-lg mb-0.5">Support Technique</h4>
                  <a href="mailto:support@medglass.pro" className="text-primary text-body-sm hover:underline">
                    support@medglass.pro
                  </a>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Délai moy. : &lt; 15 mins
                  </p>
                </div>
              </GlassPanel>

              {/* Carte Renseignements Commerciaux */}
              <GlassPanel className="p-5 flex items-start gap-4">
                <div className="bg-primary/10 p-2.5 rounded-full text-primary shrink-0">
                   <Icon name="storefront" className="text-[20px]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Entreprise & PME
                  </p>
                  <h4 className="font-semibold text-body-lg mb-0.5">Ventes & Info</h4>
                  <a href="mailto:sales@medglass.pro" className="text-primary text-body-sm hover:underline">
                    sales@medglass.pro
                  </a>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Lun-Ven, 9h - 18h CET
                  </p>
                </div>
              </GlassPanel>
            </div>
          </div>

          {/* Présence Mondiale */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-5 border-l-4 border-primary pl-3">
              Notre présence
            </h3>
            <div className="space-y-4">
              
              {/* Siège Social */}
              <GlassPanel className="p-5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                  <Icon name="location_on" className="text-[16px]" />
                  <span>Siège Social</span>
                </div>
                <h4 className="font-semibold text-body-lg mb-2">San Francisco</h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  100 Medical Plaza Blvd,<br/>
                  Suite 400<br/>
                  San Francisco, CA 94107
                </p>
                {/* Espace pour l'image de la carte */}
                <div className="mt-4 bg-surface-variant/20 h-24 rounded-lg w-full flex items-center justify-center border border-surface-variant/30 overflow-hidden relative">
                   <span className="text-xs text-on-surface-variant absolute z-10">Intégration Google Maps</span>
                   <div className="absolute inset-0 bg-gradient-to-br from-surface-variant/10 to-surface-variant/30"></div>
                </div>
              </GlassPanel>

              {/* Hub EMEA */}
              <GlassPanel className="p-5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                  <Icon name="location_on" className="text-[16px]" />
                  <span>Hub EMEA</span>
                </div>
                <h4 className="font-semibold text-body-lg mb-2">Londres</h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  The Shard, Level 22<br/>
                  32 London Bridge St<br/>
                  London SE1 9SG, UK
                </p>
                {/* Espace pour l'image de la carte */}
                <div className="mt-4 bg-surface-variant/20 h-24 rounded-lg w-full flex items-center justify-center border border-surface-variant/30 overflow-hidden relative">
                   <span className="text-xs text-on-surface-variant absolute z-10">Intégration Google Maps</span>
                   <div className="absolute inset-0 bg-gradient-to-br from-surface-variant/10 to-surface-variant/30"></div>
                </div>
              </GlassPanel>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}