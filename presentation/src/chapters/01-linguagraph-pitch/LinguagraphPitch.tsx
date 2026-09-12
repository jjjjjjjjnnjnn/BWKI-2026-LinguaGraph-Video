import { MaskReveal } from "../../components/MaskReveal";
import { TeamMonogram } from "../../components/TeamMonogram";
import type { ChapterStepProps } from "../../registry/types";
import {
  APP_ROLES,
  CONCEPT_GRAPH,
  CONCEPT_GRAPH_EDGES,
  DE_ANSWERS_FREIHEIT,
  DE_DRIVERS,
  FIVE_THEMES,
  LDS_BARS,
  LINK,
  MATHE_CHECK,
  PROJECT_SUBTITLE,
  PROVIDER_FAMILIES,
  STATS,
  TEAM,
  THREE_LANGUAGES,
  TRI_LINGUAL_WORD,
  ZH_ANSWERS_FREIHEIT,
  ZH_DRIVERS,
} from "./data";
import "./LinguagraphPitch.css";

/**
 * Single chapter — the entire 203s LinguaGraph BWKI 2026 pitch.
 *
 * 32 steps; each `step === N` is a full-scene takeover with its own
 * visual demonstration. Token-only colors/fonts; durations come from
 * theme CSS variables.
 */
export default function LinguagraphPitch({ step }: ChapterStepProps) {
  /* ─── Cover (step 0) — editorial opening ─────────────────────────── */

  if (step === 0) {
    // Cover: project name (italic accent), DE subtitle, full team, affiliation.
    return (
      <div className="lp-scene scene-pad lp-center">
        <header className="masthead">
          <span className="brand">LinguaGraph</span>
          <span className="issue">BWKI 2026 · Pitch</span>
        </header>
        <hr className="rule" style={{ marginTop: "var(--space-5)" }} />

        <div className="lp-cover">
          <div className="kicker">Video-Pitch · Forschungsprojekt</div>
          <h1 className="lp-cover-h">
            <MaskReveal show duration={1100}>
              <span className="lp-cover-mark">LinguaGraph</span>
            </MaskReveal>
          </h1>
          <hr className="rule-accent lp-rule-grow-in" />
          <p className="lp-cover-tag">
            <MaskReveal show delay={500} duration={700}>
              —
            </MaskReveal>
            <MaskReveal show delay={700} duration={900}>
              <span className="serif-it lp-em">{PROJECT_SUBTITLE}</span>
            </MaskReveal>
          </p>
          <div className="lp-cover-team">
            <div className="lp-cover-name serif-it">
              <MaskReveal show delay={1400} duration={700}>
                {TEAM.name} · {TEAM.partner}
              </MaskReveal>
            </div>
            <div className="lp-cover-teamid label-mono">
              <MaskReveal show delay={1750} duration={600}>
                {TEAM.teamId}
              </MaskReveal>
            </div>
            <div className="lp-cover-aff label-mono">
              <MaskReveal show delay={2050} duration={600}>
                {TEAM.affiliation}
              </MaskReveal>
            </div>
            <div className="lp-cover-monogram">
              <MaskReveal show delay={2300} duration={700}>
                <TeamMonogram size="md" showCaption />
              </MaskReveal>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── M1 — Hook + Team ──────────────────────────────────────────── */

  if (step === 1) {
    // DE ask "Freiheit" + 3 DE answers stagger
    return (
      <div className="lp-scene scene-pad">
        <header className="masthead">
          <span className="brand">LinguaGraph</span>
          <span className="issue">BWKI 2026 · Pitch</span>
        </header>
        <hr className="rule" style={{ marginTop: "var(--space-5)" }} />
        <div className="lp-hook">
          <div className="kicker">M1 · Hook</div>
          <h1 className="lp-hero-q">
            <MaskReveal show duration={900}>
              Was gehört zur&nbsp;
            </MaskReveal>
            <MaskReveal show delay={300} duration={900}>
              <span className="lp-hero-it">Freiheit</span>
            </MaskReveal>
            <MaskReveal show delay={650} duration={900}>
              <span className="lp-hero-qmark">?</span>
            </MaskReveal>
          </h1>
          <div className="lp-answers">
            {DE_ANSWERS_FREIHEIT.map((ans, i) => (
              <span
                key={ans}
                className="lp-chip lp-chip-in"
                style={{ animationDelay: `${1100 + i * 280}ms` }}
              >
                {ans}
              </span>
            ))}
          </div>
          <div className="label-mono lp-source">Antwort · deutsches KI-Modell</div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    // ZH ask + 3 ZH answers; DE chips dim
    return (
      <div className="lp-scene scene-pad">
        <header className="masthead">
          <span className="brand">LinguaGraph</span>
          <span className="issue">BWKI 2026 · Pitch</span>
        </header>
        <hr className="rule" style={{ marginTop: "var(--space-5)" }} />
        <div className="lp-hook">
          <div className="kicker">M1 · Hook</div>
          <h1 className="lp-hero-q">
            <MaskReveal show duration={900}>
              什么是&nbsp;
            </MaskReveal>
            <MaskReveal show delay={300} duration={900}>
              <span className="lp-hero-it">自由</span>
            </MaskReveal>
            <MaskReveal show delay={650} duration={900}>
              <span className="lp-hero-qmark">?</span>
            </MaskReveal>
          </h1>
          <div className="lp-answers">
            {DE_ANSWERS_FREIHEIT.map((ans) => (
              <span key={ans} className="lp-chip lp-chip-dim">
                {ans}
              </span>
            ))}
            {ZH_ANSWERS_FREIHEIT.map((ans, i) => (
              <span
                key={ans}
                className="lp-chip lp-chip-in lp-chip-active"
                style={{ animationDelay: `${900 + i * 280}ms` }}
              >
                {ans}
              </span>
            ))}
          </div>
          <div className="label-mono lp-source">Antwort · dasselbe Modell · 中文</div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    // "Dasselbe Wort — andere kognitive Landkarte" — drei Worten converge
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-triword">
          <div className="kicker">M1 · Hook</div>
          <div className="lp-triword-row">
            <span
              className="lp-triword-cell lp-triword-de"
              style={{ animationDelay: "0ms" }}
            >
              {TRI_LINGUAL_WORD.de}
            </span>
            <span
              className="lp-triword-cell lp-triword-zh"
              style={{ animationDelay: "220ms" }}
            >
              {TRI_LINGUAL_WORD.zh}
            </span>
            <span
              className="lp-triword-cell lp-triword-en"
              style={{ animationDelay: "440ms" }}
            >
              {TRI_LINGUAL_WORD.en}
            </span>
          </div>
          <div className="lp-triword-rule rule-accent lp-grow-in" />
          <h2 className="lp-triword-tagline">
            <MaskReveal show delay={900} duration={900}>
              <span className="serif-it lp-em">Dasselbe Wort</span>
            </MaskReveal>
            <MaskReveal show delay={1200} duration={700}>
              &nbsp;— eine andere&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1500} duration={900}>
              <span className="lp-em">kognitive Landkarte</span>
            </MaskReveal>
            <MaskReveal show delay={1900} duration={600}>
              .
            </MaskReveal>
          </h2>
        </div>
      </div>
    );
  }

  if (step === 4) {
    // "LinguaGraph" tagline hero with accent underline
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-tagline">
          <div className="kicker">M1 · Hook</div>
          <h1 className="lp-tagline-h">
            <MaskReveal show duration={1100}>
              <span className="lp-tagline-mark">LinguaGraph</span>
            </MaskReveal>
          </h1>
          <hr className="rule-accent lp-rule-grow-in" />
          <p className="lp-tagline-sub">
            <MaskReveal show delay={500} duration={700}>
              Genau solche Unterschiede macht&nbsp;
            </MaskReveal>
            <MaskReveal show delay={900} duration={700}>
              <span className="serif-it lp-em">LinguaGraph</span>
            </MaskReveal>
            <MaskReveal show delay={1200} duration={600}>
              &nbsp;messbar.
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  /* ─── M2 — Problem ──────────────────────────────────────────────── */

  if (step === 5) {
    // "KI-Systeme für Milliarden ... Dutzende Sprachen"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-stat-hero">
          <div className="kicker">M2 · Problem</div>
          <div className="lp-stat-row">
            <span className="lp-stat-num hero-num">Milliarden</span>
            <span className="lp-stat-plus">×</span>
            <span className="lp-stat-num hero-num">Dutzende</span>
          </div>
          <p className="lp-stat-cap">
            <MaskReveal show delay={600} duration={700}>
              KI-Systeme werden heute für Menschen in&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1000} duration={700}>
              <span className="lp-em">Dutzenden Sprachen</span>
            </MaskReveal>
            <MaskReveal show delay={1400} duration={600}>
              &nbsp;bereitgestellt.
            </MaskReveal>
          </p>
          <div className="lp-globe lp-fade-in" />
        </div>
      </div>
    );
  }

  if (step === 6) {
    // "Aber sie sind überwiegend mit englischen Daten trainiert."
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-bar-fill">
          <div className="kicker">M2 · Problem</div>
          <h2 className="lp-bar-cap">Training-Daten</h2>
          <div className="lp-bar-track">
            <div
              className="lp-bar-fill-inner lp-bar-grow"
              style={{ width: "92%" }}
            />
            <span className="lp-bar-label-en">EN</span>
          </div>
          <div className="lp-bar-axis">
            <span>0%</span>
            <span>100%</span>
          </div>
          <p className="lp-bar-note label-mono">
            <MaskReveal show delay={900} duration={700}>
              überwiegend englische Trainingsdaten
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 7) {
    // "Versteht ein Modell Gerechtigkeit ... gleich?" — split cards
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-split-cards">
          <div className="kicker">M2 · Problem · Kreditentscheidung</div>
          <div className="lp-split-grid">
            <div
              className="lp-split-card lp-card lp-card-in"
              style={{ animationDelay: "0ms" }}
            >
              <div className="lp-card-lang">DE</div>
              <div className="lp-card-word">Gerechtigkeit</div>
              <div className="lp-card-mini">
                Fairness · Verteilung · Schutz
              </div>
            </div>
            <div className="lp-split-eq serif-it">=</div>
            <div
              className="lp-split-card lp-card lp-card-in lp-card-dim"
              style={{ animationDelay: "200ms" }}
            >
              <div className="lp-card-lang">?</div>
              <div className="lp-card-word">?</div>
            </div>
            <div
              className="lp-split-card lp-card lp-card-in"
              style={{ animationDelay: "400ms" }}
            >
              <div className="lp-card-lang">ZH</div>
              <div className="lp-card-word">公正</div>
              <div className="lp-card-mini">
                程序 · 关系 · 公平
              </div>
            </div>
          </div>
          <p className="lp-split-q">
            <MaskReveal show delay={700} duration={700}>
              Versteht ein Modell&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1100} duration={700}>
              <span className="lp-em">Gerechtigkeit</span>
            </MaskReveal>
            <MaskReveal show delay={1400} duration={700}>
              &nbsp;in beiden Sprachen gleich?
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 8) {
    // "Wenn nicht, erhalten Nutzer ... unterschiedliche Behandlung"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-mockup-warning">
          <div className="kicker">M2 · Problem</div>
          <div className="lp-mockup">
            <div className="lp-mockup-bar">
              <span className="lp-mockup-title">Kredit-Score</span>
              <span className="badge-mono is-accent">⚠ Sprachdrift</span>
            </div>
            <div className="lp-mockup-row">
              <div className="lp-mockup-cell">
                <div className="label-mono">Anfrage · DE</div>
                <div className="lp-mockup-val">Genehmigt</div>
              </div>
              <div className="lp-mockup-cell">
                <div className="label-mono">Anfrage · ZH</div>
                <div className="lp-mockup-val lp-mockup-val-warn">
                  Abgelehnt
                </div>
              </div>
            </div>
          </div>
          <p className="lp-mockup-tag">
            <MaskReveal show delay={700} duration={700}>
              Nutzer erhalten&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1100} duration={700}>
              <span className="lp-em">je nach Sprache</span>
            </MaskReveal>
            <MaskReveal show delay={1500} duration={700}>
              &nbsp;unterschiedliche Behandlung.
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 9) {
    // "Gängige KI-Evaluation misst nur Aufgabenerfüllung"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-eval-list">
          <div className="kicker">M2 · Problem · Evaluation misst …</div>
          <ul className="lp-eval-items">
            {["Accuracy", "BLEU", "F1", "ROUGE", "MMLU"].map((m, i) => (
              <li
                key={m}
                className="lp-eval-item lp-eval-in"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <span className="lp-eval-x">×</span>
                <span className="lp-eval-name">{m}</span>
                <span className="label-mono lp-eval-aside">
                  misst Aufgabenerfüllung
                </span>
              </li>
            ))}
          </ul>
          <p className="lp-eval-gap">
            <MaskReveal show delay={1200} duration={700}>
              nicht, ob&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1500} duration={700}>
              <span className="lp-em">Wertkonzepte</span>
            </MaskReveal>
            <MaskReveal show delay={1800} duration={700}>
              &nbsp;sprachübergreifend konsistent sind.
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 10) {
    // "Das ist ein blinder Fleck."
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-tagline">
          <div className="kicker">M2 · Problem</div>
          <h1 className="lp-tagline-h lp-tagline-h-mid">
            <MaskReveal show duration={900}>
              Das ist ein
            </MaskReveal>
          </h1>
          <h1 className="lp-tagline-h lp-tagline-h-big">
            <MaskReveal show delay={500} duration={1100}>
              <span className="serif-it lp-em">blinder Fleck</span>
            </MaskReveal>
            <MaskReveal show delay={1100} duration={500}>
              .
            </MaskReveal>
          </h1>
          <hr className="rule-accent lp-rule-grow-in" />
        </div>
      </div>
    );
  }

  /* ─── M3 — Methode ──────────────────────────────────────────────── */

  if (step === 11) {
    // "Wie misst man etwas Unsichtbares ... Konzeptstruktur"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-tagline">
          <div className="kicker">M3 · Methode</div>
          <h2 className="lp-section-h">
            <MaskReveal show duration={900}>
              Wie misst man etwas&nbsp;
            </MaskReveal>
            <MaskReveal show delay={300} duration={700}>
              <span className="serif-it lp-em">Unsichtbares</span>
            </MaskReveal>
            <MaskReveal show delay={600} duration={700}>
              ?
            </MaskReveal>
          </h2>
          <hr className="rule lp-rule-grow-in" />
          <p className="lp-section-sub">
            <MaskReveal show delay={1000} duration={700}>
              die Konzeptstruktur eines Modells
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 12) {
    // "Kernidee: Man fragt die KI selbst"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-probe">
          <div className="kicker">M3 · Methode · Kernidee</div>
          <div className="lp-probe-box">
            <div className="lp-probe-label">LLM</div>
            <div className="lp-probe-core" />
            <div
              className="lp-probe-pulse lp-probe-pulse-1"
              style={{ animationDelay: "300ms" }}
            />
            <div
              className="lp-probe-pulse lp-probe-pulse-2"
              style={{ animationDelay: "700ms" }}
            />
            <div
              className="lp-probe-pulse lp-probe-pulse-3"
              style={{ animationDelay: "1100ms" }}
            />
          </div>
          <h2 className="lp-probe-tag">
            <MaskReveal show delay={1200} duration={700}>
              <span className="lp-em">Man fragt die KI selbst</span>
            </MaskReveal>
            <MaskReveal show delay={1700} duration={500}>
              .
            </MaskReveal>
          </h2>
        </div>
      </div>
    );
  }

  if (step === 13) {
    // 5 themes × 3 languages grid
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-grid15">
          <div className="kicker">M3 · Methode · Versuchsaufbau</div>
          <div className="lp-grid15-head">
            <span></span>
            {THREE_LANGUAGES.map((l) => (
              <span key={l.code} className="lp-grid15-lang">
                {l.label}
              </span>
            ))}
          </div>
          {FIVE_THEMES.map((t, ti) => (
            <div key={t} className="lp-grid15-row">
              <span className="lp-grid15-theme">{t}</span>
              {THREE_LANGUAGES.map((l, li) => (
                <span
                  key={l.code}
                  className="lp-grid15-cell lp-grid15-cell-in"
                  style={{ animationDelay: `${ti * 120 + li * 80}ms` }}
                >
                  ·{ti + 1}{l.code}·
                </span>
              ))}
            </div>
          ))}
          <p className="label-mono lp-grid15-note">
            dasselbe Modell · nur Sprache ändert sich
          </p>
        </div>
      </div>
    );
  }

  if (step === 14) {
    // "Sprache ist die einzige Variable" hero + arrow
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-variable">
          <div className="kicker">M3 · Methode · Kontrollvariable</div>
          <h2 className="lp-variable-h">
            <MaskReveal show duration={800}>
              Weil es&nbsp;
            </MaskReveal>
            <MaskReveal show delay={250} duration={700}>
              <span className="lp-em">dasselbe Modell</span>
            </MaskReveal>
            <MaskReveal show delay={650} duration={500}>
              &nbsp;ist,
            </MaskReveal>
          </h2>
          <div className="lp-variable-arrow">
            <span className="lp-arrow-line" />
            <span className="lp-arrow-head">→</span>
          </div>
          <h1 className="lp-variable-target">
            <MaskReveal show delay={1200} duration={1100}>
              <span className="serif-it lp-em">Sprache</span>
            </MaskReveal>
            <MaskReveal show delay={1500} duration={700}>
              &nbsp;ist die&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1800} duration={900}>
              <span className="lp-em">einzige Variable</span>
            </MaskReveal>
            <MaskReveal show delay={2200} duration={500}>
              .
            </MaskReveal>
          </h1>
        </div>
      </div>
    );
  }

  if (step === 15) {
    // v6: Concept graph — 14 nodes per language + dynamic cross-language
    // edges with divergence-driven stroke-opacity. Layout is deterministic
    // (radial around two hubs at (400, 130) DE / (400, 330) ZH) so the
    // graph renders stably across re-mounts.
    //
    // Position generation: angle = (2π * i) / N — evenly spread on a circle.
    // 14 nodes is dense enough to look "real-data" without crowding.
    const N = CONCEPT_GRAPH.de.length; // 14
    const DE_R = 110;
    const ZH_R = 110;
    const DE_HUB: [number, number] = [400, 130];
    const ZH_HUB: [number, number] = [400, 330];

    const deNodes = Array.from({ length: N }, (_, i) => {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2; // start at top
      return [
        DE_HUB[0] + DE_R * Math.cos(angle),
        DE_HUB[1] + DE_R * Math.sin(angle),
      ] as [number, number];
    });
    const zhNodes = Array.from({ length: N }, (_, i) => {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      return [
        ZH_HUB[0] + ZH_R * Math.cos(angle),
        ZH_HUB[1] + ZH_R * Math.sin(angle),
      ] as [number, number];
    });

    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-graph">
          <div className="kicker">M3 · Methode · Konzeptgraph</div>
          <svg
            className="lp-graph-svg"
            viewBox="0 0 800 460"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* ─── DE half (top, y < 240) ─────────────────────────── */}
            {/* edges: hub → each node, opacity scales with DE-side cross-edge avg */}
            {deNodes.map((p, i) => (
              <line
                key={`de-edge-${i}`}
                x1={DE_HUB[0]}
                y1={DE_HUB[1]}
                x2={p[0]}
                y2={p[1]}
                stroke="var(--accent)"
                strokeOpacity={0.25}
                strokeWidth={1}
                className="lp-graph-edge"
                style={{ animationDelay: `${300 + i * 60}ms` }}
              />
            ))}
            {/* DE nodes */}
            {deNodes.map((p, i) => (
              <g key={`de-node-${i}`} className="lp-graph-node">
                <circle
                  cx={p[0]}
                  cy={p[1]}
                  r={16}
                  fill="var(--surface)"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  style={{ animationDelay: `${100 + i * 60}ms` }}
                />
                <text
                  x={p[0]}
                  y={p[1] + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="var(--text)"
                  style={{ animationDelay: `${250 + i * 60}ms` }}
                >
                  {CONCEPT_GRAPH.de[i]}
                </text>
              </g>
            ))}
            {/* hub DE */}
            <circle
              cx={DE_HUB[0]}
              cy={DE_HUB[1]}
              r={6}
              fill="var(--accent)"
              opacity={0.6}
            />

            {/* divider + labels */}
            <line
              x1={40}
              y1={240}
              x2={760}
              y2={240}
              stroke="var(--rule)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <text
              x={60}
              y={232}
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="var(--text-mute)"
              letterSpacing="2"
            >
              DE
            </text>
            <text
              x={60}
              y={272}
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="var(--text-mute)"
              letterSpacing="2"
            >
              ZH
            </text>

            {/* ─── ZH half (bottom, y > 240) ───────────────────────── */}
            {/* edges: hub → each node */}
            {zhNodes.map((p, i) => (
              <line
                key={`zh-edge-${i}`}
                x1={ZH_HUB[0]}
                y1={ZH_HUB[1]}
                x2={p[0]}
                y2={p[1]}
                stroke="var(--accent)"
                strokeOpacity={0.25}
                strokeWidth={1}
                className="lp-graph-edge"
                style={{ animationDelay: `${1100 + i * 60}ms` }}
              />
            ))}
            {/* ZH nodes */}
            {zhNodes.map((p, i) => (
              <g key={`zh-node-${i}`} className="lp-graph-node">
                <circle
                  cx={p[0]}
                  cy={p[1]}
                  r={16}
                  fill="var(--surface-2)"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  style={{ animationDelay: `${900 + i * 60}ms` }}
                />
                <text
                  x={p[0]}
                  y={p[1] + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="var(--text)"
                  style={{ animationDelay: `${1050 + i * 60}ms` }}
                >
                  {CONCEPT_GRAPH.zh[i]}
                </text>
              </g>
            ))}
            {/* hub ZH */}
            <circle
              cx={ZH_HUB[0]}
              cy={ZH_HUB[1]}
              r={6}
              fill="var(--accent)"
              opacity={0.6}
            />
          </svg>
          <p className="lp-graph-cap label-mono">
            pro Sprache · ein Konzeptgraph · {CONCEPT_GRAPH_EDGES.length}{" "}
            messbare Brücken
          </p>
        </div>
      </div>
    );
  }

  if (step === 16) {
    // LDS formula
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-formula">
          <div className="kicker">M3 · Methode · Metrik</div>
          <div className="lp-formula-name">
            <MaskReveal show duration={800}>
              <span className="serif-it lp-em">Linguistic Divergence Score</span>
            </MaskReveal>
          </div>
          <div className="lp-formula-eq">
            <MaskReveal show delay={600} duration={500}>
              <span>LDS</span>
            </MaskReveal>
            <MaskReveal show delay={800} duration={300}>
              <span className="lp-formula-eq-mark">&nbsp;=&nbsp;</span>
            </MaskReveal>
            <MaskReveal show delay={1000} duration={500}>
              <span>1&nbsp;</span>
            </MaskReveal>
            <MaskReveal show delay={1200} duration={400}>
              <span className="lp-formula-eq-op">−</span>
            </MaskReveal>
            <MaskReveal show delay={1400} duration={500}>
              <span>&nbsp;mean</span>
            </MaskReveal>
            <MaskReveal show delay={1600} duration={500}>
              <span>&nbsp;( J_node, J_edge )</span>
            </MaskReveal>
          </div>
          <hr className="rule lp-rule-grow-in" />
          <p className="lp-formula-cap">
            <MaskReveal show delay={2200} duration={700}>
              misst strukturelle Divergenz — über gemeinsame Konzepte und
              Relationen.
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 17) {
    // "benennt welche Bestandteile divergieren" — list stagger
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-output">
          <div className="kicker">M3 · Methode · Output</div>
          <h2 className="lp-output-h">
            <MaskReveal show duration={800}>
              Nicht nur eine Zahl, sondern
            </MaskReveal>
          </h2>
          <ul className="lp-output-list">
            {[
              "Konzept-A",
              "Beziehungs-Cluster",
              "Treiber-Wortschatz",
            ].map((item, i) => (
              <li
                key={item}
                className="lp-output-item lp-output-in"
                style={{ animationDelay: `${1000 + i * 280}ms` }}
              >
                <span className="lp-output-marker">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="lp-output-cap">
            <MaskReveal show delay={2000} duration={700}>
              welche&nbsp;
            </MaskReveal>
            <MaskReveal show delay={2300} duration={700}>
              <span className="lp-em">Bestandteile</span>
            </MaskReveal>
            <MaskReveal show delay={2600} duration={700}>
              &nbsp;genau divergieren.
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  /* ─── M4 — Befund ───────────────────────────────────────────────── */

  if (step === 18) {
    // "über 50 Modelle" hero + provider list
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-tagline">
          <div className="kicker">M4 · Befund · Stichprobe</div>
          <h1 className="lp-tagline-h lp-tagline-h-mid">
            <MaskReveal show duration={800}>
              <span className="lp-tagline-mark">{STATS.models}</span>
            </MaskReveal>
          </h1>
          <h1 className="lp-tagline-h lp-tagline-h-big">
            <MaskReveal show delay={500} duration={900}>
              <span className="serif-it lp-em">Modelle</span>
            </MaskReveal>
          </h1>
          <p className="lp-tagline-sub">
            <MaskReveal show delay={1200} duration={700}>
              verschiedener Anbieter · auch ein US-amerikanisches Modell
            </MaskReveal>
          </p>
          <ul className="lp-prov-list">
            {PROVIDER_FAMILIES.map((p, i) => (
              <li
                key={p}
                className="lp-prov-item lp-prov-in"
                style={{ animationDelay: `${1500 + i * 200}ms` }}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (step === 19) {
    // v6: "55 / 50" — explicit "Sprachpaar-Messungen" / "Modelle" association.
    // Each big number sits above its labelled badge so the relationship is
    // visually obvious (no more "is 55 the denominator?" confusion).
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-finding-hero">
          <div className="kicker">M4 · Befund · Messungen</div>
          <div className="lp-finding-rows">
            <div className="lp-finding-row lp-finding-row-in" style={{ animationDelay: "0ms" }}>
              <span className="lp-finding-num hero-num">55</span>
              <span className="lp-finding-arrow">↳</span>
              <span className="badge-mono lp-finding-badge">
                Sprachpaar-Messungen
              </span>
            </div>
            <div className="lp-finding-row lp-finding-row-in" style={{ animationDelay: "200ms" }}>
              <span className="lp-finding-num hero-num">50</span>
              <span className="lp-finding-arrow">↳</span>
              <span className="badge-mono lp-finding-badge">
                Modelle verschiedener Anbieter
              </span>
            </div>
            <div className="lp-finding-row lp-finding-row-in lp-finding-row-accent" style={{ animationDelay: "700ms" }}>
              <span className="badge-mono is-accent lp-finding-badge">
                p &lt; 0.05 · alle ZH–DE
              </span>
            </div>
          </div>
          <p className="lp-finding-cap">
            <MaskReveal show delay={1500} duration={700}>
              das chinesisch-deutsche Signal ist&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1900} duration={700}>
              <span className="lp-em">statistisch signifikant</span>
            </MaskReveal>
            <MaskReveal show delay={2300} duration={500}>
              .
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 20) {
    // "kulturell gemustert: DE Autonomie / ZH Raum"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-culture">
          <div className="kicker">M4 · Befund · Kulturelles Muster</div>
          <div className="lp-culture-grid">
            <div
              className="lp-culture-card lp-card lp-card-in"
              style={{ animationDelay: "0ms" }}
            >
              <div className="lp-card-lang">DE</div>
              <ul className="lp-driver-list">
                {DE_DRIVERS.map((d, i) => (
                  <li
                    key={d}
                    className="lp-driver-in"
                    style={{ animationDelay: `${500 + i * 220}ms` }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="lp-culture-card lp-card lp-card-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="lp-card-lang">ZH</div>
              <ul className="lp-driver-list">
                {ZH_DRIVERS.map((d, i) => (
                  <li
                    key={d}
                    className="lp-driver-in"
                    style={{ animationDelay: `${700 + i * 220}ms` }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 21) {
    // Mathe konvergiert vs Kultur divergiert — split
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-control">
          <div className="kicker">M4 · Befund · Kontrollbefund</div>
          <div className="lp-control-split">
            <div
              className="lp-control-half lp-card lp-card-in"
              style={{ animationDelay: "0ms" }}
            >
              <div className="lp-control-mark lp-control-mark-ok">✓</div>
              <div className="lp-control-h">{MATHE_CHECK.indicator}</div>
              <div className="lp-control-sub">
                <span className="label-mono">
                  z. B. {MATHE_CHECK.example}
                </span>
              </div>
              <div className="lp-control-tag">konvergiert</div>
            </div>
            <div
              className="lp-control-half lp-card lp-card-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="lp-control-mark lp-control-mark-warn">!</div>
              <div className="lp-control-h">Kulturelle Konzepte</div>
              <div className="lp-control-sub">
                <span className="label-mono">
                  z. B. Gerechtigkeit · Freiheit · Verantwortung
                </span>
              </div>
              <div className="lp-control-tag">divergieren deutlich</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 22) {
    // Beziehungen organisieren sich sprachspezifisch — bar chart
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-bars">
          <div className="kicker">M4 · Befund · LDS Werte</div>
          <h3 className="lp-bars-h">
            <MaskReveal show duration={700}>
              Konzept- &amp; Beziehungs-Divergenz
            </MaskReveal>
          </h3>
          <div className="lp-bars-rows">
            {LDS_BARS.map((b, i) => (
              <div
                key={b.label}
                className="lp-bars-row lp-bars-row-in"
                style={{ animationDelay: `${500 + i * 350}ms` }}
              >
                <div className="lp-bars-label">{b.label}</div>
                <div className="lp-bars-pair">
                  <div
                    className="lp-bars-bar lp-bars-bar-lds"
                    style={{
                      width: `${b.lds * 100}%`,
                      animationDelay: `${700 + i * 350}ms`,
                    }}
                  >
                    <span className="lp-bars-val">LDS · {b.lds.toFixed(2)}</span>
                  </div>
                  <div
                    className="lp-bars-bar lp-bars-bar-base"
                    style={{
                      width: `${b.baseline * 100}%`,
                      animationDelay: `${900 + i * 350}ms`,
                    }}
                  >
                    <span className="lp-bars-val">Boden · {b.baseline.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="lp-bars-cap label-mono">
            Within-Subject · ZH–DE · p &lt; 0.05
          </p>
        </div>
      </div>
    );
  }

  /* ─── M5 — Reflexion ────────────────────────────────────────────── */

  if (step === 23) {
    // "Ehrlich dazu" tone shift marker
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-reflect">
          <div className="kicker">M5 · Reflexion</div>
          <h2 className="lp-reflect-h">
            <MaskReveal show duration={900}>
              <span className="serif-it lp-em">Ehrlich</span>
            </MaskReveal>
            <MaskReveal show delay={400} duration={700}>
              &nbsp;dazu:
            </MaskReveal>
          </h2>
          <hr className="rule-accent lp-rule-grow-in" />
          <p className="lp-reflect-sub label-mono">
            <MaskReveal show delay={1000} duration={700}>
              drei Limitationen, kein Gegenbeweis
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 24) {
    // N=15, Design-Artefakt
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-reflect-card">
          <div className="kicker">M5 · Reflexion · 1 / 3</div>
          <h2 className="lp-reflect-num">
            <MaskReveal show duration={900}>
              N&nbsp;=&nbsp;{STATS.humanN}
            </MaskReveal>
          </h2>
          <p className="lp-reflect-body">
            <MaskReveal show delay={500} duration={700}>
              Human-Experiment · Between-Subject-Bedingungen
            </MaskReveal>
          </p>
          <div className="lp-reflect-tag">
            <span className="badge-mono is-accent">
              <MaskReveal show delay={1100} duration={700}>
                Design-Artefakt · kein Gegenbeweis
              </MaskReveal>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 25) {
    // 8 EN-Paare nicht signifikant
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-reflect-card">
          <div className="kicker">M5 · Reflexion · 2 / 3</div>
          <h2 className="lp-reflect-num">
            <MaskReveal show duration={900}>
              {STATS.enPairsNotSignificant}&nbsp;
            </MaskReveal>
            <MaskReveal show delay={300} duration={700}>
              <span className="serif-it lp-em">EN-Paare</span>
            </MaskReveal>
          </h2>
          <p className="lp-reflect-body">
            <MaskReveal show delay={700} duration={700}>
              nicht signifikant · konsistent mit der
            </MaskReveal>
            <MaskReveal show delay={1100} duration={700}>
              &nbsp;<span className="lp-em">Englisch-Zentriertheit</span>
            </MaskReveal>
            <MaskReveal show delay={1500} duration={700}>
              &nbsp;heutiger Modelle.
            </MaskReveal>
          </p>
        </div>
      </div>
    );
  }

  if (step === 26) {
    // Schwelle 0,10 heuristisch
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-reflect-card">
          <div className="kicker">M5 · Reflexion · 3 / 3</div>
          <h2 className="lp-reflect-num">
            <MaskReveal show duration={900}>
              Schwelle&nbsp;
            </MaskReveal>
            <MaskReveal show delay={300} duration={900}>
              <span className="serif-it lp-em">0,10</span>
            </MaskReveal>
          </h2>
          <p className="lp-reflect-body">
            <MaskReveal show delay={900} duration={700}>
              operative Faustregel · keine validierte Grenze.
            </MaskReveal>
          </p>
          <div className="lp-reflect-tag">
            <span className="badge-mono">
              <MaskReveal show delay={1500} duration={700}>
                heuristisch · nicht validiert
              </MaskReveal>
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ─── M6 — Anwendung + Schluss ──────────────────────────────────── */

  if (step === 27) {
    // "neue Art von KI-Prüfung"
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-tagline">
          <div className="kicker">M6 · Anwendung</div>
          <h2 className="lp-tagline-h lp-tagline-h-mid">
            <MaskReveal show duration={700}>
              LinguaGraph ist
            </MaskReveal>
          </h2>
          <h1 className="lp-tagline-h lp-tagline-h-big">
            <MaskReveal show delay={400} duration={1100}>
              eine&nbsp;
            </MaskReveal>
            <MaskReveal show delay={700} duration={900}>
              <span className="serif-it lp-em">neue Art</span>
            </MaskReveal>
            <MaskReveal show delay={1300} duration={700}>
              &nbsp;von&nbsp;
            </MaskReveal>
            <MaskReveal show delay={1600} duration={900}>
              <span className="lp-em">KI-Prüfung</span>
            </MaskReveal>
            <MaskReveal show delay={2200} duration={500}>
              .
            </MaskReveal>
          </h1>
          <hr className="rule-accent lp-rule-grow-in" />
        </div>
      </div>
    );
  }

  if (step === 28) {
    // Entwickler card
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-role">
          <div className="kicker">M6 · Anwendung · Rolle 1 / 3</div>
          <h2 className="lp-role-h">{APP_ROLES[0].name}</h2>
          <p className="lp-role-q">
            <MaskReveal show delay={300} duration={700}>
              <span className="serif-it lp-em">
                {APP_ROLES[0].question}
              </span>
            </MaskReveal>
          </p>
          <div className="lp-role-out">
            <span className="lp-role-mockup lp-card lp-card-in">
              <div className="label-mono">Drift-Monitor</div>
              <div className="lp-role-mockup-row">
                <span className="lp-role-mini lp-role-mini-on">
                  Gerechtigkeit · DE
                </span>
                <span className="lp-role-mini lp-role-mini-off">
                  Gerechtigkeit · ZH
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 29) {
    // Regulierer card
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-role">
          <div className="kicker">M6 · Anwendung · Rolle 2 / 3</div>
          <h2 className="lp-role-h">{APP_ROLES[1].name}</h2>
          <p className="lp-role-q">
            <MaskReveal show delay={300} duration={700}>
              <span className="serif-it lp-em">
                {APP_ROLES[1].question}
              </span>
            </MaskReveal>
          </p>
          <div className="lp-role-out">
            <span className="lp-role-mockup lp-card lp-card-in">
              <div className="label-mono">EU AI Act · Compliance</div>
              <div className="lp-role-mockup-row">
                <span className="lp-role-mini lp-role-mini-on">
                  Transparenz · ✓
                </span>
                <span className="lp-role-mini lp-role-mini-on">
                  Konzept-Audit · ✓
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 30) {
    // Forscher card + interpretierbar output
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-role">
          <div className="kicker">M6 · Anwendung · Rolle 3 / 3</div>
          <h2 className="lp-role-h">{APP_ROLES[2].name}</h2>
          <p className="lp-role-q">
            <MaskReveal show delay={300} duration={700}>
              <span className="serif-it lp-em">
                {APP_ROLES[2].question}
              </span>
            </MaskReveal>
          </p>
          <div className="lp-role-out">
            <span className="lp-role-mockup lp-card lp-card-in">
              <div className="label-mono">Divergenzbericht</div>
              <div className="lp-role-mockup-rows">
                {[
                  "Konzept-A · 0.96",
                  "Beziehungs-Cluster · 0.93",
                  "Treiber-Wortschatz · 0.98",
                ].map((row, i) => (
                  <div
                    key={row}
                    className="lp-role-mockup-row lp-role-row-in"
                    style={{ animationDelay: `${700 + i * 220}ms` }}
                  >
                    <span className="lp-role-mini">{row}</span>
                  </div>
                ))}
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 31) {
    // "LinguaGraph. Sichtbar. Danke."
    return (
      <div className="lp-scene scene-pad lp-center">
        <div className="lp-end">
          <div className="kicker">M6 · Schluss</div>
          <h1 className="lp-end-mark">
            <MaskReveal show duration={1100}>
              <span className="lp-end-mark-main">LinguaGraph</span>
            </MaskReveal>
            <MaskReveal show delay={500} duration={500}>
              <span className="lp-end-mark-period">.</span>
            </MaskReveal>
          </h1>
          <h2 className="lp-end-sub">
            <MaskReveal show delay={1100} duration={900}>
              <span className="serif-it lp-em">Sichtbar</span>
            </MaskReveal>
            <MaskReveal show delay={1500} duration={500}>
              <span className="lp-end-mark-period">.</span>
            </MaskReveal>
          </h2>
          <hr className="rule-accent lp-rule-grow-in" />
          <p className="lp-end-thanks">
            <MaskReveal show delay={2000} duration={700}>
              <span className="serif-it">Danke</span>
            </MaskReveal>
            <MaskReveal show delay={2400} duration={500}>
              .
            </MaskReveal>
          </p>
          <div className="lp-end-monogram">
            <MaskReveal show delay={2700} duration={700}>
              <TeamMonogram size="md" showCaption />
            </MaskReveal>
          </div>
          <ul className="lp-end-links">
            <li
              className="lp-end-link lp-link-in"
              style={{ animationDelay: "2700ms" }}
            >
              {LINK.repo}
            </li>
            <li
              className="lp-end-link lp-link-in lp-end-names"
              style={{ animationDelay: "3000ms" }}
            >
              <span className="serif-it">{TEAM.name} · {TEAM.partner}</span>
            </li>
            <li
              className="lp-end-link lp-link-in"
              style={{ animationDelay: "3250ms" }}
            >
              <span className="label-mono">{TEAM.teamId} · {TEAM.context}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Defensive fallback (should never render — narrations length is 32)
  return <div className="lp-scene" />;
}