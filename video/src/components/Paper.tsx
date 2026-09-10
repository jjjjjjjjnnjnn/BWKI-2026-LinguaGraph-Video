import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAPER } from "../lib/theme";

// Papier-Dossier-Bausteine: Korn, Siegel-Stempel, Tusche-Linie, Papierkarte.
// Deterministisch (kein Math.random) — renderstabil.

/** Papierboden + SVG-Korn (feTurbulence, fixer Seed) + Randvignette. */
export const PaperStage: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: PAPER.paper }}>
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.5 }}>
        <filter id="paperkorn">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 0 0.47  0 0 0 0.06 0" />
        </filter>
        <rect width={width} height={height} filter="url(#paperkorn)" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};

/** 盖印: Siegel fällt ein (1.06→1, kein Bounce) + opacity. */
export const Seal: React.FC<{ frame: number; at: number; children: React.ReactNode }> = ({
  frame,
  at,
  children,
}) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 26, stiffness: 320 } });
  const s = interpolate(p, [0, 1], [1.06, 1]);
  return <div style={{ opacity: p, transform: `scale(${s})` }}>{children}</div>;
};

/** Tusche-Linie zeichnet sich selbst (horizontal). */
export const InkRule: React.FC<{
  frame: number;
  at: number;
  dur?: number;
  width?: number;
  color?: string;
  weight?: number;
}> = ({ frame, at, dur = 30, width = 560, color = PAPER.ink, weight = 2 }) => {
  const w = interpolate(frame, [at, at + dur], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ width: w, height: weight, background: color }} />;
};

/** Papierkarte: warm, 1px-Rahmen, Radius 0, kein Schatten (vignelli/tufte). */
export const PaperCard: React.FC<{ children: React.ReactNode; width?: number | string }> = ({
  children,
  width = "auto",
}) => (
  <div
    style={{
      width,
      background: PAPER.paperWarm,
      border: `1px solid ${PAPER.border}`,
      borderRadius: 0,
      padding: "36px 48px",
    }}
  >
    {children}
  </div>
);

/** Roter Siegelpunkt (vintage-editorial: Kreis + Punkt als Signatur). */
export const SealDot: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: PAPER.seal,
      verticalAlign: "middle",
    }}
  />
);
