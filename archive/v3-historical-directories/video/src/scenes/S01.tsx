import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { ParticleField } from "../components/Effects";
import { Vignette, VirtualCamera } from "../components/Camera";
import { actFrames } from "../lib/timing";

// S01 · Hook + Team — 29s (870f).
// P1 (0–120f):   „Dasselbe Wort. Drei Karten.“
// P2 (120–600f): Dreifach-Split Freiheit / 自由 / freedom
// P3 (600–870f): Teamkarte (Jiajun Rong, Schloss Heessen)
const DUR = actFrames(29);

const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = THEME.text,
  size = 150,
}) => (
  <div style={{ color, fontSize: size, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
    {children}
  </div>
);

const Panel: React.FC<{
  word: string;
  sub: string;
  chips: string[];
  accent: string;
  delay: number;
  frame: number;
  fps: number;
}> = ({ word, sub, chips, accent, delay, frame, fps }) => {
  const p = spring({ frame: frame - delay, fps, config: SPRINGS.smooth });
  const y = interpolate(p, [0, 1], [80, 0]);
  return (
    <div
      style={{
        flex: 1,
        margin: "0 18px",
        padding: "48px 36px",
        background: THEME.bgCard,
        border: `1px solid ${accent}55`,
        borderRadius: 20,
        opacity: p,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ fontSize: 84, fontWeight: 800, color: accent }}>{word}</div>
      <div style={{ fontSize: 30, color: THEME.muted, margin: "8px 0 28px" }}>{sub}</div>
      {chips.map((c, i) => (
        <div
          key={c}
          style={{
            display: "inline-block",
            fontSize: 30,
            padding: "10px 22px",
            margin: "0 12px 12px 0",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            color: THEME.text,
            opacity: interpolate(frame - delay - 20 - i * 8, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
};

export const S01_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const w1 = spring({ frame, fps, config: SPRINGS.snappy });
  const w2 = spring({ frame: frame - 25, fps, config: SPRINGS.snappy });

  // P1 ausblenden, sobald P2 kommt
  const p1Out = interpolate(frame, [100, 130], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p2In = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p2Out = interpolate(frame, [590, 625], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p3In = spring({ frame: frame - 630, fps, config: SPRINGS.smooth });

  return (
    <AbsoluteFill style={{ background: THEME.bg, fontFamily: THEME.font }}>
      <VirtualCamera duration={DUR} fromScale={1} toScale={1.12}>
        <ParticleField count={70} />
        {/* P1 */}
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center", opacity: p1Out }}
        >
          <div
            style={{
              opacity: w1,
              transform: `translateY(${interpolate(w1, [0, 1], [60, 0])}px)`,
            }}
          >
            <Big>Dasselbe Wort.</Big>
          </div>
          <div
            style={{
              opacity: w2,
              transform: `translateY(${interpolate(w2, [0, 1], [60, 0])}px)`,
            }}
          >
            <Big color={THEME.gold}>Drei Karten.</Big>
          </div>
        </AbsoluteFill>
        {/* P2 */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: p2In * p2Out,
          }}
        >
          <div style={{ display: "flex", width: 1720 }}>
            <Panel
              word="Freiheit"
              sub="Deutsch"
              chips={["Autonomie", "Regeln", "eigene Ziele"]}
              accent={THEME.gold}
              delay={140}
              frame={frame}
              fps={fps}
            />
            <Panel
              word="自由"
              sub="Chinesisch"
              chips={["Raum", "Grenzen", "Anspruch"]}
              accent={THEME.cyan}
              delay={185}
              frame={frame}
              fps={fps}
            />
            <Panel
              word="freedom"
              sub="English"
              chips={["same word —", "which map?"]}
              accent={THEME.blue}
              delay={230}
              frame={frame}
              fps={fps}
            />
          </div>
        </AbsoluteFill>
        {/* P3 — Teamkarte */}
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center", opacity: p3In }}
        >
          <div
            style={{
              color: THEME.gold,
              letterSpacing: 8,
              fontSize: 32,
              marginBottom: 12,
            }}
          >
            LINGUAGRAPH · BWKI 2026
          </div>
          <Big size={120}>Jiajun Rong</Big>
          <div style={{ fontSize: 40, color: THEME.muted, marginTop: 12 }}>
            Privatschule Schloss Heessen
          </div>
        </AbsoluteFill>
      </VirtualCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
