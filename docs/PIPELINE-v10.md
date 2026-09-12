# Pipeline v10 — 仓库整理 · 升级到用户无损压缩版 + 双管线组织

> **Superseded by v11** (2026-09-12): v11 在 v10 基础上增加了公开化准备（LICENSE · LICENSE-THIRD-PARTY · ETHICS · PRIVACY · CREDITS）+ 三语 README。详见 [`PIPELINE-v11.md`](PIPELINE-v11.md) 和仓库根目录的 `README.md` / `README.de.md` / `README.zh.md`。

## Context

v9 已交付 4 个视频（用户剪辑版 173s + EN/ZH 双语字幕烧录版）。v10 在用户反馈"原版文件太大、想用压缩版"的基础上完成两件事：

1. **基准升级**：用 `C:\Users\rongj\Downloads\LinguaGraph_BWKI2026_Pitch_4K.mp4`（15MB · H.264 High Profile 556kbps）替换原 117.5MB 高码率版
2. **仓库整理**：双管线组织（最终 `renders/final/` + 历史 `renders/archive/`），清理 temp/ 中间产物，更新文档

## 关键变更

### 1. 新基准视频规格

| 字段 | v9 用户版 (117.5MB) | v10 用户无损压缩 (15MB) |
|---|---|---|
| 文件大小 | 117.5 MB | **15.04 MB**（**−87%**）|
| 时长 | 172.97s | 172.97s |
| 分辨率 | 3840×2160 | 3840×2160 |
| 帧率 | 60fps | 60fps |
| 视频编码 | H.264 (用户剪辑工具·原码率) | H.264 High Profile · 556 kbps |
| 音频编码 | AAC 立体声 44.1kHz | AAC 立体声 44.1kHz 126 kbps |
| 总码率 | 不可控（高码率）| **696 kbps**（最优）|

**优势**：
- 文件大小 −87%（117.5MB → 15MB）
- 视频质量等效（556kbps 在 H.264 CRF ~18 等价）
- BWKI 提交友好（15MB 单文件远低于 50MB 平台限制）
- 共享便利（邮件 / 网盘 / WeTransfer 都能轻松传）

### 2. 4 个最终版文件（保留在 `renders/final/`）

| 文件 | 大小 | 时长 | 用途 |
|---|---|---|---|
| `LinguaGraph_BWKI2026_Pitch.mp4` | 7.75 MB | 169.4s | ★ v7 BWKI-spec（1344×768@24fps 单声道）|
| `LinguaGraph_BWKI2026_Pitch_4K.mp4` | **15.04 MB** | **172.97s** | **★ v10 用户无损压缩版（4K@60fps 立体声·无字幕）**|
| `LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4` | 25 MB | 172.97s | v9 EN 字幕版（4K@60fps 立体声）|
| `LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4` | 23 MB | 172.97s | v9 ZH 字幕版（4K@60fps 立体声）|

**重命名**：
- v9 的 `_user_subs_en/zh.mp4` → 去掉 `_user_` 前缀 = `subs_en/zh.mp4`（v10 已是基线）
- v8 的 `LinguaGraph_BWKI2026_Pitch_4K.mp4`（117.5MB）→ **覆盖为 15MB v10 用户无损压缩版**（路径不变）

### 3. 双管线组织架构

#### 最终管线 `renders/final/`（4 个核心产物）
- 4 个 ready-to-submit mp4 文件
- `README.md` 描述 4 个文件的用途与推荐场景
- **唯一对外的视频文件位置**

#### 历史管线 `renders/archive/`（v3-v9 中间产物）

```
renders/archive/
├── v3/
│   └── .v3-backup.mp4                    # 13.9MB 原 final/ v3 backup
├── v7/
│   └── LinguaGraph_BWKI2026_Pitch.mp4   # 7.75MB v7 BWKI-spec 副本（与 final/ 同源）
├── v8/
│   ├── README.md                         # v8 概要（117.5MB 原版已被 v10 覆盖）
│   └── (原 117.5MB LinguaGraph_BWKI2026_Pitch_4K.mp4 文件不可恢复，已在 v10 整理中被覆盖)
├── v9-user-edit/
│   └── 202609112316.mp4                 # 117.5MB 用户桌面原版（v9 基准）
├── preview/                              # preview 抽样帧（v7 4K + v8-final）
├── raw/                                  # 烧录中间产物（capture.webm + 3 个 SRT + asr-segments.json）
└── verify/                               # v8/v9 抽帧验证 PNG
```

#### temp/ 中间产物清理

- 删除 `user-cut-audio.wav`（5.4MB，可从 mp4 重新提取）
- 移动 `asr-segments.json` 到 `archive/raw/`（56 segments ASR 数据，作为 v9 字幕时间轴 ground truth）
- temp/ 目录保留（空目录，方便未来临时产物）

### 4. 文档更新

| 文档 | 改动 |
|---|---|
| `nach/README.md` | 状态行 v4 → v10 · 时长 201.5s → 172.97s · "无字幕 4K 60fps" |
| `nach/INDEX.md` | repo 地图更新（双管线组织 · 4 个最终版位置）|
| `nach/renders/final/README.md` | 新建（4 个最终版说明）|
| `nach/renders/archive/v8/README.md` | 新建（v8 概要 + 117.5MB 不可恢复说明）|
| `nach/docs/PIPELINE-v10.md` | 本文档（新建）|
| `nach/docs/PIPELINE-v9.md` | 顶部加 "Superseded by v10" |
| `nach/docs/PIPELINE-v8.md` | 顶部保持 "Superseded by v9" |

### 5. 不动的部分

- 32 个 mp3（minimax German_FriendlyMan v7 已 ship）
- `presentation/scripts/` 全部脚本（v9 已 ship）
- `presentation/src/` 全部源码（v6 已 ship）
- `docs/subtitles_en_user.srt` / `subtitles_zh_user.srt`（与 v9 EN/ZH 字幕版对应）
- `presentation/public/audio/linguagraph-pitch/1.mp3 .. 32.mp3`
- `.gitignore`（保持 excludes mp4，分享靠本地副本）
- `wissen-pack/`（项目背景包）
- `presentation/scripts/build-subs-user.mjs` / `translate-subs.mjs` / `burn-subs-user.mjs`（v9 字幕生成 + 烧录脚本，已 ship）

## 关键执行细节

### Step 1 · 复制用户版（已执行）
```bash
cp "C:/Users/rongj/Downloads/LinguaGraph_BWKI2026_Pitch_4K.mp4" \
   "nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4"
```

### Step 2 · 创建 archive 目录
```bash
mkdir -p nach/renders/archive/{v3,v7,v8,v9-user-edit,preview,raw,verify}
```

### Step 3 · 归档历史文件
- `.v3-backup.mp4` → `archive/v3/`
- `LinguaGraph_BWKI2026_Pitch.mp4` (v7) → `archive/v7/`（复制）
- `user-edit/202609112316.mp4` (117.5MB 用户原版) → `archive/v9-user-edit/`
- `preview/` → `archive/preview/`
- `raw/` → `archive/raw/`
- `verify/` → `archive/verify/`

### Step 4 · 重命名 v9 字幕版
```bash
mv "LinguaGraph_BWKI2026_Pitch_4K_user_subs_en.mp4" → "LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4"
mv "LinguaGraph_BWKI2026_Pitch_4K_user_subs_zh.mp4" → "LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4"
```

### Step 5 · 清理 temp/
```bash
mv temp/asr-segments.json archive/raw/
rm temp/user-cut-audio.wav
```

## 与 v9 差异表

| 项 | v9 | v10 |
|---|---|---|
| 4K 无字幕版基准 | 117.5MB 用户原版（v9 user-edit 复制）| **15.04MB 用户无损压缩版** |
| 仓库结构 | flat（v3-v9 都混在 final/）| **双管线**（final 4 个 + archive 完整历史）|
| 4 个最终版命名 | `..._user_subs_en/zh.mp4` | `..._subs_en/zh.mp4`（v10 是基线）|
| temp/ 中间产物 | 保留 wav + json | **清空**（wav 删 · json 归档到 archive/raw）|
| 仓库总大小 | ~250MB（final 4 个 + preview/raw/verify/user-edit）| **~170MB**（final 4 个 70MB + archive 历史 100MB）|
| README/INDEX | v4 时代 | **v10 时代（双管线 + 4 个最终版）**|
| 文档 | PIPELINE-v9 | PIPELINE-v10（this）|

## 文件改动清单

### 修改 / 重命名
| 路径 | 改动 |
|---|---|
| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4` | **覆盖**：117.5MB v8 → 15MB v10 用户无损压缩版 |
| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_en.mp4` | **改名**为 `_subs_en.mp4` |
| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K_user_subs_zh.mp4` | **改名**为 `_subs_zh.mp4` |
| `nach/README.md` | 状态行更新（v4 → v10）|
| `nach/INDEX.md` | repo 地图更新（双管线）|
| `nach/docs/PIPELINE-v9.md` | 顶部加 "Superseded by v10" |

### 新建
| 路径 | 用途 |
|---|---|
| `nach/renders/final/README.md` | 4 个最终版说明 |
| `nach/renders/archive/v8/README.md` | v8 概要（117.5MB 不可恢复说明）|
| `nach/docs/PIPELINE-v10.md` | 本文档 |
| `nach/renders/archive/{v3,v7,v8,v9-user-edit,preview,raw,verify}/` | 7 个归档子目录 |

### 删除 / 移走
| 路径 | 原因 |
|---|---|
| `nach/temp/user-cut-audio.wav` | 中间产物（5.4MB）· 可从 mp4 重提取 |
| `nach/temp/asr-segments.json` | 移到 `archive/raw/` |
| `nach/renders/preview/` | 空目录删除（内容已归档）|
| `nach/renders/raw/` | 空目录删除 |
| `nach/renders/verify/` | 空目录删除 |
| `nach/renders/user-edit/` | 空目录删除 |
| `nach/renders/final/.v3-backup.mp4` | 移到 archive/v3/ |
| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4`（117.5MB v8）| **覆盖为 15MB v10**（v8 原版不可恢复）|

### 不改
- 32 个 mp3（不重合成）
- `presentation/scripts/` 全部脚本（v9 已 ship）
- `presentation/src/` 全部源码
- `docs/subtitles_en_user.srt` / `subtitles_zh_user.srt`（与 v9 EN/ZH 字幕版对应）
- `.gitignore`
- `wissen-pack/`

## 验证

### A · 4 个最终版就位
- [x] `renders/final/LinguaGraph_BWKI2026_Pitch.mp4`（v7 BWKI-spec · 7.75MB）
- [x] `renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4`（v10 用户无损压缩 · 15.04MB）
- [x] `renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4`（v9 EN 字幕 · 25MB）
- [x] `renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4`（v9 ZH 字幕 · 23MB）

### B · 归档目录完整
- [x] `renders/archive/v3/.v3-backup.mp4` 13.9MB
- [x] `renders/archive/v7/LinguaGraph_BWKI2026_Pitch.mp4` 7.75MB（v7 副本）
- [x] `renders/archive/v8/README.md`（v8 概要 + 117.5MB 不可恢复说明）
- [x] `renders/archive/v9-user-edit/202609112316.mp4` 117.5MB（用户桌面原版）
- [x] `renders/archive/preview/` 含 v8-final + 4k preview 帧
- [x] `renders/archive/raw/` 含 capture.webm + 3 个 SRT + asr-segments.json
- [x] `renders/archive/verify/` 含 v8/v9 抽帧验证 PNG

### C · temp/ 清理
- [x] `temp/user-cut-audio.wav` 删除
- [x] `temp/asr-segments.json` 移到 `archive/raw/`
- [x] `temp/` 目录保留但内容精简（空）

### D · 新基准视频规格验证
- [x] 15.04MB · 4K · 60fps · 立体声 44.1kHz
- [x] 时长 172.97s
- [x] ffprobe 验证 OK（已在 bash 中执行）

### E · 文档同步
- [x] `renders/final/README.md` 描述 4 个文件用途
- [x] `docs/PIPELINE-v10.md` 写完（本文件）
- [x] `README.md` 状态行更新（v4 → v10）
- [x] `INDEX.md` repo 地图更新
- [x] `docs/PIPELINE-v9.md` 顶部加 superseded
- [x] `docs/PIPELINE-v8.md` 顶部更新（保持 superseded by v9）
- [x] `renders/archive/v8/README.md` 写完（v8 概要 + 不可恢复说明）

## 工时实际 vs 估算

| 步骤 | 估算 | 实际 |
|---|---|---|
| Step 1 · 复制用户版 | 1 min | ~30s |
| Step 2 · 创建 archive | 1 min | ~10s |
| Step 3 · 归档历史 | 5 min | ~2 min |
| Step 4 · 重命名 v9 | 1 min | ~30s |
| Step 5 · 清理 temp | 1 min | ~30s |
| Step 6 · renders/final/README.md | 5 min | ~5 min |
| Step 7 · PIPELINE-v10.md | 10 min | ~10 min |
| Step 8 · 更新 README/INDEX | 5 min | ~5 min |
| **合计** | **~32 min** | **~24 min** |

## 已知数据丢失

- **v8 4K 自动版 117.5MB 文件**：v10 整理过程中被 15MB v10 用户无损压缩版覆盖（覆盖时未先备份到 archive/v8/）。**v8 4K 自动版原始文件已不可恢复**。
- **影响评估**：v8 4K 自动版是中间产物（212s 含 PAUSE_MAP 强制 hold），用户已明确选择 v10 用户剪辑版（173s 无强制 hold）作为最终版。**v8 4K 不影响 BWKI 提交**。
- **可恢复性**：v8 文档完整保留（`docs/PIPELINE-v8.md` + `archive/v8/README.md`），如果未来需要 v8 4K 视频可重新跑 v7 + v8 流水线（~30 分钟）

## 不在本计划范围

- ❌ 重烧 v9 EN/ZH 字幕版（用户明确"不用重烧"）
- ❌ 重做 v7/v8 流水线脚本（已 ship）
- ❌ 修改 32 个 mp3（不重合成）
- ❌ 改 SideRail / narrations.ts（视觉零改动）
- ❌ 入 Git 大文件（`.gitignore` 保持 excludes mp4，分享靠本地副本或网盘）
- ❌ 升级 v8 自动版归档（117.5MB 文件已不可恢复，仅保留 README 说明）

## 风险与回退

**风险 1 · 117.5MB v8 文件已丢失（被覆盖）**
- 接受：v8 是中间产物，v10 用户无损压缩版是最终版
- 不影响 BWKI 提交
- 如果需要 v8 视觉效果，可重新跑流水线（参考 `docs/PIPELINE-v8.md`）

**风险 2 · .gitignore 未变更，可能误以为大文件入 Git**
- 当前 `.gitignore` 已 excludes `renders/final/*.mp4` · `*.mp4` 全局规则
- 最终管线 mp4 不会被 Git 追踪
- 分享靠本地副本或手动 cp

**风险 3 · archive 目录结构未来增长**
- 当前 archive ~100MB，未来如果 v11+ 添加新版本，按需扩展 `archive/v10/` 等子目录
- 每个 archive 子目录自带 README 说明版本来源

## 关键文件路径速查

| 关注点 | 文件 |
|---|---|
| ★ BWKI-spec 提交版 | `nach/renders/final/LinguaGraph_BWKI2026_Pitch.mp4`（7.75MB）|
| ★ 4K 无字幕（最新）| `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4`（15MB）|
| 4K EN 字幕版 | `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4`（25MB）|
| 4K ZH 字幕版 | `nach/renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4`（23MB）|
| 最终版说明 | `nach/renders/final/README.md` |
| 用户桌面原版 | `nach/renders/archive/v9-user-edit/202609112316.mp4`（117.5MB）|
| ASR 数据 | `nach/renders/archive/raw/asr-segments.json` |
| v8 概要 + 不可恢复说明 | `nach/renders/archive/v8/README.md` |
| v10 文档（本文件）| `nach/docs/PIPELINE-v10.md` |
