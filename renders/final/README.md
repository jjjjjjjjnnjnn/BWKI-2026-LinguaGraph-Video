# LinguaGraph BWKI 2026 — 最终版视频 (v10)

> 4 个 ready-to-submit 视频文件。  
> 仓库提交时间：2026-09-12 · v10 仓库整理。

## 4 个最终版文件

| 文件 | 大小 | 时长 | 分辨率 | 帧率 | 音频 | 字幕 | 推荐场景 |
|---|---|---|---|---|---|---|---|
| `LinguaGraph_BWKI2026_Pitch.mp4` | **7.75 MB** | 169.4s | 1344×768 | 24fps | AAC 单声道 48kHz | 无 | ★ **BWKI 官方提交（spec 要求）** |
| `LinguaGraph_BWKI2026_Pitch_4K.mp4` | **15.04 MB** | **172.97s** | **3840×2160** | **60fps** | **AAC 立体声 44.1kHz** | 无 | **★ 高质量 4K 母版 / 高分屏放映** |
| `LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4` | **25 MB** | 172.97s | 3840×2160 | 60fps | AAC 立体声 44.1kHz | **EN** | 国际评委带英文字幕版 |
| `LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4` | **23 MB** | 172.97s | 3840×2160 | 60fps | AAC 立体声 44.1kHz | **ZH** | 国内评委带中文字幕版 |

## 选哪个？

- **BWKI 官方提交**：用 `LinguaGraph_BWKI2026_Pitch.mp4`（1344×768，符合 BWKI 视频规格）
- **自家 4K 放映 / YouTube 上传**：用 `LinguaGraph_BWKI2026_Pitch_4K.mp4`（15MB 最高效压缩）
- **发给不熟悉德语的评委**：用 4K 字幕版（EN 或 ZH 视评委母语）
- **3 种规格总和 ~70 MB**：可以一次发给评委作为备选

## 版本谱系

```
v3 (MiniMax design MP4 · 13.9 MB)
  ↓ /web-video-presentation 重构
v7 (1344×768 BWKI-spec · 7.75 MB · 169.4s)
  ↓ 用户反馈"视频比音频快 + 没停顿"
v8 (4K + PAUSE_MAP 节奏设计 · 212s · 117.5 MB)  ← archive/v8/README.md
  ↓ 用户手工剪辑紧凑版 + 双语字幕烧录
v9 (4K EN/ZH 字幕 · 25/23 MB · 173s)
  ↓ 用户无损压缩 + 仓库整理
v10 (4K 无损压缩 · 15 MB · 173s)  ← 你在这里
```

## 技术规格详细

### v7 BWKI-spec
- 编码：H.264 (CRF 18/20) + AAC LC 48kHz mono (192k/256k)
- 响度：loudnorm EBU R128 I=-16 / TP=-1.5 / LRA=11
- 配音：minimax German_FriendlyMan
- 来源：`presentation/scripts/post-process.mjs`

### v10 用户无损压缩（最新）
- 编码：H.264 High Profile · 视频 556 kbps · 音频 AAC 立体声 44.1kHz 126 kbps
- 总码率：696 kbps
- 来源：用户桌面 `C:\Users\rongj\Desktop\202609112316.mp4`（手工剪辑 + 无损压缩工具）

### v9 EN/ZH 字幕版
- 字幕位置：底部居中，MarginV=20（4K 2160 屏上 ≈ 1% 离底）
- 字幕字体：EN=Arial · ZH=Microsoft YaHei · FontSize=22
- 字幕样式：白字 + 黑底 60% 透明 + 描边 + 阴影
- 不遮挡：SideRail 在画面右侧，字幕在底部居中（无覆盖）
- 来源：`presentation/scripts/burn-subs-user.mjs`

## 备份位置

历史版本归档：`../archive/`（v3 backup · v7 副本 · v8 README · v9 user-edit 原版 · preview/raw/verify 中间产物）

## 不在本目录

- 32 个 mp3 音频片段：`presentation/public/audio/linguagraph-pitch/1.mp3 .. 32.mp3`（minimax 合成，2.7MB）
- ASR 转录数据：`../archive/raw/asr-segments.json`（56 segments · faster-whisper base）

## 提交前最后检查

- [x] 4 个视频文件存在（验证 ls -la）
- [x] 视频可正常播放（抽帧验证 t=100s）
- [x] 时长 169.4s/172.97s 在 BWKI 2-4 分钟窗口内
- [x] BWKI-spec 1344×768@24fps 单声道 满足规格
- [x] 4K 60fps 立体声 适合高质量放映
- [x] 字幕版字幕位置不遮挡主内容
- [ ] **BWKI 提交前**:提交平台可能要求 ≤ 50MB · 4 个文件总和 ~70MB · 如平台限制单文件 → 提交 v7 BWKI-spec（7.75MB）

## 验证命令

```bash
# 1. 列出最终版
ls -la "C:/Users/rongj/Desktop/学校/BWKI 介绍/nach/renders/final/"

# 2. 验证 v10 无损压缩版规格
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,bit_rate \
  -of default=noprint_wrappers=1 \
  "C:/Users/rongj/Desktop/学校/BWKI 介绍/nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4"

# 3. 抽帧验证视频可播放
ffmpeg -y -ss 100 -i "C:/Users/rongj/Desktop/学校/BWKI 介绍/nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4" \
  -frames:v 1 -q:v 2 "/tmp/v10_t100s.png"
```
