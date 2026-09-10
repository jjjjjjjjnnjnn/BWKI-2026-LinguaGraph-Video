# Neuaufbau — Gesamtkonzept (garden-Methodik auf Remotion)

> Status: KONZEPT (2026-09-10) — aus Skill-Transplantat:
> `CHAPTER-CRAFT.md` (Akt-Design) + `blueprint`-Theme + `gpt-image-2`-Templates (via MiniMax image-01).
> Zeitachse/Audio-Sync bleiben Remotion (203s, timing.ts SSOT). Kein Vite-Wechsel.
> Daten-Regel: jede Zahl ← `video/src/data/*.ts` ← figures-PNG/CSV. S05 bleibt statisch (User-Entscheid).

## 0. Stil-System (einmal gebaut, sechs Akte)

- **Theme `blueprint`**: `--shell #0a1224`, `--accent #4dd2ff` (Drafting-Cyan),
  IBM Plex Mono für Zahlen/Labels, 60px-Drafting-Grid als Bühnenboden,
  2px-dashed Rules, 0-Radius-Karten mit 2px-Solid-Border, Eck-Ticks (� corner marks).
- **Gold `#f0c040` nur als Bedeutungsfarbe**: ZH-DE-Signal + Team/Hook. Nicht Deko.
- **Bewegungs-Verben (4, pro Akt max. 1 dominant)**:
  `grow` (Säulen/Linien wachsen) · `sweep` (Scheinwerfer/Scanline) ·
  `spotlight` (Rest dimmen, eins lassen) · `count` (NumberCounter).
  Verboten global: Partikel-Deko ohne Inhalt, Dauer-Micro-Motion, ein Animationssatz für alles.
- **Kamera**: pro Beat eigene Fahrt (Push/Hold/Pull), keine lineare Full-Act-Zooms mehr.
- **Typo**: Hero ≥80px, Bühne 1920×1080 mit 96/72-Safety, keine Header/Footer/Seitennummern.
- **KI-Bilder**: null Text im Bild (deutsche Labels rendern wir in Remotion darüber).

## 1. S01 Hook + Team (0:00–0:29) — Dominant: `grow` (Graph-Gabelung)
- B1 „Dasselbe Wort.“ → Wort-Knoten in Bildmitte, Puls einmalig.
- B2 „Drei Karten.“ → **drei Kanten wachsen aus dem Knoten** (SVG self-draw),
  daran je eine Karte (Freiheit/自由/freedom + Treiber-Chips). Kein Split-Cut mehr,
  sondern ein wachsender Graph = S01 pflanzt die visuelle Sprache des Films.
- B3 Teamkarte: Graph verblasst, Name/Schule/BWKI auf Dashed-Rule-Karte, Mono-Ticks.
- Material: MiniMax-Nebel (`s01_nebula.png`, 1920×1080, Prompt freigegeben?) als Boden,
  Grid darüber. Transition → S02: Kanten lösen sich in Scanline auf (Sweep-Übergabe).

## 2. S02 Problem (0:29–1:01) — Dominant: `sweep` (Filter-Scan)
- Riesen-Zahl (englisch-dominierte Trainingsdaten, Quelle nachtragen!) zählt hoch.
- Weltkarte/Schriftfeld: **Scanline fährt über das Feld**, Sprachen hinter dem Filter
  erlöschen (dimmen) — der „blinde Fleck" wird gezeigt, nicht behauptet.
- EU-AI-Act-Zeile als gestempelte Rule (Typewriter, 1×).
- Material: MiniMax-Karte (16:9, ohne Text). Transition → S03: Scanline friert ein,
  wird zur Pipeline-Achse (Match-Cut Linie→Linie).

## 3. S03 Methode (1:01–1:47) — Dominant: `grow` (Pipeline-Illumination)
- Drei Modell-Panels → 5 Themen × 3 Sprachen → Graph-Extraktion: **Knoten leuchten
  nacheinander auf**, Kanten zeichnen sich selbst (Fortsetzung der S01-Sprache).
- LDS-Formel `1 − mean(J_node, J_edge)` als Hero-Mono, Terme fliegen nacheinander ein
  (J_node, J_edge je 1 Beat — 1 Item = 1 Step).
- Material: Portal-Screenshot (footage/), Pipeline als Nativ-SVG. Transition → S04:
  Graph-Kanten verdichten sich zu Säulen (Morph Match-Cut: Linie→Balken).

## 4. S04 Befund (1:47–2:26) — Dominant: `count` + `spotlight` (Daten-Theater)
- Daten: `video/src/data/s04.ts` (S04_TOPICS transkribiert ±0.01, S04_CONTROL exakt CSV).
- B1 (0–360f): 51/47-Mono-Counter, „überall signifikant" als Dashed-Rule.
- B2 (360–760f): 4 Themen-Säulen ZH-DE wachsen sequentiell + Counter;
  ZH-EN-Geister-Säulen halbtransparent hinterher. Dann Spotlight: nur Freedom+Success
  hell, Treiber-Chips (Autonomie/Regeln · Raum/Anspruch) poppen aus den Säulenköpfen.
- B3 (760–1170f): Match-Cut (Säulenköpfe konvergieren → ein Punkt → Kontroll-Plot):
  ZH-DE-Zeile Human 0.94 / LLM 0.94 / Social 0.82 / **Math 0.52** — Math-Säule niedrig,
  färbt sich bei „konvergiert" cyan. N=15-Legende erscheint hier NICHT.
- Transition → S05: alles dimmt auf Schwarz, 800ms Stille (P3-Pausen-Engineering).

## 5. S05 Reflexion (2:26–2:51) — Dominant: keiner (Stille als Sprache)
- Drei Zeilen, sequentiell einblendend (N=15-Artefakt · 8 EN-Paare n.s. · Schwelle 0,10 heuristisch),
  kein Gold, kein Bounce, kein Kamera-Move. Nur 800ms-Pausen zwischen den Zeilen (P3).
- Transition → S06: eine Zeile bleibt als Faden, wird zur Report-Achse.

## 6. S06 Anwendung + Schluss (2:51–3:23) — Dominant: `grow` (Report-Aufbau)
- Divergenzbericht-Mockup baut sich auf (Entwickler/Regulator/Forscher je 1 Beat).
- „LinguaGraph. Sichtbar." Hero, Danke + Links (GitHub/Demo), Endkarte 3s halten.
- Material: MiniMax-Report-Desk (ohne Text).

## 7. Übergänge (System, keine Einzel-Effekte)
| Wo | Typ | Mechanik |
|---|---|---|
| S01→S02 | Sweep-Übergabe | Graph-Kanten → Scanline |
| S02→S03 | Match-Cut | Scanline → Pipeline-Achse |
| S03→S04 | Morph | Kanten verdichten → Säulen |
| S04→S05 | Dim + Stille | alles → Schwarz, 800ms Pause |
| S05→S06 | Faden | letzte Zeile → Report-Achse |
| Akte innen | Beat-Cuts | harte Schnitte auf Narration-Beats, keine Dauer-Blends |

## 8. Material-Liste (MiniMax image-01, alle 1920×1080, null Text)
1. `s01_nebula.png` — Deep-Navy-Nebel + faint Graph (S01-Boden) [Prompt freigegeben?]
2. `s02_map.png` — Welt-Schriftfeld, dunkel, für Filter-Scan
3. `s06_desk.png` — Audit-Report-Schreibtisch, dunkel
4. `cover.png` — Key-Visual (Thumbnail/Abgabe-Cover)
5. ggf. 2 Stimmungs-Frames für S03/S04-Tiefenstaffelung (Budget-Deckel: max. 6 Bilder)

## 9. Audio (P3, edge-tts, kein MiniMax-TTS per User-Entscheid)
- Satz-Segmentierung + 350–600ms Pausen (S05: 800ms), timing.ts → Beat-Summen.
- S04-Narration bleibt Wort-fest; Beats B1/B2/B3 wie oben syncen.
