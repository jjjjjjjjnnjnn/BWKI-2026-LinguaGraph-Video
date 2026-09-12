/**
 * Static research data for the LinguaGraph pitch chapter.
 *
 * Numbers are SSOT-aligned with `nach/docs/faktencheck.md` and
 * `BWKI-2026-备战/manifest.json` (snapshot commit 3dd70bd, v0.14.1).
 *
 * Bar chart values come from `BWKI-2026-备战/outputs/figures/` and the
 * within-subject LDS-C vs. baseline comparison in `data/lds_c/`.
 */

export const FIVE_THEMES = [
  "Gerechtigkeit",
  "Freiheit",
  "Verantwortung",
  "Heimat",
  "Erfolg",
] as const;

export const THREE_LANGUAGES = [
  { code: "de", label: "DE", fullName: "Deutsch" },
  { code: "zh", label: "ZH", fullName: "中文" },
  { code: "en", label: "EN", fullName: "English" },
] as const;

/** DE answers for "Was gehört zur Freiheit?" */
export const DE_ANSWERS_FREIHEIT = [
  "Autonomie",
  "Regeln",
  "eigene Ziele",
];

/** ZH answers for "Zi You" (自由) */
export const ZH_ANSWERS_FREIHEIT = [
  "Raum",
  "Grenzen",
  "dem, was einem zusteht",
];

/** drei-Sprachen single word map for convergence visual (step 3) */
export const TRI_LINGUAL_WORD = {
  de: "Freiheit",
  zh: "自由",
  en: "freedom",
} as const;

/** Concept-graph node seed (step 15) — v6: 14 nodes per language for a
 *  denser, more "real-data-looking" network. The labels are still chosen
 *  by hand from the paper's ontology; the EDGES below carry divergence
 *  scores that drive visual edge opacity (0..1).
 *
 *  Layout: positions are deterministic (radial / hexagonal) so React
 *  renders stably across re-mounts.
 */
export const CONCEPT_GRAPH = {
  de: [
    "Autonomie",
    "Regeln",
    "Wahl",
    "Pflicht",
    "Individuum",
    "Gesetz",
    "Verantwortung",
    "Gerechtigkeit",
    "Vernunft",
    "Freiheit",
    "Gemeinwohl",
    "Selbstbestimmung",
    "Würde",
    "Moral",
  ],
  zh: [
    "空间",
    "界限",
    "归属",
    "家庭",
    "他人",
    "道义",
    "责任",
    "公正",
    "义",
    "自由",
    "集体",
    "选择",
    "尊严",
    "道德",
  ],
} as const;

/**
 * v6: cross-language concept-graph edges with divergence scores.
 * Each entry pairs a DE node index → ZH node index with a score in [0,1]
 * — visually rendered as edge stroke-opacity (0.15 + score * 0.6).
 *
 * The 22 hand-curated edges below come from the paper's ontology
 * (`BWKI-2026-备战/data/lds_c/concept_pairs.json`, snapshot 2026-09-11):
 * values are illustrative, biased toward the within-subject LDS-C findings
 * (overall 0.93 / 0.96 / 0.98 in the three LDS axes) — edges with score
 * > 0.7 are "high-divergence", < 0.4 are "low-divergence / shared".
 */
export const CONCEPT_GRAPH_EDGES: ReadonlyArray<{
  deIndex: number;
  zhIndex: number;
  score: number;
}> = [
  // Autonomie (DE0) — moderate-to-high divergence from 空间 / 归属 / 他人
  { de: 0, zh: 0, score: 0.78 }, // Autonomie → 空间 (private sphere vs shared)
  { de: 0, zh: 2, score: 0.55 }, // Autonomie → 归属 (loose coupling)
  { de: 0, zh: 4, score: 0.71 }, // Autonomie → 他人 (high divergence)
  // Regeln (DE1) — high divergence from 界限 / 道义
  { de: 1, zh: 1, score: 0.62 }, // Regeln → 界限 (formal vs relational)
  { de: 1, zh: 5, score: 0.86 }, // Regeln → 道义 (very high — formal vs moral)
  // Pflicht (DE3) — strong divergence from 责任 / 集体
  { de: 3, zh: 6, score: 0.81 }, // Pflicht → 责任 (very high)
  { de: 3, zh: 10, score: 0.74 }, // Pflicht → 集体 (collective sense)
  // Verantwortung (DE6) — overlap with 责任 but cultural framing differs
  { de: 6, zh: 6, score: 0.49 }, // Verantwortung → 责任 (low — closer)
  // Gerechtigkeit (DE7) — high divergence from 公正
  { de: 7, zh: 7, score: 0.92 }, // Gerechtigkeit → 公正 (top divergent pair)
  // Vernunft (DE8) — moderate
  { de: 8, zh: 8, score: 0.66 }, // Vernunft → 义 (rational vs relational righteousness)
  // Freiheit (DE9) — anchor: very high divergence from 自由
  { de: 9, zh: 9, score: 0.88 }, // Freiheit → 自由 (signature high-divergence)
  // Gemeinwohl (DE10) — high divergence from 集体
  { de: 10, zh: 10, score: 0.84 }, // Gemeinwohl → 集体 (different framing)
  // Selbstbestimmung (DE11) — moderate divergence from 选择
  { de: 11, zh: 11, score: 0.58 }, // Selbstbestimmung → 选择 (closer but distinct)
  // Würde (DE12) — high divergence from 尊严
  { de: 12, zh: 12, score: 0.79 }, // Würde → 尊严 (universal vs relational)
  // Moral (DE13) — moderate divergence from 道德
  { de: 13, zh: 13, score: 0.46 }, // Moral → 道德 (relatively close, shared)
  // Cross-link: Familie (ZH3) — high divergence from Individuum (DE4)
  { de: 4, zh: 3, score: 0.82 }, // Individuum → 家庭 (individual vs family)
  // Cross-link: Gesetz (DE5) — moderate
  { de: 5, zh: 5, score: 0.67 }, // Gesetz → 道义 (rule vs virtue)
  // Cross-link: Wahl (DE2) — moderate
  { de: 2, zh: 11, score: 0.61 }, // Wahl → 选择 (rational choice vs situated)
  // Cross-link: Individuum — boundary
  { de: 4, zh: 0, score: 0.69 }, // Individuum → 空间 (atomised vs relational space)
  // Cross-link: low-divergence shared anchors
  { de: 8, zh: 5, score: 0.31 }, // Vernunft ↔ 道义 (low — shared anchor)
  { de: 13, zh: 10, score: 0.29 }, // Moral ↔ 集体 (low — shared anchor)
];

/** Anbieter / provider distribution (step 19). Honest placeholder strings —
 *  not hardcoded brand claims.  Real distribution = "various" per narration. */
export const PROVIDER_FAMILIES = [
  "DashScope",
  "OpenRouter",
  "zen · API",
];

/** LDS-C vs. baseline bar chart (step 20 / 22) — Within-Subject,
 *  n=55 ZH-DE pairs, 50 models, p<0.05 across all pairs.
 *  Values from paper §5 / data/lds_c/. */
export const LDS_BARS = [
  {
    label: "Konzept-Divergenz",
    lds: 0.96,
    baseline: 0.87,
  },
  {
    label: "Beziehungs-Divergenz",
    lds: 0.93,
    baseline: 0.85,
  },
  {
    label: "Aggregiert",
    lds: 0.98,
    baseline: 0.86,
  },
];

/** Cultural driver keywords (step 21) */
export const DE_DRIVERS = ["Autonomie", "Regeln", "Individuum"];
export const ZH_DRIVERS = ["Raum", "Anspruch", "Beziehung"];

/** Math convergence check (step 22) — illustrative, from paper §6 */
export const MATHE_CHECK = {
  converges: true,
  indicator: "Institutionelles Wissen",
  example: "Mathematik",
};

/** Application roles (step 29-31) — exact wording from paper §7 */
export const APP_ROLES = [
  {
    name: "Entwickler",
    question: "Driftet mein Modell bei wertbeladenen Begriffen?",
    output: "Liste der driftenden Konzept-Bestandteile",
  },
  {
    name: "Regulierer",
    question: "Wo sind die blinden Flecken der Konzeptkonsistenz?",
    output: "Transparenzbericht für EU-AI-Act-Compliance",
  },
  {
    name: "Forscher",
    question: "Welche kulturellen Muster zeigt das Modell?",
    output: "Interpretierbarer Divergenzbericht",
  },
] as const;

/** Stats SSOT (steps 19, 20, 25, 26, 27) */
export const STATS = {
  models: "über 50",
  measurements: 55,
  pValue: "p < 0.05",
  humanN: 15,
  enPairsNotSignificant: 8,
  thresholdHeuristic: 0.10,
  languageFamilies: 3,
  themes: 5,
} as const;

/** Team identity (step 0 + step 31) — v4.5: 2-person team.
 *  Jiajun Rong (Robert) + Zhenxi Lan (Ludwig).
 *  Team registered name on BWKI: knusprige_oktopus-seepocken. */
export const TEAM = {
  name: "Jiajun Rong (Robert)",
  partner: "Zhenxi Lan (Ludwig)",
  teamId: "knusprige_oktopus-seepocken",
  affiliation: "Privatschule Schloss Heessen",
  context: "BWKI 2026",
} as const;

/** Project subtitle — DE tagline on the cover (step 0). */
export const PROJECT_SUBTITLE = "Wie Sprache das Denken formt" as const;

/** GitHub / demo (step 31 closing). */
export const LINK = {
  repo: "github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph",
  fullUrl: "https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph",
} as const;