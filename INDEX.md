# INDEX — Wegweiser durch `nach/` (v11, 2026-09-12)

> 🌐 **[English](README.md)** · [Deutsch](README.de.md) · [中文](README.zh.md)
>
> **双管线组织**（v10 仓库整理）:
> - **最终管线** `renders/final/` — 4 个 ready-to-submit 视频
> - **历史管线** `renders/archive/` — v3-v9 中间产物
>
> **核心视频** (BWKI 提交首选):
> - `renders/final/LinguaGraph_BWKI2026_Pitch.mp4` — 7.75MB · 1344×768 BWKI-spec
> - `renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4` — 15MB · 4K@60fps 用户无损压缩
>
> **合规文档** (v11 新增):
> - [`LICENSE`](LICENSE) · [`LICENSE-THIRD-PARTY.md`](LICENSE-THIRD-PARTY.md) · [`ETHICS.md`](ETHICS.md) · [`CREDITS.md`](CREDITS.md) · [`docs/PRIVACY.md`](docs/PRIVACY.md)

```
nach/
├── README.md                       # 最终版视频清单 + 快速入门
├── INDEX.md                        # 本文件:仓库地图
├── assets_meta.md                  # v4 资产台账 (代码生成 + research repo 引用)
├── outline.md                      # 单章 outline · 32 step · 信息池
├── script.md                       # DE 口播稿 (与 docs/narration_de.md 同源)
│
├── docs/                           # 内容 SSOT + 流水线文档
│   ├── storyboard.md        ★      # 6 幕分镜 (Act-Struktur)
│   ├── narration_de.md      ★      # 德文 Sprechtext (TTS-Quelle)
│   ├── faktencheck.md       ★      # Upload-Sperre (2026-09-11 已签字)
│   ├── subtitles_en.srt            # v7 EN SRT (32 cues · 169.4s 时间轴)
│   ├── subtitles_en_user.srt       # v9 EN SRT (32 cues · 172.97s 时间轴 · 用户剪辑版)
│   ├── subtitles_zh_user.srt       # v9 ZH SRT (32 cues · 172.97s 时间轴 · 用户剪辑版)
│   ├── voice-cloning-feasibility.md # 5 方案对比 (ElevenLabs/Coqui/etc)
│   ├── PIPELINE-v3.md / v4 / v5 / v6 / v7 / v8 / v9.md  # 历史流水线
│   └── PIPELINE-v10.md             # ★ 最新文档（双管线 + 4K 无损压缩版）
│
├── wissen-pack/                    # 项目背景包 (7 文件) — 不变
│
├── presentation/                   # Vite + React + TS 工程 (v9 ship)
│   ├── .theme                       # indigo-porcelain
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx                 # 顶层 stepper + audio + 自动播放
│   │   ├── registry/chapters.ts    # 唯一 chapter 注册
│   │   ├── chapters/
│   │   │   └── 01-linguagraph-pitch/
│   │   │       ├── LinguagraphPitch.tsx     # ★ 32 step 组件
│   │   │       ├── LinguagraphPitch.css     # .lp-* 样式 (token-only)
│   │   │       ├── narrations.ts            # ★ step + 口播 SSOT (32 entry)
│   │   │       └── data.ts                  # 数字 / 节点 / bar 数据
│   │   ├── styles/tokens.css       # indigo-porcelain theme tokens
│   │   ├── styles/base.css         # design system primitives
│   │   └── styles/animations.css   # mask-reveal / rule-grow / stagger
│   ├── scripts/
│   │   ├── extract-narrations.ts   # npm run extract-narrations
│   │   ├── synthesize-audio.sh     # npm run synthesize-audio
│   │   ├── tts-providers/          # minimax.sh · openai.sh · edge-tts.sh
│   │   ├── concat-audio.mjs        # 32 mp3 → all.mp3
│   │   ├── record-video.mjs        # Playwright 录 32 frames (含 v8 PAUSE_MAP)
│   │   ├── post-process.mjs        # frames + audio → final MP4 (v7/v8 pipeline)
│   │   ├── build-subs.mjs          # v7 SRT 生成 (32 mp3 cumulative)
│   │   ├── build-subs-user.mjs     # ★ v9 EN SRT 生成 (ASR 强制对齐)
│   │   ├── translate-subs.mjs      # ★ v9 ZH SRT 翻译
│   │   ├── burn-subs-user.mjs      # ★ v9 字幕烧录 (en/zh 双轨)
│   │   └── remap-audio.mjs         # 重新排序 mp3 (开发工具)
│   └── public/audio/linguagraph-pitch/
│       ├── 1.mp3 ... 32.mp3        # ★ 32 段 TTS (minimax German_FriendlyMan)
│       └── all.mp3                 # concatenated 32 段 = 167.78s
│
├── temp/                           # ★ v10 清空 (中间产物已归档)
│
├── video/                          # v3 旧目录 (历史)
│
└── renders/
    │
    ├── final/                      # ★ 最终管线:4 个 ready-to-submit 视频
    │   ├── README.md               # 4 个视频说明 (用途 · 推荐场景)
    │   ├── LinguaGraph_BWKI2026_Pitch.mp4          # 7.75MB · v7 BWKI-spec
    │   ├── LinguaGraph_BWKI2026_Pitch_4K.mp4       # 15MB · v10 用户无损压缩
    │   ├── LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4  # 25MB · v9 EN 字幕
    │   └── LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4  # 23MB · v9 ZH 字幕
    │
    └── archive/                    # ★ 历史管线:v3-v9 中间产物
        ├── v3/
        │   └── .v3-backup.mp4                    # 13.9MB · v3 备份
        ├── v7/
        │   └── LinguaGraph_BWKI2026_Pitch.mp4   # 7.75MB · v7 副本
        ├── v8/
        │   └── README.md                         # v8 概要 (117.5MB 原版已被 v10 覆盖)
        ├── v9-user-edit/
        │   └── 202609112316.mp4                 # 117.5MB · 用户桌面原版
        ├── preview/                              # preview 抽样帧 (v7 4k + v8-final)
        ├── raw/                                  # 烧录中间产物 (capture.webm + 3 SRT + asr-segments.json)
        └── verify/                               # v8/v9 抽帧验证 PNG
```

## 最终版视频选择指南

| 场景 | 推荐文件 |
|---|---|
| **BWKI 官方提交** | `LinguaGraph_BWKI2026_Pitch.mp4` (1344×768 满足 spec) |
| **4K 高质量放映 / YouTube** | `LinguaGraph_BWKI2026_Pitch_4K.mp4` (15MB 紧凑) |
| **国际评委带字幕** | `LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4` |
| **国内评委带字幕** | `LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4` |
| **总 4 个视频** | ~70MB（邮件 / 网盘轻松分享） |

## Konventionen (verbindlich)

1. **32 step 长度严格相等**:
   - `narrations.ts` 长度 === `LinguagraphPitch.tsx` 中 `if (step === N)` 最大 N + 1
   - mp3 文件名 1-indexed, visual step 0 → `1.mp3`, visual step 1 → `2.mp3`
2. **颜色 / 字体 token-only**: `.lp-*` CSS 必须用 `var(--…)`, 绝不硬编码 hex 或字体名
3. **每步独立视觉**: `if (step === N)` 独占整屏, 视觉演示用 CSS/SVG/Canvas/JS, 禁纯文字
4. **不紫粉渐变 / 圆角彩边 / emoji / 假数据**: placeholder 卡也要诚实
5. **音频 SSOT = mp3 实测时长**: `post-process.mjs` 用 `ffprobe` 读每段时长, 帧停留时长 = 音频时长

## 升级路径

- 想换主题 → `cp themes/<id>/tokens.css presentation/src/styles/tokens.css`
- 想加 step → 同步改 `narrations.ts` (数组追加) + `.tsx` (加 `if (step === N+1)`) + 合成新 mp3 + 重跑 record + post-frames
- 想加字幕 → 在 `post-process.mjs` 的 filter 链加 `subtitles=subtitles_en.srt:force_style='…'`
- 想用 4K 60fps 立体声 → 用 `presentation/scripts/burn-subs-user.mjs` 烧录到 4K 版

## 流水线版本谱系

```
v3 (MiniMax design MP4 · 13.9 MB)            → archive/v3/
v4 (Vite + React TS · 1 Chapter × 32 Step)   → docs/PIPELINE-v4.md
v5 (SideRail + visual polish)
v6 (A/V sync + visualEndMs)                  → docs/PIPELINE-v6.md
v7 (minimax DE voice · 169.4s · 7.75MB)      → final/ + archive/v7/
v8 (PAUSE_MAP 节奏设计 · 212s · 117.5MB)     → archive/v8/README.md
v9 (用户剪辑版 + 双语字幕烧录 · 173s)        → final/ + archive/v9-user-edit/
v10 (用户无损压缩 15MB + 双管线组织)         → ★ 现状
```

## 与 v3 差异

| 项 | v3 (MiniMax + ffmpeg) | v10 (现状) |
|---|---|---|
| 视觉生成 | MiniMax Design 预渲染 MP4 | 每 step 一个 React 组件 + CSS/SVG |
| 音画同步 | ❌ 67.6s visual vs 203s total | ✅ 每 step 精确对齐口播 |
| TTS | 6 段固定 | 32 段 minimax German_FriendlyMan |
| 主题 | MiniMax paper-craft | indigo-porcelain token 系统 |
| 录屏 | 无 | Playwright + PAUSE_MAP 节奏 |
| 字幕 | EN 烧入 | EN + ZH 双轨（v9 字幕版）|
| 最终版时长 | 203s | **172.97s**（v10 用户剪辑）|
| 4K 视频大小 | n/a | **15MB**（v10 无损压缩）|
| 仓库组织 | flat（v3-v9 混在 final/）| **双管线**（final 4 个 + archive 历史）|
