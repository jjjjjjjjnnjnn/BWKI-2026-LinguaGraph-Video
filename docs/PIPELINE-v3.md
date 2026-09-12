# PIPELINE v3 — LinguaGraph BWKI 2026(2026-09-10 重写)

> **取代** 旧 `docs/handoff.md`(Remotion + Blender + ComfyUI 三栈架构)
> **新架构** 资产 ingest + ffmpeg 装配(零代码依赖)

---

## 为什么重写

旧管线用 Remotion 4.0.252 做 6 幕分镜 + TTS 同步 + 字幕烧录,但视觉走的是程序化代码渲染(深色 Apple-keynote + 金色粒子)。新方向是 MiniMax Design 出图 → 预渲染 MP4 → ffmpeg 装配:

- **风格统一**:所有视觉来自同一 MiniMax Design 通道(米色纸感 + 衬线 + 红强调)
- **零代码依赖**:不再有 React/Remotion/Node.js/Blender/ComfyUI 工具链
- **3-5 分钟装配**:`python assemble.py` 一次性出 203s 终版
- **可热替换**:改某幕视觉 = 替换 `visuals/s0X-final.mp4` + 跑一次脚本

---

## 新目录结构

```
nach/
├── README.md                       # 项目 30s 概览(旧版,待 v4 更新)
├── INDEX.md                        # 工作空间地图(待 v4 更新)
├── assets_meta.md                  # 资产来源台账(待 v4 更新)
├── assemble.py                     # ★ 新装配入口
│
├── visuals/                        # ★ MiniMax 视觉资产
│   ├── SOURCE.md                   # 每张图/视频的来源 + 模型 + 参数
│   ├── s01-hook.mp4                # ★ ffmpeg 占位(待 MiniMax 替换)
│   ├── s02-final.mp4               # MiniMax Design 输出
│   ├── s03-final.mp4               # ...
│   ├── s04-final.mp4               # ...
│   ├── s05-final.mp4               # ...
│   ├── s06-final.mp4               # ...
│   ├── roughcut-reference.mp4      # 203s 时间样本(无声)
│   └── stills/                     # 4 张主帧(2560×1440)
│
├── docs/                           # 内容 SSOT(不变)
│   ├── storyboard.md ★             # 6 幕分镜
│   ├── narration_de.md ★           # 德文 Sprechtext
│   ├── subtitles_en.srt ★          # 英文字幕(7 cues)
│   ├── faktencheck.md ★            # 上传前必过清单
│   ├── handoff.md                  # 旧版,已被本文件取代
│   ├── INDEX.md                    # 阅读顺序
│   ├── euaufbau.md                 # 旧索引(冗余,可删)
│   └── PIPELINE-v3.md              # ★ 本文件
│
├── video/                          # 缩减为只保留音频 + figures
│   └── public/
│       ├── audio/                  # 6 个 TTS MP3(de-DE-ConradNeural)
│       └── figures/                # 29 PNG + 10 CSV figure 快照
│
├── wissen-pack/                    # 项目背景包(不变)
│   └── ...
│
├── renders/                        # 输出
│   ├── v3/                         # ★ 中间产物:seg_01..06.mp4 + merged.mp4 + concat.txt
│   └── final/
│       └── LinguaGraph_BWKI2026_Pitch.mp4  # ★ 终版
│
└── (已删除)                       # 旧管线
    ├── video/src/                  # Remotion scenes / components / lib / data
    ├── blender/                    # 占位(无 .blend)
    ├── comfy/                      # 占位(无 workflow)
    ├── tooling/                    # 旧 tts_edge.py + assemble.ps1
    ├── handoff-minimax/            # 旧 MiniMax Design 交接
    └── .agents/                    # 旧 skills bundle
```

---

## 3 步走完整流水线

```bash
# 前提:Python 3.11+ · ffmpeg 8.1+ · visuals/ 资产齐备

cd "C:/Users/rongj/Desktop/学校/BWKI 介绍/nach/"

# 1. (可选) 验证 6 个 visual + 6 个 audio 都在
python -c "from pathlib import Path; print(list(Path('visuals').glob('*.mp4'))); print(list(Path('video/public/audio').glob('*.mp3')))"

# 2. 完整装配(全 203s, 含字幕烧录 + loudnorm)
python assemble.py

# 3. 校验产物
python assemble.py --verify-only
ffprobe renders/final/LinguaGraph_BWKI2026_Pitch.mp4
```

### 调试用法

```bash
# 单幕构建(快速验证某段时长)
python assemble.py --segment 03

# 跳过字幕烧录(快速验证装配)
python assemble.py --skip-subs

# 只跑 ffprobe 校验,不再渲染
python assemble.py --verify-only
```

---

## 6 幕时间对齐

| 幕 | 总时长(SSOT) | visual 时长 | hold |
|---|---|---|---|
| S01 Hook + Team | 29s | 29s | 0(visual 撑满) |
| S02 Problem | 32s | 12.25s | 19.75s(static hold) |
| S03 Methode | 46s | 15.08s | 30.92s(static hold) |
| S04 Befund | 39s | 15.08s | 23.92s(static hold) |
| S05 Reflexion | 25s | 10.13s | 14.87s(static hold) |
| S06 Anwendung | 32s | 15.08s | 16.92s(static hold) |
| **总** | **203s** | 67.62s | 135.38s |

**Hold 策略**:ffmpeg `tpad=stop_mode=clone:stop_duration=99999` 在 visual 末尾无限补最后一帧,然后 `trim=end=DURATION` 切到幕时长。MP4 解码器默认 last-frame display,无需额外处理。

**音频淡入淡出**:每幕音频首尾各 0.4s 淡变(避免硬切"啵"声)。

---

## 字幕烧录

ffmpeg `subtitles=` filter + ASS 风格的 `force_style`:

| 属性 | 值 |
|---|---|
| 字体 | Georgia(Windows 系统字体,衬线) |
| 字号 | 22 |
| 主色 | 白色 `#FFFFFF` |
| 描边 | 黑色 1.5px |
| 背景 | 半透明黑底 `BorderStyle=4` |
| 对齐 | 底部居中(`Alignment=2`) |
| 边距 | 距底 60px |

字幕文件:`docs/subtitles_en.srt`(7 cues,1:1 对应 6 幕,共 ~210 字英文)

---

## 响度归一化

EBU R128 loudnorm filter,两遍处理:

```
-af "loudnorm=I=-16:TP=-1.5:LRA=11"
```

| 目标 | 值 |
|---|---|
| 集成响度 I | -16 LUFS(BWKI/YouTube 标准) |
| 真峰值 TP | -1.5 dBTP |
| 响度范围 LRA | 11 LU |

---

## 视觉规范(MiniMax Design 沿用)

```
背景:      #F5EFE4 米色纸
强调色:    #C44536 红/砖红
辅助灰:    #3E4A5C slate
字体:      衬线(EB Garamond/Caslon → Windows 实际用 Georgia)
sans:     Calibri / Segoe UI(副信息)
布局:      大量留白,信息块居中或三分
信息图:    3D 浮雕剪纸图标(米色单色 + 浮雕阴影)
边缘:      手撕纸效果
数据图:    手绘风条形图,主线单一红色高亮,其余灰色
节奏:      慢、安静、有呼吸感
水印:      S04 右下角 "MiniMax Design × MiniMax"(S05/S06 不显)
```

---

## 已知限制

- **S01 visual** 是 ffmpeg drawtext 占位版,等 MiniMax Design 出最终 still 后替换 `visuals/s01-hook.mp4`
- **分辨率**:1344×768(非 1080p);若 BWKI 提交要求 1920×1080,加 `scale=1920:1080` filter
- **FPS**:24(锁定,避免音频重采样)
- **字幕**:仅英文(BWKI 强制);如需多语种,改 `subtitles=` 为多 filter 链
- **静态 hold**:visual 后段是最后一帧静态显示,理论上不会引起评审注意;若用户审片觉得突兀,v2 改 `xfade=transition=fade` filter

---

## 升级路径

| 想做的事 | 改哪里 |
|---|---|
| 替换 S01 视觉 | 出新 `s01-hook.still.png`,改 `assemble.py` drawtext 命令为 input PNG + Ken Burns |
| 改某幕时长 | 改 `ACTS[idx]["duration"]`,改 `docs/storyboard.md` 一致 |
| 加 crossfade | 在 `concat_segments()` 用 `xfade` filter 替代 `-c copy` |
| 替换字体 | 改 `burn_subs_and_loudnorm()` 的 `FontName=` |
| 字幕多语种 | 加 `docs/subtitles_zh.srt` 等,串联 `subtitles=` filter |
| 输出 1080p | 改 W/H = 1920/1080,加 `scale` filter 或换 lanczos 重采样 |
| 加章节标记 | ffmpeg `-metadata title=` + `-metadata description=` |

---

## 故障排查

| 症状 | 原因 → 修复 |
|---|---|
| `subtitles=` 找不到文件 | 路径需 forward slashes(已用 `as_posix()`) |
| `loudnorm` 二次测量错误 | ffmpeg 8.1 默认 single-pass OK;若双-pass 报错,加 `loudnorm=...:print_format=json` 跑一遍测量再贴值 |
| `tpad` 后黑屏 | `stop_mode=clone` 必填;否则默认 `add` 加黑帧 |
| 字体显示为方框 | Windows 路径转义问题:用 `C\\:/Windows/Fonts/...` 双反斜杠 + 单冒号 |
| `afade` 报错 | 时长参数超界:确保 `t=out:st=D-0.4:d=0.4` 中 `st+d ≤ duration` |
| 最终 MP4 < 200s | 检查每幕 ACTS[].duration 和;总 = 203s |
