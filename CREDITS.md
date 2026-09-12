# CREDITS — LinguaGraph BWKI 2026

> Acknowledgments for the **LinguaGraph BWKI 2026 Video** project.

---

## Author

**Jiajun Rong** (戎家俊)  
Privatschule Schloss Heessen, Germany  
GitHub: [@jjjjjjjjnnjnn](https://github.com/jjjjjjjjnnjnn)

---

## Cloud Services

- **[minimax](https://minimax.io)** — DE voice-over (TTS, `German_FriendlyMan`)
- **[Anthropic Claude Code](https://www.anthropic.com/claude-code)** — AI-assisted code + text
- **[Systran faster-whisper](https://github.com/Systran/faster-whisper)** — ASR for subtitle timing alignment (v9)
- **[ffmpeg](https://ffmpeg.org)** — Video processing (loudnorm, trim, burn subtitles)

---

## Open-Source Libraries

- **[React](https://react.dev)** + **[Vite](https://vitejs.dev)** + **[TypeScript](https://www.typescriptlang.org)** — Frontend stack
- **[Playwright](https://playwright.dev)** + **[Chromium](https://www.chromium.org)** — Headless browser recording
- **[esbuild](https://github.com/evanw/esbuild)** + **[Lightning CSS](https://github.com/parcel-bundler/lightningcss)** — Build pipeline
- **[edge-tts](https://github.com/rany2/edge-tts)** — TTS backup (v6, deprecated)

---

## LLM Subject Providers (55 Measurements / 50 Models)

The video's research methodology used 50 LLM models from 7 providers. The author thanks:

- **[Alibaba DashScope](https://dashscope.aliyun.com)** — 42 Qwen-series models
- **[OpenRouter](https://openrouter.ai)** — 7 mixed-provenance models
- **[Kilo](https://kilo.ai)** — 2 models
- **[Cohere](https://cohere.com)** — 1 model
- **[NVIDIA NIM](https://www.nvidia.com/en-us/ai-models)** — 1 model
- **[opencode-go](https://github.com/opencode-ai)** — 1 model
- **[DeepSeek](https://www.deepseek.com)** — 1 D1-baseline model

> Total: 55 measurements × 50 models. All ZH-DE pairs p<0.05. 8 EN-containing pairs not
> significant (disclosed in video).

---

## Human Subjects

**N=15 participants** — German-speaking volunteers from Privatschule Schloss Heessen. All
provided written informed consent per GDPR Article 6(1)(a). Their anonymised responses are
the basis for the N=15 design finding disclosed in the video.

---

## Main Project Reference

This video pitch project (`nach/`) consumes data + claims from the main research repository:

- **[BWKI-2026-备战](https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video)** — Forschungs-SSOT
  (commit `3dd70bd` v0.14.1)

---

## Inspiration

- The **LDS (Linguistic Divergence Score)** metric is the author's original work
- The **concept graph extraction** approach is inspired by OpenIE / BabelNet / ConceptNet
  literature
- The **controlled subject** experimental design follows conventions from cognitive science
  (between-subject vs within-subject)

---

## BWKI 2026

This video was produced for the **Bundeswettbewerb Künstliche Intelligenz (BWKI)** 2026,
organised by the German Federal Ministry of Education and Research (BMBF).

- https://www.bwki.de

---

## Open-Source Contributors

This project builds on the work of hundreds of open-source contributors. See
[`LICENSE-THIRD-PARTY.md`](LICENSE-THIRD-PARTY.md) for the full list.

---

*Last updated: 2026-09-12 · v11*
