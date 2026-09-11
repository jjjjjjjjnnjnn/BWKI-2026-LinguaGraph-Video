# LinguaGraph — BWKI 2026 Video-Pitch

> **Status**: v4 · fertig (2026-09-11) · **5.09 MB** · **201.5s** · H.264+AAC · **ohne Untertitel** (per User-Feedback)
> **Architektur**: `/web-video-presentation` — Vite + React + TS · 1 Chapter × 32 Step · indigo-porcelain Theme · per-step 自绘 CSS/SVG
> **Deadline**: 2026-09-20

## 4 Befehle

```bash
cd "C:/Users/rongj/Desktop/学校/BWKI 介绍/nach/presentation"

# 1. Audio synthetisieren (32 mp3 via edge-tts de-DE-ConradNeural)
PRESENTATION_TTS=edge-tts PRESENTATION_TTS_VOICE=de-DE-ConradNeural \
  bash scripts/synthesize-audio.sh

# 2. Audio zu einem Track zusammenhängen
node scripts/concat-audio.mjs

# 3. 32 Frames mit Playwright headless aufnehmen
node scripts/record.mjs

# 4. Frames + Audio zu finalem MP4 zusammenbauen (loudnorm + 1344×768@24fps)
node scripts/post-frames.mjs
# → renders/final/LinguaGraph_BWKI2026_Pitch.mp4
```

> Erforderlich für Schritt 3: `npx playwright install chromium` (einmalig).
> Schritt 1-4 sind nur nach Narrations-Änderungen nötig; in der Regel reicht 3+4.

## Repo-Karte → [`INDEX.md`](INDEX.md) · Pipeline-Doku → [`docs/PIPELINE-v4.md`](docs/PIPELINE-v4.md)

## Fakten-SSOT (nicht hier ändern — Quelle ist das Forschungsrepo)

| Zahl | Wert | Quelle |
|---|---|---|
| Konzepte / Relationen / Gruppen | 556 / 525 / 219 | `BWKI-2026-备战/manifest.json` |
| F1 sozial / gewichtet | 0,939 / 0,881 | Gold-Annotationen (72+20) |
| LLM-Replikation | 55 Messungen / 50 Modelle | `data/lds_c/llm_subject/` |
| Human N=15 | ΔLDS ≈ 0 (Between-Subject, Design-Artefakt) | `docs/paper/` |
| LDS-C vs. Boden | 0,93–0,96 vs. 0,85–0,87 | Within-Subject Basismodell |
| Schwelle ≥ 0,10 | heuristisch, keine validierte Grenze | Paper §8.15 |

## Rote Linien (Details: `docs/faktencheck.md`)

- Kein N=8 (0,70–0,75), kein Sim-Vergleich p=0,05, kein „fertiges Audit-Anstrument"
- Mathe-Konvergenz nur als *indikativ* (P2-Recheck: Alignment-Artefakte)
- Offenlegung im Film/Beschreibung: Claude Code, 42 DashScope- + 7 zen/OpenRouter-Modelle + D1 + Kilo/Cohere/NIM/opencode (55 Messungen / 50 Modelle), N=15 Eigen-Erhebung
- Wikipedia CC-BY-SA: Quellenartangte in Videobeschreibung verlinken (TODO vor Upload)
- **v4-Entscheidung**: KEINE eingebrannten Untertitel (User-Feedback 2026-09-11) — DA-Video, deutscher Originalton, internationale Jury erwartet entweder DE-Audio oder keine Subs; DA-Narration spricht für sich