import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";
import { SPRINGS } from "../lib/springs";

// TODO: Partikelfeld (Sternenstaub/Netzstaub) — sanftes Driften, dämpft „PPT-Gefühl“.
// Vorgabe: seedbar (deterministisch aus frame ableiten, kein Math.random ohne Seed!).
export const ParticleField: React.FC<{ count?: number; color?: string }> = ({
  count = 60,
  color = THEME.cyan,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  void frame;
  return (
    <AbsoluteFill style={{ opacity: 0.5 }}>
      <svg width={width} height={height}>
        {Array.from({ length: count }).map((_, i) => {
          // Deterministischer Pseudo-Seed pro Partikel (renderstabil!)
          const sx = ((i * 733) % width) / width;
          const sy = ((i * 389) % height) / height;
          return (
            <circle
              key={i}
              cx={sx * width}
              cy={sy * height}
              r={1.5}
              fill={color}
              opacity={0.4}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// NumberCounter — federt auf Zielwert (Hook-Zahlen, LDS-Werte).
// Spring als Treiber, interpolate() mappt auf Anzeigewert. Overshoot clampen!
export const NumberCounter: React.FC<{
  value: number;
  decimals?: number;
  delay?: number;
  size?: number;
  color?: string;
}> = ({ value, decimals = 2, delay = 0, size = 160, color = THEME.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRINGS.snappy });
  const shown = interpolate(p, [0, 1], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ fontSize: size, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>
      {shown.toFixed(decimals)}
    </span>
  );
};

// TODO: Parallax — Ebenen mit speed-Faktoren gegeneinander verschieben (Kurzgesagt-Tiefe).
// TODO: LDSChart — Balken LDS-C vs. Boden aus public/figures/*.png mit Push-In.
