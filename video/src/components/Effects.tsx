import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../lib/theme";

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

// TODO: NumberCounter — federt auf Zielwert (Hook-Zahlen, LDS-Werte).
// Pattern: spring() als Treiber + interpolate() auf Zielwert mappen.
export const NumberCounter: React.FC<{ value: number; decimals?: number }> = ({
  value,
  decimals = 2,
}) => <span>{value.toFixed(decimals)}</span>;

// TODO: Parallax — Ebenen mit speed-Faktoren gegeneinander verschieben (Kurzgesagt-Tiefe).
// TODO: LDSChart — Balken LDS-C vs. Boden aus public/figures/*.png mit Push-In.
