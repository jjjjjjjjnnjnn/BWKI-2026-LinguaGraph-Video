import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { ParticleField } from "../components/Effects";
import { Vignette, VirtualCamera } from "../components/Camera";
import { actFrames } from "../lib/timing";

// S02 · Problem — 32s (960f). Keine erfundenen Statistiken: nur qualitative
// Riesenworte aus der Narration + Kredit-Beispiel + EU-AI-Act-Zeile.
// P1 (0–320f):   Milliarden Menschen / Dutzende Sprachen / Überwiegend Englisch
// P2 (320–650f): Gerechtigkeit → Gleiche Frage. Gleiche Antwort?
// P3 (650–960f): Der blinde Fleck + Transparenz-Zeile
const DUR = actFrames(32);

const Word: React.FC<{
  children: React.ReactNode;
  frame: number;
  fps: number;
  at: number;
  outAt?: number;
  color?: string;
  size?: number;
}> = ({ children, frame, fps, at, outAt, color = THEME.text, size = 130 }) => {
  const p = spring({ frame: frame - at, fps, config: SPRINGS.snappy });
  const out = outAt
    ? interpolate(frame, [outAt, outAt + 25], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <div
      style={{
        opacity: p * out,
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px)`,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: -2,
        color,
        textAlign: "center",
        lineHeight: 1.1,
      }}
    >
      {children}
    </div>
  );
};

export const S02_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = interpolate(frame, [700, 740], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: THEME.bg, fontFamily: THEME.font }}>
      <VirtualCamera duration={DUR} fromScale={1} toScale={1.1}>
        <ParticleField count={50} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {/* P1 */}
          <Word frame={frame} fps={fps} at={10} outAt={200} color={THEME.text} size={120}>
            Milliarden Menschen.
          </Word>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Word frame={frame} fps={fps} at={115} outAt={305} size={120}>
            Dutzende Sprachen.
          </Word>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Word frame={frame} fps={fps} at={220} outAt={410} color={THEME.gold} size={120}>
            Überwiegend Englisch.
          </Word>
        </AbsoluteFill>
        {/* P2 */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Word frame={frame} fps={fps} at={440} outAt={640} size={150}>
            Gerechtigkeit.
          </Word>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Word frame={frame} fps={fps} at={560} outAt={688} color={THEME.cyan} size={90}>
            Gleiche Frage. Gleiche Antwort?
          </Word>
        </AbsoluteFill>
        {/* P3 */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Word frame={frame} fps={fps} at={680} color={THEME.gold} size={150}>
            Der blinde Fleck.
          </Word>
          <div
            style={{
              opacity: badgeIn,
              marginTop: 28,
              fontSize: 36,
              color: THEME.muted,
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "14px 40px",
            }}
          >
            Evaluation misst Aufgaben — nicht Werte.
          </div>
        </AbsoluteFill>
      </VirtualCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
