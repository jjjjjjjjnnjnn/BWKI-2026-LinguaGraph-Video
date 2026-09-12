import type { ChapterDef } from "./types";
import LinguagraphPitch from "../chapters/01-linguagraph-pitch/LinguagraphPitch";
import { narrations as linguagraphNarrations } from "../chapters/01-linguagraph-pitch/narrations";

/**
 * Single chapter — the entire LinguaGraph BWKI 2026 pitch.
 *
 * Length (32) === number of `if (step === N)` branches in
 * LinguagraphPitch.tsx. narrations array is the single source of truth
 * for step count + per-step spoken text + audio synthesis.
 *
 * Visual styling comes entirely from the active theme (indigo-porcelain)
 * via CSS tokens — chapter code is theme-agnostic.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "linguagraph-pitch",
    title: "LinguaGraph · BWKI 2026 · Pitch",
    narrations: linguagraphNarrations,
    Component: LinguagraphPitch,
  },
];