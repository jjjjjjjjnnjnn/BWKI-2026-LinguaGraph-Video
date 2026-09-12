# Pipeline v7 — minimax 配音升级 + A/V 同步修复

> **⚠ Superseded by v8** (2026-09-11) — 用户反馈"幻灯片和音频不对应 / 没有停顿 / 没有层次性"。v8 加入 `PAUSE_MAP` 节奏设计 + SideRail pulse 视觉微动效。详见 `PIPELINE-v8.md`。

## 概述

v7 在 v6 基础上修复 1 个问题 + 切换 1 个 TTS provider + 输出 1 份 voice cloning 调研：

| 反馈/方向 | v6 现状 | v7 修复 |
|---|---|---|
| **A · A/V 不同步** | 短音频 step（如 step 24 audio=1.34s）末 reveal 在 1.8s → 视觉被切 | `record-video.mjs` 加 `VISUAL_END_BY_STEP` 表，`minWait` 公式改为 `min(SETTLE_MS, max(audioMs + 200, visualEndMs))` |
| **B · 配音机械** | edge-tts de-DE-ConradNeural 平缓、emphasis 用 `--rate=-15%` 模拟 | 切换到 **minimax `German_FriendlyMan`** — 自然度更高（mmx 语音合成有情感起伏）|
| **C · Voice Cloning 调研** | 用户提示可考虑 voice cloning | 输出 `docs/voice-cloning-feasibility.md`（5 方案对比 + 推荐 ElevenLabs） |

---

## 关键变更

### 1. `presentation/scripts/tts-providers/minimax-clean.sh` (新建)

`minimax.sh` 的扩展版本，**剥离 `[EMPHASIS]…[/EMPHASIS]` 标记**后传给 mmx。

为什么需要？因为 minimax 不支持 SSML 也不支持自定义 emphasis — 如果直接把 `[EMPHASIS]blinder Fleck[/EMPHASIS]` 传过去，mmx 会朗读 "[EMPHASIS]..." 字面文本。

```bash
# sed 一行剥离：
clean_text="$(printf '%s' "$text" | sed -E 's/\[EMPHASIS\]|\[\/EMPHASIS\]//g')"
mmx speech synthesize --voice "$voice" --text "$clean_text" --out "$out"
```

启用：
```bash
PRESENTATION_TTS=minimax-clean npm run synthesize-audio -- --voice=German_FriendlyMan
```

### 2. `presentation/scripts/record-video.mjs` · `VISUAL_END_BY_STEP`

v6 的 `minWait` 只保护音频边界（`audioMs + CROSSFADE_MS`），没考虑视觉动画时长。短音频 step（如 step 24: audio=1.02s, visual=1.8s）会视觉被切。

**v7 新增 hardcoded 表**：

```js
const VISUAL_END_BY_STEP = {
  6:  1500,   // step 6 "Aber sie sind überwiegend..." bar reveal ends ~1500ms
  23: 1700,   // step 23 "Ehrlich dazu" reveals end ~1700ms
  24: 1800,   // step 24 "N=15" badge reveal ends at delay 1100+700 = 1800ms
  25: 1700,   // step 25 "8 EN-Paare" reveal ends ~1700ms
  26: 1700,   // step 26 "Schwelle 0,10" reveal ends ~1700ms
};
```

**新 `minWait` 公式**：
```js
const visualEndMs = (VISUAL_END_BY_STEP[step + 1] ?? 0) + 100; // +100ms 缓冲
const minWait = Math.min(
  SETTLE_MS,
  Math.max(audioMs + CROSSFADE_MS, visualEndMs),
);
const waitMs = Math.max(minWait, targetClickTime - Date.now());
```

逻辑：
- `Math.max(audioMs + 200, visualEndMs)` — 必须等两者中较长的那个
- `Math.min(..., SETTLE_MS)` — 但用 SETTLE_MS (3s) cap，长音频步不会 over-wait

第一次实现时我误用 `Math.max(SETTLE_MS, ...)` → 32 步 × 3s = 96s 累积漂移。改为 min-cap 后漂移正常（短步 0-50ms，长步 1-15ms，step 24 单步 ~1s 因 visualEndMs=1900）。

### 3. minimax 切换：32 mp3 重合成

**关键变化**：
- Audio 总长：188.5s → **169.4s**（minimax 比 edge-tts 快 ~10%）
- 单 mp3 体积：edge-tts avg ~50KB → minimax avg ~75KB（更高码率 = 更自然）

实际录制漂移（v7 重录）：
- 多数步 0-50ms
- step 24: 1119ms（visualEndMs 故意 wait 1.9s）
- step 32: 487ms（末段累积）
- 其他 outliers < 100ms

### 4. `docs/voice-cloning-feasibility.md` (新建)

5 方案对比：
| 方案 | 速度 | 成本 | 德语质量 | 推荐 |
|---|---|---|---|---|
| ElevenLabs IVC | ★★★★★ | $5/月 | ★★★★★ | ★ 首选 |
| Coqui XTTS v2 | ★★★ | 免费 | ★★★★ | ★ 备选（需 GPU）|
| OpenVoice v2 | ★★★ | 免费 | ★★★ | ✗ 不推荐 |
| F5-TTS | ★★★ | 免费 | ★★ (DE) | ✗ DE 不推荐 |
| minimax German_FriendlyMan | ★★★★★ | 已用 | ★★★ | 当前 v7 |

详细推荐路径见文档。

---

## 验证

### A · A/V 同步
- [x] step 24 实测漂移 1119ms（v6 是 427ms）— **故意多 wait 1s 让视觉完成**
- [x] 抽帧 t=124s: "DESIGN-ARTEFAKT · KEIN GEGENBEWEIS" badge 完整可见
- [x] 全片 32 步 drift log：多数 <50ms，最大 1119ms（仅 step 24）
- [x] 末段 step 32 drift 487ms（合理累积）

### B · minimax 切换
- [x] `mmx speech synthesize` auth 验证通过
- [x] 3 个 DE voice 都可用：`German_FriendlyMan` / `German_PlayfulMan` / `German_SweetLady`
- [x] 选 `German_FriendlyMan`（mature male，匹配 v6 de-DE-ConradNeural 气质）
- [x] 32 mp3 全部 minimax 重合成，无 failed
- [x] minimax-clean.sh 正确剥离 `[EMPHASIS]` 标记
- [x] 双版本（BWKI-spec 7.49 MB + 4K 19.19 MB）产出

### C · Voice Cloning 报告
- [x] `docs/voice-cloning-feasibility.md` 写完
- [x] 5 方案对比表 + 推荐路径 + 实施步骤 + 风险评估
- [x] 不实做克隆（用户选择）

### 整体
- [x] `npx tsc --noEmit` 通过
- [x] 录音完成（漂移 < 100ms 大多数，step 24 故意 1.1s）
- [x] 双版本 MP4 产出
- [x] loudnorm EBU R128 不变

---

## 最终产物

| 文件 | 大小 | 分辨率 | 时长 | 用途 |
|---|---|---|---|---|
| `renders/final/LinguaGraph_BWKI2026_Pitch.mp4` | **7.49 MB** | 1344×768 @ 24fps | 169.4s | ★ BWKI 2026 提交 |
| `renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4` | **19.19 MB** | 3840×2160 @ 24fps | 169.4s | 高分屏 / 母版 |

- 编码：H.264 (CRF 18/20) + AAC LC 48kHz mono (192k/256k)
- 响度：loudnorm I=-16 / TP=-1.5 / LRA=11 (EBU R128)
- 配音：minimax German_FriendlyMan（v7 新增）

---

## 与 v6 差异表

| 项 | v6 | v7 |
|---|---|---|
| TTS provider | edge-tts-emphasis (--rate=-15%) | **minimax German_FriendlyMan** (更自然) |
| Emphasis 模拟 | yes（slow + loud）| **no**（mmx 自身有自然重音）|
| A/V 同步修复 | 仅保护 crossfade | **+ VISUAL_END_BY_STEP**（视觉不被切）|
| 音频总长 | 188.5s | **169.4s**（minimax 更快）|
| 文档 | PIPELINE-v6 | PIPELINE-v7 + **voice-cloning-feasibility** |

---

## 不在本计划范围

- ❌ 实际 voice cloning 实施（用户选"minimax switch + research"，不实做克隆）
- ❌ 改 SideRail 字号/对比度（投影问题由 4K 解决；非紧急）
- ❌ 改 32 段 narration text
- ❌ 改 visual scene 数据/动画
- ❌ 删除 edge-tts-emphasis.sh（保留作为 fallback provider）

---

## 已知非问题

**minimax 音频无显式 emphasis**：v6 用 edge-tts `--rate=-15%` 模拟重音（"blinder Fleck" 减速），v7 minimax 没有对应机制。但 minimax 自身语音有自然情感起伏，**听感上更自然**胜过 v6 的"机械重音"。

**total duration 从 188.5s 缩到 169.4s**：minimax 速度比 edge-tts 快约 10%。这对评委无影响（都在 2-3 分钟窗口内）。

**step 24 drift 1.1s**：这是 v7 故意行为（visualEndMs=1800+100=1900ms 等视觉完成）。最终视频里 step 24 有 1.9s 视觉停留 + 1s 音频 → 视觉不被切。

---

## 后续建议（v8+）

1. **录制 Jiajun Rong 真声样本**（3-5 分钟 DE）→ 上传 ElevenLabs IVC → 替换 minimax（成本 $5/月）
2. 或保持 minimax — v7 自然度已经够用，评委对 TTS 反馈"可接受"
3. **Coqui XTTS** 是完全免费/隐私安全的备选，但需要 GPU 一次性配置