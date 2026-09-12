/**
 * build-subs.mjs — generate a 32-cue English SRT aligned to the 32 mp3
 * segments, using the actual measured duration of each segment.
 *
 * Strategy:
 *   - For each <N>.mp3 under public/audio/linguagraph-pitch/, ffprobe its
 *     duration.
 *   - Walk the DE narrations array (read directly from narrations.ts via
 *     dynamic import) and pair each with a hand-written EN translation.
 *   - Compute cumulative start/end timestamps; write a fresh SRT.
 *
 * The translations are short, plain-English renderings that aim to read
 * naturally without losing any of the 6 source numbers / claims
 * (55 measurements / 50 models / N=15 / 0.10 etc.). They are paraphrased
 * to fit the ~6s-per-step cadence; their semantic content matches the
 * corresponding DE narration.
 */

import { writeFile, readdir, copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const NACH_ROOT = resolve(ROOT, "..");
const AUDIO_DIR = resolve(ROOT, "public", "audio", "linguagraph-pitch");
const NARRATIONS_FILE = resolve(ROOT, "src", "chapters", "01-linguagraph-pitch", "narrations.ts");
const OUT_SRT = resolve(NACH_ROOT, "docs", "subtitles_en.srt");

// Parallel DE → EN renderings. Each entry MUST preserve the source
// numbers / key phrases; paraphrase freely otherwise to fit ~6s/cue.
const EN_TRANSLATIONS = [
  // M1 Hook + Team
  "Let's ask a German AI model: what belongs to freedom? It answers: autonomy, rules, one's own goals.",
  "Let's ask the same model in Chinese about Zi You. It says: room, boundaries, what one is entitled to.",
  "Same word — but a different cognitive map.",
  "I'm Jiajun Rong, from Privatschule Schloss Heessen.",
  "LinguaGraph makes exactly these differences measurable.",

  // M2 Problem
  "AI systems today serve billions of people, in dozens of languages.",
  "But they're trained predominantly on English data.",
  "Does a model mean the same thing by 'justice' in a German and a Chinese loan decision?",
  "If not, users get different treatment depending on the language they speak.",
  "Standard AI evaluation only measures task completion — not whether value concepts stay consistent across languages.",
  "That is a blind spot.",

  // M3 Method
  "How do you measure something invisible — like a model's concept structure?",
  "The core idea: ask the AI itself.",
  "We turn the LLM into a controlled subject: same model, same five topics — justice, freedom, responsibility, home, success — only the language changes.",
  "Because it's the same model, language is the only variable.",
  "From each response we extract a concept graph, per language.",
  "Our new metric, the Linguistic Divergence Score, measures structural divergence — across shared concepts and relations.",
  "And we don't just output a number — we name exactly which concept components diverge.",

  // M4 Finding
  "We extended the experiment to over fifty models from various providers — including a US-American model.",
  "In all fifty-five measurements, the Chinese–German signal is statistically significant.",
  "And it's not random — it's culturally patterned. German concepts stress autonomy and rules; Chinese ones, space and aspiration.",
  "The decisive control finding: institutional knowledge — like mathematics — converges across languages. Cultural concepts clearly diverge.",
  "Even the relations between concepts organize themselves in language-specific ways.",

  // M5 Reflection
  "To be honest:.",
  "Our human experiment with fifteen people shows no language signal under between-subject conditions — a design artifact, not counter-evidence.",
  "Eight English-containing pairs are not significant — consistent with the English-centrism of today's models.",
  "And our operational threshold of zero point one zero is a heuristic rule of thumb — not a validated boundary.",

  // M6 Application + Schluss
  "LinguaGraph is a new kind of AI audit.",
  "A developer can check before deploying a multilingual model: does mine drift on value-laden terms across languages — and where exactly?",
  "For regulators, it delivers the transparency the EU AI Act requires.",
  "The output is interpretable — no black-box score, but a list of the concrete concept components that diverge.",
  "LinguaGraph. Visible. Thank you.",
];

function fmtTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

async function probeDuration(file) {
  return new Promise((res, rej) => {
    execFile(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
      (err, stdout) => {
        if (err) return rej(err);
        res(parseFloat(stdout.trim()));
      },
    );
  });
}

async function main() {
  const files = (await readdir(AUDIO_DIR))
    .filter((f) => /^\d+\.mp3$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  if (files.length !== EN_TRANSLATIONS.length) {
    console.error(
      `[build-subs] mismatch: ${files.length} mp3 files vs ${EN_TRANSLATIONS.length} translations`,
    );
    process.exit(1);
  }

  // Pull DE narrations just to assert parity
  const mod = await import(pathToFileURL(NARRATIONS_FILE).href);
  if (mod.narrations.length !== EN_TRANSLATIONS.length) {
    console.error(
      `[build-subs] narrations.ts has ${mod.narrations.length} entries, expected ${EN_TRANSLATIONS.length}`,
    );
    process.exit(1);
  }

  const durations = [];
  let cumulative = 0;
  for (const f of files) {
    const d = await probeDuration(resolve(AUDIO_DIR, f));
    durations.push({ start: cumulative, end: cumulative + d, dur: d });
    cumulative += d;
  }

  const lines = [];
  files.forEach((f, i) => {
    const { start, end } = durations[i];
    lines.push(String(i + 1));
    lines.push(`${fmtTime(start)} --> ${fmtTime(end)}`);
    lines.push(EN_TRANSLATIONS[i]);
    lines.push("");
  });

  await mkdir(dirname(OUT_SRT), { recursive: true });
  await writeFile(OUT_SRT, lines.join("\n"), "utf8");

  // Also drop a copy next to the webm so ffmpeg's relative path works.
  const localCopy = resolve(NACH_ROOT, "renders", "raw", "subtitles_en.srt");
  await mkdir(dirname(localCopy), { recursive: true });
  await copyFile(OUT_SRT, localCopy);

  console.log(`[build-subs] wrote ${OUT_SRT}`);
  console.log(`[build-subs] mirrored to ${localCopy}`);
  console.log(`[build-subs] total duration: ${durations.at(-1).end.toFixed(2)}s`);
}

main().catch((e) => {
  console.error("[build-subs] error:", e);
  process.exit(1);
});