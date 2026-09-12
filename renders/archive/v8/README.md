# v8 Archive

> **Status**: v8 4K 自动版已被 v10 替换（用户决定升级到 173s 用户无损压缩版）。
> 原 117.5MB `LinguaGraph_BWKI2026_Pitch_4K.mp4` 在 v10 整理过程中被 15MB 用户无损压缩版覆盖。**原始 v8 4K 文件已不可恢复**。

## v8 概要（2026-09-11 交付）

- 时长：212.13s（含 PAUSE_MAP 节奏 hold 38.6s）
- 分辨率：3840×2160 (4K)
- 帧率：24fps
- 视频码率：615kbps H.264
- 音频：AAC 单声道 48kHz 192kbps
- 大小：原 117.5MB → 现已被 15MB v10 用户无损压缩版覆盖

## v8 关键设计决策

- PAUSE_MAP 32 段差异化停顿表（MICRO 0.4s · BREATHING 1.5s · SECTION 2.2s · CLIMAX 2.5-3s）
- cumulativeMs 公式重构：Σ(audio + pause) 把 pause 编入 timeline
- SideRail pulse 微动效（body.is-holding · sr-pulse 1.6s keyframes）
- TRIM_DURATION 198 → 215（v8 拉长后）

## v8 文档

见 `docs/PIPELINE-v8.md`（仓库 docs/ 目录）。

## 后续建议

如果需要 v8 4K 自动版的视觉效果参考，可重新跑 v7 流水线 + v8 PAUSE_MAP 重录（需要重合成 32 mp3 + record-video.mjs · post-process.mjs），但用户已确认 v10 用户剪辑版是最终版，**无需重做**。
