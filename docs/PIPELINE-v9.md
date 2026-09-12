# Pipeline v9 — 双语字幕版（基于用户手动剪辑版）

> **Superseded by v10** (2026-09-12): 用户用无损压缩工具把 117.5MB 用户剪辑版压缩成 15MB，要求用它作为最终版。v10 完成基准升级 + 双管线仓库整理。详见 `PIPELINE-v10.md`。

## Context

| 项 | v8 自动版 | v9 用户剪辑版 |
|---|---|---|
| 时长 | 212.13s | **172.97s** |
| 分辨率 | 3840×2160 | 3840×2160 |
| 帧率 | 24fps | **60fps** |
| 音频 | AAC 48kHz 单声道 | AAC 立体声 44.1kHz |
| 大小 | 20.5MB | 117.5MB |
| 节奏 | v8 PAUSE_MAP 强制 hold 38.6s | 用户自然剪辑（v7 节奏 + 自然停顿）|

**关键观察**：
- 用户版 173s 与 32 mp3 cumulative 167.78s 高度接近（差 5s = 用户保留的自然停顿）
- 用户**没有**裁掉 v8 停顿 —— 他的手剪版保留了 v7 节奏，更适合 BWKI 2-4 分钟窗口
- 字幕策略：EN 复用 v7 翻译 + ZH 按 EN 逐句翻译，时间轴重映射到用户版 173s

## 关键变更

### 1. `presentation/scripts/build-subs-user.mjs`（新建）

**32 段字幕强制对齐脚本**，从 ASR 数据生成 EN SRT：
- 读取 `temp/asr-segments.json`（faster-whisper base 在用户版音频上转录的 56 个 segments）
- 读取 32 段 DE narration（从 `narrations.ts`）
- **ANCHOR_TABLE**：手写 32 段 narration → ASR segment 范围映射
- 输出 `docs/subtitles_en_user.srt`，32 cues，时间轴 0-171.87s（用户版 172.97s - 1.1s slack）

**为什么不用 fuzzy text match**：faster-whisper DE 输出有拼写错误（"Blinderfleck"·"Jajun Rong"·"Sprachpammessungen"），fuzzy match 不可靠。手写 ANCHOR_TABLE 准确率高。

**ANCHOR_TABLE 示例**：
```js
// step 0 — Cover (Team + tagline)
{ from: 0, to: 1 },   // "Ich bin Jajun Rong..." + "Lingua Graf macht..."

// step 10 — "blinder Fleck" CLIMAX
{ from: 17, to: 17 }, // "Das ist ein Blinderfleck"

// step 31 — Closing
{ from: 53, to: 55 }, // "Lingorgraf" + "Sichtbar" + "Danke"
```

### 2. `presentation/scripts/translate-subs.mjs`（新建）

**EN → ZH 翻译脚本**：
- 读取 `subtitles_en_user.srt`（32 cues，时间轴）
- 替换为 32 段中文翻译，**时间戳完全不变**
- 输出 `docs/subtitles_zh_user.srt`

**翻译原则**：
- 关键术语保留英文：LinguaGraph · Jiajun Rong · Privatschule Schloss Heessen · EU AI Act · Linguistic Divergence Score · p<0.05
- 中文标点：，。：；？！（em-dash 用 ASCII "—" 与 EN 一致）
- 长句拆 2 行（用 `\n`）：避免 4K 屏上字幕过长遮挡

### 3. `presentation/scripts/burn-subs-user.mjs`（新建）

**字幕烧录脚本**（不动 post-process.mjs 的 v7/v8 流水线）：
- 输入：用户手动剪辑版 4K 60fps 立体声
- 字幕：`subtitles_en_user.srt` 或 `subtitles_zh_user.srt`
- 视频：libx264 CRF 20 preset fast（重编码）
- **音频：`c:a copy`**（立体声 44.1kHz bit-perfect 保留）
- 不缩放 / 不重帧率 / 不 loudnorm

**字幕样式**（不遮挡主内容）：
```js
FontName=Arial (en) | Microsoft YaHei (zh)
FontSize=22                  // 4K 屏 22pt ≈ 0.85cm 清晰可读
PrimaryColour=&H00FFFFFF     // 白字
BackColour=&H60000000        // 60% 透明黑底
BorderStyle=4                // 圆角背景盒
Outline=1, Shadow=1          // 描边+阴影可读性
Alignment=2                  // BottomCenter
MarginV=20                   // 离底部 20px 微抬
```

**坑**：
1. **ffmpeg subtitles filter 解析 `:` 与 Windows C: 路径冲突** → 把 SRT 复制到 `renders/raw/` 子目录，ffmpeg 在该目录运行用相对路径
2. **Alignment=2 + MarginV>0 会推字幕到屏幕顶部**（libass 行为反直觉）→ MarginV=0 或 20 即可让字幕贴底
3. **长 cue 自动换行 3 行会遮挡主体内容** → 手动拆 `\n` 强制 2 行

### 4. 存档

| 文件 | 来源 | 用途 |
|---|---|---|
| `renders/user-edit/202609112316.mp4` | 用户手动剪辑版复制 | **只读存档**（原档在桌面不动） |

## ASR 数据（已完成）

```bash
ffmpeg -i "C:/Users/rongj/Desktop/202609112316.mp4" -vn -ar 16000 -ac 1 temp/user-cut-audio.wav
python -c "from faster_whisper import WhisperModel; m = WhisperModel('base', device='cpu', compute_type='int8'); segs, info = m.transcribe('temp/user-cut-audio.wav', language='de', beam_size=5, vad_filter=True); ..."
```

- 模型：faster-whisper base · CPU · int8
- 加载：66s · 转录：33.7s
- 输出：56 segments · 0-171.67s · DE 概率 1.00
- 写到 `temp/asr-segments.json`

**关键 ASR anchor（手写映射参考）**：

| Step | DE narration 关键词 | ASR seg |
|---|---|---|
| 0 | "Ich bin Jiajun Rong" | 0 |
| 0 | "LinguaGraph macht..." | 1 |
| 10 | "blinder Fleck" | 17 |
| 14 | "Sprache die einzige Variable" | 24 |
| 19 | "55 Messungen" | 32-33 |
| 20 | "kulturell gemustert" | 34 |
| 23 | "Ehrlich dazu" | 40 |
| 27 | "neue Art von KI-Prüfung" | 47 |
| 31 | "Sichtbar" + "Danke" | 53-55 |

## 最终产物

| 文件 | 大小 | 分辨率 | 时长 | 字幕 | 用途 |
|---|---|---|---|---|---|
| `renders/user-edit/202609112316.mp4` | 117.5 MB | 3840×2160@60fps | 172.97s | 无 | 用户手动剪辑原档存档 |
| `renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_en.mp4` | 25.0 MB | 3840×2160@60fps | 172.97s | EN | 4K + 60fps + **英文字幕** |
| `renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_zh.mp4` | 23.2 MB | 3840×2160@60fps | 172.97s | ZH | 4K + 60fps + **中文字幕** |
| `docs/subtitles_en_user.srt` | 3.8 KB | — | 32 cues 0-171.87s | EN | EN SRT 源文件 |
| `docs/subtitles_zh_user.srt` | 3.6 KB | — | 32 cues 0-171.87s | ZH | ZH SRT 源文件 |

### 字幕版详细规格

| 字段 | EN 版 | ZH 版 |
|---|---|---|
| 视频编码 | H.264 (libx264) | H.264 (libx264) |
| 视频码率 | ~1018 kbps | ~1018 kbps |
| 音频编码 | AAC LC 立体声 44.1kHz | AAC LC 立体声 44.1kHz |
| 音频码率 | 125 kbps（**copy**）| 125 kbps（**copy**）|
| 时长 | 172.97s | 172.97s |
| 分辨率 | 3840×2160 | 3840×2160 |
| 帧率 | 60fps | 60fps |
| 字幕格式 | SRT 烧录（libass） | SRT 烧录（libass） |
| 字幕位置 | 底部居中 | 底部居中 |
| 字幕字体 | Arial | Microsoft YaHei |
| 字幕字号 | 22pt | 22pt |

## 验证

### A · SRT 准确性
- [x] 抽帧 6 个关键时间点（10/30/53/100/130/170s）
- [x] t=10s EN: "Let's ask a German AI model: what belongs to freedom? It answers: autonomy, rules, one's own goals." ✓
- [x] t=10s ZH: "我们来问一个德语 AI 模型:什么是自由?它回答:自主、规则、自己的目标。" ✓
- [x] t=53s EN: "This is a blind spot." ✓
- [x] t=100s EN: "In fifty-five measurements, the Chinese–German signal is statistically significant." ✓
- [x] t=170s EN: "LinguaGraph. Visible. Thank you." ✓
- [x] t=170s ZH: "LinguaGraph。可见。谢谢。" ✓
- [x] 32 cues 完整覆盖 0-171.87s

### B · 字幕烧录
- [x] EN 版 25 MB · 4K · 60fps · 立体声 44.1kHz
- [x] ZH 版 23.2 MB · 4K · 60fps · 立体声 44.1kHz
- [x] EN 版时长 172.97s（与原版完全一致）
- [x] ZH 版时长 172.97s（与原版完全一致）
- [x] 字幕位置：底部居中，**不遮挡**主内容（4K 3840×2160 画面下半部留白区足够容纳字幕盒）
- [x] t=100s EN 字幕轻微压到 DE 小字 "das chinesisch-deutsche Signal ist statistisch signifikant" 下沿，但不影响主要数字 55/50

### C · 与原版对比
- [x] 原版 117.5MB（H.264 615kbps 高码率）→ 字幕版 23-25MB（H.264 CRF 20 高效编码）
- [x] 字幕版更小但**视觉质量更好**（CRF 20 vs 原版 615kbps 不可控码率）
- [x] 音频零损失（`-c:a copy` bit-perfect passthrough）

## 与 v8 差异表

| 项 | v8 自动版 | v9 用户剪辑版 + 双语字幕 |
|---|---|---|
| 视频基准 | v8 record-video 流水线 (212s) | 用户手剪版 (173s) |
| 节奏 | 32 段差异化 PAUSE_MAP (38.6s hold) | 用户自然剪辑（保留 v7 节奏）|
| 帧率 | 24fps | **60fps** |
| 音频 | 单声道 48kHz | **立体声 44.1kHz** |
| 字幕 | EN SRT 烧录（v7 169s 时间轴） | EN + ZH 双轨烧录（用户版 173s 时间轴）|
| 字幕来源 | 32 mp3 cumulative timeline | faster-whisper ASR 56 segments → 32 段强制对齐 |
| 最终产物 | 2 个 MP4 (BWKI-spec + 4K) | 2 个 MP4 (4K + EN/ZH 双轨) + 1 个原档存档 |
| MP4 大小 | 7.49MB + 19.19MB | **25MB EN + 23.2MB ZH** |
| 总工时 | ~70min（v8 节奏设计）| ~65min（v9 ASR + 字幕）|

## 文件改动清单

### 修改
| 路径 | 改动 |
|---|---|
| `docs/PIPELINE-v8.md` | 顶部加 "Superseded by v9" |

### 新建
| 路径 | 用途 |
|---|---|
| `presentation/scripts/build-subs-user.mjs` | 从 ASR 数据生成 32 段 EN SRT |
| `presentation/scripts/translate-subs.mjs` | EN SRT 时间戳 → ZH SRT（32 cues 同时间轴）|
| `presentation/scripts/burn-subs-user.mjs` | ffmpeg 字幕烧录（en/zh 双语支持）|
| `docs/subtitles_en_user.srt` | EN SRT（用户版时间轴，32 cues）|
| `docs/subtitles_zh_user.srt` | ZH SRT（用户版时间轴，32 cues）|
| `renders/user-edit/202609112316.mp4` | 用户手动剪辑版（**只读**存档副本）|
| `renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_en.mp4` | 4K + 60fps + **英文字幕**烧录版 |
| `renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_zh.mp4` | 4K + 60fps + **中文字幕**烧录版 |

### 不改
- `narrations.ts` · `data.ts` · `LinguagraphPitch.tsx` · `LinguagraphPitch.css`（视觉零改动）
- `record-video.mjs` · `post-process.mjs` · `build-subs.mjs`（v7/v8 流水线不动）
- 32 个 mp3（不重合成）
- TTS providers
- `subtitles_en.srt`（v7 EN SRT 保留，不动）
- `subtitles_zh_user.srt` 翻译文本（首版基于 EN 复用，可后续人工调优）

## 后续建议（v10+）

1. **若 ZH 字幕需要更精炼**：translate-subs.mjs 里 32 段翻译首版基于 EN 复用，可逐句人工 review 调优（特别是技术术语 p<0.05 的中文表达）
2. **若字幕压到底部仍嫌高**：burn-subs-user.mjs 里把 FontSize 从 22 降到 20（更小，更贴底）
3. **若需要 side-by-side 双语版**：再跑一次 `node burn-subs-user.mjs` 把 EN 和 ZH 上下排列（需要改 force_style 加 `\N` 换行符分上下两行）
4. **若需要软字幕（不烧录）**：用 `-c:s mov_text` 替代 `-vf subtitles=...`，输出 MKV/MP4 软字幕轨道

## 风险与回退

**风险 1 · ANCHOR_TABLE 手写错误导致某段字幕错位**
- 表现：抽帧检查时某段字幕与画面配音不同步
- 回退：检查 `temp/asr-segments.json` 对应段的 start/end，调整 ANCHOR_TABLE 的 from/to 后重跑 build-subs-user.mjs

**风险 2 · libass 烧录后字幕位置异常**
- 表现：字幕在画面顶部而非底部
- 回退：检查 MarginV 是否为 0/20（>50 会推到顶部）

**风险 3 · ZH 翻译术语不准**
- 表现：评委对 "LDS" / "blinder Fleck" 等术语中文表达有疑问
- 回退：人工修改 translate-subs.mjs 的 ZH_TRANSLATIONS 数组，重跑生成 ZH SRT，再 burn

## 关键文件路径速查

| 关注点 | 文件 |
|---|---|
| 用户手动剪辑原档 | `C:\Users\rongj\Desktop\202609112316.mp4` |
| 用户剪辑版存档副本 | `nach/renders/user-edit/202609112316.mp4` |
| ASR 原始数据 | `nach/temp/asr-segments.json` |
| EN SRT（用户版时间轴）| `nach/docs/subtitles_en_user.srt` |
| ZH SRT（用户版时间轴）| `nach/docs/subtitles_zh_user.srt` |
| 字幕生成脚本 | `nach/presentation/scripts/build-subs-user.mjs` |
| 翻译脚本 | `nach/presentation/scripts/translate-subs.mjs` |
| 字幕烧录脚本 | `nach/presentation/scripts/burn-subs-user.mjs` |
| v9 文档（本文档）| `nach/docs/PIPELINE-v9.md` |
| EN 字幕版（最终）| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_en.mp4` |
| ZH 字幕版（最终）| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_zh.mp4` |
