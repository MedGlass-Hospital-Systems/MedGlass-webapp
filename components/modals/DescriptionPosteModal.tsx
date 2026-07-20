"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/layout/Icon";
import type { JobRole } from "@/lib/types/recruitment";

interface PosteModalInterface {
  job: JobRole;
  open: boolean;
  onClose: () => void;
}

export default function DescriptionPosteModal({ job, open, onClose }: PosteModalInterface) {
  // Simulez ici la récupération des droits utilisateur
  const [isAdmin] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Conteneur du modal animé */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel relative shadow-2xl"
      >
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors"
        >
          <Icon name="close" className="text-[20px]" />
        </button>

        {/* En-tête du modal */}
        <div className="mb-6 pr-8">
          <h2 className="text-headline-sm font-bold text-on-surface">{job.title}</h2>
          <p className="text-body-sm text-primary mt-1">Clôture des candidatures : {job.closesAt ? new Date(job.closesAt).toLocaleDateString() : "Au fil de l'eau"}</p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-title-md font-semibold text-on-surface mb-2">Description du poste</h3>
          {/* Assurez-vous d'avoir une propriété de description dans votre type JobRole */}
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {/* @ts-ignore - Remplacer par job.description si elle existe dans votre type */}
            {job.description || "Aucune description détaillée n'a été fournie pour ce poste."}
          </p>
        </div>

        {/* Liste des candidats avec affichage conditionnel */}
        <div>
          <h3 className="text-title-md font-semibold text-on-surface mb-4">
            Liste des candidats ({job.applications || 0})
          </h3>
          {isAdmin ? <ListeCandidatAdmin /> : <ListeCandidat />}
        </div>
      </motion.div>
    </div>
  );
}

// --- SOUS-COMPOSANTS POUR LES CANDIDATS ---

function ListeCandidatAdmin() {
  // Exemple de données factices, à remplacer par vos vraies données
  const [candidats, setCandidats] = useState([
    { id: 1, nom: "Jean Dupont", status: "En attente" },
    { id: 2, nom: "Marie Curie", status: "En attente" },
  ]);

  const handleAction = (id: number, action: "Accepter" | "Refuser") => {
    // Logique d'acceptation / refus
    console.log(`${action} le candidat ${id}`);
  };

  return (
    <ul className="flex flex-col gap-3">
      {candidats.map((candidat) => (
        <li key={candidat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <span className="text-body-md text-on-surface font-medium">{candidat.nom}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => handleAction(candidat.id, "Refuser")}
              className="px-3 py-1.5 bg-error/20 text-error rounded-md hover:bg-error/30 transition-colors text-label-caps"
            >
              Refuser
            </button>
            <button 
              onClick={() => handleAction(candidat.id, "Accepter")}
              className="px-3 py-1.5 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors text-label-caps"
            >
              Accepter
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ListeCandidat() {
  const candidats = [
    { id: 1, nom: "Jean Dupont" },
    { id: 2, nom: "Marie Curie" },
  ];

  return (
    <ul className="flex flex-col gap-2">
      {candidats.map((candidat) => (
        <li key={candidat.id} className="p-3 bg-white/5 rounded-lg border border-white/5 text-on-surface-variant flex items-center gap-3">
          <Icon name="person" className="text-[18px]" />
          {candidat.nom}
        </li>
      ))}
    </ul>
  );
}