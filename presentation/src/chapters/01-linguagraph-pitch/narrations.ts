import type { Narration } from "../../registry/types";

/**
 * Per-step narration for the LinguaGraph pitch (single chapter, 32 steps).
 *
 * SSOT: 节拍切分见 `nach/outline.md`. 完整口播稿见 `nach/script.md`
 * (与 `nach/docs/narration_de.md` 同源, 2026-09-11 不动).
 *
 * Index i === spoken text for `step === i` in LinguagraphPitch.tsx.
 * Length === 32 === total steps.
 *
 * v6 marker convention (TTS prosody hints):
 *   - Text may contain [EMPHASIS]…[/EMPHASIS] markers around key phrases.
 *   - The active TTS provider (edge-tts-emphasis.sh) recognises these and
 *     synthesises the bracketed chunk with --rate=-15% + --volume=+5% for
 *     a slower, weightier delivery on audience-bearing words (e.g. "blinder
 *     Fleck", "einzige Variable", "kulturell gemustert", "Sichtbar").
 *   - The visual step scene does NOT render the markers — they are TTS-only
 *     and stripped at synthesis time (provider side).
 *
 * Step 0 is the COVER (team + project tagline, longer than a typical step
 * to give readers time to absorb the editorial opening). Audio for this
 * step is synthesized separately from the source script — it combines
 * the original team + tagline lines into one cover narration.
 *
 * Steps 1–31 are unchanged from `nach/docs/narration_de.md`, only
 * re-indexed so the cover sits at the front.
 */
export const narrations: Narration[] = [
  // ─── Cover (step 0) — NEW ─────────────────────────────────────────
  // Cover narrative. Combines old team-card (S01 §4) + tagline (§5).
  // Synthesized separately; does NOT appear in narration_de.md.
  "Ich bin Jiajun Rong von der Privatschule Schloss Heessen. LinguaGraph macht solche Unterschiede messbar.",

  // ─── M1 Hook (step 1–4) ──────────────────────────────────────────
  // step 1 — DE ask "Freiheit" + 3 DE answers
  "Fragen wir ein deutsches KI-Modell: Was gehört zur Freiheit? Es antwortet: Autonomie, Regeln, eigene Ziele.",
  // step 2 — ZH ask + 3 ZH answers (split reveal)
  "Fragen wir dasselbe Modell auf Chinesisch nach Zi You: Es antwortet mit Raum, Grenzen, dem, was einem zusteht.",
  // step 3 — "Dasselbe Wort — andere kognitive Landkarte"
  "Dasselbe Wort — aber eine andere kognitive Landkarte.",
  // step 4 — LinguaGraph tagline reveal
  "Genau solche Unterschiede macht LinguaGraph messbar.",

  // ─── M2 Problem (step 5–10) ──────────────────────────────────────
  // step 5 — KI global deployment
  "KI-Systeme werden heute für Milliarden von Menschen in Dutzenden Sprachen bereitgestellt.",
  // step 6 — English-trained data
  "Aber sie sind überwiegend mit englischen Daten trainiert.",
  // step 7 — Gerechtigkeit credit-scoring split
  "Versteht ein Modell Gerechtigkeit in einem Kreditentscheidungs-System auf Deutsch und Chinesisch gleich?",
  // step 8 — Different treatment
  "Wenn nicht, erhalten Nutzer je nach Sprache unterschiedliche Behandlung.",
  // step 9 — Evaluation gap
  "Gängige KI-Evaluation misst aber nur die Aufgabenerfüllung — nicht, ob die Wertkonzepte des Modells sprachübergreifend konsistent sind.",
  // step 10 — "blinder Fleck" [EMPHASIS marker for TTS slow-down]
  "Das ist ein [EMPHASIS]blinder Fleck[/EMPHASIS].",

  // ─── M3 Methode (step 11–17) ─────────────────────────────────────
  // step 11 — How to measure invisible
  "Wie misst man etwas Unsichtbares wie die Konzeptstruktur eines Modells?",
  // step 12 — Core idea: ask the AI itself
  "Kernidee: Man fragt die KI selbst.",
  // step 13 — LLM as subject, 5 themes × 3 languages
  "Wir machen das LLM zum kontrollierten Versuchsprobanden: Dasselbe Modell, dieselben fünf Themen — Gerechtigkeit, Freiheit, Verantwortung, Heimat, Erfolg — nur die Sprache ändert sich.",
  // step 14 — Language is the only variable [EMPHASIS]
  "Weil es dasselbe Modell ist, ist [EMPHASIS]Sprache die einzige Variable[/EMPHASIS].",
  // step 15 — Concept graph extraction
  "Aus den Antworten extrahieren wir pro Sprache einen Konzeptgraphen.",
  // step 16 — LDS formula
  "Unsere neue Metrik, der Linguistic Divergence Score, misst die strukturelle Divergenz — über gemeinsame Konzepte und Relationen.",
  // step 17 — Names the drivers
  "Und wir können nicht nur eine Zahl ausgeben, sondern benennen, welche Konzept-Bestandteile genau divergieren.",

  // ─── M4 Befund (step 18–22) ───────────────────────────────────────
  // step 18 — 50 models from various providers
  "Wir haben das Experiment auf über 50 Modelle verschiedener Anbieter ausgeweitet — auch auf ein US-amerikanisches Modell.",
  // step 19 — 55 measurements, p<0.05 [v6: explicit "Sprachpaar-Messungen über 50 Modelle"]
  "Bei 55 Sprachpaar-Messungen über 50 Modelle hinweg ist das chinesisch-deutsche Signal statistisch signifikant.",
  // step 20 — Cultural pattern [EMPHASIS on "kulturell gemustert"]
  "Und es ist nicht zufällig, sondern [EMPHASIS]kulturell gemustert[/EMPHASIS]: Deutsche Konzepte betonen Autonomie und Regeln, chinesische Raum und Anspruch.",
  // step 21 — Mathe converges / culture diverges
  "Der entscheidende Kontrollbefund: Institutionelles Wissen — etwa Mathematik — konvergiert sprachübergreifend. Kulturelle Konzepte divergieren dagegen deutlich.",
  // step 22 — Relations also language-specific
  "Selbst die Beziehungen zwischen Konzepten organisieren sich sprachspezifisch.",

  // ─── M5 Reflexion (step 23–26) ─────────────────────────────────────
  // step 23 — Ehrlich dazu (tone shift)
  "Ehrlich dazu.",
  // step 24 — N=15 design artifact
  "Unser Human-Experiment mit 15 Personen zeigt unter Between-Subject-Bedingungen kein Sprachsignal — ein Design-Artefakt, kein Gegenbeweis.",
  // step 25 — 8 EN-pairs not significant
  "Acht englisch-haltige Paare sind nicht signifikant — konsistent mit der Englisch-Zentriertheit heutiger Modelle.",
  // step 26 — Threshold 0.10 is heuristic
  "Und unsere operative Schwelle von 0,10 ist eine heuristische Faustregel, keine validierte Grenze.",

  // ─── M6 Anwendung + Schluss (step 27–31) ─────────────────────────
  // step 27 — New kind of audit [EMPHASIS]
  "Damit ist LinguaGraph [EMPHASIS]eine neue Art von KI-Prüfung[/EMPHASIS].",
  // step 28 — Developer use case
  "Ein Entwickler kann vor dem Einsatz eines mehrsprachigen Modells prüfen: Driftet mein Modell bei wertbeladenen Begriffen zwischen Sprachen — und wo genau?",
  // step 29 — Regulator use case
  "Für Regulierer liefert es Transparenz, wie der EU AI Act sie verlangt.",
  // step 30 — Interpretable output
  "Der Output ist interpretierbar — kein Black-Box-Score, sondern eine Liste der konkreten Konzept-Bestandteile, die divergieren.",
  // step 31 — Closing: LinguaGraph. Sichtbar. Danke. [EMPHASIS on "Sichtbar"]
  "LinguaGraph. [EMPHASIS]Sichtbar[/EMPHASIS]. Danke.",
];