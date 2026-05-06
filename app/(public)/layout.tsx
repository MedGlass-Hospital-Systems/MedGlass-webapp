import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <TopNav variant="public" />
      <main className="pt-16 min-h-[calc(100vh-64px)] flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
