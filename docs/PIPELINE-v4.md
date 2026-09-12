# PIPELINE-v4 — `/web-video-presentation` 单章重建

> **Status**: v4 fertig (2026-09-11) · 5.09 MB · 201.5s · H.264+AAC · DE-Narration ohne Untertitel · indigo-porcelain Theme

## Context — 为什么 v4 取代 v3

v3 (MiniMax Design + ffmpeg 装配) 报废的原因:
1. **音频和视频不对应** — 6 段 ffmpeg 拼接 visual 67.6s vs 总长 203s 严重不匹配,靠 `tpad` 静帧 hold 撑时长
2. **不需要完全使用那些素材** — MiniMax roughcut 粒度太粗,一图念 30s+
3. **每个说话点都需要专属视觉/动图/动画** — 当前是"一图念 30s"
4. **除了配色和比赛硬性要求外完全推倒**

**保留**:
- 配色 token(米色纸感 `#F5EFE4` + 红 `#C44536` + 衬线)→ 用户重新选择 **indigo-porcelain**(靛蓝瓷学术气质:靛蓝当墨 `#0a1f3d` + 瓷白 `#f1f3f5` + Playfair Display italic + Noto Serif SC + IBM Plex Sans)
- 比赛硬规格:1344×768 @ 24fps · H.264+AAC · 2-4 min · EBU R128 loudnorm I=-16/TP=-1.5/LRA=11
- SSOT:`nach/docs/narration_de.md`(DE 口播稿)/ `nach/docs/storyboard.md`(6 幕)/ `nach/docs/faktencheck.md`(已 2026-09-11 签字)/ `nach/wissen-pack/`

**v4 决策(User 拍板)**:
- 整个视频 = **1 chapter × 32 step**(每个说话点一个 step)
- **删除 EN 字幕烧入**(User-Feedback 2026-09-11) — DE 视频,DE 评委看得懂,字幕过大抢戏

## 架构:1 Chapter × 32 Step × indigo-porcelain

### 单章结构
```
nach/presentation/src/chapters/01-linguagraph-pitch/
  ├── LinguagraphPitch.tsx      # 32 个 if (step === N) 分支
  ├── LinguagraphPitch.css      # .lp-* 样式,token-only
  ├── narrations.ts      ★     # step + 口播 SSOT (32 entry)
  └── data.ts                   # 数字 / 节点 / bar 数据
```

### 6 个叙事段(visual movement,单章内 6 段变奏)
| Movement | step 范围 | 节拍主题 |
|---|---|---|
| Cover (NEW) | step 0 | LinguaGraph 编辑级封面(作者 + tagline + 学校) |
| M1 Hook | step 1–4 | 三语问"自由" → 答案分裂 → Dasselbe Wort → LinguaGraph tagline |
| M2 Problem | step 5–10 | KI 全球部署 → 英文训练 → DE·ZH 分裂案例 → 评价盲点 |
| M3 Methode | step 11–17 | 不可见的怎么测 → LLM 即受试者 → 5 主题×3 语言 → 概念图 → LDS 公式 |
| M4 Befund | step 18–22 | 50 模型/55 测 → p<0.05 文化模式 → Mathe 收敛 → 关系也分裂 |
| M5 Reflexion | step 23–26 | N=15 设计伪影 → 8 EN 对不显著 → 0.10 启发式 |
| M6 Anwendung | step 27–31 | 开发者/监管者/研究者用例 → LinguaGraph. Sichtbar. Danke. |

## 工作流

### Phase 0:清理(2026-09-11 完成)
- 删除 v3 装配脚本 `assemble.py` + v3 中间产物 `renders/v3/` + v3 MiniMax 视觉 `visuals/`
- 备份 v3 终版为 `renders/final/.v3-backup.mp4`
- 备份 v3 TTS 为 `video/public/.audio-v3-backup/`

### Phase 1:内容(2026-09-11 完成)
- `nach/script.md` = `nach/docs/narration_de.md` 软链副本
- `nach/outline.md` = 单章 outline + 32 step + 信息池
- Step 0 是新建的 Cover narration,合成时单独处理

### Phase 2:网页开发(2026-09-11 完成)
- `bash scaffold.sh ./presentation --theme=indigo-porcelain`
- 删 01-example,新建 01-linguagraph-pitch
- `LinguagraphPitch.tsx` 32 个 `if (step === N)` 全实现,每个独立视觉演示
- `STORAGE_KEY` bump 到 `v5`(因为 step 数变了)
- `npx tsc --noEmit` 通过

### Phase 3:音频合成(2026-09-11 完成)
- 新建 `scripts/tts-providers/edge-tts.sh`(基于 README 现成片段)
- 32 mp3 用 edge-tts de-DE-ConradNeural 合成(总 201.43s)
- `scripts/concat-audio.mjs` 用 ffmpeg concat demuxer 无损拼接 → `all.mp3`

### Phase 4:录屏 + 后期(2026-09-11 完成)
- **关键调整**:Playwright 浏览器内 auto-playback 在 headless 下不稳(audio.ended 事件不触发),改用"手动逐 step 截图"策略:
  - `record.mjs` 以 `?manual=1` 加载,逐帧 `page.mouse.click(960, 540)` 推进 32 步
  - 每帧等 3s 让 MaskReveal/stagger 动画 settle 后 `page.screenshot()`
  - 输出 32 张 1920×1080 PNG
- `post-frames.mjs` 用 ffmpeg concat demuxer + 测得的 mp3 时长拼接:
  - 写入 `_concat.txt`,每帧 `duration <sec>` 标注停留时长
  - ffmpeg 编码为临时 `video.mp4`(H.264 1344×768 @ 24fps)
  - 二次 ffmpeg mux 音频 + loudnorm + faststart
  - 输出 `renders/final/LinguaGraph_BWKI2026_Pitch.mp4`

### Phase 5:faktencheck(2026-09-11 完成)
- 已签字 2026-09-11 红线保留
- v4 新增项:每步独立视觉 / 音画 1:1 同步 / 32 step 验证 / 无字幕(2026-09-11 用户决定)

## 关键约束(从 CHAPTER-CRAFT.md)

1. 每章至少 1~2 处 CSS/SVG/Canvas/JS 视觉演示 ✓(每 step 都有)
2. 1 项 = 1 step ✓
3. 画面信息密度 > 口播 ✓(信息池每 step 都用)
4. 颜色 / 字体全走 token ✓(无硬编码 hex)
5. `narrations.ts` length === 最大 if(step===N)+1 ✓(32 === 32)
6. 每步动画时长 ≤ 口播时长 ✓(MaskReveal 总延迟 ~2.5s ≤ 平均 6.2s/段)
7. 不紫粉渐变 / 圆角彩边 / emoji / 假数据 ✓

## 与 v3 差异

| 项 | v3 | v4 |
|---|---|---|
| 章节数 | 6 | 1 |
| step 数 | 6 段 ffmpeg 拼接 | 32 step 每步独立视觉 |
| 视觉粒度 | 每段 1 视觉 ~30s | 每 step 1 视觉 ~6.5s |
| 音画同步 | ❌ 67.6s visual vs 203s total | ✅ 每 step 精确对齐 |
| TTS | 6 段固定 | 32 段按需 |
| 主题 | MiniMax paper-craft | indigo-porcelain token |
| 录屏 | 无(直接合成) | Playwright 32 帧 |
| 字幕 | EN 烧入 | 删除(用户拍板) |
| 封面 | PPT-style hero question | 编辑级 Cover |

## 不在本计划范围

- ❌ 修改 `BWKI-2026-备战/` research repo(只读)
- ❌ 修改 narration_de.md(用户明确)
- ❌ MiniMax Design 再生成任何视觉(用户明确)
- ❌ 多章节并行/选择开发模式(单章无此需求)