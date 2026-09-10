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

// ── Neuaufbau (2026-09-10): garden `blueprint`-Theme als Token.
// Quelle: .agents/skills/web-video-presentation/themes/blueprint/tokens.css
// THEME (legacy) bleibt unangetastet, bis S01–S06 migriert sind.
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
