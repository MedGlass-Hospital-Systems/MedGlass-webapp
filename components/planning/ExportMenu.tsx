"use client";

import { useState } from "react";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { useStaffMap } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { exportICS, exportXLSX } from "@/lib/utils/export";
import { fmtRange } from "@/lib/utils/dates";
import type { Shift, Staff } from "@/lib/types/planning";

/** Export de la période affichée : agenda .ics (toute l'équipe ou soi) et Excel .xlsx. */
export function ExportMenu({
  shifts,
  team,
  start,
  end,
  serviceName,
  myId,
}: {
  shifts: Shift[];
  team: Staff[];
  start: string;
  end: string;
  serviceName: string;
  myId: string;
}) {
  const staffMap = useStaffMap();
  const [busy, setBusy] = useState(false);
  const inRange = shifts.filter((s) => s.date >= start && s.date <= end && team.some((t) => t.id === s.staffId));
  const slug = `${serviceName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")}-${start}`;

  return (
    <Menu
      trigger={({ toggle }) => (
        <Button variant="secondary" icon="download" onClick={toggle} disabled={busy}>
          {busy ? "Export…" : "Exporter"}
        </Button>
      )}
    >
      {(close) => (
        <>
          <p className="px-4 pb-2 text-[11px] text-on-surface-variant">Période : {fmtRange(start, end)}</p>
          <MenuItem
            icon={<Icon name="event" className="text-[18px] text-primary" />}
            description="Mes postes, pour Google Agenda / Outlook / Apple"
            onClick={() => {
              close();
              const mine = inRange.filter((s) => s.staffId === myId);
              if (!mine.length) return toast("Aucun poste personnel sur la période", "warning");
              exportICS(mine, staffMap, `MedGlass — mon planning`, `mon-planning-${start}.ics`);
              toast(`${mine.length} poste(s) exporté(s) en .ics`);
            }}
          >
            Mon agenda (.ics)
          </MenuItem>
          <MenuItem
            icon={<Icon name="calendar_month" className="text-[18px] text-primary" />}
            description="Tous les postes de l'équipe affichée"
            onClick={() => {
              close();
              exportICS(inRange, staffMap, `MedGlass — ${serviceName}`, `planning-${slug}.ics`);
              toast(`${inRange.length} poste(s) exporté(s) en .ics`);
            }}
          >
            Agenda de l&apos;équipe (.ics)
          </MenuItem>
          <MenuItem
            icon={<Icon name="table_view" className="text-[18px] text-success" />}
            description="Grille collaborateurs × jours + onglet détail"
            onClick={async () => {
              close();
              setBusy(true);
              try {
                await exportXLSX({ shifts: inRange, team, start, end, title: `Planning ${serviceName} — ${fmtRange(start, end)}`, filename: `planning-${slug}.xlsx` });
                toast("Fichier Excel généré");
              } catch {
                toast("L'export Excel a échoué", "error");
              } finally {
                setBusy(false);
              }
            }}
          >
            Excel (.xlsx)
          </MenuItem>
        </>
      )}
    </Menu>
  );
}
