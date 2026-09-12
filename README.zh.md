# LinguaGraph — BWKI 2026 视频提案

> 🌐 [English](README.md) · [Deutsch](README.de.md) · **[中文](README.zh.md)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![BWKI 2026](https://img.shields.io/badge/BWKI-2026-blue.svg)](https://www.bwki.de)
[![状态: v10](https://img.shields.io/badge/version-v10-green.svg)](docs/PIPELINE-v10.md)
[![GDPR: 合规](https://img.shields.io/badge/GDPR-合规-success.svg)](docs/PRIVACY.md)

一个 **3 分钟 Web 视频提案**，讲解 **LinguaGraph** —— 一种新的 AI 审计方法，测量大语言模型（LLM）中语言特定概念图之间的结构性分歧。

由 **Jiajun Rong**（德国 Privatschule Schloss Heessen）提交给 **BWKI 2026**（德国联邦人工智能竞赛）。

---

## 🎬 什么是 LinguaGraph？

当同一个 LLM 用不同语言被问同一个问题时，它的意思相同吗？LinguaGraph 从 LLM 回答中抽取 **概念图**，测量 **55 次测量 × 50 个模型** 的结构性分歧。我们发现：

- **中德**概念图 **显著分歧**（全部 55 对 p<0.05）
- 分歧是 **文化上有模式的**（德语：自主 + 规则 · 中文：空间 + 追求）
- 制度性知识（数学）跨语言 **趋同**（indikativ, 详见论文 §3.8）

这是一种 **新的 AI 审计方式** —— 不是为了任务完成度，而是为了价值概念跨语言的一致性。

---

## 📺 最终版视频

| 文件 | 大小 | 时长 | 推荐用途 |
|---|---|---|---|
| [`LinguaGraph_BWKI2026_Pitch.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch.mp4) | 7.75 MB | 169.4s | ★ **BWKI-spec 提交**（1344×768 @ 24fps）|
| [`LinguaGraph_BWKI2026_Pitch_4K.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4) | **15 MB** | 172.97s | ★ **4K 母版**（无损，60fps，立体声）|
| [`LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4) | 24 MB | 172.97s | 4K + **英文字幕** |
| [`LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4) | 23 MB | 172.97s | 4K + **中文字幕** |

> 合计 ~70 MB。详见 [`renders/final/README.md`](renders/final/README.md)。

---

## 🚀 快速开始（重现视频）

```bash
git clone https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video.git
cd BWKI-2026-LinguaGraph-Video/presentation

# 1. 安装依赖
npm install

# 2. 提取 narrations（SSOT 在 src/chapters/01-linguagraph-pitch/narrations.ts）
npm run extract-narrations

# 3. 合成 DE 配音（需要 minimax API）
PRESENTATION_TTS=minimax-clean npm run synthesize-audio -- --voice=German_FriendlyMan

# 4. 合并音频
node scripts/concat-audio.mjs

# 5. 录制视频（Playwright + Chromium, headless）
node scripts/record-video.mjs

# 6. 后期处理（loudnorm, scale, encode）
node scripts/post-process.mjs

# 可选 v9: 生成 EN/ZH 字幕并烧录
node scripts/build-subs-user.mjs
node scripts/translate-subs.mjs
node scripts/burn-subs-user.mjs en
node scripts/burn-subs-user.mjs zh
```

> 完整流水线历史见 [`docs/PIPELINE-v9.md`](docs/PIPELINE-v9.md) 和 [`docs/PIPELINE-v10.md`](docs/PIPELINE-v10.md)。

---

## 📚 文档

| 文档 | 用途 |
|---|---|
| [`INDEX.md`](INDEX.md) | 仓库地图（双管线：最终 + 归档）|
| [`docs/PIPELINE-v10.md`](docs/PIPELINE-v10.md) | ★ 最新流水线（v10 — 4K 无损 + 双管线）|
| [`docs/PIPELINE-v9.md`](docs/PIPELINE-v9.md) | v9 — 双语字幕流水线 |
| [`docs/PIPELINE-v8.md`](docs/PIPELINE-v8.md) | v8 — 节奏设计 |
| [`docs/PIPELINE-v7.md`](docs/PIPELINE-v7.md) | v7 — minimax TTS + A/V 同步修复 |
| [`docs/faktencheck.md`](docs/faktencheck.md) | 事实核查（德语）— 上传门禁 |
| [`docs/voice-cloning-feasibility.md`](docs/voice-cloning-feasibility.md) | TTS 调研（5 个提供商）|
| [`docs/PRIVACY.md`](docs/PRIVACY.md) | GDPR 合规（N=15 + 数据主体权利）|
| [`docs/narration_de.md`](docs/narration_de.md) | DE 口播稿 SSOT |
| [`docs/storyboard.md`](docs/storyboard.md) | 6 幕分镜 |

---

## ⚖️ 合规与致谢

- **许可证**：[MIT](LICENSE) — Copyright © 2026 Jiajun Rong
- **第三方致谢**：[LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md) — 所有引用项目、服务、API、数据集和资产的完整清单
- **伦理与 AI 披露**：[ETHICS.md](ETHICS.md) — 使用的 AI 工具、GDPR、匿名化
- **隐私 / GDPR**：[docs/PRIVACY.md](docs/PRIVACY.md) — 数据主体权利、保留期
- **致谢**：[CREDITS.md](CREDITS.md) — 作者感谢

### 关键披露
- DE 配音是 **合成 TTS**（minimax `German_FriendlyMan`），**非克隆人声**
- Wikipedia 内容采用 **CC-BY-SA 4.0**（视频描述中的源 URL）
- **N=15 人体实验**符合 GDPR，附书面知情同意书（详见 [PRIVACY.md](docs/PRIVACY.md)）
- 使用的 AI 工具：**Anthropic Claude Code**（代码 + 文本）+ minimax（TTS）+ faster-whisper（ASR）

---

## 🗂 仓库结构

```
nach/
├── README.md (英文) · README.de.md · README.zh.md  ← 三语
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

## 📊 项目状态

| 组件 | 状态 | 日期 |
|---|---|---|
| 研究（`BWKI-2026-备战`）| ✅ Shipped v0.14.1 | 2026-08-09 |
| 视频提案 | ✅ Shipped v10 | 2026-09-12 |
| EN/ZH 字幕 | ✅ Shipped v9 | 2026-09-12 |
| 合规文档 | ✅ v11 | 2026-09-12 |
| BWKI 2026 提交截止 | 📅 2026-09-20 | — |

---

## 📞 联系方式

- **GitHub** :[@jjjjjjjjnnjnn](https://github.com/jjjjjjjjnnjnn)
- **仓库**：https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video
- **Issues**：https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video/issues

---

<sub>MIT 许可证 · © 2026 Jiajun Rong · 在德国 Hamm 用 ❤️ 制作</sub>
