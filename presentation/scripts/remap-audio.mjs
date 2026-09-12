/**
 * remap-audio.mjs — rename mp3 files to match the new 32-step order.
 *
 * Old order: 1=DE ask, 2=ZH ask, 3=Dasselbe Wort, 4=Team, 5=Tagline, 6..32=M2-M6
 * New order: 1=Cover (NEW, to synthesize), 2=DE ask, 3=ZH ask, 4=Dasselbe Wort,
 *            5=Tagline (was 5), 6..32 unchanged from old 6..32.
 *
 * The old team narration (old 4) is dropped — its content is folded into the
 * new cover narration.
 */
import { rename, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const DIR = resolve(process.cwd(), "public/audio/linguagraph-pitch");

async function main() {
  const files = (await readdir(DIR)).filter((f) => /^\d+\.mp3$/.test(f));
  if (files.length !== 32) {
    console.error(`[remap] expected 32 mp3 files, found ${files.length}`);
    process.exit(1);
  }

  // Mapping: old → new filename (1-indexed)
  // old 1 → new 2, old 2 → new 3, old 3 → new 4, old 4 → DROP, old 5 → new 5
  // everything else stays.
  const mapping = new Map();
  for (let oldN = 1; oldN <= 32; oldN++) {
    let newN;
    if (oldN <= 3) newN = oldN + 1;       // shift up by 1
    else if (oldN === 4) continue;         // drop team card
    else newN = oldN;                      // 5..32 unchanged
    mapping.set(`${oldN}.mp3`, `${newN}.mp3`);
  }

  // Rename via a temp staging directory to avoid clobbering when old and new
  // names collide (e.g. old 5 → new 5 means same name; no rename needed for
  // that case but old 4 → drop means we need to delete).
  const STAGE = resolve(process.cwd(), ".audio-stage");
  await import("node:fs/promises").then((m) => m.mkdir(STAGE, { recursive: true }));

  // First pass: move everything to staging with new names
  for (const [oldName, newName] of mapping) {
    const oldPath = resolve(DIR, oldName);
    const stagePath = resolve(STAGE, newName);
    await rename(oldPath, stagePath);
    console.log(`[remap] ${oldName} → ${newName}`);
  }

  // Second pass: move staged files back into the canonical dir
  const staged = await readdir(STAGE);
  for (const name of staged) {
    await rename(resolve(STAGE, name), resolve(DIR, name));
  }

  // Delete the dropped team card (old 4)
  const dropped = resolve(DIR, "4.mp3");
  // Wait — old 4 was moved to stage as "5.mp3" (mapping skips 4).
  // The slot new 4.mp3 was filled by old 3 (Dasselbe Wort).
  // The number "4.mp3" in canonical dir now is what was old 3 → new 4.
  // So there's no orphaned 4.mp3 left from old 4. Just remove staging.
  await import("node:fs/promises").then((m) => m.rmdir(STAGE));

  console.log(`[remap] done. canonical dir now has new-order mp3 files; slot 1 empty for cover`);
}

main().catch((e) => {
  console.error("[remap] error:", e);
  process.exit(1);
});