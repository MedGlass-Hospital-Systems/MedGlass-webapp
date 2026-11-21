"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, usePermissions } from "@/lib/store/hooks";

/** Message de bienvenue affiché à la première visite (réaffichable depuis la page Aide). */
export function WelcomeModal() {
  const seen = useDemoStore((s) => s.tutorials.welcome);
  const setSeen = useDemoStore((s) => s.setTutorialSeen);
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const router = useRouter();

  const close = () => setSeen("welcome", true);

  return (
    <Modal
      open={!seen}
      onClose={close}
      size="sm"
      icon="waving_hand"
      title={`Bienvenue ${user.firstName} !`}
      description="Vous êtes sur la démo interactive de MedGlass."
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Passer pour le moment
          </Button>
          <Button
            icon={isManager ? "auto_fix" : "menu_book"}
            onClick={() => {
              close();
              router.push(isManager ? "/wizard?nouveau=1" : "/aide");
            }}
          >
            {isManager ? "Créer mon premier planning" : "Voir les tutos"}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-on-surface-variant">
        <p>
          Toutes les actions fonctionnent : poser un congé, échanger un poste, générer et publier un planning, recruter…
          Vos modifications sont conservées dans ce navigateur.
        </p>
        <ul className="space-y-2 text-body-sm">
          {[
            ["supervised_user_circle", "Incarnez un soignant depuis votre avatar pour voir son parcours (souhaits, bourse au poste)."],
            ["help", "Les tutos pas à pas sont dans « Tutos & aide »."],
            ["restart_alt", "« Réinitialiser la démo » (menu de l'avatar) remet les données de départ."],
          ].map(([icon, text]) => (
            <li key={icon} className="flex gap-3">
              <Icon name={icon} className="text-primary text-[18px] mt-0.5" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
