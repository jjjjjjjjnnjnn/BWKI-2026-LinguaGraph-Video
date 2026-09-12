# Assets — Herkunft & Lizenz (v4, 2026-09-11)

> v4 资产台账 — 反映 `/web-video-presentation` 重构后的状态。

## 代码生成的视觉

| 资产 | 来源 | 视觉演示方式 |  |
|---|---|---|---|
| 32 step 视觉 | `presentation/src/chapters/01-linguagraph-pitch/LinguagraphPitch.tsx` + `.css` | 纯 CSS/SVG/Canvas — 自绘 hero、bar chart、概念图网络、节点连接线动画 | eigen | 2026-09-11 |

**实现示例**:

| Step | 视觉演示 |
|---|---|
| 0 (Cover) | masthead + 衬线 italic 大字 hero "LinguaGraph" + accent 划线 + tagline + author/aff |
| 1-2 (Hook) | 三语词卡 FADE IN / 答案分裂对比 |
| 3 (Dasselbe Wort) | "Freiheit / 自由 / freedom" 三语词组聚拢 + 大字 |
| 6-10 (Problem) | global dots / 100% 训练数据 bar / DE·ZH 双卡 / mockup / eval list |
| 11-17 (Methode) | abstract brain / LLM 探针 / 5×3 网格 / arrow / SVG 概念图网络 / LDS 公式 |
| 18-22 (Befund) | "50" hero / 55/50 hero + p tag / DE·ZH 双卡驱动词 / split-screen ✓ vs ⚠ / bar chart |
| 23-26 (Reflexion) | 灰卡 + tone shift / N=15 / 8 EN / 0,10 |
| 27-31 (Anwendung) | "neue Art" hero + 齿轮 / 3 角色卡 (Entwickler·Regulierer·Forscher) + mockups / "LinguaGraph. Sichtbar." + Danke + 链接 |

## 音频

| 资产 | 来源 | 长度 | 备注 |
|---|---|---|---|
| `presentation/public/audio/linguagraph-pitch/1.mp3` (Cover) | edge-tts `de-DE-ConradNeural` | ~6s | 新合成的 cover narration: "Ich bin Jiajun Rong... LinguaGraph macht solche Unterschiede messbar." |
| `presentation/public/audio/linguagraph-pitch/2.mp3 ... 32.mp3` | edge-tts `de-DE-ConradNeural` | 1.8–12.4s/段 | 来自 `docs/narration_de.md`,与 step 视觉 1:1 对齐 |
| `presentation/public/audio/linguagraph-pitch/all.mp3` | `concat-audio.mjs` | 201.43s | ffmpeg concat demuxer (lossless) |

## 框架与字体

| 资产 | 来源 |
|---|---|
| `presentation/src/styles/tokens.css` | `~/.claude/plugins/.../themes/indigo-porcelain/tokens.css` (scaffold 拷入) |
| Google Fonts (Playfair Display italic · Noto Serif SC · IBM Plex Sans · IBM Plex Mono) | 通过 `src/styles/fonts.css` 加载 |

## 截图(Playwright 录制)

| 资产 | 来源 |
|---|---|
| `renders/raw/frames/frame_01.png ... frame_32.png` (1920×1080) | `record.mjs` 手动驱动 32 step,每帧等动画 settle 后截图 |
| `renders/preview/v4_*.png` | 终版 MP4 抽样帧 (5s / 60s / 130s / 195s) |

## 终版产物

| 资产 | 路径 | 大小 | 规格 |
|---|---|---|---|
| ★ 视频 | `renders/final/LinguaGraph_BWKI2026_Pitch.mp4` | 5.09 MB | 1344×768 @ 24fps · H.264+AAC · 201.5s · loudnorm I=-16/TP=-1.5/LRA=11 |
| 中间产物 ( | frames 拼接) | `renders/raw/video.mp4` | — | 临时文件, |

## 复用资产 (Research Repo 只读)

| 来源 | 用法 |
|---|---|
| `BWKI-2026-备战/manifest.json` | 数据 SSOT (556/525/219 · 0.939/0.881) |
| `BWKI-2026-备战/data/lds_c/` | S04 bar chart 数据 (0.93–0.96 vs 0.85–0.87) |
| `BWKI-2026-备战/data/wikipedia_extractions/` | EN 字幕引用源 (v4 未使用字幕,但保留链接) |
| `nach/docs/narration_de.md` | DE 口播稿 SSOT |

## Wikipedia CC-BY-SA 引用 (待上传前手动填入 YouTube/BWKI 描述)

- [ ] Freiheit / 自由 / freedom: ___
- [ ] Gerechtigkeit / 公正 / justice: ___
- [ ] Verantwortung / 责任 / responsibility: ___
- [ ] Heimat / 家 / home: ___
- [ ] Erfolg / 成功 / success: ___

*(URLs aus `BWKI-2026-备战/data/wikipedia_extractions/*/source_url` ziehen)*

## 不使用的资产

- ❌ MiniMax Design 任何视觉 (用户明确不要)
- ❌ stock-footage / stock-images
- ❌ 任何 fake / placeholder logo
- ❌ EN 字幕烧入 (User-Feedback 2026-09-11 删)
- ❌ 音乐 / 背景音 (acoustic clip 直接用 DE 口播)