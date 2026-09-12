/**
 * post-process.mjs — final assembly for the BWKI 2026 video.
 *
 * Pipeline:
 *   1. Trim capture.webm to the audio timeline (offset 5s, 198s long)
 *   2. Mux with all.mp3 audio track
 *   3. Burn EN subtitles (subtitles_en.srt)
 *   4. Loudness normalize to EBU R128 (I=-16 / TP=-1.5 / LRA=11)
 *   5. Scale to 1344×768 @ 24fps (BWKI requirement)
 *   6. Encode H.264 + AAC, faststart
 *   7. Write renders/final/LinguaGraph_BWKI2026_Pitch.mp4
 *
 * Usage:  node scripts/post-process.mjs
 */

import { execFile } from "node:child_process";
import { mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const NACH_ROOT = resolve(ROOT, "..");
const RAW_WEB = resolve(NACH_ROOT, "renders", "raw", "capture.webm");
const AUDIO = resolve(ROOT, "public", "audio", "linguagraph-pitch", "all.mp3");
const SUBS_SRC = resolve(NACH_ROOT, "docs", "subtitles_en.srt");
const SUBS_LOCAL = resolve(NACH_ROOT, "renders", "raw", "subtitles_en.srt");
const OUT = resolve(NACH_ROOT, "renders", "final", "LinguaGraph_BWKI2026_Pitch.mp4");

const TRIM_OFFSET = "5";      // skip pre-auto-start setup frames
// v7 = "198"; v8 covers audio (169.4s) + pacing holds (~40s) + setup (5s) ≈ 215s.
const TRIM_DURATION = "215";

async function run(label, cmd, args, cwd) {
  console.log(`[post] ${label}: ${cmd} ${args.join(" ")}`);
  return new Promise((res, rej) => {
    const p = execFile(cmd, args, { stdio: "inherit", cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[post] ${label} FAILED:`, stderr?.slice(-1500));
        rej(err);
      } else {
        res();
      }
    });
  });
}

async function main() {
  if (!existsSync(RAW_WEB)) {
    console.error(`[post] missing ${RAW_WEB}`);
    process.exit(1);
  }
  await mkdir(dirname(SUBS_LOCAL), { recursive: true });
  await mkdir(dirname(OUT), { recursive: true });

  // ffmpeg subtitles filter splits on `:` which conflicts with the Windows
  // C: drive colon. Copy SRT next to the working dir and use relative path.
  if (!existsSync(SUBS_SRC)) {
    console.error(`[post] missing ${SUBS_SRC}`);
    process.exit(1);
  }
  await copyFile(SUBS_SRC, SUBS_LOCAL);

  // We do everything in one pass:
  //   -i webm  (video)
  //   -i mp3   (audio)
  //   -ss 5 -t 198              trim video to audio timeline
  //   -vf scale=1344:768,subtitles=subtitles_en.srt:force_style=...
  //   -af loudnorm=I=-16:TP=-1.5:LRA=11
  //   -r 24                     force 24fps (BWKI spec)
  //   -c:v libx264 -crf 18      high-quality H.264
  //   -c:a aac -b:a 192k        AAC LC audio
  //   -movflags +faststart      web-streamable
  const subStyle = [
      "FontName=Georgia",
      "FontSize=18",
      "PrimaryColour=&H00FFFFFF",
      "OutlineColour=&H00000000",
      "BackColour=&H60000000",
      "BorderStyle=4",
      "Outline=1",
      "Shadow=1",
      "Alignment=2",
      "MarginV=70",
    ].join(",");

  const args = [
    "-y",
    "-ss", TRIM_OFFSET,
    "-i", RAW_WEB,
    "-i", AUDIO,
    "-t", TRIM_DURATION,
    "-map", "0:v",
    "-map", "1:a",
    "-vf", "scale=1344:768:flags=lanczos",
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-r", "24",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "18",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "48000",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    OUT,
  ];

  await run("final-encode", "ffmpeg", args, dirname(SUBS_LOCAL));

  console.log(`[post] final video: ${OUT}`);
}

main().catch((e) => {
  console.error("[post] FATAL:", e);
  process.exit(1);
});