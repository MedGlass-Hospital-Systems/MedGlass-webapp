"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppConfig } from '@/lib/contexts/AppContext';


export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { planning } = useAppConfig();
    
    const router = useRouter(); 

    useEffect(() => {
        // Au chargement du composant, on vérifie si l'utilisateur a déjà vu le modal
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeTuto');
        
        if (!hasSeenWelcome ) {
            setIsOpen(true);
        }
    }, []);

    const handleStartTutorial = () => {
        localStorage.setItem('hasSeenWelcomeTuto', 'true');
        setIsOpen(false);
        router.push('/wizard'); 
    };

    const handleSkip = () => {
        // S'il veut ignorer, on enregistre quand même pour ne plus l'afficher
        localStorage.setItem('hasSeenWelcomeTuto', 'true');
        setIsOpen(false);
    };

    // Si le modal n'est pas censé être ouvert, on ne retourne rien (invisible)
    if (!isOpen) return null;

    return (
        
        // Overlay sombre (fond d'écran)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            
            <div className="w-full max-w-md p-8 text-center bg-white rounded-xl shadow-2xl animate-fade-in-up">
                
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Bienvenue ! 🎉
                </h2>
                
                <p className="mb-8 text-gray-600">
                    Nous sommes ravis de te compter parmi nous pour tester l'application. 
                    Pour bien commencer et comprendre le fonctionnement, que dirais-tu de créer ton tout premier planning ?
                </p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleStartTutorial}
                        className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Créer mon premier planning
                    </button>
                    
                    <button 
                        onClick={handleSkip}
                        className="text-sm text-gray-400 transition-colors hover:text-gray-600"
                    >
                        Passer le tutoriel pour le moment
                    </button>
                </div>
            </div>
            
        </div>
    );
}