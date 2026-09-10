import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../lib/theme";
import { Vignette } from "../components/Camera";
import { actFrames } from "../lib/timing";

// S05 · Reflexion — 25s (750f). Ruhig, ehrlich: kein Bounce, kein Gold,
// gedecktes Grau. Drei Punkte blenden nacheinander ein und bleiben stehen.
const DUR = actFrames(25);

const Point: React.FC<{ children: React.ReactNode; frame: number; at: number }> = ({
  children,
  frame,
  at,
}) => {
  const p = interpolate(frame - at, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: p,
        fontSize: 44,
        color: THEME.text,
        margin: "22px 0",
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
      }}
    >
      <span style={{ color: THEME.muted }}>— </span>
      {children}
    </div>
  );
};

export const S05_Reflexion: React.FC = () => {
  const frame = useCurrentFrame();
  void DUR;

  return (
    <AbsoluteFill
      style={{
        background: "#0b0e18",
        fontFamily: THEME.font,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: 1500 }}>
        <div
          style={{
            fontSize: 34,
            letterSpacing: 8,
            color: THEME.muted,
            marginBottom: 30,
            opacity: interpolate(frame, [0, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          EHRLICH DAZU
        </div>
        <Point frame={frame} at={40}>
          N=15 zeigt kein Signal — ein Design-Artefakt, kein Gegenbeweis.
        </Point>
        <Point frame={frame} at={220}>
          Acht englische Paare nicht signifikant — Englisch-Zentriertheit.
        </Point>
        <Point frame={frame} at={400}>
          Schwelle 0,10 ist eine Faustregel, keine validierte Grenze.
        </Point>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
