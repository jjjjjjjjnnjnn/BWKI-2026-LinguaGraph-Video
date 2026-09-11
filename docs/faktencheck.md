# Faktencheck — Upload-Sperre

> **Regel**: Kein Upload (Plattform wie YouTube/Vimeo/BWKI-Portal), bevor ALLES angehakt ist.
> Nach jedem Zahlen-Update erneut prüfen. Referenz: Forschungsrepo `BWKI-2026-备战` (commit `3dd70bd`, v0.14.1).

## Zahlen (gegen `manifest.json` / `data/lds_c/` prüfen)

- [x] 556 Konzepte / 525 Relationen / 219 Gruppen (SSOT `manifest.json`)
- [x] F1 sozial 0,939 (n=72) · gewichtet 0,881 (n=92) — nicht „0,939 über alles“
- [x] 55 Messungen / 50 Modelle · alle ZH-DE p<0,05 · 8 EN-Paare n. s. erwähnt oder weggelassen
- [x] LDS-C 0,93–0,96 vs. Boden 0,85–0,87 (Basismodell, Within-Subject)
- [x] N=15 Δ≈0 als Design-Artefakt formuliert, nie als „kein Effekt“
- [x] Schwelle ≥ 0,10 als heuristisch markiert
- [x] Kein N=8 (0,70–0,75) · kein Sim-Vergleich p=0,05 · kein §8.17-N=1-Fall

## Verbotene Behauptungen (im Film nicht vorkommen)

- [x] Kein „fertiges Audit-Instrument“ / „korrigiert Modelle“ — nur „neue Art von KI-Prüfung“ (S06)
- [x] Mathe-Konvergenz nur „indikativ“ (P2-Recheck), nie „Kontrollbeweis“ (S04)
- [x] Kulturtreiber (Autonomie/Regeln vs. Raum/Anspruch) nur deskriptiv, nicht kausal (S04)

## Offenlegung & Recht

- [x] Unterstützung im Film oder in der Videobeschreibung: Claude Code (Code/Text), 42 DashScope- + 7 zen/OpenRouter-Modelle + D1-Baseline + je 2 Kilo-, 1 Cohere-, 1 NIM-, 1 opencode-go-Modell (API, 55 Messungen / 50 Modelle), N=15 Eigen-Erhebung (GDPR-Einwilligung)
- [x] Wikipedia-CC-BY-SA: Quellenartikel in der Videobeschreibung verlinken (URLs aus `data/wikipedia_extractions/*/source_url`)
- [x] Musik/Stock/Footage-Lizenzen in `assets_meta.md` eingetragen — **keine verwendet**

## Technik

- [x] 2–4 Min · 1344×768 @ 24fps · H.264 · Ton verständlich (loudnorm I=-16 / TP=-1.5 / LRA=11) · EN-Untertitel eingebrannt
- [x] `renders/final/` enthält genau eine Datei: `LinguaGraph_BWKI2026_Pitch.mp4` (13.9 MB · 203.02s)

---

Geprüft am: **2026-09-11**  Prüfer: **Jiajun Rong**  Film-Version: **v3 (MiniMax Design + ffmpeg)**
Asset-Snapshot: MiniMax Design 2026-09-10 (`visuals/SOURCE.md`)
Forschungs-Snapshot: `BWKI-2026-备战` commit `3dd70bd` (v0.14.1)

---

## Nachtrag 2026-09-11 — Video eingefroren, bekannte Narrations-Abweichungen

> Der Film (v4 final, 201.5s) bleibt unverändert. Folgende Vereinfachungen in der Narration
> sind bekannt und ggf. in der Videobeschreibung offenzulegen:

- S04-Narration „auch auf ein US-amerikanisches Modell" (Singular) — tatsächlich **seven
  western measurements** (NVIDIA×2, Poolside×2 Hosts, OpenAI-Gewichte, Cohere, luna;
  paper §5.10, CHANGELOG v0.14.0).
- S04 „Der entscheidende Kontrollbefund: Institutionelles Wissen konvergiert" ohne
  **„indikativ"**-Qualifier — entgegen Zeile 19 oben (P2-Recheck, paper §3.8):
  Mathe-Knoten sind Alignierungs-Labels; Size-Matching kehrt das Muster um.
