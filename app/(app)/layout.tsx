import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { HydrationGate } from "@/components/layout/HydrationGate";
import { ImpersonationBanner } from "@/components/layout/ImpersonationBanner";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Toaster } from "@/components/ui/Toaster";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <HydrationGate>
        <TopNav />
        <Sidebar />
        <main className="md:ml-64 mt-16 min-h-[calc(100vh-64px)] flex flex-col">
          <div className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-6">
            <ImpersonationBanner />
            {children}
          </div>
        </main>
        <WelcomeModal />
        <Toaster />
      </HydrationGate>
    </>
  );
}
