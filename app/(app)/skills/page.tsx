import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/layout/Icon";
import { api } from "@/lib/api/client";

const skillCategories = [
  { id: "bloc", label: "Bloc opératoire", color: "primary" },
  { id: "soins", label: "Soins critiques", color: "tertiary" },
  { id: "tech", label: "Plateaux techniques", color: "secondary" },
  { id: "encadrement", label: "Encadrement", color: "warning" },
];

const allSkills = [
  "Chirurgie viscérale",
  "Cœlioscopie",
  "Bloc d'urgence",
  "Suture",
  "Hospitalisation",
  "Bloc opératoire",
  "Encadrement",
  "Réanimation médicale",
  "ECMO",
  "Échographie",
  "Coronarographie",
  "Holter",
  "Soins post-op",
  "Pansements complexes",
  "Mobilisation",
  "Hygiène",
  "Intubation",
  "VVC",
];

export default async function SkillsPage() {
  const teamStaff = await api.staff.byService("chir-gen");
  const allStaff = await api.staff.list();

  return (
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-lg text-on-surface mb-1">Compétences & carrières</h1>
          <p className="text-on-surface-variant">
            Matrice des compétences pour garantir un soignant qualifié à chaque shift.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="download">Export</Button>
          <Button icon="add">Ajouter une compétence</Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Soignants", v: allStaff.length, i: "groups" },
          { l: "Compétences", v: allSkills.length, i: "psychology" },
          { l: "Certifications", v: 12, i: "verified" },
          { l: "Évaluations en attente", v: 3, i: "pending" },
        ].map((s) => (
          <GlassPanel key={s.l} className="p-5 flex items-center gap-4">
            <span className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center">
              <Icon name={s.i} className="text-primary text-[24px]" filled />
            </span>
            <div>
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-body-sm text-on-surface-variant">{s.l}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Badge tone="primary" className="cursor-pointer">Toutes</Badge>
        {skillCategories.map((c) => (
          <Badge key={c.id} tone="neutral" className="cursor-pointer">
            {c.label}
          </Badge>
        ))}
      </div>

      {/* Matrix */}
      <GlassPanel className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md">Matrice de compétences</h2>
          <input
            type="search"
            placeholder="Rechercher un soignant ou une compétence…"
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant focus-ring w-64"
          />
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-white/5">
              <tr>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Soignant
                </th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Rôle
                </th>
                <th className="text-left p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Compétences
                </th>
                <th className="text-right p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Niveau
                </th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {teamStaff.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.initials} size="sm" />
                      <div>
                        <p className="font-semibold text-body-sm">
                          {s.role === "praticien" || s.role === "interne" ? "Dr. " : ""}
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">{s.weeklyHours}h/sem</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge tone="neutral">{s.roleLabel}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {s.skills.map((sk) => (
                        <Badge key={sk} tone="primary">{sk}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-6 rounded-sm ${i < 4 ? "bg-primary" : "bg-white/10"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:bg-primary/10 rounded-full p-2">
                      <Icon name="more_horiz" className="text-[20px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </>
  );
}
