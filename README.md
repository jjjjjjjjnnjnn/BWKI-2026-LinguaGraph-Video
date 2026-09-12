# LinguaGraph — BWKI 2026 Video Pitch

> 🌐 **[English](README.md)** · [Deutsch](README.de.md) · [中文](README.zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![BWKI 2026](https://img.shields.io/badge/BWKI-2026-blue.svg)](https://www.bwki.de)
[![Status: v10](https://img.shields.io/badge/version-v10-green.svg)](docs/PIPELINE-v10.md)
[![GDPR: Compliant](https://img.shields.io/badge/GDPR-Compliant-success.svg)](docs/PRIVACY.md)

A **3-minute web video pitch** explaining **LinguaGraph**, a new AI audit method that measures
structural divergence between language-specific concept graphs in large language models (LLMs).

Submitted to **BWKI 2026** (Bundeswettbewerb Künstliche Intelligenz) by **Jiajun Rong**,
Privatschule Schloss Heessen, Germany.

---

## 🎬 What is LinguaGraph?

When the same LLM is asked the same question in different languages, does it mean the
same thing? LinguaGraph extracts **concept graphs** from LLM responses and measures
structural divergence across 55 measurements × 50 models. We found that:

- **Chinese–German** concept graphs **diverge significantly** (all 55 pairs p<0.05)
- The divergence is **culturally patterned** (German: autonomy + rules · Chinese: space +
  aspiration)
- Institutional knowledge (mathematics) **converges** across languages (indicative, see
  paper §3.8)

This is a **new kind of AI audit** — not for task completion, but for **value-concept
consistency** across languages.

---

## 📺 Final Videos

| File | Size | Duration | Recommended Use |
|---|---|---|---|
| [`LinguaGraph_BWKI2026_Pitch.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch.mp4) | 7.75 MB | 169.4s | ★ **BWKI-spec submission** (1344×768 @ 24fps) |
| [`LinguaGraph_BWKI2026_Pitch_4K.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4) | **15 MB** | 172.97s | ★ **4K master** (lossless, 60fps, stereo) |
| [`LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4) | 24 MB | 172.97s | 4K + **English** subtitles |
| [`LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4) | 23 MB | 172.97s | 4K + **Chinese** subtitles |

> Total ~70 MB. See [`renders/final/README.md`](renders/final/README.md) for full details.

---

## 🚀 Quickstart (Reproduce the Video)

```bash
git clone https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video.git
cd BWKI-2026-LinguaGraph-Video/presentation

# 1. Install dependencies
npm install

# 2. Extract narrations (already done; SSOT in src/chapters/01-linguagraph-pitch/narrations.ts)
npm run extract-narrations

# 3. Synthesise DE voice (minimax API required)
PRESENTATION_TTS=minimax-clean npm run synthesize-audio -- --voice=German_FriendlyMan

# 4. Concatenate audio
node scripts/concat-audio.mjs

# 5. Record video (Playwright + Chromium, headless)
node scripts/record-video.mjs

# 6. Post-process (loudnorm, scale, encode)
node scripts/post-process.mjs

# Optional v9: generate EN/ZH subtitles and burn
node scripts/build-subs-user.mjs
node scripts/translate-subs.mjs
node scripts/burn-subs-user.mjs en
node scripts/burn-subs-user.mjs zh
```

> See [`docs/PIPELINE-v9.md`](docs/PIPELINE-v9.md) and [`docs/PIPELINE-v10.md`](docs/PIPELINE-v10.md)
> for the full pipeline history.

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| [`INDEX.md`](INDEX.md) | Repository map (dual-pipeline: final + archive) |
| [`docs/PIPELINE-v10.md`](docs/PIPELINE-v10.md) | ★ Latest pipeline (v10 — 4K lossless + dual-pipeline) |
| [`docs/PIPELINE-v9.md`](docs/PIPELINE-v9.md) | v9 — bilingual subtitle pipeline |
| [`docs/PIPELINE-v8.md`](docs/PIPELINE-v8.md) | v8 — pacing rhythm design |
| [`docs/PIPELINE-v7.md`](docs/PIPELINE-v7.md) | v7 — minimax TTS + A/V sync fix |
| [`docs/faktencheck.md`](docs/faktencheck.md) | Fact-check (German) — upload-sperre |
| [`docs/voice-cloning-feasibility.md`](docs/voice-cloning-feasibility.md) | TTS research (5 providers) |
| [`docs/PRIVACY.md`](docs/PRIVACY.md) | GDPR compliance (N=15 + data subject rights) |
| [`docs/narration_de.md`](docs/narration_de.md) | DE narration SSOT |
| [`docs/storyboard.md`](docs/storyboard.md) | 6-act storyboard |

---

## ⚖️ Compliance & Credits

- **License**: [MIT](LICENSE) — Copyright © 2026 Jiajun Rong
- **Third-party credits**: [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md) — full list of all
  cited projects, services, APIs, datasets, and assets
- **Ethics & AI disclosure**: [ETHICS.md](ETHICS.md) — AI tools used, GDPR, anonymisation
- **Privacy / GDPR**: [docs/PRIVACY.md](docs/PRIVACY.md) — data subject rights, retention
- **Acknowledgments**: [CREDITS.md](CREDITS.md) — author thanks

### Key Disclosures
- The DE voice-over is **synthetic TTS** (minimax `German_FriendlyMan`), **not a cloned human voice**
- Wikipedia content used under **CC-BY-SA 4.0** (source URLs in video description)
- **N=15 human experiment** is GDPR-compliant with written informed consent (see [PRIVACY.md](docs/PRIVACY.md))
- AI tools used: **Anthropic Claude Code** (code + text) + minimax (TTS) + faster-whisper (ASR)

---

## 🗂 Repository Structure

```
nach/
├── README.md (this) · README.de.md · README.zh.md  ← 三语
├── LICENSE · LICENSE-THIRD-PARTY.md · ETHICS.md · CREDITS.md
├── INDEX.md                                            ← 仓库地图
├── docs/                                               ← 文档 SSOT
│   ├── PIPELINE-v3-v10.md                              ← 流水线历史
│   ├── faktencheck.md · PRIVACY.md · narration_de.md
│   └── subtitles_*.srt                                ← 字幕源
├── presentation/                                       ← Vite + React + TS 工程
│   ├── src/chapters/01-linguagraph-pitch/             ← 32 step 组件
│   ├── scripts/                                        ← 录屏 + 后期 + 字幕
│   └── public/audio/linguagraph-pitch/1.mp3 .. 32.mp3 ← 32 段 TTS
└── renders/
    ├── final/         ← 最终管线:4 个 mp4 + README.md
    └── archive/       ← 历史管线:v3-v9 归档
```

---

## 📊 Project Status

| Component | Status | Date |
|---|---|---|
| Research (`BWKI-2026-备战`) | ✅ Shipped v0.14.1 | 2026-08-09 |
| Video pitch | ✅ Shipped v10 | 2026-09-12 |
| EN/ZH subtitles | ✅ Shipped v9 | 2026-09-12 |
| Compliance docs | ✅ v11 | 2026-09-12 |
| BWKI 2026 submission deadline | 📅 2026-09-20 | — |

---

## 📞 Contact

- **GitHub**: [@jjjjjjjjnnjnn](https://github.com/jjjjjjjjnnjnn)
- **Repository**: https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video
- **Issues**: https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video/issues

---

<sub>MIT License · © 2026 Jiajun Rong · Made with ❤️ in Hamm, Germany</sub>
