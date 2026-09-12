// ★ SSOT für alle Dauern. Einzige Stelle, an der Sekunden geändert werden.
// Nach TTS-Abhören: SECONDS je Akt anpassen, FRAMES berechnen sich von selbst (30 fps).
export const FPS = 30;

export type Act = {
  id: string;
  seconds: number;
  audio: string; // Datei in public/audio/
};

// Gemessen 2026-09-10 (edge-tts ConradNeural) + ~1,5s Luft pro Akt.
// Audio: S01 27,5 · S02 30,7 · S03 44,6 · S04 37,4 · S05 23,8 · S06 30,6 → Film 3:23.
export const ACTS: Act[] = [
  { id: "S01", seconds: 29, audio: "s01.mp3" },
  { id: "S02", seconds: 32, audio: "s02.mp3" },
  { id: "S03", seconds: 46, audio: "s03.mp3" },
  { id: "S04", seconds: 39, audio: "s04.mp3" },
  { id: "S05", seconds: 25, audio: "s05.mp3" },
  { id: "S06", seconds: 32, audio: "s06.mp3" },
];

export const actFrames = (seconds: number) => Math.round(seconds * FPS);

export const TOTAL_FRAMES = ACTS.reduce((s, a) => s + actFrames(a.seconds), 0);
