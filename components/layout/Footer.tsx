const VITRINE_URL = "https://medglass.fr";

export function Footer() {
  return (
    <footer className="w-full py-10 px-4 md:px-8 bg-background/70 backdrop-blur-[20px] border-t border-outline-variant/20 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} MedGlass Hospital Systems. Tous droits réservés.
        </p>
        <div className="flex flex-wrap gap-4 text-body-sm text-on-surface-variant">
          <a href={VITRINE_URL} className="hover:text-primary transition-colors">medglass.fr</a>
          <a href={`${VITRINE_URL}/pricing`} className="hover:text-primary transition-colors">Tarifs</a>
          <a href={`${VITRINE_URL}/contact`} className="hover:text-primary transition-colors">Contact</a>
          <a href={`${VITRINE_URL}/legal/privacy`} className="hover:text-primary transition-colors">Confidentialité</a>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          HDS certifié · RGPD
        </p>
      </div>
    </footer>
  );
}
