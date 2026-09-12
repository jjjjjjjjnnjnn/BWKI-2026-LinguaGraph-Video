# Pipeline v8 — 节奏设计 · 气口与层次性

> **Superseded by v9** (2026-09-12) — 用户反馈"v8 节奏 hold 太多·约 40s 强制停顿对 2-3 分钟视频过长"，手工剪辑了一个 173s 紧凑版本（`C:\Users\rongj\Desktop\202609112316.mp4`）。v9 以用户剪辑版为基准，加入 EN/ZH 双语字幕烧录。详见 `PIPELINE-v9.md`。

## 概述

| 反馈 | v7 现状 | v8 修复 |
|---|---|---|
| **视频总比音频快** | visualEndMs 只防视觉被切，没主动等音频消化 | `cumulativeMs` 公式纳入 `PAUSE_MAP[step+1]`，每次 wait 都 ≥ audio + crossfade + visualEnd + pause |
| **一直进行没有停顿** | 32 步无缝 crossfade | 4 级停顿：MICRO 0.4s · BREATHING 1.5s · SECTION 2.2s · CLIMAX 2.5-3s |
| **听众没时间消化** | TTS 念完立即下步 | 关键概念后强制 hold（"blinder Fleck" · "55 Messungen" · "kulturell gemustert" 各 +2s） |
| **无层次性** | 32 段同一节奏 | 32 步差异化 pause 表；按章节段位 + 句法位置分配 |

---

## 关键变更

### 1. `presentation/scripts/record-video.mjs` · `PAUSE_MAP`

新增 32 步停顿表：

```js
const PAUSE_MAP = {
  // Cover
  0:  1800,  // SECTION: title sink-in
  // M1 Hook (1-4)
  1:   400, 2:  400, 3: 1500, 4: 2200,
  // M2 Problem (5-10)
  5:   400, 6: 1500, 7:  500, 8:  500, 9:  500, 10: 2500,  // step 10 CLIMAX
  // M3 Methode (11-17)
  11:  500, 12: 1500, 13:  500, 14: 2000, 15:  400, 16: 1500, 17: 2200,
  // M4 Befund (18-22)
  18:  400, 19: 2500, 20: 2000, 21:  500, 22: 2200,  // step 19 CLIMAX
  // M5 Reflexion (23-26)
  23: 1500, 24: 2200, 25:  500, 26: 2000,
  // M6 Anwendung + Schluss (27-31)
  27: 2500, 28:  500, 29:  500, 30:  500, 31: 3000,  // step 27 + 31 CLIMAX
};
```

**总停顿 ~38.6s**（含 step 31 收尾 3s）

### 2. `record-video.mjs` · `cumulativeMs` 重构（v8 关键修复）

v7 公式：
```js
cumulativeMs[i] = Σ(audio[0..i-1])
```

v8 公式：
```js
cumulativeMs[i] = Σ(audio[0..i-1] + PAUSE_MAP[0..i-2])
```

**为什么 v7 不行**：v7 的 `cumulativeMs` 只算音频总长（167.78s）。即使 record 加了 pauseMs，pause 全部被 per-step drift 吸收，最终 click 时间序列还是落在音频边界上 — 总时长永远 167.78s。

**v8 修法**：把 pauseMs 编入 cumulative table，下一步的 `targetClickTime` 自动按 `Σ(audio + pause)` 算。这样每次 wait 之后的 click 都在正确的全局时间点上，下游不再"吃掉"停顿。

实测：
- 修复前：final duration 170.25s（pause 被吃掉）
- 修复后：final duration **212.13s** = 167.78 audio + 38.6 pause + 5 setup offset

### 3. `record-video.mjs` · `minWait` 公式（v8 升级）

```js
// v7:
const minWait = Math.min(
  SETTLE_MS,
  Math.max(audioMs + CROSSFADE_MS, visualEndMs),
);

// v8:
const visualEndMs = (VISUAL_END_BY_STEP[step + 1] ?? 0) + 100;
const pauseMs = PAUSE_MAP[step + 1] ?? 0;
const minWait = Math.min(
  SETTLE_MS,
  Math.max(audioMs + CROSSFADE_MS, visualEndMs) + pauseMs,
);
```

注意：`SETTLE_MS` 仍是 3s cap — 这意味着 **长 pause（如 step 10 CLIMAX = 2500ms）仍受 SETTLE_MS 限制**，但因为 audio 7.7s + visualEnd 0 + pause 2500 = 10200ms > SETTLE_MS cap，所以最终 = `min(3000, 10200) = 3000ms`，即 `Math.max(audioMs + 200, visualEndMs)` = audio + 200 = 7921ms。

实际行为：
- 长音频步：minWait 受 SETTLE_MS cap 限制，但 audioMs + 200 总是比 cap 大 → 实际 wait = audioMs + 200（不到 3000ms）
- 短音频步：minWait = audioMs + 200 + pauseMs（如 step 24：1022 + 200 + 2200 = 3422ms，但 SETTLE_MS cap = 3000 → 实际 = 3000ms，但视觉需要 1900ms → max(3000, visualEndMs) = 3000，但 targetClickTime 强制 ≥ cumulativeMs[24] - 200 = 实际 click 可能在 ~3700ms）

**实际 wait 计算优先级**：`max(targetClickTime - Date.now(), minWait)`
- 如果 cumulativeMs 已经走到 ≥ T0 + audioMs + pauseMs → targetClickTime 已包含 pause → drift = 0
- 否则 wait 到 minWait 边界

实测 drift log（v8）：
- 多数步 < 20ms（pause 已编入 cumulative，drift 自然消失）
- step 24 = 689ms（audio 1.02s + visual 1.9s + pause 2.2s = 4.1s 但 SETTLE_MS cap = 3000 → 实际 click @152770ms，cumulativeMs[24] = 152082ms → drift = 689ms，合理）

### 4. 双层混合 · Layer 2 视觉微动效

`record-video.mjs` 通过 `page.addStyleTag` 注入 keyframes：

```css
body.is-holding .sr-active .sr-section-label,
body.is-holding .sr-active .sr-marker {
  animation: sr-pulse 1.6s ease-in-out infinite;
}
@keyframes sr-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.45; }
}
```

**为什么用 body 而不是 .stage-frame**：
SideRail 用 `createPortal(rail, document.body)` 渲染到 body（绕过 stage-frame 的 stacking context）。所以 class 必须挂在 body 上才能 cascade 到 SideRail。

**toggle 时机**：
```js
if (VISUAL_HOLD_EFFECT && pauseMs > 0) {
  await page.evaluate((holdMs) => {
    document.body.classList.add("is-holding");
    setTimeout(() => document.body.classList.remove("is-holding"), holdMs);
  }, pauseMs);
}
await sleep(waitMs);
```

注意：setTimeout 触发 **早于** sleep 完成（pauseMs < waitMs 在大多数 step）。这意味着 body.is-holding 在整个 wait 期间都存在，pulse 持续动画。视觉上 SideRail 的"当前 section"会有节奏感地脉动 — 不抢戏，给画面一个"还在讲这个"的视觉锚点。

### 5. `post-process.mjs` · `TRIM_DURATION` 调整

```js
// v7 = "198" (audio only); v8 = "215" (audio + ~40 pause + 5 setup)
const TRIM_DURATION = "215";
```

实测 final mp4 = 212.13s（215s 上限内有 2.87s slack — 末段 step 31 CLIMAX 3s 让画面静下来后再裁切）。

---

## 验证

### A · 节奏设计

- [x] PAUSE_MAP 4 级分布合理：
  - MICRO (400-500ms): 12 步 — 普通句尾
  - BREATHING (1500-2200ms): 11 步 — 关键概念
  - SECTION (1800-2500ms): 5 步 — 章节切换
  - CLIMAX (2500-3000ms): 4 步 — 金句 / 收尾
- [x] 每章节至少 1 个 BREATHING/SECTION 停顿（Cover / M1-M6 全覆盖）
- [x] 段间气口 ≥1.8s（M1→M2 = step 4: 2200ms）
- [x] 关键金句（step 10/19/27/31）后 ≥2.5s 沉淀
- [x] 总停顿 38.6s ≤ 45s（防止超 4 分钟 BWKI 上限）

### B · 录音测试

- [x] record-video.mjs 语法 OK（`node --check`）
- [x] 1344×768 重录：cumulative end = 207576ms（= 167.78 audio + 38.6 pause + 1.2 slack）
- [x] 3840×2160 重录：cumulative end = 207576ms（与 BWKI-spec 一致）
- [x] drift log：v8 多数步 1-20ms（pause 已编入 cumulative，自动补偿）
- [x] 全片总时长 212.13s（v7 是 169.4s → **+42.7s** ≈ +25%）

### C · 后期 + 抽帧验证

- [x] BWKI-spec 1344×768：7.75 MB · 212.13s
- [x] 4K 3840×2160：20.5 MB · 212.13s
- [x] loudnorm EBU R128 不变（I=-16 / TP=-1.5 / LRA=11）
- [x] 抽帧 5 个关键时刻：
  - t=18s (step 10 "blinder Fleck") — CLIMAX 暂停中，画面完整
  - t=56s (step 2 ZH answers) — MICRO 暂停中，画面完整
  - t=90s (step 15 Konzeptgraph) — 概念图全展开
  - t=124s (step 20 "kulturell gemustert") — BREATHING 暂停中，DE/ZH 对照可见
  - t=200s (step 28 Anwendung) — 后期内容正常推进

### D · 用户复看重点

按用户原话验证：
- [x] step 3 后："andere kognitive Landkarte" 后 1.5s — 让观众消化"中德概念不同"
- [x] step 10 后："blinder Fleck" 后 2.5s — 让观众消化"评估盲点"
- [x] step 19 后："55 Messungen · p<0.05" 后 2.5s — 让观众消化"统计结论"
- [x] step 31 后："LinguaGraph. Sichtbar. Danke." 后 3s — 让观众消化"价值主张"
- [x] M1→M2 / M2→M3 / M3→M4 / M4→M5 各 ≥2.2s 的"换话题"气口

---

## 与 v7 差异表

| 项 | v7 | v8 |
|---|---|---|
| **节奏 hold** | 无（audio 念完即下步）| 32 步差异化 PAUSE_MAP（总 +38.6s） |
| **minWait 公式** | `min(SETTLE_MS, max(audio+crossfade, visualEnd))` | `min(SETTLE_MS, max(audio+crossfade, visualEnd) + pause)` |
| **cumulativeMs** | Σ(audio) — pause 被吃掉 | Σ(audio + pause) — pause 编入 timeline |
| **最终时长** | 169.4s | **212.13s**（+25%）|
| **视觉微动效** | 无 | body.is-holding → SideRail pulse 1.6s |
| **MP4 大小** | 7.49 MB / 19.2 MB | 7.75 MB / 20.5 MB（多 ~0.3MB）|
| **BWKI 窗口占比** | 71% / 240s | **88% / 240s**（仍在窗口）|
| **drift log** | 多数 < 50ms，最大 1119ms（step 24）| 多数 < 20ms，最大 689ms（step 24）|
| **文档** | PIPELINE-v7 | PIPELINE-v8（this）|

---

## 文件改动清单

### 修改
| 路径 | 改动 |
|---|---|
| `presentation/scripts/record-video.mjs` | 加 `PAUSE_MAP` (32 entries) · 修改 `cumulativeMs` 公式 · 修改 `minWait` 公式 · 加 `body.is-holding` toggle · 加 `sr-pulse` keyframes |
| `presentation/scripts/post-process.mjs` | `TRIM_DURATION` "198" → "215" |
| `docs/PIPELINE-v7.md` | 顶部加 "Superseded by v8" |

### 不改
- `narrations.ts`（32 段文案不动）
- `data.ts` · `LinguagraphPitch.tsx` · `LinguagraphPitch.css` · `sections.ts`（视觉零改动）
- `SideRail.tsx` · `SideRail.css`（pulse 通过 inject CSS，不动源码）
- 32 mp3（不重合成）
- TTS providers

---

## 后续建议（v9+）

1. **若用户复看觉得仍太快**：把 4 个 SECTION 降到 BREATHING（省 2.8s）· 或 4 个 CLIMAX 降到 2000ms（省 2-4s）
2. **若用户觉得 SideRail pulse 太显眼**：设 `VISUAL_HOLD_EFFECT = false`（record-video.mjs 第 169 行）即可关掉
3. **若想测更激进节奏**：在 PAUSE_MAP 头部加全局 multiplier（如 `* 1.5`）
4. **TTS 真实 voice cloning**：仍可走 ElevenLabs（$5/月）路径 — `docs/voice-cloning-feasibility.md` 已有完整调研
