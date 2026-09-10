import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { ParticleField } from "../components/Effects";
import { Vignette, VirtualCamera } from "../components/Camera";
import { actFrames } from "../lib/timing";

// S06 · Anwendung + Schluss — 32s (960f).
// C1 (0–560):   Divergenzbericht — drei Nutzer, kein Black-Box-Score
// C2 (560–960): „LinguaGraph. Sichtbar.“ + Danke + Links
const DUR = actFrames(32);

export const S06_Schluss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1Out = interpolate(frame, [520, 555], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const c2In = spring({ frame: frame - 560, fps, config: SPRINGS.smooth });
  const users = ["Entwickler", "Regulierer", "Forscher"];

  return (
    <AbsoluteFill style={{ background: THEME.bg, fontFamily: THEME.font }}>
      <VirtualCamera duration={DUR} fromScale={1} toScale={1.06}>
        <ParticleField count={60} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: c1Out }}>
          <div style={{ fontSize: 88, fontWeight: 800, color: THEME.text }}>
            Kein Black-Box-Score.
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 40 }}>
            {users.map((u, i) => (
              <div
                key={u}
                style={{
                  fontSize: 38,
                  padding: "18px 44px",
                  borderRadius: 999,
                  border: `1px solid ${[THEME.gold, THEME.cyan, THEME.blue][i]}88`,
                  color: THEME.text,
                  opacity: interpolate(frame - 120 - i * 25, [0, 20], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {u}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 34, color: THEME.muted, marginTop: 32 }}>
            Eine Liste der Bestandteile, die divergieren.
          </div>
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: c2In,
            transform: `scale(${interpolate(c2In, [0, 1], [0.96, 1])})`,
          }}
        >
          <div style={{ fontSize: 130, fontWeight: 800, color: THEME.text }}>
            LinguaGraph. <span style={{ color: THEME.gold }}>Sichtbar.</span>
          </div>
          <div style={{ fontSize: 40, color: THEME.text, marginTop: 24 }}>Danke.</div>
          <div style={{ fontSize: 30, color: THEME.muted, marginTop: 16, fontFamily: THEME.mono }}>
            github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph
          </div>
        </AbsoluteFill>
      </VirtualCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
