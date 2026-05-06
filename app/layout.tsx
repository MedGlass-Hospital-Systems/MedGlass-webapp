import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedGlass — Planification hospitalière intelligente",
  description:
    "MedGlass est la plateforme de planification dédiée aux hôpitaux : gardes, astreintes, congés, échanges de shifts et matrice de compétences pour vos équipes médicales et paramédicales.",
  keywords: [
    "planning hospitalier",
    "logiciel planning médical",
    "gestion gardes",
    "logiciel hôpital",
    "planning IDE",
    "planning praticien",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
