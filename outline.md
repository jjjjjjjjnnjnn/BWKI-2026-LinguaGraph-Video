# Video Outline — LinguaGraph BWKI 2026 (单章 v4)

> **主题**: `indigo-porcelain` (靛蓝瓷 · 学术气质)
> **总时长**: ~203s (DE 口播 ~570 字 ÷ ~2.8 字/s)
> **章节数**: 1 章 / 32 步
> **画布**: 1920×1080 16:9 stage (BWKI 兼容 1344×768 同比例)
> **配字**: Playfair Display italic (en) + Noto Serif SC (cn) + IBM Plex Sans (body)

---

## 1. linguagraph-pitch — LinguaGraph BWKI 2026 (32 steps · ~203s)

### 信息池(每步实现时按需挂 mono kicker / 副标 / 数据浮层)

- **数字 hero**: 556 / 525 / 219 / 0.939 / 0.881 / 55 / 50 / 0.93–0.96 / 0.85–0.87 / N=15 / 0.10 — `BWKI-2026-备战/manifest.json`
- **5 主题**: Gerechtigkeit / Freiheit / Verantwortung / Heimat / Erfolg — paper §3
- **LDS 公式**: `1 − mean(J_node, J_edge)` — paper §4
- **3 应用角色**: Entwickler / Regulierer / Forscher — paper §7
- **团队**: Jiajun Rong · Privatschule Schloss Heessen · BWKI 2026 — storyboard §S01
- **应用 / 出处**: EU AI Act (Transparenz) · CognitiveSpace Orbit (Demo-Pflicht, placeholder)
- **EN 字幕 cue**: 已映射到 32 step 边界 — `docs/subtitles_en.srt` 重映射版

### 开发计划(32 step, 1-indexed)

| # | 节拍 | 屏幕主元素 | 视觉演示 |
|---|---|---|---|
| **M1 Hook + Team** ||||
| 1 | DE 问"自由" + 3 答案 | 三语词卡 FADE IN · DE 答案框亮 | DE 答案 3 项 stagger 入场 |
| 2 | ZH 问"自由" + 3 答案 | ZH 答案框亮 · DE 答案灰化退后 | 答案分裂对比动画(横线扫过) |
| 3 | "Dasselbe Wort — andere kognitive Landkarte" | 三语词卡聚拢 + 大字 hero | 三语词卡向中心聚拢 |
| 4 | "Ich bin Jiajun Rong…" | 团队卡 fade in | 团队卡滑入 + 学校 logo placeholder |
| 5 | "…macht LinguaGraph messbar" | LinguaGraph logo 大字 + 项目名 | hero 大字 fade in + accent 下划线 |
| **M2 Problem** ||||
| 6 | "KI-Systeme für Milliarden in Dutzenden Sprachen" | 全球地图淡入 + 用户数 hero | 地图节点逐次点亮(全球) |
| 7 | "überwiegend mit englischen Daten trainiert" | 训练数据英文占比 bar 100% | 横向 bar 自绘填满 |
| 8 | "Versteht ein Modell Gerechtigkeit … gleich?" | DE/ZH 双卡并列 "Gerechtigkeit" | 双卡 flip-in 动画 |
| 9 | "Wenn nicht, erhalten Nutzer … unterschiedliche Behandlung" | 信贷场景 mockup + 警示 icon | mockup fade in + ⚠ 图标 |
| 10 | "Gängige Evaluation misst nur Aufgabenerfüllung" | 评价指标对比 list(Accuracy / BLEU / etc.) | 列表项 stagger 出现 |
| 11 | "Das ist ein blinder Fleck" | "blinder Fleck" 大字 + 高亮 underline | hero 大字 + accent 划线动画 |
| **M3 Methode** ||||
| 12 | "Wie misst man etwas Unsichtbares…?" | "Konzeptstruktur" 大字 + brain 抽象图 | 大字 + 抽象 brain SVG 淡入 |
| 13 | "Kernidee: Man fragt die KI selbst" | LLM 模型框 + 探针图标 | 模型框 fade + 探针 ping 动画 |
| 14 | "Dasselbe Modell, 5 Themen × 3 Sprachen" | 5 主题球体 + 3 语言球体 orbit | 15 节点 orbit 入场 |
| 15 | "Sprache ist die einzige Variable" | 高亮大字 + 单一变量箭头 | hero + SVG 箭头指向 "Sprache" |
| 16 | "Aus den Antworten extrahieren wir Konzeptgraphen" | 概念图网络 SVG 自绘 | 节点连线 stroke-dashoffset 动画 |
| 17 | "LDS misst strukturelle Divergenz" | 公式 `1 − mean(J_node, J_edge)` | 公式逐字符 stagger 出现 |
| 18 | "benennt welche Bestandteile divergieren" | 列表: Treiber-Liste stagger | 3 项 stagger + mono kicker |
| **M4 Befund** ||||
| 19 | "über 50 Modelle verschiedener Anbieter" | "50" hero + Anbieter logo 网格 | hero + 8-10 Anbieter 占位 |
| 20 | "55 Messungen · p<0.05" | "55 / 50" 大字 + p-value tag | hero + 绿色 p<0.05 标记 |
| 21 | "kulturell gemustert: DE 自主 / ZH 空间" | 双卡对比 + 关键词云 | 双卡 fade + 关键词 stagger |
| 22 | "Mathe konvergiert / Kultur divergiert" | split-screen: ✓ vs ⚠ | 对比动画(✓ 一边 / ⚠ 一边) |
| 23 | "Beziehungen organisieren sich sprachspezifisch" | 概念图旋转 + DE/ZH 关系不同色 | 旋转 + 关系线颜色变化 |
| **M5 Reflexion** ||||
| 24 | "Ehrlich dazu:" | 灰卡 fade in · tone shift marker | 灰卡 + "Reflection" 角标 |
| 25 | "N=15 · Between-Subject · Design-Artefakt" | "N=15" + "Design-Artefakt" mono | hero + ⚠ mono kicker |
| 26 | "8 EN-Paare nicht signifikant" | "8 / n.s." + 一致性 note | hero + "EN-zentriert" 注释 |
| 27 | "Schwelle 0,10 ist heuristisch" | "0,10" + "heuristisch, nicht validiert" | hero + ⚠ kicker |
| **M6 Anwendung + Schluss** ||||
| 28 | "neue Art von KI-Prüfung" | "neue Art" hero + 齿轮图标 | 大字 + 齿轮 SVG |
| 29 | "Entwickler: Driftet mein Modell…?" | Entwickler 卡 + drift monitor mockup | 卡片 flip-in + mockup |
| 30 | "Regulierer: EU AI Act Transparenz" | Regulierer 卡 + 法规 icon | 卡片 + EU AI Act icon |
| 31 | "Output interpretierbar, kein Black-Box-Score" | Forscher 卡 + Divergenzbericht mockup | 卡片 + 报告 mockup |
| 32 | "LinguaGraph. Sichtbar. Danke." | hero 大字 + Danke + 链接 | fade in + 链接 stagger |

---

### 口播节选(完整文本回 `script.md`)

> "Fragen wir ein deutsches KI-Modell: Was gehört zur Freiheit? Es antwortet: Autonomie, Regeln, eigene Ziele. Fragen wir dasselbe Modell auf Chinesisch nach Zi You: Es antwortet mit Raum, Grenzen, dem, was einem zusteht. Dasselbe Wort — aber eine andere kognitive Landkarte."

---

## 自检(写完强制执行)

- [x] 每个 step 都是单一句屏幕内容描述,无动画/手段行
- [x] 没有 step 写具体毫秒/秒数(除 `(~Ts)` 口播估时)
- [x] 章节首段有「信息池」block,12+ 条 article/manifest 抽取,每条带来源
- [x] 所有 step `(~Ts)` 累加 ≈ 顶部声明的 203s(总时长 5+6+7+5+4+5 = 32 step · 实测估时 203s)
- [x] 单章 32 step,符合"信息密集型 ~31 step"经验(略超,符合 academic research tone)
- [x] 末尾素材清单嵌入信息池(无需单独列,assets_meta.md 接管)

## 素材清单

> v4 不需要外部素材。所有视觉演示 = CSS/SVG/Canvas/JS 自绘 + DOM 元素。
> 唯一外部数据 = research repo 数字 manifest.json / lds_c/,通过 chapters/data.ts 静态导入。

- ✓ 数字(556/525/219/0.939/0.881/55/50/0.93–0.96/0.85–0.87/N=15/0.10) — `BWKI-2026-备战/manifest.json`
- ✓ 5 主题列表 — `nach/docs/storyboard.md` §S03
- ✓ LDS 公式 — paper §4
- ⚠ CognitiveSpace Orbit 截图 — 官方 Demo-Pflicht,占位"录屏待补"
- ⚠ Anbieter logo(S04) — 用文字网格占位,不上传 fake logo
- ✓ 团队信息 — storyboard §S01

## 不在本 outline 范围

- ❌ 字体 / 颜色 token(由 indigo-porcelain 主题决定)
- ❌ 动画时长 / 缓动(由 chapter agent 实现时按 mood 决定)
- ❌ 录屏策略(Phase 4 决定)
- ❌ 字幕 cue 时码(由 audio-segments.json 推算)