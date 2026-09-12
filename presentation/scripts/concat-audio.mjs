/**
 * concat-audio.mjs — stitch the 32 per-step mp3s into one continuous track.
 *
 * Uses ffmpeg's concat demuxer (lossless re-stitch — no re-encode).
 * Output: <chapter>/all.mp3 alongside the segment files.
 *
 * Usage:  node scripts/concat-audio.mjs
 */

import { execFile } from "node:child_process";
import { writeFile, readdir } from "node:fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const AUDIO_DIR = resolve(ROOT, "public", "audio", "linguagraph-pitch");

async function main() {
  const files = (await readdir(AUDIO_DIR))
    .filter((f) => /^\d+\.mp3$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  if (files.length === 0) {
    console.error("no <N>.mp3 files found in", AUDIO_DIR);
    process.exit(1);
  }

  console.log(`[concat-audio] found ${files.length} segments`);

  const concatList = resolve(AUDIO_DIR, "_concat.txt");
  await writeFile(
    concatList,
    files.map((f) => `file '${resolve(AUDIO_DIR, f).replace(/\\/g, "/")}'`).join("\n") + "\n",
    "utf8",
  );

  const out = resolve(AUDIO_DIR, "all.mp3");

  await new Promise((res, rej) => {
    const proc = execFile(
      "ffmpeg",
      [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concatList,
        "-c",
        "copy",
        out,
      ],
      { stdio: "inherit" },
      (err) => (err ? rej(err) : res()),
    );
  });

  console.log(`[concat-audio] wrote ${out}`);
}

main().catch((e) => {
  console.error("[concat-audio] error:", e);
  process.exit(1);
});