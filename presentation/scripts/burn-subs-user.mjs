/**
 * burn-subs-user.mjs — burn EN or ZH subtitles onto the user-cut
 * 4K video (C:/Users/rongj/Desktop/202609112316.mp4) WITHOUT
 * re-encoding audio or changing the resolution / framerate.
 *
 * Why this script (vs post-process.mjs):
 *   - post-process.mjs is the v7/v8 pipeline: scales 1920x1080 → 1344x768
 *     (or 3840x2160 for the 4K variant), re-encodes AAC audio at 48kHz
 *     mono, applies loudnorm EBU R128, forces 24fps. That's a lot of
 *     re-encoding for a user who just wants subtitles baked in.
 *   - User explicitly wants: keep 4K + 60fps + stereo, just add subtitles.
 *   - This script: -c:v libx264 for video (CRF 20), -c:a copy for audio
 *     (bit-perfect stereo passthrough), no scaling, no framerate change.
 *
 * Subtitle styling (BottomCenter, no overlap with main content):
 *   - FontSize=28 (4K-friendly, ~0.7% of vertical 2160)
 *   - Alignment=2 (bottom-center)
 *   - MarginV=120 (~5.5% from bottom; safely below SideRail which sits
 *     on the right side of the frame)
 *   - FontName=Microsoft YaHei (CJK-friendly; falls back gracefully for EN)
 *   - Outline + shadow for legibility against any background colour
 *
 * Usage:
 *   node presentation/scripts/burn-subs-user.mjs en
 *   node presentation/scripts/burn-subs-user.mjs zh
 *
 * Output:
 *   renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_<lang>.mp4
 */

import { execFile } from "node:child_process";
import { mkdir, stat, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const NACH_ROOT = resolve(ROOT, "..");
const USER_CUT = "C:/Users/rongj/Desktop/202609112316.mp4";
const SRT_DIR = resolve(NACH_ROOT, "renders", "raw");
const OUT_DIR = resolve(NACH_ROOT, "renders", "final");

const LANGS = {
  en: {
    label: "English",
    srt: resolve(NACH_ROOT, "docs", "subtitles_en_user.srt"),
    out: resolve(OUT_DIR, "LinguaGraph_BWKI2026_Pitch_4K_user_subs_en.mp4"),
    font: "Arial", // EN uses Latin sans-serif
  },
  zh: {
    label: "Chinese",
    srt: resolve(NACH_ROOT, "docs", "subtitles_zh_user.srt"),
    out: resolve(OUT_DIR, "LinguaGraph_BWKI2026_Pitch_4K_user_subs_zh.mp4"),
    font: "Microsoft YaHei", // ZH needs CJK font
  },
};

async function run(label, cmd, args, cwd) {
  console.log(`[burn-subs] ${label}: ${cmd} ${args.join(" ")}`);
  return new Promise((res, rej) => {
    const p = execFile(cmd, args, { stdio: "inherit", cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[burn-subs] ${label} FAILED:`, stderr?.slice(-2000));
        rej(err);
      } else {
        res();
      }
    });
  });
}

async function main() {
  const lang = process.argv[2] || "en";
  const cfg = LANGS[lang];
  if (!cfg) {
    console.error(`[burn-subs] unknown lang "${lang}", use "en" or "zh"`);
    process.exit(1);
  }

  if (!existsSync(USER_CUT)) {
    console.error(`[burn-subs] missing user cut: ${USER_CUT}`);
    process.exit(1);
  }
  if (!existsSync(cfg.srt)) {
    console.error(`[burn-subs] missing SRT for ${cfg.label}: ${cfg.srt}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(SRT_DIR, { recursive: true });

  // ffmpeg subtitles filter splits on `:` which conflicts with the Windows
  // C: drive colon. Copy SRT next to the working dir (already done by
  // build-subs-user.mjs / translate-subs.mjs, but be defensive).
  const localSrt = resolve(SRT_DIR, `subtitles_${lang}_user.srt`);
  if (!existsSync(localSrt)) {
    await copyFile(cfg.srt, localSrt);
  }
  const localSrtBasename = `subtitles_${lang}_user.srt`;

  // Subtitle styling — BottomCenter, near bottom edge.
  // ffmpeg/libass quirk: MarginV with Alignment=2 (BottomCenter) is
  // measured from the BOTTOM EDGE UP to the subtitle box's TOP, not the
  // distance we wanted. So we leave MarginV=0 (default) and rely on
  // Alignment=2 to bottom-anchor the box; the box then hugs the bottom
  // edge naturally. To keep it ~5% off the very bottom we add a small
  // MarginV=20.
  const forceStyle = [
    `FontName=${cfg.font}`,
    "FontSize=22",
    "PrimaryColour=&H00FFFFFF",   // white text
    "SecondaryColour=&H000000FF", // black for karaoke (unused but required)
    "OutlineColour=&H00000000",   // black outline
    "BackColour=&H60000000",      // 60% opaque black background
    "BorderStyle=4",              // opaque box
    "Outline=1",
    "Shadow=1",
    "Alignment=2",                // BottomCenter (numpad 2)
    "MarginV=20",                 // tiny lift off the very bottom
    "MarginL=40",
    "MarginR=40",
  ].join(",");

  // Video re-encode: libx264 CRF 20 (visually lossless for subs), preset fast.
  // Audio copy: bit-perfect passthrough, preserves 44.1kHz stereo.
  // No scale / no fps: keeps 4K 3840x2160 60fps intact.
  const args = [
    "-y",
    "-i", USER_CUT,
    "-vf", `subtitles=${localSrtBasename}:force_style='${forceStyle}'`,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "20",
    "-c:a", "copy",
    "-movflags", "+faststart",
    cfg.out,
  ];

  await run(`burn-${lang}`, "ffmpeg", args, dirname(localSrt));

  // Final inspection
  const s = await stat(cfg.out);
  console.log(`[burn-subs] ${cfg.label} done: ${cfg.out}`);
  console.log(`[burn-subs] size: ${(s.size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((e) => {
  console.error("[burn-subs] FATAL:", e);
  process.exit(1);
});
