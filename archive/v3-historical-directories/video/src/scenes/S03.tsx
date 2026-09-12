import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { ParticleField } from "../components/Effects";
import { Vignette, VirtualCamera } from "../components/Camera";
import { actFrames } from "../lib/timing";

// S03 · Methode — 46s (1380f). Ein Satz, eine Karte (4 Karten, kein Textstau).
// C1 (0–330):    Das Unsichtbare messen.
// C2 (330–700):  Dasselbe Modell × 3 Sprachen, 5 Themen
// C3 (700–1030): Ein Graph pro Sprache (Knoten + Kanten wachsen)
// C4 (1030–1380): LDS-Formel + was sie liefert
const DUR = actFrames(46);

const Card: React.FC<{
  frame: number;
  fps: number;
  at: number;
  outAt: number;
  children: React.ReactNode;
}> = ({ frame, fps, at, outAt, children }) => {
  const p = spring({ frame: frame - at, fps, config: SPRINGS.smooth });
  const out = interpolate(frame, [outAt, outAt + 25], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity: p * out }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const H: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = THEME.text,
  size = 110,
}) => (
  <div style={{ fontSize: size, fontWeight: 800, letterSpacing: -2, color, lineHeight: 1.15 }}>
    {children}
  </div>
);

const MiniPanel: React.FC<{
  lang: string;
  word: string;
  accent: string;
  frame: number;
  delay: number;
}> = ({ lang, word, accent, frame, delay }) => {
  const p = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        flex: 1,
        margin: "0 14px",
        padding: "30px 20px",
        background: THEME.bgCard,
        border: `1px solid ${accent}55`,
        borderRadius: 16,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 22, color: THEME.muted }}>dasselbe Modell · {lang}</div>
      <div style={{ fontSize: 56, fontWeight: 800, color: accent, marginTop: 6 }}>{word}</div>
    </div>
  );
};

// Winziger Konzeptgraph: Knoten poppen, Kanten blenden ein (gestaffelt).
const MiniGraph: React.FC<{ frame: number; fps: number; delay: number; accent: string }> = ({
  frame,
  fps,
  delay,
  accent,
}) => {
  const nodes = [
    { x: 90, y: 60 },
    { x: 220, y: 30 },
    { x: 330, y: 80 },
    { x: 150, y: 150 },
    { x: 280, y: 160 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [0, 3],
    [3, 4],
    [1, 4],
  ];
  return (
    <svg width="400" height="200">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={accent}
          strokeWidth={3}
          opacity={interpolate(frame - delay - 10 - i * 8, [0, 15], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      ))}
      {nodes.map((n, i) => {
        const p = spring({ frame: frame - delay - i * 8, fps, config: SPRINGS.snappy });
        return (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={13 * p}
            fill={accent}
            opacity={p}
          />
        );
      })}
    </svg>
  );
};

export const S03_Methode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const topics = ["Gerechtigkeit", "Freiheit", "Verantwortung", "Heimat", "Erfolg"];

  return (
    <AbsoluteFill style={{ background: THEME.bg, fontFamily: THEME.font }}>
      <VirtualCamera duration={DUR} fromScale={1} toScale={1.08}>
        <ParticleField count={50} />
        <Card frame={frame} fps={fps} at={10} outAt={300}>
          <H>Das Unsichtbare messen.</H>
          <div style={{ fontSize: 38, color: THEME.muted, marginTop: 16 }}>
            die Konzeptstruktur eines Modells
          </div>
        </Card>
        <Card frame={frame} fps={fps} at={340} outAt={670}>
          <H size={84}>
            Ein Modell. <span style={{ color: THEME.gold }}>Drei Sprachen.</span>
          </H>
          <div style={{ display: "flex", width: 1600, margin: "36px auto 0" }}>
            <MiniPanel lang="DE" word="Modell A" accent={THEME.gold} frame={frame} delay={400} />
            <MiniPanel lang="ZH" word="Modell A" accent={THEME.cyan} frame={frame} delay={430} />
            <MiniPanel lang="EN" word="Modell A" accent={THEME.blue} frame={frame} delay={460} />
          </div>
          <div style={{ marginTop: 28 }}>
            {topics.map((t, i) => (
              <span
                key={t}
                style={{
                  display: "inline-block",
                  fontSize: 28,
                  padding: "8px 20px",
                  margin: "0 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: THEME.text,
                  opacity: interpolate(frame - 500 - i * 10, [0, 15], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
        <Card frame={frame} fps={fps} at={710} outAt={1000}>
          <H size={84}>
            Ein Graph <span style={{ color: THEME.cyan }}>pro Sprache.</span>
          </H>
          <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 32 }}>
            <MiniGraph frame={frame} fps={fps} delay={780} accent={THEME.gold} />
            <MiniGraph frame={frame} fps={fps} delay={830} accent={THEME.cyan} />
            <MiniGraph frame={frame} fps={fps} delay={880} accent={THEME.blue} />
          </div>
        </Card>
        <Card frame={frame} fps={fps} at={1040} outAt={1360}>
          <div style={{ color: THEME.gold, letterSpacing: 6, fontSize: 30 }}>
            LINGUISTIC DIVERGENCE SCORE
          </div>
          <div
            style={{
              fontFamily: THEME.mono,
              fontSize: 92,
              fontWeight: 700,
              color: THEME.text,
              margin: "20px 0",
            }}
          >
            LDS = 1 − mean(J<sub>node</sub>, J<sub>edge</sub>)
          </div>
          <div style={{ fontSize: 36, color: THEME.muted }}>
            Strukturdivergenz — bis zum einzelnen Konzept benannt.
          </div>
        </Card>
      </VirtualCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
