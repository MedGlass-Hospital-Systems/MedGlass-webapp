"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Form";
import { EmptyState, PageHeader, SearchInput } from "@/components/ui/Layout";
import { FilterPills, Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/components/layout/Icon";
import { StaffCard } from "./StaffCard";
import { SkillsMatrix } from "./SkillsMatrix";
import { ProfileDrawer } from "./ProfileDrawer";
import { CollaboratorModal } from "@/components/team/CollaboratorModal";
import { useDemoStore } from "@/lib/store/demoStore";
import { usePermissions } from "@/lib/store/hooks";
import type { ContractKind } from "@/lib/types/planning";

type ContractFilter = "tous" | "internes" | "vacataire" | "interimaire" | "prestataire";

const matchesContract = (c: ContractKind, f: ContractFilter) =>
  f === "tous" || (f === "internes" ? c === "titulaire" || c === "contractuel" : c === f);

export function DirectoryView() {
  const staff = useDemoStore((s) => s.staff);
  const services = useDemoStore((s) => s.services);
  const { isManager } = usePermissions();
  const [tab, setTab] = useState<"annuaire" | "matrice">("annuaire");
  const [q, setQ] = useState("");
  const [contract, setContract] = useState<ContractFilter>("tous");
  const [service, setService] = useState("tous");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return staff
      .filter((p) => matchesContract(p.contract, contract))
      .filter((p) => service === "tous" || p.service === service)
      .filter(
        (p) =>
          !needle ||
          `${p.firstName} ${p.lastName} ${p.roleLabel} ${p.company ?? ""} ${p.skills.map((s) => s.name).join(" ")}`
            .toLowerCase()
            .includes(needle),
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [staff, q, contract, service]);

  const counts = {
    tous: staff.length,
    internes: staff.filter((p) => matchesContract(p.contract, "internes")).length,
    vacataire: staff.filter((p) => p.contract === "vacataire").length,
    interimaire: staff.filter((p) => p.contract === "interimaire").length,
    prestataire: staff.filter((p) => p.contract === "prestataire").length,
  };
  const skillCount = new Set(staff.flatMap((p) => p.skills.map((s) => s.name))).size;

  return (
    <>
      <PageHeader
        eyebrow="Équipe"
        title="Annuaire & compétences"
        description="Retrouvez tous les collaborateurs, vacataires, intérimaires et prestataires, avec leurs compétences."
        actions={
          isManager && (
            <Button icon="person_add" onClick={() => setAdding(true)}>
              Ajouter un collaborateur
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Personnes", v: counts.tous, i: "groups" },
          { l: "Personnel interne", v: counts.internes, i: "badge" },
          { l: "Externes & vacataires", v: counts.vacataire + counts.interimaire + counts.prestataire, i: "work" },
          { l: "Compétences", v: skillCount, i: "psychology" },
        ].map((s) => (
          <GlassPanel key={s.l} className="p-5 flex items-center gap-4">
            <span className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Icon name={s.i} className="text-primary text-[24px]" filled />
            </span>
            <div>
              <p className="text-2xl font-bold tabular-nums">{s.v}</p>
              <p className="text-body-sm text-on-surface-variant">{s.l}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-3 xl:items-center justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: "annuaire", label: "Annuaire", icon: "contacts" },
            { id: "matrice", label: "Matrice de compétences", icon: "grid_view" },
          ]}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={service} onChange={(e) => setService(e.target.value)} className="sm:w-56 py-2 rounded-full" aria-label="Service">
            <option value="tous">Tous les services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <SearchInput value={q} onChange={setQ} placeholder="Nom, métier, compétence…" className="sm:w-72" />
        </div>
      </div>

      <FilterPills
        value={contract}
        onChange={setContract}
        items={[
          { id: "tous", label: "Tous", count: counts.tous },
          { id: "internes", label: "Titulaires & contractuels", count: counts.internes },
          { id: "vacataire", label: "Vacataires", count: counts.vacataire },
          { id: "interimaire", label: "Intérimaires", count: counts.interimaire },
          { id: "prestataire", label: "Prestataires", count: counts.prestataire },
        ]}
      />

      {tab === "annuaire" ? (
        filtered.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <StaffCard key={p.id} person={p} serviceName={serviceName(p.service)} onOpen={() => setProfileId(p.id)} />
            ))}
          </div>
        ) : (
          <GlassPanel>
            <EmptyState icon="person_search" title="Aucun résultat" description="Modifiez la recherche ou les filtres." />
          </GlassPanel>
        )
      ) : (
        <GlassPanel className="overflow-hidden">
          <SkillsMatrix people={filtered} onOpen={setProfileId} />
        </GlassPanel>
      )}

      <ProfileDrawer staffId={profileId} onClose={() => setProfileId(null)} />
      <CollaboratorModal open={adding} onClose={() => setAdding(false)} />
    </>
  );
}
