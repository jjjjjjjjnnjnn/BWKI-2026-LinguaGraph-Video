# Third-Party Notices

> This file lists all third-party software, services, APIs, datasets, and assets used by
> the **LinguaGraph BWKI 2026 Video** project. All rights belong to their respective owners.

---

## 1. Cloud Services & APIs (Runtime)

| Service | Version | Purpose | License / Terms | URL |
|---|---|---|---|---|
| **minimax (mmx-cli)** | API | TTS for DE voice-over (v7, 32 mp3) | Proprietary — see vendor ToS | https://minimax.io |
| **edge-tts** | API | TTS backup (v6, deprecated) | Microsoft Public | https://github.com/rany2/edge-tts |
| **Anthropic Claude Code** | n/a | Code + text generation (project scaffold) | Proprietary | https://www.anthropic.com/claude-code |
| **Systran faster-whisper** | 1.2.1 | ASR for v9 subtitle timing alignment | MIT | https://github.com/Systran/faster-whisper |
| **ffmpeg** | 8.1.1 | Video processing (loudnorm, trim, burn subtitles) | LGPL 2.1+ / GPL 2+ | https://ffmpeg.org |
| **Playwright + Chromium** | latest | Headless browser recording (v5–v8) | Apache 2.0 | https://playwright.dev |

---

## 2. NPM Dependencies (presentation/package.json)

### Production
| Package | License | URL |
|---|---|---|
| react | MIT | https://react.dev |
| react-dom | MIT | https://react.dev |

### Development
| Package | License | URL |
|---|---|---|
| vite | MIT | https://vitejs.dev |
| @vitejs/plugin-react | MIT | https://github.com/vitejs/vite-plugin-react |
| typescript | Apache 2.0 | https://www.typescriptlang.org |
| @types/node | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/react | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/react-dom | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| esbuild | MIT | https://github.com/evanw/esbuild |
| lightningcss | MPL-2.0 | https://github.com/parcel-bundler/lightningcss |

### Auto-installed subdependencies
| Package | License | URL |
|---|---|---|
| @esbuild/win32-x64 | MIT | https://github.com/evanw/esbuild |
| lightningcss-win32-x64-msvc | MPL-2.0 | https://github.com/parcel-bundler/lightningcss |
| nanoid | MIT | https://github.com/ai/nanoid |
| fdir | MIT | https://github.com/thecodrr/fdir |
| @oxc-project/oxlint | MIT | https://github.com/oxc-project/oxc |
| detect-libc | Apache 2.0 | https://github.com/lovell/detect-libc |
| csstype | MIT | https://github.com/frenic/csstype |
| tsx | MIT | https://github.com/esbuild-kit/tsx |

> Complete dependency tree: see `presentation/package-lock.json`.

---

## 3. TTS Research (Not Used in Final Video)

These were evaluated in `docs/voice-cloning-feasibility.md` but **not adopted** in the final video.
The video uses **minimax `German_FriendlyMan`** (synthetic voice, not cloning).

| Service | License | URL | Notes |
|---|---|---|---|
| ElevenLabs Instant Voice Clone | Proprietary | https://elevenlabs.io | Recommended path (requires paid API) |
| Coqui XTTS v2 | CPML (non-commercial) | https://github.com/coqui-ai/TTS | Open-source backup |
| OpenVoice v2 | MIT | https://github.com/myshell-ai/OpenVoice | Evaluated, not recommended |
| F5-TTS | MIT | https://github.com/SWivid/F5-TTS | Evaluated, not recommended for DE |

---

## 4. Data Sources

### Wikipedia (CC-BY-SA 4.0)
- **Source articles**: extracted from Chinese + German Wikipedia for concept-grounded prompts
- **License**: Creative Commons Attribution-ShareAlike 4.0 International
- **Attribution**: All source article URLs are listed in `docs/faktencheck.md` and the video description
- **More info**: https://creativecommons.org/licenses/by-sa/4.0/

### LLM Subjects (55 Measurements / 50 Models)
The video's research methodology used the following model providers via API:

| Provider | Models | Purpose |
|---|---|---|
| **DashScope (Alibaba)** | 42 Qwen-series models | Primary Chinese LLM subjects |
| **OpenRouter / zen** | 7 mixed-provenance models | Cross-provider control |
| **Kilo** | 2 models | Secondary replication |
| **Cohere** | 1 model | Western control |
| **NIM (NVIDIA)** | 1 model | Western control |
| **opencode-go** | 1 model | Reference baseline |
| **D1 (DeepSeek)** | 1 baseline | Reference baseline |
| **Poolside / OpenAI weights / NVIDIA / luna** | 7 western measurements | US-American model claims |

> Total: 55 measurements × 50 models. All ZH-DE pairs p<0.05. 8 EN-containing pairs not significant.
> Full data: see `BWKI-2026-备战/` commit `3dd70bd` (v0.14.1).

### Human Subjects (N=15)
- **N=15 German-speaking participants** recruited by the author
- **GDPR-compliant**: written informed consent (`Einwilligung`) obtained from all 15
- **Design**: between-subject design with 8 EN-containing pairs (no language signal in human data — disclosed as design artifact in the video)
- See [`docs/PRIVACY.md`](docs/PRIVACY.md) for full GDPR compliance details.

---

## 5. Assets

The final video contains **no third-party media assets** (no stock footage, no third-party music,
no third-party images). All visuals are produced from CSS + SVG + JS via the React pipeline in
`presentation/src/`. The DE voice-over is **fully synthetic TTS** (minimax `German_FriendlyMan`).

See [`assets_meta.md`](assets_meta.md) for the asset registry.

---

## 6. Main Project Reference

- **`BWKI-2026-备战/`** — Forschungs-Repository (commit `3dd70bd` v0.14.1)
- This video pitch project (`nach/`) consumes data + claims from `BWKI-2026-备战/`
- Both projects are authored by Jiajun Rong (Privatschule Schloss Heessen, Germany)

---

## 7. SSOT Discipline

Numbers and claims in the video are cross-checked against:
- `BWKI-2026-备战/manifest.json` (556 concepts / 525 relations / 219 groups)
- `BWKI-2026-备战/data/lds_c/` (LLM measurements)
- `BWKI-2026-备战/docs/paper/` (formal paper)

See [`docs/faktencheck.md`](docs/faktencheck.md) for the full fact-check (upload-sperre).

---

## 8. Authoring Tools

- **AI-assisted coding**: Anthropic Claude Code (https://www.anthropic.com/claude-code)
- **IDE**: VS Code (https://code.visualstudio.com)
- **Source control**: Git (https://git-scm.com)
- **Hosting**: GitHub (https://github.com)

---

*Last updated: 2026-09-12 · v11*
