# Ethics & Compliance — LinguaGraph BWKI 2026

> This document discloses all ethical considerations, AI usage, data sources, and compliance
> measures for the **LinguaGraph BWKI 2026 Video** project. Maintained per the project's
> upload-sperre protocol (`docs/faktencheck.md`).

---

## 1. AI-Assisted Authorship (Disclosure)

### 1.1 Code Generation
- **Tool**: Anthropic **Claude Code** (https://www.anthropic.com/claude-code)
- **Scope**: All React/Vite/TypeScript code in `presentation/src/`, all build scripts in
  `presentation/scripts/`, all documentation in `docs/`, all project scaffolding
- **Human oversight**: Every line of generated code was reviewed, tested, and modified by
  the human author (Jiajun Rong) before commit

### 1.2 Text Generation
- **Tool**: Anthropic Claude Code (same as above)
- **Scope**: German narration text in `docs/narration_de.md`, English subtitle translations in
  `docs/subtitles_en.srt` / `subtitles_en_user.srt`, Chinese subtitle translations in
  `docs/subtitles_zh_user.srt`, all `docs/PIPELINE-v*.md` documents
- **Human oversight**: All narration text was sourced from the original German pitch script
  (`nach/script.md` / `BWKI-2026-备战/submission/pitch/video_script.md`); AI was used only for
  refinement, not invention

### 1.3 Voice-Over (TTS)
- **Tool**: **minimax `German_FriendlyMan`** (https://minimax.io) — synthetic TTS voice
- **NOT** a cloned human voice: The DE voice-over in this video is **fully synthetic**
- **No human voice recording** was used in this project
- See [`docs/voice-cloning-feasibility.md`](docs/voice-cloning-feasibility.md) for the TTS
  research that led to choosing minimax over ElevenLabs voice cloning

### 1.4 Video Subtitles
- **Tool**: Anthropic Claude Code (for ZH translation)
- **English subtitles**: Manually translated by the human author from the German narration
- **Chinese subtitles**: First-draft machine-translated from English, then reviewed by the
  human author
- **Timing alignment**: Generated via **Systran faster-whisper** ASR (MIT) on the manually
  cut 173-second video — see `docs/PIPELINE-v9.md` for details

---

## 2. Data Sources & GDPR Compliance

### 2.1 LLM Subject Data (55 Measurements / 50 Models)
- **Source**: Public API responses from 7 LLM providers (DashScope, OpenRouter, Kilo,
  Cohere, NIM, opencode-go, D1-baseline)
- **Privacy**: No personal data involved; all 50 models are public commercial / open-source
  LLMs
- **Compliance**: All API calls were within each provider's terms of service at the time
  of research (2025–2026)

### 2.2 Wikipedia Data (CC-BY-SA 4.0)
- **Source articles**: Chinese + German Wikipedia (public domain knowledge)
- **License**: Creative Commons Attribution-ShareAlike 4.0 International
- **Attribution**: All source article URLs are listed in the video description and
  `docs/faktencheck.md`
- **Compliance**: CC-BY-SA 4.0 permits reuse with attribution + share-alike (the video
  project uses a stricter MIT license for code, but the underlying Wikipedia content
  remains CC-BY-SA as per the upstream license)

### 2.3 Human Subjects (N=15) — GDPR-Compliant
> See [`docs/PRIVACY.md`](docs/PRIVACY.md) for the full GDPR compliance report.

- **N=15** German-speaking participants, recruited by the author
- **GDPR Article 6 (Lawful basis)**: Explicit written informed consent (`Einwilligung`)
  obtained from all 15 participants before data collection
- **GDPR Article 5 (Data minimisation)**: Only the minimum required data collected (no
  personally identifying information stored alongside responses)
- **GDPR Article 17 (Right to erasure)**: Participants were informed of their right to
  withdraw at any time; no participant has requested withdrawal as of 2026-09-12
- **GDPR Article 32 (Security)**: All responses stored on encrypted local disk; no cloud
  upload of raw human data
- **Result**: N=15 design showed no language signal under between-subject conditions — this
  result is **disclosed in the video as a design artifact, not as counter-evidence** (per
  `docs/faktencheck.md` § "Verbotene Behauptungen")

---

## 3. Privacy by Design

- **No tracking**: The video has no analytics, no telemetry, no cookies, no third-party
  scripts
- **No user data**: The video does not collect, transmit, or store any user data
- **Offline viewing**: The MP4 files play in any standard video player with zero
  network dependencies
- **No third-party assets**: The video contains zero third-party media (no stock footage,
  no third-party music, no third-party images — all visuals are CSS + SVG + JS)

---

## 4. Numbers & Claims Integrity

All numbers and claims in the video are cross-checked against the Forschungs-SSOT
(`BWKI-2026-备战/` commit `3dd70bd` v0.14.1). The fact-check log is in
[`docs/faktencheck.md`](docs/faktencheck.md). No fabricated or speculative data appears in
the video.

**Known simplifications** (disclosed in video description):
- S04 narration "auch auf ein US-amerikanisches Modell" (singular) — actually 7 western
  measurements (NVIDIA×2, Poolside×2, OpenAI-weights, Cohere, luna; paper §5.10)
- S04 "Institutionelles Wissen konvergiert" without "indikativ" qualifier — counter to
  P2-Recheck (paper §3.8): math nodes are alignment labels; size-matching reverses the
  pattern

---

## 5. Author Identity

- **Name**: Jiajun Rong (戎家俊)
- **Affiliation**: Privatschule Schloss Heessen, Germany (independent student researcher)
- **Contact**: GitHub @jjjjjjjjnnjnn
- **Submission**: BWKI 2026 (Bundeswettbewerb Künstliche Intelligenz)

---

## 6. Contact

For ethical concerns, GDPR data subject requests, or general inquiries about this project:
- **GitHub Issues**: https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video/issues

---

*Last updated: 2026-09-12 · v11*
