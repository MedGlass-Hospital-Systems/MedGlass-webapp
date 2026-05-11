import { AmbientBackground } from "@/components/layout/AmbientBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <main className="min-h-screen flex flex-col justify-center">{children}</main>
    </>
  );
}
