import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../lib/theme";

// Sanfte Einblendung — Standardauftritt für Karten/Texte.
export const FadeIn: React.FC<{
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
}> = ({ children, startFrame = 0, duration = 20 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - startFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity, width: "100%", height: "100%" }}>{children}</div>;
};

// Virtuelle Kamera: Pan/Zoom/Dolly über die ganze Szene (Aufmerksamkeitsführung).
export const VirtualCamera: React.FC<{
  children: React.ReactNode;
  duration: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
}> = ({
  children,
  duration,
  fromScale = 1,
  toScale = 1.12,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(p, [0, 1], [fromScale, toScale]);
  const x = interpolate(p, [0, 1], [fromX, toX]);
  const y = interpolate(p, [0, 1], [fromY, toY]);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${x}px, ${y}px)`,
        transformOrigin: "center center",
        background: THEME.bg,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Kinolook: Vignette über die Szene legen.
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);
