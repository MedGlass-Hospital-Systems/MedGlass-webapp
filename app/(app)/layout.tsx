import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <TopNav />
      <Sidebar />
      <main className="md:ml-64 mt-16 min-h-[calc(100vh-64px)] flex flex-col">
        <div className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-6">
          {children}
        </div>
      </main>
    </>
  );
}
