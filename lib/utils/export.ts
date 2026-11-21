import type { Shift, Staff } from "@/lib/types/planning";
import { SHIFT_LABELS } from "./labels";
import { addDaysISO, fmt, rangeDates } from "./dates";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const icsDate = (iso: string) => iso.replace(/-/g, "");
const icsDateTime = (iso: string, time: string) => `${icsDate(iso)}T${time.replace(":", "")}00`;
const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Fichier iCalendar (RFC 5545) importable dans Google Agenda, Outlook, Apple Calendrier. */
export function buildICS(shifts: Shift[], staff: Map<string, Staff>, calendarName: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MedGlass//Planning//FR",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${icsEscape(calendarName)}`,
    "X-WR-TIMEZONE:Europe/Paris",
  ];
  for (const s of shifts) {
    const person = staff.get(s.staffId);
    const who = person ? `${person.firstName} ${person.lastName}` : s.staffId;
    const allDay = s.type === "conges" || s.type === "rtt";
    const overnight = s.endTime <= s.startTime;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${s.id}@medglass`,
      `DTSTAMP:${stamp}`,
      allDay ? `DTSTART;VALUE=DATE:${icsDate(s.date)}` : `DTSTART;TZID=Europe/Paris:${icsDateTime(s.date, s.startTime)}`,
      allDay
        ? `DTEND;VALUE=DATE:${icsDate(addDaysISO(s.date, 1))}`
        : `DTEND;TZID=Europe/Paris:${icsDateTime(overnight ? addDaysISO(s.date, 1) : s.date, s.endTime)}`,
      `SUMMARY:${icsEscape(`${SHIFT_LABELS[s.type]} — ${who}`)}`,
      `DESCRIPTION:${icsEscape(`${SHIFT_LABELS[s.type]} ${s.startTime}-${s.endTime} · ${person?.roleLabel ?? ""}`)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function exportICS(shifts: Shift[], staff: Map<string, Staff>, calendarName: string, filename: string) {
  downloadBlob(new Blob([buildICS(shifts, staff, calendarName)], { type: "text/calendar;charset=utf-8" }), filename);
}

const XLSX_FILLS: Record<Shift["type"], string> = {
  jour: "FFDCE6FF",
  nuit: "FFE4E3FF",
  garde: "FFFFDAD6",
  astreinte: "FFFFE8CC",
  admin: "FFEDEFF3",
  conges: "FFD9F5D9",
  rtt: "FFD9F5D9",
  formation: "FFD5F3FF",
};

/** Classeur Excel : un onglet grille collaborateurs × jours, un onglet détail. Chargé à la demande. */
export async function exportXLSX(opts: {
  shifts: Shift[];
  team: Staff[];
  start: string;
  end: string;
  title: string;
  filename: string;
}) {
  const { Workbook } = await import("exceljs");
  const wb = new Workbook();
  wb.creator = "MedGlass";
  const days = rangeDates(opts.start, opts.end);

  const grid = wb.addWorksheet("Planning", { views: [{ state: "frozen", xSplit: 2, ySplit: 2 }] });
  grid.addRow([opts.title]).font = { bold: true, size: 14 };
  const header = grid.addRow(["Collaborateur", "Fonction", ...days.map((d) => fmt(d.date, "EEE dd/MM"))]);
  header.font = { bold: true };
  header.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A2029" } };
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    c.alignment = { horizontal: "center", vertical: "middle" };
  });
  grid.getColumn(1).width = 24;
  grid.getColumn(2).width = 24;
  days.forEach((_, i) => (grid.getColumn(i + 3).width = 13));

  for (const person of opts.team) {
    const row = grid.addRow([
      `${person.firstName} ${person.lastName}`,
      person.roleLabel,
      ...days.map((d) => {
        const s = opts.shifts.find((x) => x.staffId === person.id && x.date === d.date);
        if (!s) return "";
        return s.type === "conges" || s.type === "rtt" ? SHIFT_LABELS[s.type] : `${SHIFT_LABELS[s.type]} ${s.startTime}-${s.endTime}`;
      }),
    ]);
    days.forEach((d, i) => {
      const s = opts.shifts.find((x) => x.staffId === person.id && x.date === d.date);
      const cell = row.getCell(i + 3);
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      if (s) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: XLSX_FILLS[s.type] } };
    });
  }

  const detail = wb.addWorksheet("Détail");
  detail.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: "Collaborateur", key: "who", width: 24 },
    { header: "Fonction", key: "role", width: 24 },
    { header: "Type", key: "type", width: 12 },
    { header: "Début", key: "start", width: 9 },
    { header: "Fin", key: "end", width: 9 },
  ];
  detail.getRow(1).font = { bold: true };
  const byId = new Map(opts.team.map((p) => [p.id, p]));
  opts.shifts
    .filter((s) => byId.has(s.staffId) && s.date >= opts.start && s.date <= opts.end)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .forEach((s) => {
      const p = byId.get(s.staffId)!;
      detail.addRow({
        date: fmt(s.date, "dd/MM/yyyy"),
        who: `${p.firstName} ${p.lastName}`,
        role: p.roleLabel,
        type: SHIFT_LABELS[s.type],
        start: s.startTime,
        end: s.endTime,
      });
    });

  const buffer = await wb.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    opts.filename,
  );
}
