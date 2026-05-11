import { redirect } from "next/navigation";

// La racine de app.medglass.fr redirige vers le dashboard
export default function RootPage() {
  redirect("/dashboard");
}
