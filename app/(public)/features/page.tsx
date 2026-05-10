"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/layout/Icon";
import { Variants } from "framer-motion";

const features = [
  {
    i: "auto_fix",
    t: "Génération automatique",
    d: "Un assistant IA propose un planning optimal en quelques secondes en respectant vos règles de service, contrats et compétences.",
    color: "from-blue-500/20 to-cyan-500/10" // Couleurs pour les placeholders visuels
  },
  {
    i: "swap_horiz",
    t: "Échange de gardes",
    d: "Demandes d'échange et remplacements validés par le cadre, traçabilité complète et notifications instantanées.",
    color: "from-indigo-500/20 to-purple-500/10"
  },
  {
    i: "event_busy",
    t: "Congés & absences",
    d: "Demandes de congés, RTT, formation, maladie. Validation hiérarchique et impact temps réel sur le planning.",
    color: "from-emerald-500/20 to-teal-500/10"
  },
  {
    i: "warning",
    t: "Détection des conflits",
    d: "Repos non respectés, gardes consécutives, sous-effectif : l'application alerte avant publication.",
    color: "from-orange-500/20 to-red-500/10"
  },
  {
    i: "psychology",
    t: "Matrice de compétences",
    d: "Garantissez qu'un soignant qualifié est toujours présent (réa, bloc, néonat, urgences vitales).",
    color: "from-blue-600/20 to-indigo-600/10"
  },
  {
    i: "schedule",
    t: "Compteurs d'heures",
    d: "Suivi des heures sup, du temps de travail effectif, du forfait jours et des récupérations en temps réel.",
    color: "from-sky-500/20 to-blue-500/10"
  },
  {
    i: "groups",
    t: "Multi-services & sites",
    d: "Gérez plusieurs pôles, services et établissements depuis une seule plateforme avec droits d'accès fins.",
    color: "from-violet-500/20 to-fuchsia-500/10"
  },
  {
    i: "phone_iphone",
    t: "Application mobile",
    d: "Vos soignants consultent leur planning, posent leurs congés et échangent leurs gardes depuis leur téléphone.",
    color: "from-slate-500/20 to-gray-500/10"
  },
  {
    i: "lock",
    t: "Sécurité & conformité",
    d: "Hébergement de Données de Santé certifié, double authentification et journalisation des accès.",
    color: "from-emerald-600/20 to-green-500/10"
  },
];

// Variante d'animation pour Framer Motion
const revealVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" // Now TS knows this must conform to Framer Motion's Easing type
    } 
  }
};

export default function FeaturesPage() {
  return (
    <div className="w-full relative bg-surface overflow-hidden">
      
      {/* En-tête de la page */}
      <section className="px-4 py-24 max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-6 text-primary leading-tight">
            Des outils de précision pour <br className="hidden md:block"/>
            <span className="text-gradient">la santé moderne</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl">
            Découvrez nos modules avancés conçus pour fluidifier les opérations, 
            garantir la conformité et donner du pouvoir à vos équipes cliniques.
          </p>
        </motion.div>
      </section>

      {/* Liste des fonctionnalités avec effet "Scroll Reveal" et disposition alternée */}
      <section className="max-w-7xl mx-auto px-4 pb-32 flex flex-col gap-24 md:gap-32">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={feature.i}
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }} // Déclenche l'animation un peu avant que l'élément soit visible
              className={`flex flex-col gap-10 items-center ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              
              {/* Carte de texte (GlassPanel) */}
              <div className="w-full md:w-5/12 z-10">
                <GlassPanel className="p-8 md:p-10 relative overflow-hidden group hover:border-primary/40 transition-colors duration-500">
                  {/* Décoration de fond subtile dans la carte */}
                  <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${feature.color} blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-primary border border-primary/20 shadow-inner">
                    <Icon name={feature.i} className="text-[28px]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-on-surface">{feature.t}</h3>
                  <p className="text-on-surface-variant leading-relaxed text-lg">
                    {feature.d}
                  </p>
                  
                  <div className="mt-8">
                    <a href="#demo" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide">
                      Découvrir ce module <Icon name="arrow_forward" className="text-[16px]" />
                    </a>
                  </div>
                </GlassPanel>
              </div>

              {/* Espace pour l'image de fond/maquette associée à la fonctionnalité */}
              <div className="w-full md:w-7/12 relative">
                {/* REMPLACEZ CETTE DIV PAR VOTRE BALISE <img src="..." />
                  J'utilise ici un placeholder stylisé avec un dégradé pour la structure.
                */}
                <div className={`aspect-video md:aspect-[4/3] rounded-3xl bg-gradient-to-br ${feature.color} border border-surface-variant/40 shadow-2xl overflow-hidden relative flex items-center justify-center`}>
                   
                   {/* Éléments décoratifs pour simuler une interface d'application */}
                   <div className="absolute inset-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner flex flex-col p-4">
                      <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
                         <div className="w-8 h-8 rounded-full bg-white/20"></div>
                         <div className="flex-1 space-y-2 py-1">
                            <div className="h-2 w-1/3 bg-white/20 rounded"></div>
                            <div className="h-2 w-1/4 bg-white/10 rounded"></div>
                         </div>
                      </div>
                      <div className="flex-1 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                         <span className="text-on-surface-variant/50 text-sm font-medium">Illustration : {feature.t}</span>
                      </div>
                   </div>

                </div>
              </div>

            </motion.div>
          );
        })}
      </section>

    </div>
  );
}