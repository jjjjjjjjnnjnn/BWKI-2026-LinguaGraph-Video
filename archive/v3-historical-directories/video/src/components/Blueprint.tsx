import React from "react";
import { AbsoluteFill } from "remotion";
import { BLUEPRINT } from "../lib/theme";

// Blueprint-Bühnenbausteine: Grid-Boden, Eck-Ticks, Dashed-Rule.
// Einmal hier, überall gleich — kein Wildwuchs pro Szene.

/** Vollflächiger Drafting-Grid-Boden (60/240px, aus tokens.css). */
export const Grid: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill
    style={{
      background: BLUEPRINT.shell,
      opacity,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: BLUEPRINT.grid,
        backgroundSize: BLUEPRINT.gridSize,
      }}
    />
  </AbsoluteFill>
);

/** Eck-Ticks (Vermessungszeichen) — Signatur des Blueprint-Themes. */
export const Ticks: React.FC<{ inset?: number; len?: number; color?: string }> = ({
  inset = 48,
  len = 36,
  color = BLUEPRINT.rule,
}) => {
  const t: React.CSSProperties = { position: "absolute", width: len, height: len, borderColor: color };
  return (
    <>
      <div style={{ ...t, top: inset, left: inset, borderTop: "2px solid", borderLeft: "2px solid", borderTopColor: color, borderLeftColor: color }} />
      <div style={{ ...t, top: inset, right: inset, borderTop: "2px solid", borderRight: "2px solid", borderTopColor: color, borderRightColor: color }} />
      <div style={{ ...t, bottom: inset, left: inset, borderBottom: "2px solid", borderLeft: "2px solid", borderBottomColor: color, borderLeftColor: color }} />
      <div style={{ ...t, bottom: inset, right: inset, borderBottom: "2px solid", borderRight: "2px solid", borderBottomColor: color, borderRightColor: color }} />
    </>
  );
};

/** 2px-dashed Trennlinie (Drafting-Line). */
export const Rule: React.FC<{ width?: number | string; opacity?: number }> = ({
  width = 560,
  opacity = 1,
}) => (
  <div
    style={{
      width,
      borderTop: `2px dashed ${BLUEPRINT.accent}`,
      opacity: opacity * 0.55,
      margin: "28px auto",
    }}
  />
);
