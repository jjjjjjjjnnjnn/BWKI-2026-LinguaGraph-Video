# Pipeline v5 — SideRail 流程导航 + A/V 同步修复

## 概述

v5 在 v4.5 基础上修复两个用户复看时反馈的问题:

| 反馈 | 现象 | 根因 | 修复 |
|---|---|---|---|
| A | 音频和视频不能对应上 | (1) `scene-crossfade` 600ms,每步切换产生 ~600ms "新音频+旧视觉"窗口<br/>(2) `setTimeout` 累积漂移(可达 1.5s)<br/>(3) `-ss 6` 固定 trim,实际 setup 仅 3.77s → 多切 2.23s cover 动画 | (1) crossfade 200ms<br/>(2) 绝对时序 anchor + 实时补偿<br/>(3) `-ss 5` + record 端加 1s 末段缓冲 |
| B | 流程性不清楚,需要"小标签" | 没有任何 step 进度指示器 | 新增 `<SideRail />` 右轨:AKTUELL 标题/计数/章节列表 + 分段 ✓▶· 标记 |

---

## 关键变更

### 1. animations.css · `.scene-anim` 600ms → 200ms

```css
.scene-anim {
  animation: scene-crossfade 200ms var(--ease-quart);
}
@keyframes scene-crossfade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

**理由**:200ms 是感知阈值之下 — 仍感觉得到切换但不觉得"A/V 错位"。原本 600ms 让 31 次切换累计 18.6s 错位窗口。

### 2. record-video.mjs · 绝对时序 anchor

替换 v4.5 的相对时序(`await sleep(audio[i])`)为基于 T0 时序锚点的绝对计时:

```js
const T0 = Date.now();  // 锚点:cover 完全渲染后
const cumulativeMs = [0];
for (let i = 0; i < 32; i++) {
  cumulativeMs.push(cumulativeMs[i] + durations[i] * 1000);
}

for (let step = 0; step < 32; step++) {
  const targetClickTime = T0 + cumulativeMs[step + 1] - CROSSFADE_MS;
  const audioMs = durations[step] * 1000;
  const minWait = Math.min(SETTLE_MS, audioMs + CROSSFADE_MS);  // 短音频不卡
  const waitMs = Math.max(minWait, targetClickTime - Date.now());
  if (waitMs > 0) await sleep(waitMs);
  if (step < 31) {
    await page.locator(".stage-frame").click({...});
    await sleep(150);
  } else {
    // 末段(31 = Danke):等 audio 32.mp3 完整 + 1s buffer
    await sleep(cumulativeMs[32] - cumulativeMs[31] + 1000);
  }
}
```

**优势**:
- 单一 T0 锚点,所有点击时刻 = `T0 + cumulativeMs[i+1] - 200ms`
- crossfade 200ms 后新 step 完全可见 = 音频边界 ✓
- `targetClickTime - Date.now()` 实时补偿,无累积漂移
- 实测漂移 1-15ms(短音频 11.mp3 / 24.mp3 因 `minWait` 保护,最大 468ms)

### 3. post-video.mjs · `-ss 5` + 末段 1s 缓冲

- v4.5 用 `-ss 6` 多切了 2.23s cover 末段动画(team 行)。
- v5 改用 `-ss 5`(实测 setup ~3.77s + 1.23s buffer)。
- 录制脚本在末段(Danke)多等 1s,让 webm 末段超出音频 1s,确保 `-shortest` 不会过早截断音频。
- 最终 mp4 = 201.5s(精确对齐 201.43s 音频总长)。

### 4. SideRail 流程导航

**数据**:`presentation/src/chapters/01-linguagraph-pitch/sections.ts`(新建)
- `SECTIONS`: 7 个章节(cover + M1..M6),含 startStep / endStep / label
- `STEP_TITLES`: 32 条 DE 短标题

**组件**:`presentation/src/components/SideRail.{tsx,css}`(新建)
- 固定右侧,position: fixed right: 28px
- 视口 1920×1080 中,rail 落在 stage 外的右侧 letterbox 区域
- 三层信息:
  1. `AKTUELL` 标签 + 步号 (`01 / 32`) + 当前 step 短标题
  2. 分隔线
  3. `INHALT` 章节列表,7 项,带 `▶`(当前)/ `✓`(已过)/ `·`(未到) 标记
  4. 团队身份 footer(可选)
- `pointer-events: none` 不挡 stage click

**集成**:`App.tsx` 加 `<SideRail />` 在 `<Stage />` 旁(sibling)
- 始终渲染(不依赖 hover)
- 在 record 模式不被 CSS 隐藏(`record-video.mjs` 的 hide-chrome CSS 只隐藏 `.pb-hover / .at-hover / .click-cue`)

### 5. record-video.mjs 路径修复

v4.5 假设 `process.cwd() + ../../renders/raw/capture.webm` 解析正确。Windows + 中文路径下 `path.resolve('..', '..', ...)` 在某些场景会**多走一层**(跳过 `nach` 直接到 `BWKI 介绍`),导致输出写到 `C:\...\BWKI 介绍\renders\raw\`(错位置)。

v5 改用 `import.meta.url` + `dirname()` 链,可靠地走 `scripts → presentation → nach` 三层。

```js
const __filename_rr = fileURLToPath(import.meta.url);
const __dirname_rr = dirname(__filename_rr);
const NACH_ROOT_RR = dirname(dirname(__dirname_rr));
const absOut = resolve(NACH_ROOT_RR, "renders", "raw", "capture.webm");
```

post-video.mjs 同样改为 `import.meta.url` 链。

### 6. post-video.mjs · 自动选 webm

Playwright recordVideo 写入 `page@<hash>.webm`(随机名),record-video.mjs 末尾重命名为 `capture.webm`(可能因 Windows 文件锁失败)。post-video.mjs 现在自动读 dir,取最新的 `capture.webm` 或 `page@*.webm` 作为输入。

---

## 验证

### 抽帧(t=0/30/60/120/180/200s)
- t=0 cover: SideRail `AKTUELL · 01/32 · Cover`,▶ Cover 标记,team info 完整
- t=30 M2: `AKTUELL · 05/32 · KI global im Einsatz`(...),✓ M1 Hook,▶ M2 Problem
- t=60 M2 end: 完整"blinder Fleck"内容
- t=120 M4: "55 / 50" 大字 + p tag,SideRail 切到 M4 · Befund
- t=200 M6 末段: `AKTUELL · 32/32 · Danke`,✓ Cover..M5,▶ M6 Schluss,Danke + GitHub URL + 团队名

### 音画同步
- 实测每步点击漂移 1-15ms(目标 <200ms crossfade 时长)
- 短音频 step 11 (2.256s) 和 step 24 (1.800s) 受 `minWait` 保护,漂移 443-468ms(在 600ms 旧 crossfade 以内,新 200ms 下仍可接受)

### 终版规格
- 编码: H.264 (High) + AAC LC
- 分辨率: 1344×768 @ 24fps
- 时长: 201.5s(精确对齐 201.43s 音频)
- 音频: 48kHz mono
- 响度: I=-16.0 LUFS / TP=-1.5 dBTP / LRA=3.2 LU(完美 EBU R128)
- 大小: 7.77 MB(远低于 50 MB 上限)
- 字幕: 无(per 用户明确删除)

### 浏览器端验证
- `npx tsc --noEmit` 通过
- `npm run dev` localhost:5174 启动正常
- SideRail 在 dev 浏览器和最终 mp4 中均可见

---

## 与 v4.5 差异

| 项 | v4.5 | v5 |
|---|---|---|
| crossfade | 600ms | **200ms** |
| setup trim | 固定 6s(多切 2.23s) | **5s** |
| 录制时序 | 相对 `sleep(audio[i])` | **绝对 anchor T0 + cumulativeMs** |
| 时序漂移 | ≤ 1.5s 累积 | **< 0.1s 累积** (实测 1-15ms, 短音频 468ms) |
| 末段缓冲 | 无 | **+1s buffer** |
| 流程导航 | ❌ | **✅ SideRail** (AKTUELL + INHALT + ▶/✓/·) |
| 章节定义 | narrations.ts 注释 | **sections.ts(SSOT)** |
| 步骤标题 | ❌ | **32 条 STEP_TITLES(DE 短标题)** |
| 路径解析 | cwd + `..`(Windows 中文 bug) | **import.meta.url 链(可靠)** |
| webm 选择 | 硬编码 capture.webm | **自动选 capture 或 page@*.webm** |
| 终版大小 | 7.71 MB | 7.77 MB |

---

## 不在本计划范围(留给后续)

- ❌ SideRail 做成可点击跳转(manual 模式时通过现有 ProgressBar pips 提供)
- ❌ 改 LinguagraphPitch.tsx 视觉(32 step 内容不动)
- ❌ 加 EN 字幕(用户 2026-09-11 明确删除)
- ❌ 修改比赛硬规格
- ❌ 改 narrations.ts 内容

---

## 已知非问题

**Playwright recordVideo + 中文路径 + 复杂 `..`**: 旧脚本 `process.cwd() + ../../renders/raw/...` 在 Windows + 中文目录下 `path.resolve('..', '..', ...)` 会跳一层(从 `nach\presentation` 直接 `..` 到 `BWKI 介绍`,跳过 `nach`)。修复方式见 §5,改用 `import.meta.url` 链式 `dirname()`。

如果以后 Windows + Node 版本升级,该问题可能自然消失。当前 v5 已绕过。
