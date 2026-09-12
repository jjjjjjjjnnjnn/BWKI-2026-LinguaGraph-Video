/**
 * Section / chapter breakdown of the LinguaGraph pitch (32 steps).
 *
 * v5: extracted from narrations.ts comment blocks into a structured
 * single source of truth. Drives:
 *   - <SideRail /> flow indicator in App.tsx
 *   - Section labels in PIPELINE-v5.md
 *
 * ID convention: cover = pre-M1 hero, m1..m6 = the 6 narrative chapters.
 */

export interface Section {
  id: string;
  label: string;       // shown in SideRail list
  startStep: number;   // inclusive
  endStep: number;     // inclusive
}

export const SECTIONS: readonly Section[] = [
  { id: "cover", label: "Cover",              startStep:  0, endStep:  0 },
  { id: "m1",    label: "M1 · Hook",          startStep:  1, endStep:  4 },
  { id: "m2",    label: "M2 · Problem",       startStep:  5, endStep: 10 },
  { id: "m3",    label: "M3 · Methode",       startStep: 11, endStep: 17 },
  { id: "m4",    label: "M4 · Befund",        startStep: 18, endStep: 22 },
  { id: "m5",    label: "M5 · Reflexion",     startStep: 23, endStep: 26 },
  { id: "m6",    label: "M6 · Schluss",       startStep: 27, endStep: 31 },
] as const;

/**
 * One-line title for each step (DE, 1–4 words).
 * Drives the "AKTUELL" panel above the section list in SideRail.
 *
 * Mirrors the topic of each narration in narrations.ts.
 */
export const STEP_TITLES: Readonly<Record<number, string>> = {
  0:  "Cover",
  1:  "Frage auf Deutsch",
  2:  "Frage auf Chinesisch",
  3:  "Andere kognitive Landkarte",
  4:  "Tagline",
  5:  "KI global im Einsatz",
  6:  "Englisch-trainiert",
  7:  "Gerechtigkeit im Modell",
  8:  "Unterschiedliche Behandlung",
  9:  "Evaluation misst Konzepte nicht",
  10: "Blinder Fleck",
  11: "Wie misst man Konzepte",
  12: "Frag die KI selbst",
  13: "5 Themen × 3 Sprachen",
  14: "Sprache als einzige Variable",
  15: "Konzeptgraph extrahieren",
  16: "Linguistic Divergence Score",
  17: "Welche Konzepte divergieren",
  18: "50 Modelle verschiedener Anbieter",
  19: "55 Messungen · p < 0.05",
  20: "Kulturell gemustert",
  21: "Mathe konvergiert",
  22: "Beziehungen sprachspezifisch",
  23: "Ehrlich dazu",
  24: "N=15 Design-Artefakt",
  25: "8 EN-Paare nicht signifikant",
  26: "Schwelle 0.10 heuristisch",
  27: "Neue Art der KI-Prüfung",
  28: "Anwendung · Entwickler",
  29: "Anwendung · Regulierer",
  30: "Anwendung · Interpretierbar",
  31: "Danke",
} as const;

export function getStepTitle(step: number): string {
  return STEP_TITLES[step] ?? "";
}

export function getCurrentSection(step: number): Section | undefined {
  return SECTIONS.find((s) => step >= s.startStep && step <= s.endStep);
}
