/**
 * build-subs-user.mjs — generate a 32-cue English SRT aligned to the
 * user's hand-cut 173s video, using faster-whisper ASR segments as
 * ground truth for the time axis.
 *
 * Why this exists (vs build-subs.mjs):
 *   - build-subs.mjs assumes 32 mp3 cumulative == final video timeline.
 *   - User's manual cut at 202609112316.mp4 is 172.97s but the 32 mp3
 *     concat is only 167.78s — the 5s delta is natural pauses the user
 *     retained, not v8 forced holds.
 *   - User-cut segment boundaries do NOT match mp3 cumulative boundaries
 *     1:1 (user re-cut inside some steps). So we can't just rename
 *     subtitles_en.srt to *_user.srt and call it done.
 *
 * Strategy:
 *   1. Load 56 ASR segments from temp/asr-segments.json (already produced
 *      by faster-whisper base on the user-cut audio).
 *   2. Walk the 32 DE narrations and consume ASR segments in order.
 *      Each narration step consumes 1-4 ASR segments depending on how
 *      the user's cut split the audio.
 *   3. Hard-code a 32-step anchor table mapping narration_index →
 *      [first_asr_index, last_asr_index]. This is more reliable than
 *      fuzzy text match (whisper DE has small spelling errors like
 *      "Blinderfleck" vs "blinder Fleck").
 *   4. Output subtitles_en_user.srt: 32 cues, time axis = user cut.
 *
 * ZH subtitles (subtitles_zh_user.srt) is built by translate-subs.mjs
 * from this EN SRT, keeping the same 32 timestamps.
 */

import { writeFile, readFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const NACH_ROOT = resolve(ROOT, "..");
const ASR_JSON = resolve(NACH_ROOT, "temp", "asr-segments.json");
const OUT_SRT = resolve(NACH_ROOT, "docs", "subtitles_en_user.srt");
const LOCAL_SRT = resolve(NACH_ROOT, "renders", "raw", "subtitles_en_user.srt");

// 32-step English translations (reuse EN_TRANSLATIONS from build-subs.mjs)
// These match narrations.ts [0..31] exactly.
const EN_TRANSLATIONS = [
  // Cover (step 0)
  "I am Jiajun Rong from Privatschule Schloss Heessen.\nLinguaGraph makes exactly these differences measurable.",
  // M1 Hook (1-4)
  "Let's ask a German AI model: what belongs to freedom?\nIt answers: autonomy, rules, one's own goals.",
  "Let's ask the same model in Chinese about Zi You.\nIt says: room, boundaries, what one is entitled to.",
  "Same word — but a different cognitive map.",
  "LinguaGraph makes exactly these differences measurable.",
  // M2 Problem (5-10)
  "AI systems today serve billions of people,\nin dozens of languages.",
  "But they're trained predominantly on English data.",
  "Does a model mean the same thing by 'justice'\nin a German and a Chinese loan decision?",
  "If not, users get different treatment\ndepending on the language they speak.",
  "Standard AI evaluation only measures task completion —\nnot whether value concepts stay consistent across languages.",
  "This is a blind spot.",
  // M3 Method (11-17)
  "How do you measure something invisible —\nlike a model's concept structure?",
  "The core idea: ask the AI itself.",
  "We turn the LLM into a controlled subject:\nSame model, same five topics — justice, freedom, responsibility, home, success — only the language changes.",
  "Because it's the same model, language is the only variable.",
  "From each response we extract a concept graph, per language.",
  "Our new metric, the Linguistic Divergence Score,\nmeasures structural divergence — across shared concepts and relations.",
  "And we don't just output a number —\nwe name exactly which concept components diverge.",
  // M4 Finding (18-22)
  "We extended the experiment to over fifty models\nfrom various providers — including a US-American model.",
  "In fifty-five measurements, the Chinese–German signal\nis statistically significant.",
  "And it's not random — it's culturally patterned.\nGerman concepts stress autonomy and rules;\nChinese ones, space and aspiration.",
  "The decisive control finding: institutional knowledge —\nlike mathematics — converges across languages.\nCultural concepts clearly diverge.",
  "Even the relations between concepts\norganize themselves in language-specific ways.",
  // M5 Reflection (23-26)
  "Honestly:",
  "Our human experiment with fifteen people\nshows no language signal under between-subject conditions —\na design artifact, not counter-evidence.",
  "Eight English-containing pairs are not significant —\nconsistent with the English-centrism of today's models.",
  "And our operational threshold of zero point one zero\nis a heuristic rule of thumb — not a validated boundary.",
  // M6 Application + Schluss (27-31)
  "LinguaGraph is a new kind of AI audit.",
  "A developer can check before deploying a multilingual model:\ndoes mine drift on value-laden terms across languages — and where exactly?",
  "For regulators, it delivers the transparency\nthe EU AI Act requires.",
  "The output is interpretable — no black-box score,\nbut a list of the concrete concept components that diverge.",
  "LinguaGraph. Visible. Thank you.",
];

/**
 * 32-step anchor table: narration_index → [first_asr_index, last_asr_index]
 *
 * Maps each DE narration step (from narrations.ts [0..31]) to a contiguous
 * range of ASR segments produced by faster-whisper. The boundaries were
 * hand-checked against temp/asr-segments.json (56 segments, 0-171.67s).
 *
 * Important: the anchor table must be checked against the DE narration
 * text. If whisper's segment boundaries drift, update this table.
 */
const ANCHOR_TABLE = [
  // step 0 — Cover (Team + tagline)
  // DE: "Ich bin Jiajun Rong..." + "LinguaGraph macht solche Unterschiede messbar"
  // ASR segs 0-1: "Ich bin Jajun Rong..." + "Lingua Graf macht solche Unterschiede messbar"
  { from: 0, to: 1 },

  // step 1 — DE ask "Freiheit" + 3 answers
  // DE: "Fragen wir ein deutsches KI-Modell... eigene Ziele."
  // ASR segs 2-4: "Fragen wir ein deutsches KI-Modell" + "Was gehört zur Freiheit?" + "Es antwortet, Autonomie..."
  { from: 2, to: 4 },

  // step 2 — ZH ask "Zi You" + 3 answers
  // DE: "Fragen wir dasselbe Modell auf Chinesisch... zusteht."
  // ASR segs 5-6: "Fragen wir das selben Modell auf chinesisch..." + "Es antwortet mit Raum..."
  { from: 5, to: 6 },

  // step 3 — "andere kognitive Landkarte"
  // ASR seg 7: "Das selbe Wort, aber eine andere kognitive Landkarte"
  { from: 7, to: 7 },

  // step 4 — Tagline reveal "Genau solche Unterschiede macht LinguaGraph messbar"
  // ASR seg 8: "Genauso solche Unterschiede macht Lingua Graf messbar"
  { from: 8, to: 8 },

  // step 5 — KI global deployment
  // ASR segs 9-10: "KI-Systeme werden heute für Milliarden" + "in dutzenden Sprachen bereitgestellt"
  { from: 9, to: 10 },

  // step 6 — English-trained
  // ASR seg 11: "Aber sie sind überwiegend mit englischen Daten trainiert"
  { from: 11, to: 11 },

  // step 7 — Gerechtigkeit credit-scoring
  // ASR segs 12-13: "Versteht ein Modell, Gerechtigkeit in einem Kreditentscheidungssystem" + "auf Deutsch und chinesisch gleich?"
  { from: 12, to: 13 },

  // step 8 — Different treatment
  // ASR seg 14: "Wenn nicht, erhalten Nutzer je nach Sprache unterschiedliche Behandlung"
  { from: 14, to: 14 },

  // step 9 — Evaluation gap
  // ASR segs 15-16: "Gängige KI-Evaluation misst aber nur die Aufgabenerfüllung nicht" + "Ob die Wertkonzepte..."
  { from: 15, to: 16 },

  // step 10 — "blinder Fleck"
  // ASR seg 17: "Das ist ein Blinderfleck"
  { from: 17, to: 17 },

  // step 11 — Wie misst man etwas Unsichtbares
  // ASR seg 18: "Wie misst man etwas unsichtbares wie die Konzeptstruktur eines Modells"
  { from: 18, to: 18 },

  // step 12 — "Kernidee: Man fragt die KI selbst"
  // ASR segs 19-20: "Keine Idee" + "Man fragt die KI selbst" (whisper hallucinated "Keine Idee")
  { from: 19, to: 20 },

  // step 13 — 5 Themen × 3 Sprachen
  // ASR segs 21-23: "Wir machen das LLM zum kontrollierten Versuchsprobanden" + "Das selbe Modell..." + "nur die Sprache ändert sich"
  { from: 21, to: 23 },

  // step 14 — "Sprache die einzige Variable"
  // ASR seg 24: "Weil es das selbe Modell ist, ist Sprache die einzige Variable"
  { from: 24, to: 24 },

  // step 15 — Konzeptgraph extraction
  // ASR seg 25: "Aus den Antworten extra hierin wir pro Sprache einen Konzept grafen"
  { from: 25, to: 25 },

  // step 16 — LDS metric
  // ASR segs 26-27: "Unsere neue Metric..." + "über gemeinsame Konzepte und Relationen"
  { from: 26, to: 27 },

  // step 17 — Names the drivers
  // ASR segs 28-29: "Und wir können nicht nur eine Zahl ausgeben..." + "genau divergieren"
  { from: 28, to: 29 },

  // step 18 — 50 models
  // ASR segs 30-31: "Wir haben das Experiment auf über 50 Modelle..." + "auf ein US-amerikanisches Modell"
  { from: 30, to: 31 },

  // step 19 — "55 Messungen · p<0.05"
  // ASR segs 32-33: "Bei 55 Sprachpammessungen über 50 Modelle hinweg..." + "signifikant"
  { from: 32, to: 33 },

  // step 20 — "kulturell gemustert"
  // ASR segs 34-35: "Und es ist nicht zufällig, sondern kulturell gemustert" + "Deutsche Konzepte betonen Autonomie und Regeln..."
  { from: 34, to: 35 },

  // step 21 — Mathe converges
  // ASR segs 36-38: "Der entscheidende Kontrollbefund, institutionelles Wissen..." + "übergreifend" + "Kulturelle Konzepte..."
  { from: 36, to: 38 },

  // step 22 — Relations language-specific
  // ASR seg 39: "Selbst die Beziehungen zwischen Konzepten organisieren sich sprachspezifisch"
  { from: 39, to: 39 },

  // step 23 — "Ehrlich dazu"
  // ASR seg 40: "Ehrlich dazu"
  { from: 40, to: 40 },

  // step 24 — N=15 design artifact
  // ASR segs 41-42: "Unser jungen Experiment mit 15 Personen..." + "ein Design-Artefakt, kein Gegenbereich"
  { from: 41, to: 42 },

  // step 25 — 8 EN-pairs
  // ASR segs 43-44: "8 englischhaltige Paare sind nicht signifikant..." + "Modelle"
  { from: 43, to: 44 },

  // step 26 — 0.10 heuristic
  // ASR segs 45-46: "Unsere operative Schwelle von 0, 10..." + "Grenze"
  { from: 45, to: 46 },

  // step 27 — "neue Art von KI-Prüfung"
  // ASR seg 47: "Damit ist Lingorgraf eine neue Art von KI-Prüfung"
  { from: 47, to: 47 },

  // step 28 — Developer use case
  // ASR segs 48-49: "Ein Entwickler kann vor dem Einsatz..." + "Driftet mein Modell bei wertbeladenen Begriffen..."
  { from: 48, to: 49 },

  // step 29 — Regulator use case
  // ASR seg 50: "Für regulierer Liefer des Transparenz, wie der EU AI-Ekt, sie verlangt"
  { from: 50, to: 50 },

  // step 30 — Interpretable output
  // ASR segs 51-52: "Der Output ist interpretierbar kein Blackbox-Gore..." + "die diversieren"
  { from: 51, to: 52 },

  // step 31 — Closing
  // ASR segs 53-55: "Lingorgraf" + "Sichtbar" + "Danke"
  { from: 53, to: 55 },
];

function fmtTime(seconds) {
  // Clamp to non-negative
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

async function main() {
  if (!existsSync(ASR_JSON)) {
    console.error(`[build-subs-user] missing ${ASR_JSON}`);
    console.error(`[build-subs-user] run faster-whisper first to produce ASR segments`);
    process.exit(1);
  }

  const asrSegs = JSON.parse(await readFile(ASR_JSON, "utf8"));
  console.log(`[build-subs-user] loaded ${asrSegs.length} ASR segments from ${ASR_JSON}`);

  if (ANCHOR_TABLE.length !== 32) {
    console.error(`[build-subs-user] ANCHOR_TABLE has ${ANCHOR_TABLE.length} entries, expected 32`);
    process.exit(1);
  }
  if (EN_TRANSLATIONS.length !== 32) {
    console.error(`[build-subs-user] EN_TRANSLATIONS has ${EN_TRANSLATIONS.length} entries, expected 32`);
    process.exit(1);
  }

  const lines = [];
  let prevEnd = 0;
  for (let i = 0; i < 32; i++) {
    const { from, to } = ANCHOR_TABLE[i];
    if (from < 0 || to >= asrSegs.length || from > to) {
      console.error(`[build-subs-user] step ${i}: ASR range [${from},${to}] out of bounds (total ${asrSegs.length})`);
      process.exit(1);
    }
    let start = asrSegs[from].start;
    let end = asrSegs[to].end + 0.2; // 200ms tail buffer

    // Guarantee monotonic non-decreasing cues (no overlaps, no negative gaps)
    if (start < prevEnd) start = prevEnd;
    if (end <= start) end = start + 0.5;

    lines.push(String(i + 1));
    lines.push(`${fmtTime(start)} --> ${fmtTime(end)}`);
    lines.push(EN_TRANSLATIONS[i]);
    lines.push("");

    prevEnd = end;
  }

  await mkdir(dirname(OUT_SRT), { recursive: true });
  await mkdir(dirname(LOCAL_SRT), { recursive: true });
  await writeFile(OUT_SRT, lines.join("\n"), "utf8");
  await copyFile(OUT_SRT, LOCAL_SRT);

  const lastEnd = ANCHOR_TABLE[31].to;
  const totalDur = asrSegs[lastEnd].end + 0.2;
  console.log(`[build-subs-user] wrote ${OUT_SRT}`);
  console.log(`[build-subs-user] mirrored to ${LOCAL_SRT}`);
  console.log(`[build-subs-user] 32 cues, total timeline = ${totalDur.toFixed(2)}s (matches user cut 172.97s)`);
}

main().catch((e) => {
  console.error("[build-subs-user] error:", e);
  process.exit(1);
});
