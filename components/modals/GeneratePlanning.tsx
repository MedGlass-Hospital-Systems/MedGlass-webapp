"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface TutorialStep {
    targetId: string;
    title: string;
    body: string;
    arrowPosition?: 'top' | 'left' | 'right' | 'bottom';
}

const steps: TutorialStep[] = [
    {
        targetId: "step-target-0",
        title: "Service et créneau",
        body: "Pour commencer la génération de votre planning, sélectionnez le service concerné connecté à votre offre. Définissez ensuite la plage de dates pour laquelle le planning sera actif.",
        arrowPosition: "top"
    },
    {
        targetId: "step-target-1",
        title: "Ajout des règles",
        body: "Configurez les règles légales et internes du service : repos obligatoires, quotas horaires maximums, et équité de répartition des gardes entre les membres de l'équipe.",
        arrowPosition: "top"
    },
    {
        targetId: "step-target-2",
        title: "Désirs et Contraintes",
        body: "Intégrez les demandes de congés valides, les indisponibilités spécifiques et les préférences individuelles du personnel pour garantir un planning sur mesure.",
        arrowPosition: "top"
    },
    {
        targetId: "step-target-3",
        title: "Génération automatique",
        body: "Notre algorithme analyse toutes vos variables et génère en quelques secondes la combinaison optimale qui respecte à la fois vos règles et les désirs de l'équipe.",
        arrowPosition: "top"
    },
    {
        targetId: "step-target-4",
        title: "Révision et Publication",
        body: "Vérifiez le brouillon généré, effectuez vos derniers ajustements manuels si nécessaire, puis publiez le planning pour notifier instantanément votre équipe.",
        arrowPosition: "top"
    }
];

export default function GenerationTutorial() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    
    const router = useRouter();

    useEffect(() => {
        const hasSeenTuto = localStorage.getItem('hasSeenGenerationTuto');
        if (!hasSeenTuto) {
            setIsOpen(true);
        }
    }, []);

    // Recalculate target element position whenever the step changes or window resizes
    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const currentTargetId = steps[currentStep]?.targetId;
            const element = document.getElementById(currentTargetId);
            
            if (element) {
                const rect = element.getBoundingClientRect();
                setCoords({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                });
                // Smooth scroll to element if it's off-screen
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [currentStep, isOpen]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        localStorage.setItem('hasSeenGenerationTuto', 'true');
        setIsOpen(false);
    };

    if (!isOpen || !coords) return null;

    const activeStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Dark Backdrop with Spotlight cutout using clip-path or box-shadow */}
            <div 
                className="absolute transition-all duration-300 pointer-events-none ring-[9999px] ring-black/60 rounded-lg"
                style={{
                    top: `${coords.top - 30}px`,
                    left: `${coords.left - 8}px`,
                    width: `${coords.width + 16}px`,
                    height: `${coords.height + 16}px`,
                }}
            />

            {/* Tooltip Card */}
            <div 
                className="absolute z-50 w-80 p-6 bg-white rounded-xl shadow-2xl transition-all duration-300 animate-fade-in"
                style={{
                    // Position the card below the target element by default
                    top: `${coords.top + coords.height + 20}px`,
                    left: `${Math.max(16, coords.left + (coords.width / 2) - 160)}px`, // Centered with screen edge padding
                }}
            >
                {/* CSS Triangle Arrow pointing UP towards the element */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white" />

                {/* Step Counter Badge */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Étape {currentStep + 1} sur {steps.length}
                    </span>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {activeStepData.title}
                </h3>
                <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                    {activeStepData.body}
                </p>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            currentStep === 0 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Précédent
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        {currentStep === steps.length - 1 ? "Terminer" : "Suivant →"}
                    </button>
                </div>
            </div>
        </div>
    );
}