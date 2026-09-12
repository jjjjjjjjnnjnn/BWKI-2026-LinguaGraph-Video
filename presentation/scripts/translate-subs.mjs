/**
 * translate-subs.mjs — translate subtitles_en_user.srt to Chinese, keeping
 * the same 32 timestamps.
 *
 * Why a separate file: SRT timestamps are hand-aligned via faster-whisper
 * ASR (see build-subs-user.mjs). Translating the text is purely textual;
 * no re-alignment needed. ZH version mirrors EN cue-for-cue.
 *
 * Translation choices (32 cues):
 *   - Keep key English terms verbatim: LinguaGraph, Jiajun Rong,
 *     Privatschule Schloss Heessen, EU AI Act, Linguistic Divergence
 *     Score (LDS), p<0.05, etc.
 *   - Match the natural spoken rhythm (~6s/cue). One ZH line per cue.
 *   - Use full-width punctuation (，。：；？！) where natural, but keep
 *     ASCII "—" for em-dash to match EN typography.
 *   - Numbers: digits stay in Latin form for tech terms (55, 0.10,
 *     50, etc.), but "billion/milliarden" becomes "亿" per ZH convention.
 */

import { writeFile, readFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const NACH_ROOT = resolve(ROOT, "..");
const EN_SRT = resolve(NACH_ROOT, "docs", "subtitles_en_user.srt");
const OUT_SRT = resolve(NACH_ROOT, "docs", "subtitles_zh_user.srt");
const LOCAL_SRT = resolve(NACH_ROOT, "renders", "raw", "subtitles_zh_user.srt");

const ZH_TRANSLATIONS = [
  // Cover (step 0)
  "我是 Jiajun Rong,来自 Privatschule Schloss Heessen。LinguaGraph 正是把这些差异变得可测量。",
  // M1 Hook (1-4)
  "我们来问一个德语 AI 模型:什么是自由?它回答:自主、规则、自己的目标。",
  "用中文问同一个模型「自由」:它回答:空间、边界、自己应得的。",
  "同一个词 —— 却是一幅不同的认知地图。",
  "LinguaGraph 正是把这些差异变得可测量。",
  // M2 Problem (5-10)
  "今天的 AI 系统为数十亿人服务,使用数十种语言。",
  "但它们主要是在英语数据上训练的。",
  "一个模型对「正义」的理解,在德语和中文的信贷决策中会一样吗?",
  "如果不一样,用户会因为说的语言不同而受到不同对待。",
  "标准的 AI 评估只测量任务完成度 —— 不测量价值概念是否跨语言一致。",
  "这是一个盲点。",
  // M3 Method (11-17)
  "如何测量不可见的东西 —— 比如一个模型的概念结构?",
  "核心思路:让 AI 自己回答。",
  "我们把大语言模型变成受控的实验对象:同一个模型、同样五个主题 —— 正义、自由、责任、家、成就 —— 只改变语言。",
  "因为是同一个模型,语言是唯一的变量。",
  "从每次回答中,我们按语言抽取概念图。",
  "我们的新指标 —— Linguistic Divergence Score —— 测量跨共同概念与关系的结构性分歧。",
  "而且我们不仅输出一个数字,还准确指出哪些概念成分发生了分歧。",
  // M4 Finding (18-22)
  "我们把实验扩展到来自不同供应商的 50 多个模型 —— 包括一个美国模型。",
  "在 55 次测量中,中德语言信号具有统计显著性(p<0.05)。",
  "而且这不是随机的,而是文化上有模式的:德语概念强调自主和规则,中文强调空间与追求。",
  "决定性的对照发现:制度性知识 —— 比如数学 —— 跨语言趋同;文化概念则显著分歧。",
  "概念之间的关系也以语言特有的方式组织。",
  // M5 Reflection (23-26)
  "说实话:",
  "我们对 15 个人做的人体实验显示,在被试间条件下没有语言信号 —— 这是设计缺陷,不是反证。",
  "8 对包含英语的配对不显著 —— 与今天模型的英语中心化一致。",
  "我们的运营阈值 0.10 是一条经验法则 —— 不是经过验证的边界。",
  // M6 Application + Schluss (27-31)
  "LinguaGraph 是一种新的 AI 审计方式。",
  "开发者可以在部署多语言模型前检查:我的模型在价值负载词上是否跨语言漂移 —— 具体在哪?",
  "对于监管者,它提供了 EU AI Act 所要求的透明度。",
  "输出是可解释的 —— 不是黑箱分数,而是发生分歧的具体概念成分清单。",
  "LinguaGraph。可见。谢谢。",
];

function parseSrt(text) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\n+/);
  const cues = [];
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split("\n");
    const idx = parseInt(lines[0], 10);
    const time = lines[1];
    const text = lines.slice(2).join("\n");
    cues.push({ idx, time, text });
  }
  return cues;
}

async function main() {
  if (!existsSync(EN_SRT)) {
    console.error(`[translate-subs] missing ${EN_SRT}`);
    console.error(`[translate-subs] run build-subs-user.mjs first`);
    process.exit(1);
  }

  const enSrt = await readFile(EN_SRT, "utf8");
  const cues = parseSrt(enSrt);

  if (cues.length !== 32) {
    console.error(`[translate-subs] expected 32 cues in EN SRT, got ${cues.length}`);
    process.exit(1);
  }
  if (ZH_TRANSLATIONS.length !== 32) {
    console.error(`[translate-subs] ZH_TRANSLATIONS has ${ZH_TRANSLATIONS.length}, expected 32`);
    process.exit(1);
  }

  const lines = [];
  for (let i = 0; i < 32; i++) {
    lines.push(String(i + 1));
    lines.push(cues[i].time); // reuse EN timestamps
    lines.push(ZH_TRANSLATIONS[i]);
    lines.push("");
  }

  await mkdir(dirname(OUT_SRT), { recursive: true });
  await mkdir(dirname(LOCAL_SRT), { recursive: true });
  await writeFile(OUT_SRT, lines.join("\n"), "utf8");
  await copyFile(OUT_SRT, LOCAL_SRT);

  console.log(`[translate-subs] wrote ${OUT_SRT}`);
  console.log(`[translate-subs] mirrored to ${LOCAL_SRT}`);
  console.log(`[translate-subs] 32 cues, total timeline = ${cues.at(-1).time}`);
}

main().catch((e) => {
  console.error("[translate-subs] error:", e);
  process.exit(1);
});
