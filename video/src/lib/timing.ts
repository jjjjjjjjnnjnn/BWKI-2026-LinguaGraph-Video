// ★ SSOT für alle Dauern. Einzige Stelle, an der Sekunden geändert werden.
// Nach TTS-Abhören: SECONDS je Akt anpassen, FRAMES berechnen sich von selbst (30 fps).
export const FPS = 30;

export type Act = {
  id: string;
  seconds: number;
  audio: string; // Datei in public/audio/
};

export const ACTS: Act[] = [
  { id: "S01", seconds: 30, audio: "s01.mp3" },
  { id: "S02", seconds: 25, audio: "s02.mp3" },
  { id: "S03", seconds: 45, audio: "s03.mp3" },
  { id: "S04", seconds: 45, audio: "s04.mp3" },
  { id: "S05", seconds: 20, audio: "s05.mp3" },
  { id: "S06", seconds: 25, audio: "s06.mp3" },
];

export const actFrames = (seconds: number) => Math.round(seconds * FPS);

export const TOTAL_FRAMES = ACTS.reduce((s, a) => s + actFrames(a.seconds), 0);
