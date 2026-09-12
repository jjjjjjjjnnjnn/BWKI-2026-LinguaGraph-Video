# Voice Cloning 可行性研究 — BWKI 2026 LinguaGraph Pitch

> **状态**：研究文档（v7 范围内未实做克隆，仅调研）。
> **作者**：Claude (assisted research)
> **日期**：2026-09-11
> **目标**：在 v7 minimax (mmx) 切换之后，下一步若想进一步提升配音真实感，评估 voice cloning 可行性。

---

## TL;DR

| 维度 | 推荐方案 |
|---|---|
| **最便宜 +最快** | **ElevenLabs Instant Voice Clone** — $5-22/月，3-5 分钟 DE 样本即可。1 小时内可上线。 |
| **完全免费** | **Coqui XTTS v2** — 本地运行，~6 GB 模型下载，需 GPU。但效果非常好。 |
| **当前 v7 已用** | **MiniMax (mmx) `German_FriendlyMan`** — 自然度比 edge-tts 好，但仍是合成音。 |

**建议**：先用 ElevenLabs（最小投入），若不满意再换 Coqui XTTS。

---

## 1. ElevenLabs（推荐路径）

### 1.1 概述
- **官网**：https://elevenlabs.io
- **API**：POST `/v1/text-to-speech/<voice_id>`
- **模型**：`eleven_multilingual_v2`（多语种，支持中文/德语/英语）
- **克隆**：Instant Voice Clone（IVC）— 上传 3-5 分钟样本即可训练自定义 voice

### 1.2 定价（2026-09）

| Tier | 价格 | 字符/月 | 适用 |
|---|---|---|---|
| **Free** | $0 | 10,000 | 不够（我们 ~3,500 字符 ≈ 32 段总长）|
| **Starter** | $5/月 | 30,000 | ✓ **够用**（每月录 1 次 = $5/次）|
| **Creator** | $22/月 | 100,000 | 团队多次提交时 |
| **Pro** | $99/月 | 500,000 | 商业级 |

### 1.3 实施步骤

**Step 1 — 准备样本（30-60 分钟）**

Jiajun Rong 在安静环境朗读 DE 文本 3-5 分钟。建议：
- 用平常说话的速度，**不刻意表演**
- 选通用内容（新闻、维基条目、TED 翻译），**不要念脚本**（避免"对嘴念稿"质感）
- 48 kHz / 16-bit WAV 或高码率 MP3
- 单文件 5-10 MB

**Step 2 — 上传并克隆（5 分钟）**

```bash
curl -X POST https://api.elevenlabs.io/v1/voices/add \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "name=jiajun-rong-de" \
  -F "files[]=@sample1.wav" \
  -F "files[]=@sample2.wav" \
  -F "files[]=@sample3.wav"
# 返回 voice_id: "abc123..."
```

**Step 3 — 合成 32 段（10-30 分钟）**

```bash
for i in 1..32; do
  TEXT=$(jq -r ".[$i].text" segments.json)
  curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"$TEXT\", \"model_id\": \"eleven_multilingual_v2\"}" \
    -o "${i}.mp3"
done
```

**Step 4 — 整合到 v6/v7 pipeline**

新建 `presentation/scripts/tts-providers/elevenlabs-clone.sh`：
```bash
tts_synthesize() {
  local text="$1" out="$2" voice="${3:-$ELEVENLABS_VOICE_ID}"
  curl -fsS -X POST \
    "https://api.elevenlabs.io/v1/text-to-speech/$voice" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"$text\", \"model_id\": \"eleven_multilingual_v2\"}" \
    -o "$out"
}
```

启用：`ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=abc123... PRESENTATION_TTS=elevenlabs-clone npm run synthesize-audio`

### 1.4 优缺点

| 优点 | 缺点 |
|---|---|
| ✓ 最快上线（1 小时内） | ✗ 月费 $5（每年录 1-2 次 = $5-10）|
| ✓ 德语质量最佳（IVC 是产品卖点）| ✗ 数据出域（隐私敏感场景需评估）|
| ✓ 多语种克隆（ZH/EN/DE 都行）| ✗ API rate limit 需重试 |
| ✓ 与现有 `tts-providers/*.sh` 契约完全兼容 | |

---

## 2. Coqui XTTS v2（开源备选）

### 2.1 概述
- **官网**：https://github.com/coqui-ai/TTS
- **模型**：~6 GB（v2.0.3）
- **克隆**：few-shot — 6 秒样本即可（官方 demo），3-5 分钟样本最佳
- **License**：CPML（非商业 / 受限商业）

### 2.2 硬件要求

| 配置 | 推荐 |
|---|---|
| GPU | NVIDIA 8GB VRAM+（GTX 1070+）|
| CPU | 4+ cores |
| RAM | 16 GB |
| 磁盘 | 10 GB（模型 + 缓存）|
| 时间 | 32 段约 5-10 分钟 |

### 2.3 安装步骤

```bash
# Python ≥3.9
pip install TTS

# 下载模型（首次自动）
python -c "from TTS.api import TTS; tts = TTS('tts_models/multilingual/multi-dataset/xtts_v2')"

# 命令行合成（无 API key）
tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \
    --text "Wir haben das Experiment auf über 50 Modelle..." \
    --speaker_wav ./samples/jiajun_5min.wav \
    --language_idx de \
    --out_path 18.mp3
```

### 2.4 与 v7 pipeline 整合

新建 `presentation/scripts/tts-providers/coqui-xtts.sh`：
```bash
tts_synthesize() {
  local text="$1" out="$2" voice="${3:-$COQUI_SPEAKER_WAV}"
  tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \
      --text "$text" \
      --speaker_wav "$voice" \
      --language_idx de \
      --out_path "$out" 2>/dev/null
}
```

启用：`COQUI_SPEAKER_WAV=./samples/jiajun_5min.wav PRESENTATION_TTS=coqui-xtts npm run synthesize-audio`

### 2.5 优缺点

| 优点 | 缺点 |
|---|---|
| ✓ 完全免费 | ✗ 6 GB 模型下载 |
| ✓ 完全本地（隐私安全）| ✗ 需要 GPU 或长 CPU 等待 |
| ✓ 6 秒即可克隆（demo）| ✗ License 限制商业 |
| ✓ 32 段高质 output | ✗ 首次设置 1-2 小时 |

---

## 3. OpenVoice v2（轻量备选）

- **GitHub**：https://github.com/myshell-ai/OpenVoice
- **License**：MIT（商业友好）
- **模型**：~500 MB（v2）
- **克隆**：reference audio + tone color converter
- **限制**：克隆的"音色"特征优秀，但**语调/停顿继承差**——出来的声音像 Jiajun 但节奏是合成的
- **推荐度**：★★ 不太推荐，Coqui XTTS 全面更强

---

## 4. F5-TTS（中文场景备选）

- **GitHub**：https://github.com/SWivid/F5-TTS
- **License**：MIT
- **特长**：中文克隆极佳（来自中国团队）
- **限制**：德语未官方支持，社区补丁不稳定
- **推荐度**：★★ 不推荐用于 DE 母版（中文场景下推荐）

---

## 5. 决策矩阵

| 方案 | 速度 | 成本 | 德语质量 | 设置难度 | 数据出域 | 推荐 |
|---|---|---|---|---|---|---|
| **ElevenLabs** | ★★★★★ | $5/月 | ★★★★★ | ★ 低 | ⚠ 是 | ★ **首选** |
| **Coqui XTTS v2** | ★★★ | 免费 | ★★★★ | ★★★ 中 | ✗ 否 | ★ 备选 |
| **OpenVoice v2** | ★★★ | 免费 | ★★★ | ★★★ | ✗ 否 | ✗ 不推荐 |
| **F5-TTS** | ★★★ | 免费 | ★★ (DE) | ★★★ | ✗ 否 | ✗ DE 不推荐 |
| **MiniMax German_FriendlyMan** | ★★★★★ | 已用 | ★★★ | ★ 已完成 | ⚠ 是 | **当前 v7** |
| **edge-tts de-DE-ConradNeural** | ★★★★★ | 免费 | ★★ | ★ | ⚠ 是 | v6 历史 |

---

## 6. 推荐路径（具体步骤）

### 选项 A · 快速路径（首选）
**ElevenLabs IVC + `$5/月`**

1. 录制 3-5 分钟 Jiajun Rong DE 样本（30 分钟）
2. 上传 ElevenLabs，5 分钟得到 voice_id
3. 实现 `tts-providers/elevenlabs-clone.sh`（30 分钟）
4. 重合成 32 段（10 分钟）
5. 重录 + 重后期（30 分钟）
6. **总计：~2 小时**

### 选项 B · 隐私优先路径
**Coqui XTTS v2 + 本地 GPU**

1. 安装 + 下载模型（1-2 小时首次）
2. 录制样本（30 分钟）
3. 实现 `tts-providers/coqui-xtts.sh`（30 分钟）
4. 重合成（10 分钟 GPU / 1 小时 CPU）
5. 重录 + 重后期（30 分钟）
6. **总计：~3-5 小时首次**

### 选项 C · 维持现状
**继续用 MiniMax German_FriendlyMan**

无操作。v7 已 ship。如果评委对"自然度"反馈 OK 就 OK 了。

---

## 7. 风险与注意

**ElevenLabs 数据出域**：
- 样本（3-5 分钟）上传 ElevenLabs 服务器
- 训练好的 voice_id 留在 ElevenLabs 账户
- 删除账户可清除数据
- 学术比赛用 OK；商业产品需重审 ToS

**Coqui XTTS License (CPML)**：
- 个人 / 非商业项目免费
- 商业使用需联系 coqui 申请（可能收费）

**Jiajun Rong 声音隐私**：
- 录音样本 = 生物特征
- 建议明确使用范围（"仅用于 BWKI 提交"）
- 比赛结束后删除云端 voice

---

## 8. 立即可行（v7 范围内）

**当前 v7 已落地**：
- ✅ `minimax-clean.sh` provider（minimax German_FriendlyMan，strip [EMPHASIS]）
- ✅ 32 段重合成 + 重录 + 重后期
- ✅ A/V 同步修复（visualEndMs 概念）

**v8+ 建议（不属本报告范围）**：
- 录制 3-5 分钟 Jiajun Rong DE 样本
- 走选项 A（ElevenLabs）— 2 小时上线
- 或选项 B（Coqui XTTS）— 若用户有 GPU 且需隐私

---

## 9. 参考资料

- ElevenLabs API: https://elevenlabs.io/docs/api-reference/text-to-speech
- ElevenLabs Instant Voice Clone: https://elevenlabs.io/docs/voices/voice-lab/instant-voice-cloning
- Coqui XTTS: https://github.com/coqui-ai/TTS
- OpenVoice v2: https://github.com/myshell-ai/OpenVoice
- F5-TTS: https://github.com/SWivid/F5-TTS
- 现有 `presentation/scripts/tts-providers/README.md` 已含 ElevenLabs / Coqui 代码片段可直接抄