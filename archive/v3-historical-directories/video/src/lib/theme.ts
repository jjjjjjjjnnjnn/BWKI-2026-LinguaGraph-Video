// ★ SSOT für Look & Feel: Apple-Keynote auf Tiefblau. Nur hier ändern.
export const THEME = {
  bg: "#060a14",
  bgCard: "#111833",
  gold: "#f0c040",
  blue: "#3b82f6",
  cyan: "#22d3ee",
  text: "#f0f4ff",
  muted: "#8892a8",
  font: "Inter, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', Consolas, monospace",
} as const;

// ── v3 Papier-Dossier (2026-09-10): Skill-Fusion paper-press + kraft-paper +
// vintage-editorial + tufte-dataink + vignelli. Einzige Point-Farbe: Siegelrot.
// BLUEPRINT (v2) bleibt als rejected Referenz stehen, wird nicht mehr rendert.
export const PAPER = {
  paper: "#faf9f6",
  paperWarm: "#f5f0e8",
  border: "#e0ddd5",
  borderLight: "#ece8e0",
  ink: "#1a1a1a",
  inkLight: "#4a4a4a",
  inkMuted: "#888888",
  seal: "#c44536", // einzige Point-Farbe: ZH-DE-Signal, Schlüsselwörter, Siegel
  sealSoft: "rgba(196, 69, 54, 0.08)",
  slate: "#3E4A5C", // zweite Datenfarbe (tufte): nur Vergleichsserien
  faintRule: "#D8D2C2", // tufte: Referenzlinien nicht dunkler
  serifDe: "Georgia, 'Times New Roman', serif",
  serifCn: "'Noto Serif SC', 'Songti SC', STSong, SimSun, serif",
  mono: "'JetBrains Mono', Consolas, monospace", // nur Achsen-Labels (tufte)
} as const;
export const BLUEPRINT = {
  shell: "#0a1224",
  surface: "#0e1a2e",
  surface2: "#142441",
  surface3: "#1c2f54",
  text: "#d6e5ff",
  text2: "#a8c2f0",
  muted: "#6c89b8",
  faint: "#3e5680",
  rule: "rgba(120, 200, 255, 0.30)",
  accent: "#4dd2ff",
  accentSoft: "rgba(77, 210, 255, 0.10)",
  accentGlow: "rgba(77, 210, 255, 0.55)",
  gold: "#f0c040", // Bedeutungsfarbe: nur ZH-DE-Signal + Hook/Team
  mono: "'IBM Plex Mono', 'JetBrains Mono', Consolas, monospace",
  sans: "'IBM Plex Sans', 'Noto Sans SC', 'Inter', sans-serif",
  grid:
    "linear-gradient(rgba(120,200,255,0.08) 1px, transparent 1px)," +
    "linear-gradient(90deg, rgba(120,200,255,0.08) 1px, transparent 1px)," +
    "linear-gradient(rgba(120,200,255,0.04) 1px, transparent 1px)," +
    "linear-gradient(90deg, rgba(120,200,255,0.04) 1px, transparent 1px)",
  gridSize: "240px 240px, 240px 240px, 60px 60px, 60px 60px",
} as const;
