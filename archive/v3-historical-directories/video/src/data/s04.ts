// S04 · Befund — Daten-SSOT für den nativen Rebuild (kein PNG-Einkleben).
// Regel: jede Zahl hat eine Quelle. PNG-transkribierte Werte sind mit
// `transcribed` + Toleranz markiert und müssen gegen das PNG gegengeprüft werden.
// Review-Pflicht: docs/faktencheck.md → S04-Transkription.

export interface TopicBar {
  topic: string;
  zhDe: number;
  zhEn: number;
  /** Woher die Zahl kommt */
  src: string;
}

// ── Beat 1+2: LDS je Thema (ZH-DE vs ZH-EN) ──────────────────────────────
// Quelle: video/public/figures/figure1_lds_distribution.png
// („Language Drift Score by Topic and Language Pair"), TRANSSKRIBIERT ±0.01.
// PNG-Labels: Freedom 0.84/0.72 · Justice 0.89/0.70 · Responsibility 0.88/0.77
// · Success ZH-DE-Säule stößt an die 1.0-Achse (⭑ VERIFY) · ZH-EN 0.92.
// „Overall"-Balken (EN-DE 1.0) bewusst NICHT übernommen: keine kulturelle
// Aussage, würde nur verwirren. EN-DE pro Thema hat im PNG keine Säule → n/a.
export const S04_TOPICS: TopicBar[] = [
  { topic: "Freedom", zhDe: 0.84, zhEn: 0.72, src: "figure1_lds_distribution.png (transcribed ±0.01)" },
  { topic: "Justice", zhDe: 0.89, zhEn: 0.7, src: "figure1_lds_distribution.png (transcribed ±0.01)" },
  { topic: "Responsibility", zhDe: 0.88, zhEn: 0.77, src: "figure1_lds_distribution.png (transcribed ±0.01)" },
  // ⭑ VERIFY: PNG zeigt Säule exakt an Oberkante 1.0, kein separates Label lesbar.
  { topic: "Success", zhDe: 1.0, zhEn: 0.92, src: "figure1_lds_distribution.png (transcribed ±0.01, ZH-DE VERIFY)" },
];

// ── Beat 2: Treiber-Chips (qualitativ, keine Messwerte) ───────────────────
// Quelle: narration_de.md S04 + storyboard.md („Treiberliste DE vs. ZH").
export const S04_TREIBER_DE = ["Autonomie", "Regeln"];
export const S04_TREIBER_ZH = ["Raum", "Anspruch"];

// ── Beat 3: Kontrollbefund — 4 Quellen × 3 Paare ──────────────────────────
// Quelle: video/public/figures/fig_a7_1_delta_lds.csv (EXAKT, 4 Dezimalen).
// PNG: fig_a7_1_delta_lds.png („Three-way structural divergence").
// N=15-Legende wird im Film NICHT gezeigt (s. S05-Ehrlichkeit, dort offengelegt).
export interface ControlRow {
  pair: string;
  human: number;
  llm: number;
  social: number;
  math: number;
}
export const S04_CONTROL: ControlRow[] = [
  { pair: "ZH-EN", human: 0.9634, llm: 0.9552, social: 0.6976, math: 0.9336 },
  { pair: "DE-EN", human: 0.9324, llm: 0.93, social: 0.7234, math: 0.9382 },
  { pair: "ZH-DE", human: 0.9364, llm: 0.9446, social: 0.8191, math: 0.5188 },
];
// Pointe von Beat 3: Math ZH-DE 0.5188 (konvergiert) vs. Social ZH-DE 0.8191
// (divergiert) — exakt die „Kontrollbefund"-Aussage der Narration.
