# LinguaGraph — BWKI 2026 Video-Pitch

> 🌐 [English](README.md) · **[Deutsch](README.de.md)** · [中文](README.zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![BWKI 2026](https://img.shields.io/badge/BWKI-2026-blue.svg)](https://www.bwki.de)
[![Status: v10](https://img.shields.io/badge/version-v10-green.svg)](docs/PIPELINE-v10.md)
[![DSGVO: Konform](https://img.shields.io/badge/DSGVO-Konform-success.svg)](docs/PRIVACY.md)

Ein **3-minütiges Web-Video-Pitch**, das **LinguaGraph** erklärt — eine neue KI-Audit-Methode,
die die strukturelle Divergenz zwischen sprachspezifischen Konzeptgraphen in Large Language
Models (LLMs) misst.

Eingereicht beim **BWKI 2026** (Bundeswettbewerb Künstliche Intelligenz) von **Jiajun Rong**,
Privatschule Schloss Heessen, Deutschland.

---

## 🎬 Was ist LinguaGraph?

Wenn dasselbe LLM in verschiedenen Sprachen dieselbe Frage bekommt, meint es dann
dasselbe? LinguaGraph extrahiert **Konzeptgraphen** aus LLM-Antworten und misst die
strukturelle Divergenz über 55 Messungen × 50 Modelle. Wir fanden:

- **Chinesisch-Deutsche** Konzeptgraphen **divergieren signifikant** (alle 55 Paare p<0,05)
- Die Divergenz ist **kulturell gemustert** (Deutsch: Autonomie + Regeln · Chinesisch:
  Raum + Anspruch)
- Institutionelles Wissen (Mathematik) **konvergiert** sprachübergreifend (indikativ,
  siehe Paper §3.8)

Dies ist eine **neue Art von KI-Prüfung** — nicht für Aufgabenerfüllung, sondern für
**Wertkonzept-Konsistenz** über Sprachen hinweg.

---

## 📺 Finale Videos

| Datei | Größe | Dauer | Empfohlene Verwendung |
|---|---|---|---|
| [`LinguaGraph_BWKI2026_Pitch.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch.mp4) | 7,75 MB | 169,4s | ★ **BWKI-spec Einreichung** (1344×768 @ 24fps) |
| [`LinguaGraph_BWKI2026_Pitch_4K.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4) | **15 MB** | 172,97s | ★ **4K Master** (verlustfrei, 60fps, Stereo) |
| [`LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_en.mp4) | 24 MB | 172,97s | 4K + **englische** Untertitel |
| [`LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4`](renders/final/LinguaGraph_BWKI2026_Pitch_4K_subs_zh.mp4) | 23 MB | 172,97s | 4K + **chinesische** Untertitel |

> Insgesamt ~70 MB. Details: [`renders/final/README.md`](renders/final/README.md).

---

## 🚀 Schnellstart (Video reproduzieren)

```bash
git clone https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video.git
cd BWKI-2026-LinguaGraph-Video/presentation

# 1. Abhängigkeiten installieren
npm install

# 2. Narrationen extrahieren (SSOT in src/chapters/01-linguagraph-pitch/narrations.ts)
npm run extract-narrations

# 3. DE-Voice synthetisieren (minimax API erforderlich)
PRESENTATION_TTS=minimax-clean npm run synthesize-audio -- --voice=German_FriendlyMan

# 4. Audio zusammenfügen
node scripts/concat-audio.mjs

# 5. Video aufnehmen (Playwright + Chromium, headless)
node scripts/record-video.mjs

# 6. Nachbearbeitung (loudnorm, scale, encode)
node scripts/post-process.mjs

# Optional v9: EN/ZH Untertitel generieren und einbrennen
node scripts/build-subs-user.mjs
node scripts/translate-subs.mjs
node scripts/burn-subs-user.mjs en
node scripts/burn-subs-user.mjs zh
```

> Siehe [`docs/PIPELINE-v9.md`](docs/PIPELINE-v9.md) und [`docs/PIPELINE-v10.md`](docs/PIPELINE-v10.md)
> für die vollständige Pipeline-Geschichte.

---

## 📚 Dokumentation

| Dokument | Zweck |
|---|---|
| [`INDEX.md`](INDEX.md) | Repo-Karte (Doppelpipeline: final + archive) |
| [`docs/PIPELINE-v10.md`](docs/PIPELINE-v10.md) | ★ Neueste Pipeline (v10 — 4K verlustfrei + Doppelpipeline) |
| [`docs/PIPELINE-v9.md`](docs/PIPELINE-v9.md) | v9 — zweisprachige Untertitel-Pipeline |
| [`docs/PIPELINE-v8.md`](docs/PIPELINE-v8.md) | v8 — Rhythmus-Design mit Pausen |
| [`docs/PIPELINE-v7.md`](docs/PIPELINE-v7.md) | v7 — minimax TTS + A/V-Sync-Fix |
| [`docs/faktencheck.md`](docs/faktencheck.md) | Faktencheck (deutsch) — Upload-Sperre |
| [`docs/voice-cloning-feasibility.md`](docs/voice-cloning-feasibility.md) | TTS-Recherche (5 Anbieter) |
| [`docs/PRIVACY.md`](docs/PRIVACY.md) | DSGVO-Konformität (N=15 + Betroffenenrechte) |
| [`docs/narration_de.md`](docs/narration_de.md) | DE-Sprechtext SSOT |
| [`docs/storyboard.md`](docs/storyboard.md) | 6-Akt Storyboard |

---

## ⚖️ Compliance & Danksagungen

- **Lizenz**: [MIT](LICENSE) — Copyright © 2026 Jiajun Rong
- **Drittanbieter-Credits**: [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md) — vollständige
  Liste aller zitierten Projekte, Dienste, APIs, Datensätze und Assets
- **Ethik & KI-Offenlegung**: [ETHICS.md](ETHICS.md) — verwendete KI-Tools, DSGVO,
  Anonymisierung
- **Datenschutz / DSGVO**: [docs/PRIVACY.md](docs/PRIVACY.md) — Betroffenenrechte,
  Aufbewahrungsfristen
- **Danksagungen**: [CREDITS.md](CREDITS.md) — Danksagungen des Autors

### Wichtige Offenlegungen
- Die DE-Voice-over ist **synthetische TTS** (minimax `German_FriendlyMan`), **kein
  klonter Menschenstimme**
- Wikipedia-Inhalte unter **CC-BY-SA 4.0** (Quell-URLs in der Videobeschreibung)
- **N=15 Menschenexperiment** ist DSGVO-konform mit schriftlicher Einwilligung
  (siehe [PRIVACY.md](docs/PRIVACY.md))
- Verwendete KI-Tools: **Anthropic Claude Code** (Code + Text) + minimax (TTS) +
  faster-whisper (ASR)

---

## 🗂 Repo-Struktur

```
nach/
├── README.md (englisch) · README.de.md · README.zh.md  ← 三语
├── LICENSE · LICENSE-THIRD-PARTY.md · ETHICS.md · CREDITS.md
├── INDEX.md                                            ← 仓库地图
├── docs/                                               ← Doku SSOT
│   ├── PIPELINE-v3-v10.md                              ← Pipeline-Geschichte
│   ├── faktencheck.md · PRIVACY.md · narration_de.md
│   └── subtitles_*.srt                                ← Untertitelquellen
├── presentation/                                       ← Vite + React + TS Projekt
│   ├── src/chapters/01-linguagraph-pitch/             ← 32-Step-Komponenten
│   ├── scripts/                                        ← Aufnahme + Post + Subs
│   └── public/audio/linguagraph-pitch/1.mp3 .. 32.mp3 ← 32 TTS-Segmente
└── renders/
    ├── final/         ← Final-Pipeline: 4 MP4 + README.md
    └── archive/       ← Archiv-Pipeline: v3-v9
```

---

## 📊 Projekt-Status

| Komponente | Status | Datum |
|---|---|---|
| Forschung (`BWKI-2026-备战`) | ✅ Shipped v0.14.1 | 2026-08-09 |
| Video-Pitch | ✅ Shipped v10 | 2026-09-12 |
| EN/ZH Untertitel | ✅ Shipped v9 | 2026-09-12 |
| Compliance-Dokumente | ✅ v11 | 2026-09-12 |
| BWKI 2026 Einreichungsfrist | 📅 2026-09-20 | — |

---

## 📞 Kontakt

- **GitHub**: [@jjjjjjjjnnjnn](https://github.com/jjjjjjjjnnjnn)
- **Repository**: https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video
- **Issues**: https://github.com/jjjjjjjjnnjnn/BWKI-2026-LinguaGraph-Video/issues

---

<sub>MIT-Lizenz · © 2026 Jiajun Rong · Gemacht mit ❤️ in Hamm, Deutschland</sub>
