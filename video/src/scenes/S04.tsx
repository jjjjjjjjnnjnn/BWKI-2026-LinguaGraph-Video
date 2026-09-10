import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAPER } from "../lib/theme";
import { SPRINGS } from "../lib/springs";
import { NumberCounter } from "../components/Effects";
import { InkRule, PaperCard, PaperStage, Seal } from "../components/Paper";
import { actFrames } from "../lib/timing";
import { S04_CONTROL, S04_TOPICS, S04_TREIBER_DE, S04_TREIBER_ZH } from "../data/s04";

// S04 · Befund (Papier-Dossier v3) — 39s (1170f). Daten aus data/s04.ts.
// B1 (0–360):    51/47-Siegelzahlen · „überall signifikant"
// B2 (360–760):  4 Themen-Säulen (Tusche, ZH-DE siegelrot), ZH-EN-Geister,
//                Warmgrau-Spotlight Freedom+Success + Treiber-Zeilen
// B3 (760–1170): Kontrollbefund ZH-DE · Math 0.52 mit朱批 „konvergiert (indikativ)"
const DUR = actFrames(39);
void DUR;

const fade = (frame: number, at: number, len = 25) =>
  interpolate(frame, [at, at + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fadeOut = (frame: number, at: number, len = 25) =>
  interpolate(frame, [at, at + len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const SERIF = `${PAPER.serifDe}, ${PAPER.serifCn}`;

/** Tusche-Säule mit Direkt-Label über der Spitze (tufte: kein Rahmen, kein Grid). */
const Column: React.FC<{
  label: string;
  value: number;
  maxH: number;
  color: string;
  dim?: boolean;
  frame: number;
  fps: number;
  delay: number;
  width?: number;
}> = ({ label, value, maxH, color, dim, frame, fps, delay, width = 110 }) => {
  const p = spring({ frame: frame - delay, fps, config: SPRINGS.smooth });
  const h = interpolate(p, [0, 1], [0, value * maxH]);
  const shown = interpolate(p, [0, 1], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: dim ? 0.25 : 1 }}>
      <div style={{ height: 60, display: "flex", alignItems: "flex-end" }}>
        <span style={{ fontFamily: SERIF, fontSize: 44, color, fontVariantNumeric: "tabular-nums" }}>
          {(shown as number).toFixed(2).replace(".", ",")}
        </span>
      </div>
      <div style={{ height: maxH + 8, display: "flex", alignItems: "flex-end", margin: "10px 0" }}>
        <div style={{ width, height: Math.max(h, 2), background: color }} />
      </div>
      <div style={{ fontFamily: PAPER.mono, fontSize: 26, letterSpacing: 3, color: PAPER.inkMuted }}>
        {label}
      </div>
    </div>
  );
};

export const S04_Befund: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1 = fade(frame, 8) * fadeOut(frame, 330);
  const b2 = fade(frame, 368) * fadeOut(frame, 730);
  const b3 = fade(frame, 768);
  const spot = interpolate(frame, [695, 725], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chips = fade(frame, 700);

  const zhde = S04_CONTROL.find((r) => r.pair === "ZH-DE")!;

  return (
    <PaperStage>
      {/* ── B1: Zählung ── */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: b1 }}>
        <Seal frame={frame} at={12}>
          <div style={{ display: "flex", gap: 170 }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: SERIF, fontSize: 200, color: PAPER.ink }}>
                <NumberCounter value={51} decimals={0} delay={15} size={200} color={PAPER.ink} />
              </span>
              <div style={{ fontFamily: SERIF, fontSize: 38, color: PAPER.inkLight, letterSpacing: 4 }}>Messungen</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: SERIF, fontSize: 200, color: PAPER.ink }}>
                <NumberCounter value={47} decimals={0} delay={35} size={200} color={PAPER.ink} />
              </span>
              <div style={{ fontFamily: SERIF, fontSize: 38, color: PAPER.inkLight, letterSpacing: 4 }}>Modelle</div>
            </div>
          </div>
        </Seal>
        <div style={{ marginTop: 10, opacity: fade(frame, 120) }}>
          <InkRule frame={frame} at={120} width={620} color={PAPER.seal} />
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 48, color: PAPER.ink, marginTop: 26, opacity: fade(frame, 140) }}>
          Ein Signal — <em style={{ color: PAPER.seal, fontStyle: "italic" }}>überall signifikant.</em>
        </div>
      </AbsoluteFill>

      {/* ── B2: Themen-Säulen ── */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: b2 }}>
        <div style={{ fontFamily: SERIF, fontSize: 34, letterSpacing: 5, color: PAPER.inkMuted }}>
          LDS JE THEMA · <span style={{ color: PAPER.seal }}>■ ZH-DE</span>
          <span> vs </span>
          <span style={{ color: PAPER.slate }}>■ ZH-EN</span>
        </div>
        {/* Warmgrau-Schleier für Spotlight */}
        {spot > 0 && (
          <AbsoluteFill style={{ background: PAPER.paperWarm, opacity: spot * 0.55, pointerEvents: "none" }} />
        )}
        <div style={{ display: "flex", gap: 100, alignItems: "flex-end", marginTop: 6 }}>
          {S04_TOPICS.map((t, i) => (
            <div key={t.topic} style={{ position: "relative", display: "flex", gap: 16, alignItems: "flex-end", zIndex: spot > 0.5 && (i === 0 || i === 3) ? 2 : 1 }}>
              <Column
                label={t.topic}
                value={t.zhDe}
                maxH={360}
                color={PAPER.seal}
                dim={spot > 0.5 && i !== 0 && i !== 3}
                frame={frame}
                fps={fps}
                delay={390 + i * 70}
              />
              <Column
                label=""
                value={t.zhEn}
                maxH={360}
                color={PAPER.slate}
                dim={spot > 0.5 && i !== 0 && i !== 3}
                frame={frame}
                fps={fps}
                delay={415 + i * 70}
                width={40}
              />
            </div>
          ))}
        </div>
        <div style={{ height: 100, marginTop: 22, opacity: chips }}>
          <PaperCard>
            <span style={{ fontFamily: SERIF, fontSize: 34, color: PAPER.ink }}>
              DE · {S04_TREIBER_DE.join(" · ")}
            </span>
            <span style={{ fontFamily: SERIF, fontSize: 34, color: PAPER.inkMuted }}>{"   ·   "}</span>
            <span style={{ fontFamily: SERIF, fontSize: 34, color: PAPER.seal }}>
              ZH · {S04_TREIBER_ZH.join(" · ")}
            </span>
          </PaperCard>
        </div>
      </AbsoluteFill>

      {/* ── B3: Kontrollbefund ── */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: b3 }}>
        <div style={{ fontFamily: SERIF, fontSize: 34, letterSpacing: 5, color: PAPER.inkMuted }}>
          KONTROLLBEFUND · ZH-DE
        </div>
        <div style={{ display: "flex", gap: 100, alignItems: "flex-end", marginTop: 6 }}>
          <Column label="Human" value={zhde.human} maxH={340} color={PAPER.ink} frame={frame} fps={fps} delay={790} />
          <Column label="LLM" value={zhde.llm} maxH={340} color={PAPER.ink} frame={frame} fps={fps} delay={830} />
          <Column label="Social" value={zhde.social} maxH={340} color={PAPER.slate} frame={frame} fps={fps} delay={870} />
          <Column label="Math" value={zhde.math} maxH={340} color={PAPER.seal} frame={frame} fps={fps} delay={910} />
        </div>
        <div style={{ marginTop: 30, fontFamily: SERIF, fontSize: 44, color: PAPER.ink, opacity: fade(frame, 990) }}>
          Institutionelles Wissen <em style={{ color: PAPER.seal }}>konvergiert</em>
          <span style={{ fontSize: 30, color: PAPER.inkMuted }}> (indikativ)</span>
          <span style={{ color: PAPER.inkLight }}> — Kultur divergiert.</span>
        </div>
      </AbsoluteFill>
    </PaperStage>
  );
};
