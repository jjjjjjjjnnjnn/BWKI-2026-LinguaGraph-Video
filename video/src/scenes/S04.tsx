import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { NumberCounter, ParticleField } from "../components/Effects";
import { Vignette, VirtualCamera } from "../components/Camera";
import { actFrames } from "../lib/timing";

// S04 · Befund — 39s (1170f). Zahlen nur aus narration_de/faktencheck (SSOT).
// C1 (0–280):    51 Messungen / 47 Modelle
// C2 (280–600):  LDS-C vs. Boden (Balken + Counter)
// C3 (600–900):  Treiber DE vs. ZH
// C4 (900–1170): Struktur, nicht nur Worte (+ Mathe indikativ)
const DUR = actFrames(39);

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
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: p * out }}>
      <div style={{ transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`, textAlign: "center" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Bar: React.FC<{
  label: string;
  sub: string;
  value: number;
  max: number;
  color: string;
  frame: number;
  fps: number;
  delay: number;
  decimals?: number;
}> = ({ label, sub, value, max, color, frame, fps, delay, decimals = 2 }) => {
  const p = spring({ frame: frame - delay, fps, config: SPRINGS.smooth });
  const w = interpolate(p, [0, 1], [0, (value / max) * 900]);
  return (
    <div style={{ margin: "18px 0", textAlign: "left", width: 1100 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: THEME.text, width: 420 }}>{label}</span>
        <NumberCounter value={value} decimals={decimals} delay={delay} size={72} color={color} />
      </div>
      <div style={{ height: 26, background: "rgba(255,255,255,0.08)", borderRadius: 13, marginTop: 8 }}>
        <div style={{ width: w, height: 26, background: color, borderRadius: 13 }} />
      </div>
      <div style={{ fontSize: 26, color: THEME.muted, marginTop: 4 }}>{sub}</div>
    </div>
  );
};

export const S04_Befund: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: THEME.bg, fontFamily: THEME.font }}>
      <VirtualCamera duration={DUR} fromScale={1} toScale={1.08}>
        <ParticleField count={50} />
        <Card frame={frame} fps={fps} at={10} outAt={250}>
          <div style={{ display: "flex", gap: 120, justifyContent: "center" }}>
            <div>
              <NumberCounter value={51} decimals={0} size={170} color={THEME.gold} />
              <div style={{ fontSize: 36, color: THEME.muted }}>Messungen</div>
            </div>
            <div>
              <NumberCounter value={47} decimals={0} delay={15} size={170} color={THEME.cyan} />
              <div style={{ fontSize: 36, color: THEME.muted }}>Modelle</div>
            </div>
          </div>
          <div style={{ fontSize: 40, color: THEME.text, marginTop: 24 }}>
            Ein Signal — <span style={{ color: THEME.gold }}>überall signifikant.</span>
          </div>
        </Card>
        <Card frame={frame} fps={fps} at={310} outAt={570}>
          <Bar label="LDS-C" sub="0,93–0,96 · Within-Subject" value={0.945} max={1} color={THEME.gold} frame={frame} fps={fps} delay={350} />
          <Bar label="Boden" sub="0,85–0,87 · Split-Half-Rauschen" value={0.86} max={1} color={THEME.muted} frame={frame} fps={fps} delay={390} />
        </Card>
        <Card frame={frame} fps={fps} at={630} outAt={870}>
          <div style={{ fontSize: 80, fontWeight: 800, color: THEME.text }}>
            Kulturell <span style={{ color: THEME.gold }}>gemustert.</span>
          </div>
          <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 32 }}>
            <div style={{ fontSize: 34, color: THEME.gold, border: "1px solid #f0c04055", borderRadius: 16, padding: "20px 36px" }}>
              DE · Autonomie · Regeln
            </div>
            <div style={{ fontSize: 34, color: THEME.cyan, border: "1px solid #22d3ee55", borderRadius: 16, padding: "20px 36px" }}>
              ZH · Raum · Anspruch
            </div>
          </div>
        </Card>
        <Card frame={frame} fps={fps} at={930} outAt={1150}>
          <div style={{ fontSize: 88, fontWeight: 800, color: THEME.text }}>
            Struktur, <span style={{ color: THEME.cyan }}>nicht nur Worte.</span>
          </div>
          <div style={{ fontSize: 34, color: THEME.muted, marginTop: 20 }}>
            Auch Relationen divergieren · Mathematik konvergiert (indikativ)
          </div>
        </Card>
      </VirtualCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
