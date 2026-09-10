import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUEPRINT } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { NumberCounter } from "../components/Effects";
import { Vignette, VirtualCamera } from "../components/Camera";
import { Grid, Rule, Ticks } from "../components/Blueprint";
import { actFrames } from "../lib/timing";
import { S04_CONTROL, S04_TOPICS, S04_TREIBER_DE, S04_TREIBER_ZH } from "../data/s04";

// S04 · Befund — 39s (1170f). Nativer Rebuild, Daten aus data/s04.ts.
// B1 (0–360):    51/47-Mono-Counter · „überall signifikant"
// B2 (360–760):  4 Themen-Säulen ZH-DE (grow+count), ZH-EN-Geister,
//                Spotlight Freedom+Success + Treiber-Chips
// B3 (760–1170): Kontrollbefund ZH-DE: Human/LLM/Social/Math · Math 0.52 cyan
const DUR = actFrames(39);
const MONO = BLUEPRINT.mono;

const fade = (frame: number, at: number, len = 25) =>
  interpolate(frame, [at, at + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fadeOut = (frame: number, at: number, len = 25) =>
  interpolate(frame, [at, at + len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Vertikale Säule mit Counter über der Spitze. */
const Column: React.FC<{
  label: string;
  value: number;
  maxH: number;
  color: string;
  dim?: boolean;
  frame: number;
  fps: number;
  delay: number;
  decimals?: number;
  width?: number;
}> = ({ label, value, maxH, color, dim, frame, fps, delay, decimals = 2, width = 120 }) => {
  const p = spring({ frame: frame - delay, fps, config: SPRINGS.smooth });
  const h = interpolate(p, [0, 1], [0, value * maxH]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: dim ? 0.3 : 1 }}>
      <div style={{ height: 64, display: "flex", alignItems: "flex-end" }}>
        <span style={{ fontFamily: MONO, fontSize: 44, color, fontVariantNumeric: "tabular-nums" }}>
          {(interpolate(p, [0, 1], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) as number).toFixed(decimals)}
        </span>
      </div>
      <div style={{ height: maxH + 8, display: "flex", alignItems: "flex-end", margin: "10px 0" }}>
        <div style={{ width, height: Math.max(h, 2), background: color, opacity: 0.25 + 0.75 * p }} />
      </div>
      <div style={{ fontFamily: MONO, fontSize: 30, color: BLUEPRINT.muted, letterSpacing: 2 }}>{label}</div>
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span
    style={{
      fontFamily: MONO,
      fontSize: 30,
      letterSpacing: 2,
      color,
      border: `2px solid ${color}66`,
      padding: "12px 26px",
      margin: "0 10px",
      background: BLUEPRINT.surface,
    }}
  >
    {children}
  </span>
);

export const S04_Befund: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1 = fade(frame, 8) * fadeOut(frame, 330);
  const b2 = fade(frame, 368) * fadeOut(frame, 730);
  const b3 = fade(frame, 768);
  // Spotlight ab f=700: nur Freedom (idx 0) + Success (idx 3) hell
  const spot = interpolate(frame, [695, 725], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chips = fade(frame, 700);

  const zhde = S04_CONTROL.find((r) => r.pair === "ZH-DE")!;

  return (
    <AbsoluteFill style={{ background: BLUEPRINT.shell, fontFamily: BLUEPRINT.sans }}>
      <VirtualCamera duration={DUR} fromScale={1} toScale={1.06}>
        <Grid />
        <Ticks />
        {/* ── B1: Zählung ── */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: b1 }}>
          <div style={{ display: "flex", gap: 160 }}>
            <div style={{ textAlign: "center" }}>
              <NumberCounter value={51} decimals={0} delay={15} size={190} color={BLUEPRINT.gold} />
              <div style={{ fontFamily: MONO, fontSize: 32, letterSpacing: 6, color: BLUEPRINT.muted }}>MESSUNGEN</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <NumberCounter value={47} decimals={0} delay={35} size={190} color={BLUEPRINT.accent} />
              <div style={{ fontFamily: MONO, fontSize: 32, letterSpacing: 6, color: BLUEPRINT.muted }}>MODELLE</div>
            </div>
          </div>
          <Rule />
          <div style={{ fontSize: 46, color: BLUEPRINT.text }}>
            Ein Signal — <span style={{ color: BLUEPRINT.gold }}>überall signifikant.</span>
          </div>
        </AbsoluteFill>

        {/* ── B2: Themen-Säulen ── */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: b2 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 6, color: BLUEPRINT.muted, marginBottom: 8 }}>
            LDS JE THEMA · <span style={{ color: BLUEPRINT.gold }}>■ ZH-DE</span>
            <span style={{ color: BLUEPRINT.text2 }}> vs </span>
            <span style={{ color: BLUEPRINT.faint }}>■ ZH-EN</span>
          </div>
          <div style={{ display: "flex", gap: 90, alignItems: "flex-end" }}>
            {S04_TOPICS.map((t, i) => (
              <div key={t.topic} style={{ position: "relative", display: "flex", gap: 14, alignItems: "flex-end" }}>
                <Column
                  label={t.topic.toUpperCase()}
                  value={t.zhDe}
                  maxH={380}
                  color={BLUEPRINT.gold}
                  dim={spot > 0.5 && i !== 0 && i !== 3}
                  frame={frame}
                  fps={fps}
                  delay={390 + i * 70}
                />
                <Column
                  label=""
                  value={t.zhEn}
                  maxH={380}
                  color={BLUEPRINT.faint}
                  dim={spot > 0.5 && i !== 0 && i !== 3}
                  frame={frame}
                  fps={fps}
                  delay={415 + i * 70}
                  width={44}
                />
              </div>
            ))}
          </div>
          <div style={{ height: 96, marginTop: 18, opacity: chips }}>
            <Chip color={BLUEPRINT.gold}>DE · {S04_TREIBER_DE.join(" · ")}</Chip>
            <Chip color={BLUEPRINT.accent}>ZH · {S04_TREIBER_ZH.join(" · ")}</Chip>
          </div>
        </AbsoluteFill>

        {/* ── B3: Kontrollbefund ── */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: b3 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 6, color: BLUEPRINT.muted, marginBottom: 8 }}>
            KONTROLLBEFUND · ZH-DE
          </div>
          <div style={{ display: "flex", gap: 90, alignItems: "flex-end" }}>
            <Column label="HUMAN" value={zhde.human} maxH={360} color={BLUEPRINT.text2} frame={frame} fps={fps} delay={790} />
            <Column label="LLM" value={zhde.llm} maxH={360} color={BLUEPRINT.text2} frame={frame} fps={fps} delay={830} />
            <Column label="SOCIAL" value={zhde.social} maxH={360} color={BLUEPRINT.muted} frame={frame} fps={fps} delay={870} />
            <Column label="MATH" value={zhde.math} maxH={360} color={BLUEPRINT.accent} frame={frame} fps={fps} delay={910} />
          </div>
          <div style={{ marginTop: 30, fontSize: 42, color: BLUEPRINT.text, opacity: fade(frame, 990) }}>
            Institutionelles Wissen <span style={{ color: BLUEPRINT.accent }}>konvergiert.</span>
            <span style={{ color: BLUEPRINT.muted }}> Kultur divergiert.</span>
          </div>
        </AbsoluteFill>
      </VirtualCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
