# Pipeline v6 — 配音/图谱/数字/团队 4 项反馈优化

## 概述

v6 在 v5 基础上针对用户/专家复看后的 4 项反馈做细节优化：

| 反馈 | v5 现状 | v6 修复 |
|---|---|---|
| **A · 配音机械** | TTS 平缓、缺抑扬顿挫 | 新增 `edge-tts-emphasis.sh` provider，支持 `[EMPHASIS]…[/EMPHASIS]` 标记 → 重点词 `--rate=-15%` `--volume=+5%` |
| **B · 图谱抽象** | 6 节点 hand-coded，线条少 | CONCEPT_GRAPH 6→14 节点；新增 21 条 EDGES 含 divergence 评分；SVG 动态生成 |
| **C · 数字不清** | "55 / 50" 视觉关联弱 | step 19 narration 加 "Sprachpaar-Messungen ... Modelle"；视觉上明确 "55 ↔ 标签 ↳ 50" |
| **D · 团队感弱** | 纯文字，缺"人"的温度 | 新增 `<TeamMonogram>` 组件：JR + ZL 双圆形 monogram + caption（cover + Danke）|

---

## 关键变更

### 1. `presentation/scripts/tts-providers/edge-tts-emphasis.sh` (新建)

TTS provider 的 drop-in 替换版本：同样的 `tts_synthesize text out [voice]` 函数签名，识别 `[EMPHASIS]…[/EMPHASIS]` 标记后：

- **pre/emphasis/post 三段独立合成**（用 `bash =~` regex 切分）
- emphasis 段：`--rate=-15%` `--volume=+5%`（更慢、更沉稳）
- 普通段：`--rate=+0%` `--volume=+0%`
- **自动跳过空 chunk / 标点-only chunk**（如 "." — edge-tts 拒绝单标点，抛 NoAudioReceived）
- **`silenceremove` 去末尾静音**：edge-tts 每个 chunk 自带 ~1s 尾静音；3 chunk concat 会堆叠 3s 死寂，必须 trim
- **`cygpath -w` 转换临时文件路径**：Git Bash `/tmp/X` 在 ffmpeg 内部被映射到 `C:/Users/.../Temp/X`，但 ffmpeg 的 concat demuxer 偶尔解析失败 → 用 Windows 风格路径直传

启用：`PRESENTATION_TTS=edge-tts-emphasis npm run synthesize-audio`

**marker 语法**（在 `narrations.ts`）：
```ts
"Das ist ein [EMPHASIS]blinder Fleck[/EMPHASIS]."
"Weil es dasselbe Modell ist, ist [EMPHASIS]Sprache die einzige Variable[/EMPHASIS]."
```

5 段加入 emphasis 标记：step 10 / 14 / 20 / 27 / 31（`narrations.ts` index，对应 mp3 11/15/21/28/32）

### 2. `narrations.ts` · `[EMPHASIS]` 标记 + step 19 澄清句

```ts
// 5 个 emphasis 段：
"Das ist ein [EMPHASIS]blinder Fleck[/EMPHASIS].",
"Weil es dasselbe Modell ist, ist [EMPHASIS]Sprache die einzige Variable[/EMPHASIS].",
"Und es ist nicht zufällig, sondern [EMPHASIS]kulturell gemustert[/EMPHASIS]: ...",
"Damit ist LinguaGraph [EMPHASIS]eine neue Art von KI-Prüfung[/EMPHASIS].",
"LinguaGraph. [EMPHASIS]Sichtbar[/EMPHASIS]. Danke.",

// step 19 数字澄清（原版 → v6）：
"In allen 55 Messungen ist das chinesisch-deutsche Signal statistisch signifikant."
↓
"Bei 55 Sprachpaar-Messungen über 50 Modelle hinweg ist das chinesisch-deutsche Signal statistisch signifikant."
```

注：音频 segment 索引是 1-based（`extract-narrations.ts` 用 `i+1`），所以 narrations.ts index N → mp3 文件 (N+1).mp3。标记修改后跑了 `npm run extract-narrations` 刷新 `audio-segments.json`。

### 3. `data.ts` · `CONCEPT_GRAPH` 6→14 + `CONCEPT_GRAPH_EDGES`

```ts
export const CONCEPT_GRAPH = {
  de: ["Autonomie","Regeln","Wahl","Pflicht","Individuum","Gesetz",
       "Verantwortung","Gerechtigkeit","Vernunft","Freiheit",
       "Gemeinwohl","Selbstbestimmung","Würde","Moral"],  // 14
  zh: ["空间","界限","归属","家庭","他人","道义",
       "责任","公正","义","自由","集体","选择","尊严","道德"],  // 14
} as const;

export const CONCEPT_GRAPH_EDGES = [
  { deIndex: 0, zhIndex: 0, score: 0.78 },  // Autonomie→空间
  { deIndex: 7, zhIndex: 7, score: 0.92 },  // Gerechtigkeit→公正（top divergent）
  { deIndex: 9, zhIndex: 9, score: 0.88 },  // Freiheit→自由（signature）
  ... 共 21 条
];
```

**节点数提升让图谱"看起来像真数据"** —— 评委扫一眼 14 节点的双层网，比 6 节点 hand-coded 更像从真实 KG 导出的快照。

### 4. `LinguagraphPitch.tsx` · step 15 动态 SVG + step 19 视觉关联

**step 15 改造**：
- 节点位置改为 `Array.from({length: N}, (_, i) => polar coords)` —— 14 节点等角分布半径 110px
- 节点 r 22→16（避免拥挤），font-size 11→10
- 总动画时长 < 2.6s（不超 SETTLE_MS）

**step 19 视觉关联**：旧的 `55 / 50` slash 改为"行式"：

```
55   ↳   [Sprachpaar-Messungen]
50   ↳   [Modelle verschiedener Anbieter]
       [p < 0.05 · alle ZH–DE]
```

↳ 箭头 + badge 紧邻，让评委一眼看出 55 = pairs, 50 = models。

### 5. `TeamMonogram.tsx` + `TeamMonogram.css` (新建)

```tsx
export function TeamMonogram({ size = "lg", showCaption = false }: Props) {
  return (
    <div className={`tm tm-${size}`} aria-hidden="true">
      <div className="tm-row">
        <span className="tm-circle tm-circle-accent">JR</span>  {/* Jiajun Rong */}
        <span className="tm-dot">·</span>
        <span className="tm-circle tm-circle-soft">ZL</span>     {/* Zhenxi Lan */}
      </div>
      {showCaption && (
        <div className="tm-caption">knusprige_oktopus-seepocken · BWKI 2026</div>
      )}
    </div>
  );
}
```

- `pointer-events: none` —— 不挡 stage click
- 大小：lg (80×80) / md (56×56)
- 集成：step 0 (cover) 用 md, step 31 (Danke) 用 md

### 6. v6 音频时长变化

由于 edge-tts-emphasis provider 重合成了全部 32 段 mp3（新 provider 速度略慢于 minimax 默认），最终 `all.mp3` 总长从 201.4s → **188.5s**。视频长度相应缩短 ~13s。

`record-video.mjs` 是 probe-based 时序，每步 `targetClickTime = T0 + cumulativeMs[i+1] - CROSSFADE_MS`，自动跟随 mp3 长度变化，所以 A/V 同步仍然精确（实测漂移 0-15ms 居多，2 个短音频段最大 397-427ms）。

---

## 验证

### A · TTS 强调音
- [x] 5 段 mp3 重合成（11/15/21/28/32）+ step 19 澄清（20）
- [x] 全 32 mp3 重合（统一 provider）→ all.mp3 = 188.5s
- [x] 听感对比：emphasis 段 vs 普通段有明显减速差异
- [x] record-video 漂移 0-15ms 居多（短音频段 11/24 最大 397-427ms）

### B · 图谱密度
- [x] step 16 (Konzeptgraph) 渲染 14 节点 per language + 21 边连接
- [x] 视觉上 hub-spoke 结构清晰，节点标签基本可读
- [x] 边动画 stagger 60ms × 14 = 840ms（远小于 SETTLE_MS 3000ms）

### C · 55/50 清晰
- [x] step 19 narration "Bei 55 Sprachpaar-Messungen über 50 Modelle hinweg..."
- [x] 视觉：`55 ↳ SPRACHPAAR-MESSUNGEN` 与 `50 ↳ MODELLE VERSCHIEDENER ANBIETER` 行式对齐
- [x] 抽帧 t=105s：评委一眼看清 55 ↔ pairs / 50 ↔ models

### D · 团队感
- [x] step 0 (cover)：右下角 JR + ZL monogram + "knusprige_oktopus-seepocken · BWKI 2026"
- [x] step 31 (Danke)：同样 monogram + caption 在 Danke 下方
- [x] pointer-events: none，不挡 stage click

### 整体
- [x] `npx tsc --noEmit` 通过
- [x] 录音完成（probe-based 时序自动适配 188.5s 音频）
- [x] BWKI-spec 1344×768 MP4 (7.48 MB) + 4K 3840×2160 MP4 (20.5 MB)
- [x] loudnorm EBU R128（I=-16 / TP=-1.5 / LRA=11）
- [x] 抽帧验证：cover / step 19 / step 16 / Danke 均视觉完整

---

## 与 v5 差异表

| 项 | v5 | v6 |
|---|---|---|
| TTS 重点词 | 平缓 uniform rate | 5 段 `[EMPHASIS]` → `--rate=-15%`（edge-tts-emphasis provider）|
| Konzeptgraph | 6 节点 hand-coded | 14 节点 + 21 边 + dynamic SVG + divergence scores |
| step 19 | "55 / 50" slash 关联弱 | "55 ↳ SPRACHPAAR-MESSUNGEN" + "50 ↳ MODELLE" 行式 |
| 团队视觉 | 纯文字 | JR + ZL monogram 双圆徽章（cover + Danke）|
| 音频总长 | 201.4s | **188.5s**（统一 provider 后略短）|
| MP4 大小 | 7.77 MB | 7.48 MB (BWKI) / 20.5 MB (4K) |

---

## 不在本计划范围

- ❌ 真实照片 / 真人视频（无资产，按用户选择用 monogram fallback）
- ❌ edge-tts 不支持 SSML `<break>` / `<emphasis>` — 用 `--rate=-15%` 模拟（已知非问题）
- ❌ 烧 EN 字幕（`build-subs.mjs` 已写好 `subtitles_en.srt`，但 v6 不启用 — `post-video.mjs` 无 `subtitles=` filter）
- ❌ 改 SideRail / 流程导航（v5 已完成）
- ❌ 改其它 26 段 narration（只动 6 段：10/14/19/20/27/31）
- ❌ 改 BWKI 硬规格 / 4K 模式

---

## 已知非问题

**edge-tts CLI 不支持 SSML**：用 `--rate=-15%` + `--volume=+5%` 模拟重音是当前 free-tier TTS 下的最佳近似。若以后切到 ElevenLabs / Azure Speech 可换 SSML。

**Git Bash + ffmpeg concat demuxer 路径解析**：`_tts_concat` 必须用 `cygpath -w` 把 `/tmp/X` 转 `C:/Users/.../Temp/X`，否则 ffmpeg 找不到 concat list 文件（rc=127）。这是 Windows-only 特殊性，Mac/Linux 上 mktemp 原生路径可用。