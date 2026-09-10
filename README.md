# LinguaGraph — BWKI 2026 Video-Pitch (nach)

> **Status**: Gerüst / Scaffold (2026-09-10) — noch kein Bild gerendert, kein Ton aufgenommen.
> **Ziel**: 2–4 Min, 1080p, H.264 · DE-Narration + EN-Untertitel · Frist 20.09.2026
> **Narrativ**: v2 AI-Audit-Framing (LLM-as-Subject) + Team/Motivation-Hook + kritische Reflexion
> **Stil**: Apple-Keynote — dunkle Bühne, eine Idee pro Karte, riesige Zahlen, Live-Demo-Moment

## In 30 Sekunden verstehen

1. `docs/storyboard.md` — was der Film zeigt (6 Akte, Bild + Ton + Sekunde)
2. `docs/narration_de.md` — der gesprochene deutsche Text (SSOT für TTS)
3. `video/src/lib/timing.ts` — einzige Stelle, an der Dauern geändert werden
4. `docs/faktencheck.md` — Pflicht-Checkliste vor jedem Upload

## 3 Befehle (nach Setup, siehe `docs/handoff.md`)

```powershell
# 1. Ton erzeugen (liest docs/narration_de.md)
python tooling/tts_edge.py

# 2. Vorschau / Rendern
cd video; npx remotion studio          # Vorschau im Browser
npx remotion render BWKIFinal ../renders/v2/bwki-final-v2.mp4

# 3. Endmontage (Concat + Untertitel + Loudnorm)
.\tooling\assemble.ps1
```

## Repo-Karte → [`INDEX.md`](INDEX.md)

## Fakten-SSOT (nicht hier ändern — Quelle ist das Forschungsrepo)

| Zahl | Wert | Quelle |
|---|---|---|
| Konzepte / Relationen / Gruppen | 556 / 525 / 219 | `BWKI-2026-备战/manifest.json` |
| F1 sozial / gewichtet | 0,939 / 0,881 | Gold-Annotationen (72+20) |
| LLM-Replikation | 51 Messungen / 47 Modelle | `data/lds_c/llm_subject/` |
| Human N=15 | ΔLDS ≈ 0 (Between-Subject, Design-Artefakt) | `docs/paper/` |
| Schwelle ≥ 0,10 | heuristisch, keine validierte Grenze | Paper §8.15 |

## Rote Linien (Details: `docs/faktencheck.md`)

- Kein N=8 (0,70–0,75), kein Sim-Vergleich p=0,05, kein „fertiges Audit-Instrument“.
- Mathe-Konvergenz nur als *indikativ* (P2-Recheck: Alignment-Artefakte).
- Unterstützung (Claude Code, 43+8 Modelle via API, N=15 Eigen-Erhebung) wird im Film offengelegt.
