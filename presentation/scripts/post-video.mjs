/**
 * post-video.mjs — capture.webm + all.mp3 → final MP4.
 *
 * v5 changes (vs v4.5):
 *   - SETUP_OFFSET_S 6 → 5 (实测 setup ~3.77s + 1.23s buffer)
 *   - 配合 record-video.mjs 的绝对时序 T0 anchor,首帧 cover 完整保留
 *
 * 流水线:
 *   1. probe capture.webm 时长,trim 到 audio 总长 201.432s
 *   2. mux all.mp3
 *   3. loudnorm I=-16/TP=-1.5/LRA=11
 *   4. scale 1344×768 @ 24fps (lanczos)
 *   5. H.264 crf 18 + AAC 192k @ 48kHz + faststart
 *   6. 写入 renders/final/LinguaGraph_BWKI2026_Pitch.mp4
 */

import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    resolution: { type: "string", default: "1920x1080" },
    out: { type: "string", default: "" },  // empty → auto-pick
  },
});

const RESOLUTION = (() => {
  const m = String(args.resolution).match(/^(\d+)x(\d+)$/);
  if (!m) throw new Error(`--resolution must be like 1920x1080 or 3840x2160, got: ${args.resolution}`);
  return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
})();

const FPS = 24;
// Use absolute paths via __dirname to bypass Windows resolve() bug
// that mishandles `..` on paths with Chinese characters.
const __filename_pv = fileURLToPath(import.meta.url);
const __dirname_pv = dirname(__filename_pv);
const ROOT = dirname(__dirname_pv);
const NACH_ROOT = dirname(ROOT);
const RAW_DIR = resolve(NACH_ROOT, "renders", "raw");
const AUDIO = resolve(ROOT, "public", "audio", "linguagraph-pitch", "all.mp3");
const OUT = args.out
  ? resolve(NACH_ROOT, "renders", "final", args.out)
  : (RESOLUTION.w >= 3840
      ? resolve(NACH_ROOT, "renders", "final", "LinguaGraph_BWKI2026_Pitch_4K.mp4")
      : resolve(NACH_ROOT, "renders", "final", "LinguaGraph_BWKI2026_Pitch.mp4"));

const TARGET_DURATION = 201.432; // matches all.mp3 exactly

/**
 * Resolve the actual webm path to encode. Playwright's recordVideo
 * writes to a randomly-named `page@<hash>.webm` inside the dir; the
 * capture script tries to rename it to capture.webm but on Windows
 * that rename can race with Playwright's internal cleanup. We accept
 * either capture.webm or any page@*.webm (newest by mtime).
 */
async function resolveWebm() {
  const { readdir, stat } = await import("node:fs/promises");
  const all = (await readdir(RAW_DIR))
    .filter((f) => f.endsWith(".webm"))
    .map((f) => ({ name: f, path: resolve(RAW_DIR, f) }));
  if (all.length === 0) throw new Error(`no .webm in ${RAW_DIR}`);
  for (const c of all) c.mtime = (await stat(c.path)).mtimeMs;
  all.sort((a, b) => b.mtime - a.mtime);
  // Prefer capture.webm if present and fresh
  const cap = all.find((c) => c.name === "capture.webm");
  if (cap) return cap.path;
  return all[0].path;
}

function probeDuration(file) {
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

function run(label, cmd, args) {
  console.log(`[post] ${label}`);
  return new Promise((res, rej) => {
    execFile(cmd, args, { stdio: "inherit" }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[post] ${label} FAILED:`, stderr?.slice(-1500));
        rej(err);
      } else res();
    });
  });
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true });

  // 1. probe webm duration (auto-pick newest capture.webm or page@*.webm)
  const webmPath = await resolveWebm();
  const webDur = await probeDuration(webmPath);
  console.log(`[post] using webm: ${webmPath} (${webDur.toFixed(2)}s)`);

  // If webm is longer than audio, trim to audio duration.
  // If shorter, use as-is (the audio will be the master via -shortest).
  const trimDur = Math.min(webDur, TARGET_DURATION + 2);

  // 2. final encode: trim setup offset + mux audio + loudnorm + scale + encode
  //    The webm starts with ~3.77s of page setup (blank stage) before the
  //    cover renders. -ss 5 (INPUT seek on the webm) skips that with a
  //    1.23s buffer so cover (step 0) lands at output t=0, in sync with
  //    audio start. v5 (was -ss 6 in v4.5, which over-trimmed by 2.23s
  //    and lost the late MaskReveal team lines).
  //
  // -ss before -i = INPUT seek (fast, seek before decode).
  const SETUP_OFFSET_S = 5;
  const crf = RESOLUTION.w >= 3840 ? "20" : "18";  // slightly higher CRF for 4K to keep size sane
  const audioBitrate = RESOLUTION.w >= 3840 ? "256k" : "192k";
  console.log(`[post] encoding to ${RESOLUTION.w}×${RESOLUTION.h} @ ${FPS}fps, CRF=${crf}, audio=${audioBitrate}`);
  await run(
    "final-encode (trim + mux + loudnorm + scale + encode)",
    "ffmpeg",
    [
      "-y",
      "-ss", SETUP_OFFSET_S.toString(),
      "-i", webmPath,
      "-i", AUDIO,
      "-t", trimDur.toFixed(3),
      "-map", "0:v",
      "-map", "1:a",
      "-vf", `scale=${RESOLUTION.w}:${RESOLUTION.h}:flags=lanczos,fps=${FPS}`,
      "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", crf,
      "-c:a", "aac",
      "-b:a", audioBitrate,
      "-ar", "48000",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-shortest",
      OUT,
    ],
  );

  // 3. probe final
  const finalDur = await probeDuration(OUT);
  console.log(`[post] final video: ${OUT}`);
  console.log(`[post] final duration: ${finalDur.toFixed(2)}s`);

  // 4. clean up — move the source page@*.webm to capture.webm so the
  //    next record-video run starts clean.
  if (webmPath !== resolve(RAW_DIR, "capture.webm")) {
    const { rename, unlink } = await import("node:fs/promises");
    try { await unlink(resolve(RAW_DIR, "capture.webm")); } catch {}
    await rename(webmPath, resolve(RAW_DIR, "capture.webm"));
  }

  if (Math.abs(finalDur - TARGET_DURATION) > 2) {
    console.warn(
      `[post] WARNING: final duration ${finalDur.toFixed(2)}s is >2s off target ${TARGET_DURATION}s`,
    );
  }
}

main().catch((e) => {
  console.error("[post] FATAL:", e);
  process.exit(1);
});