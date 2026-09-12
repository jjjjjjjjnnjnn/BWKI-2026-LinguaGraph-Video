/**
 * record-video.mjs — Playwright 整片录 webm,32 step 动画过程保留.
 *
 * v5 架构 (vs v4.5 的相对时序):
 *   - 单一时间锚点 T0 (cover 已完全渲染 + 所有 MaskReveal 完成时)
 *   - 累计时长表 cumulativeMs[i] = Σ(audio[0..i-1])
 *   - 每步点击时刻 = T0 + cumulativeMs[i+1] - CROSSFADE_MS
 *     → crossfade 200ms 后,新 step 完全可见 = 音频边界 ✓
 *   - setTimeout 漂移被 targetClickTime - Date.now() 实时补偿
 *   - 累计漂移 < 100ms (单步 max 50ms)
 *
 * 流水线:
 *   1. 启动 dev server (background,localhost:5174)
 *   2. Playwright launch + newContext + recordVideo (1920x1080 @ 25fps)
 *   3. navigate ?manual=1 → 屏蔽 AutoStartGate / 进度条 / 自动切换 chrome
 *   4. clear localStorage + reload + wait stage ready
 *   5. inject CSS: 隐藏 progress-bar / auto-toggle / click-cue
 *      (SideRail .sr 故意保留,记录时常显)
 *   6. SETTLE_MS 等待 cover 动画完成 → T0 = Date.now()
 *   7. 对每 step 0..31:
 *      - 目标点击时刻 = T0 + cumulativeMs[i+1] - CROSSFADE_MS
 *      - 至少 SETTLE_MS(覆盖 MaskReveal 最长 2.65s)
 *      - 实时补偿漂移
 *      - click stage 触发 crossfade + sleep 150ms
 *   8. close context → 写入 capture.webm (含所有动画)
 *
 * 关键点:
 *   - audio 不驱动 advance (headless audio.ended 不可靠)
 *   - audio all.mp3 = bit-perfect concat of 1.mp3..32.mp3(无间隙)
 *   - crossfade 200ms (与 CSS .scene-anim 同步)
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    port: { type: "string", default: "5174" },
    out: { type: "string", default: "../../renders/raw/capture.webm" },
    "settle-ms": { type: "string", default: "3000" },
    "crossfade-ms": { type: "string", default: "200" },
    // 4K mode: viewport 3840x2160 logical, deviceScaleFactor 1.
    // The content is rendered at 2x resolution natively (no upscaling).
    // Stage stays 1920x1080 base, so useStageScale gives 1.0 at this
    // viewport — content fills the frame edge-to-edge.
    resolution: { type: "string", default: "1920x1080" },
  },
});

const RESOLUTION = (() => {
  const m = String(args.resolution).match(/^(\d+)x(\d+)$/);
  if (!m) throw new Error(`--resolution must be like 1920x1080 or 3840x2160, got: ${args.resolution}`);
  return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
})();

const PORT = args.resolution === "3840x2160" ? args.port : args.port;
// OUT is an absolute path. The Windows path resolver can mishandle
// `..` on paths with Chinese characters (it skips a level), so we go
// through __dirname (the script's own directory) which is reliable.
const __filename_rr = fileURLToPath(import.meta.url);
const __dirname_rr = dirname(__filename_rr);
const NACH_ROOT_RR = dirname(dirname(__dirname_rr));
const absOut = resolve(NACH_ROOT_RR, "renders", "raw", "capture.webm");
const OUT = absOut;
const SETTLE_MS = parseInt(args["settle-ms"], 10);
const CROSSFADE_MS = parseInt(args["crossfade-ms"], 10);

const URL = `http://127.0.0.1:${PORT}/?manual=1`;
const AUDIO_DIR = resolve(NACH_ROOT_RR, "presentation", "public", "audio", "linguagraph-pitch");

/**
 * v7: per-step visual animation end time (ms) — when the last MaskReveal
 * of a given step fully completes. Used as a lower bound on waitMs so
 * short-audio steps (e.g. step 24 audio=1.34s but reveal ends at 1.8s)
 * don't get visually truncated by an over-eager click advance.
 *
 * Index is **1-based** to match the audio file naming convention.
 * 0 = no override (audio is always the long pole on step 0).
 *
 * Source: hand-mapped from `LinguagraphPitch.tsx` `delay + duration`
 * of the last `MaskReveal` per step. Update this table if you add
 * new long-reveal steps.
 */
const VISUAL_END_BY_STEP = {
  // M2 Problem — short intros to keep the hook punchy
  6: 1500,   // step 6 "Aber sie sind überwiegend..." bar reveal ends ~1500ms
  // M5 Reflexion — short taglines
  23: 1700,  // step 23 "Ehrlich dazu" reveals end ~1500ms
  24: 1800,  // step 24 "N=15" badge reveal ends at delay 1100+duration 700 = 1800ms
  25: 1700,  // step 25 "8 EN-Paare" reveal ends ~1700ms
  26: 1700,  // step 26 "Schwelle 0,10" reveal ends ~1700ms
};

/**
 * v8: per-step pacing hold (ms) — the listener-digestion pause that
 * sits AFTER the audio ends. v7 only protected the visual from being
 * truncated; v8 ADDS a deliberate hold on top so audiences have time
 * to absorb key statements, section transitions, and the closing
 * tagline. Without this the video rushes through the narration.
 *
 * Four levels (1-based step index, matches mp3 filename):
 *   MICRO     (400-500ms) — natural sentence-end beat
 *   BREATHING (1500-2200ms) — key concept landing
 *   SECTION   (1800-2500ms) — chapter transitions
 *   CLIMAX    (2500-3000ms) — headline numbers + closing tagline
 *
 * Total: ~40s added on top of v7's 169.4s audio → ~209s final.
 * Within BWKI 2-4 min window.
 */
const PAUSE_MAP = {
  // Cover
  0:  1800,  // → 1.8s SECTION: title sink-in
  // M1 Hook (1-4)
  1:   400,  // MICRO
  2:   400,  // MICRO
  3:  1500,  // BREATHING: "andere kognitive Landkarte"
  4:  2200,  // SECTION: M1 → M2 transition
  // M2 Problem (5-10)
  5:   400,
  6:  1500,  // BREATHING: "überwiegend englisch trainiert"
  7:   500,
  8:   500,
  9:   500,
  10: 2500,  // CLIMAX: "blinder Fleck"
  // M3 Methode (11-17)
  11:  500,
  12: 1500,  // BREATHING: "Kernidee: frag die KI selbst"
  13:  500,
  14: 2000,  // BREATHING: "Sprache die einzige Variable"
  15:  400,
  16: 1500,  // BREATHING: LDS metric
  17: 2200,  // SECTION: M3 → M4 transition
  // M4 Befund (18-22)
  18:  400,
  19: 2500,  // CLIMAX: "55 Messungen · p<0.05"
  20: 2000,  // BREATHING: "kulturell gemustert"
  21:  500,
  22: 2200,  // SECTION: M4 → M5 transition
  // M5 Reflexion (23-26)
  23: 1500,  // BREATHING: "Ehrlich dazu"
  24: 2200,  // BREATHING: "Design-Artefakt"
  25:  500,
  26: 2000,  // BREATHING: end of reflexion
  // M6 Anwendung + Schluss (27-31)
  27: 2500,  // CLIMAX: "neue Art von KI-Prüfung"
  28:  500,
  29:  500,
  30:  500,
  31: 3000,  // CLIMAX: "LinguaGraph. Sichtbar. Danke."
};

/**
 * v8: when true, inject `.is-holding` on `.stage-frame` during the
 * pacing hold so the SideRail current-step can pulse subtly. Keeps the
 * frame visually alive without breaking the breathing rhythm.
 */
const VISUAL_HOLD_EFFECT = true;

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

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true });

  // Probe each mp3 duration up front
  const durations = [];
  for (let step = 0; step < 32; step++) {
    const mp3 = resolve(AUDIO_DIR, `${step + 1}.mp3`);
    const d = await probeDuration(mp3);
    durations.push(d);
  }
  const totalAudio = durations.reduce((a, b) => a + b, 0);
  console.log(
    `[record-video] total audio = ${totalAudio.toFixed(2)}s across 32 segments`,
  );

  // Cumulative ms table:
  //   cumulativeMs[i] = Σ(audio[0..i-1] + pause[i-1])    for i in 0..32
  // v7 had cumulativeMs based on audio only, but v8's pacing holds
  // are part of the timeline — clicks on later steps happen later
  // because earlier steps held. If we don't add pauses here, each
  // pause just gets consumed by per-step drift and the cumulative
  // end stays at audio duration (~167s instead of ~209s).
  //
  // We add pauseMs at the END of each step (after the audio finishes),
  // except for the LAST step (i=31) whose pause pads the recording
  // tail and is handled separately by finalWait below.
  const cumulativeMs = [0];
  for (let i = 0; i < 32; i++) {
    const prevPause = i === 0 ? 0 : (PAUSE_MAP[i] ?? 0); // pause for step i-1
    cumulativeMs.push(
      cumulativeMs[i] + durations[i] * 1000 + prevPause,
    );
  }
  const totalPause = Object.values(PAUSE_MAP).reduce((a, b) => a + b, 0)
    - (PAUSE_MAP[31] ?? 0); // exclude the last step's tail pause
  console.log(
    `[record-video] cumulative end = ${cumulativeMs[32].toFixed(0)}ms ` +
      `(audio ${totalAudio.toFixed(2)}s + in-step pause ${(totalPause/1000).toFixed(2)}s)`,
  );

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-features=IsolateOrigins"],
  });

  // recordVideo.dir must be an ABSOLUTE path — Playwright's recordVideo
  // ignores relative dir values that contain "..". The auto-generated
  // page@*.webm file is moved to OUT on context.close().
  const absOut = resolve(OUT);
  const absDir = dirname(absOut);
  console.log(`[record-video] recordVideo dir: ${absDir}`);

  console.log(`[record-video] resolution: ${RESOLUTION.w}×${RESOLUTION.h}`);
  const context = await browser.newContext({
    viewport: { width: RESOLUTION.w, height: RESOLUTION.h },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: absDir,
      size: { width: RESOLUTION.w, height: RESOLUTION.h },
    },
  });

  const page = await context.newPage();

  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.error("console.error:", m.text());
  });

  console.log(`[record-video] navigate -> ${URL}`);
  await page.goto(URL, { waitUntil: "load", timeout: 30000 });

  // CRITICAL: clear localStorage before recording so the stepper
  // starts at step 0 every run. (useStepper persists cursor to
  // localStorage, so a previous record run can leak its final cursor
  // and cause this run to start mid-video.)
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload({ waitUntil: "load", timeout: 30000 });

  // Wait for first scene to mount.
  await page.waitForSelector(".stage-frame", { timeout: 15000 });
  console.log("[record-video] stage ready");

  // Inject CSS to hide chrome (progress bar / auto-toggle / click-cue).
  // NOTE: .sr (SideRail) is intentionally NOT hidden — the v5 brief
  // asks for it to be visible during recording so the final video
  // ships with a flow indicator on screen.
  await page.addStyleTag({
    content: `
      .pb-hover { display: none !important; }
      .at-hover { display: none !important; }
      .click-cue { display: none !important; }

      /* v8: pacing-hold pulse on SideRail active section.
         Applied while record-video holds on a step. Subtle so it
         doesn't compete with the main MaskReveal choreography. The
         SideRail renders via Portal to <body>, so we can't nest
         this under .stage-frame — it lives at the body root. */
      body.is-holding .sr-active .sr-section-label,
      body.is-holding .sr-active .sr-marker {
        animation: sr-pulse 1.6s ease-in-out infinite;
      }
      @keyframes sr-pulse {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.45; }
      }
    `,
  });

  // Wait for cover (step 0) animations to complete. MaskReveal max delay
  // is 2050ms + 600ms duration = 2650ms < SETTLE_MS=3000ms.
  await sleep(SETTLE_MS);

  // ★ v5 时间锚点 — cover 完全可见,音频可起播
  const T0 = Date.now();
  console.log(
    `[record-video] T0 anchored at ${new Date(T0).toISOString()} (setup done)`,
  );

  // Walk through all 32 steps. Initial state = step 0 (cover).
  for (let step = 0; step < 32; step++) {
    // ★ 目标点击时刻:让新 step 的 crossfade 恰好在音频边界结束
    // cumulativeMs[step+1] = 当前 step 音频结束的全局时刻
    // CROSSFADE_MS = scene-anim 动画时长
    const targetClickTime = T0 + cumulativeMs[step + 1] - CROSSFADE_MS;

    // 实时补偿:当前时刻到目标时刻的差值。
    // 至少要等 SETTLE_MS(覆盖 in-step MaskReveal 最长 2.75s),
    // 但不能超过本 step 的音频边界 + crossfade — 否则当 audio[i]
    // 短于 SETTLE_MS(如 step 11 audio=2.256s,step 24 audio=1.800s)
    // 时会把点击推得太远,产生 ~1s 漂移和 A/V 错位。
    const audioMs = durations[step] * 1000;

    // v7: visualEndMs — 视觉动画总时长。短音频 + 长视觉的 step
    // (e.g. step 24 audio=1.34s 但末 reveal 在 1100+700=1.8s) 会被
    // 切掉 → 加 visualEndMs 到 minWait 下限。这是 1-based 索引,与
    // visual-waits.json 保持一致。
    //
    // minWait 公式:
    //   1. 必须 wait 到 (audio + crossfade) — 否则切到下幕时上幕
    //      音频未完
    //   2. 或 wait 到 (visualEndMs + 100ms 缓冲) — 否则视觉动画
    //      被截断
    //   3. 取两者较大,但用 SETTLE_MS cap —— 长音频步不需等 3s
    //      (因为 SETTLE_MS 主要为了等 MaskReveal 完成,长音频步
    //      自然等到)
    //
    // v8: + pauseMs 加在 max(...) 之后 — 这才是用户要的"气口"。
    // 即使视觉和音频都已结束,pauseMs 强制 hold 让听众消化。pauseMs
    // 在 PAUSE_MAP 里按节拍级别配 (MICRO/BREATHING/SECTION/CLIMAX)。
    const visualEndMs = (VISUAL_END_BY_STEP[step + 1] ?? 0) + 100;
    const pauseMs = PAUSE_MAP[step + 1] ?? 0;
    const minWait = Math.min(
      SETTLE_MS,
      Math.max(audioMs + CROSSFADE_MS, visualEndMs) + pauseMs,
    );
    const waitMs = Math.max(minWait, targetClickTime - Date.now());
    if (waitMs > 0) {
      // Layer 2: during pacing hold, mark the body so SideRail's
      // active section can pulse subtly. SideRail renders via Portal
      // to <body>, so toggling on .stage-frame wouldn't reach it.
      // We toggle the class off after exactly pauseMs so the pulse
      // stops the instant record-video's wait ends.
      if (VISUAL_HOLD_EFFECT && pauseMs > 0) {
        await page.evaluate((holdMs) => {
          document.body.classList.add("is-holding");
          setTimeout(
            () => document.body.classList.remove("is-holding"),
            holdMs,
          );
        }, pauseMs);
      }
      await sleep(waitMs);
    }

    const actualClickTime = Date.now();
    const drift = actualClickTime - targetClickTime;
    console.log(
      `[record-video] step ${String(step + 1).padStart(2, "0")}/32 ` +
        `(audio=${(durations[step] * 1000).toFixed(0)}ms, ` +
        `click@+${(actualClickTime - T0).toFixed(0)}ms, drift=${drift}ms)`,
    );

    if (step < 31) {
      // Advance by clicking the stage-frame element directly. Using the
      // element handle guarantees React's onClick fires (mouseclick at
      // coords can land on child divs that don't propagate, especially
      // on the Forscher card mockup).
      await page
        .locator(".stage-frame")
        .click({ position: { x: 100, y: 100 } });
      // Tiny beat for the React state transition to register.
      await sleep(150);
    } else {
      // Last step (Danke, step 31) — no click needed. Hold for the
      // remaining audio (duration[31]) + the step's own tail pause
      // (3s CLIMAX, sits AFTER "Danke.") + 500ms margin so the
      // post-trim final mp4 reaches exactly cumulativeMs[32] rather
      // than clipping short.
      const tailPause = PAUSE_MAP[31] ?? 0;
      const finalWait = durations[31] * 1000 + tailPause + 500;
      await sleep(finalWait);
    }
  }

  console.log("[record-video] closing browser, finalising video…");
  await context.close();
  await browser.close();

  // Playwright recordVideo writes to a randomly-named `page@<hash>.webm`
  // inside `dir` — there is no API to specify a final filename. We find
  // the most recently created page@*.webm file and rename it to OUT.
  const { readdir } = await import("node:fs/promises");
  const files = await readdir(absDir);
  const candidates = files
    .filter((f) => f.startsWith("page@") && f.endsWith(".webm"))
    .map((f) => ({ name: f, path: resolve(absDir, f) }));
  if (candidates.length === 0) {
    throw new Error(
      `[record-video] no page@*.webm found in ${absDir} after recording`,
    );
  }
  // Sort by modification time (newest first) to handle stale page@ files
  const { stat } = await import("node:fs/promises");
  for (const c of candidates) {
    const s = await stat(c.path);
    c.mtime = s.mtimeMs;
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  const latest = candidates[0];

  // Remove any existing capture.webm so rename doesn't collide on Windows
  const { unlink, rename } = await import("node:fs/promises");
  try {
    await unlink(absOut);
  } catch {
    /* not present, fine */
  }
  await rename(latest.path, absOut);
  // Clean up any other stale page@*.webm
  for (const c of candidates.slice(1)) {
    try { await unlink(c.path); } catch { /* ignore */ }
  }

  console.log(`[record-video] done. video written to: ${absOut}`);
}

main().catch((err) => {
  console.error("[record-video] FATAL:", err);
  process.exit(1);
});