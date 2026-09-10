# Storyboard — LinguaGraph Video-Pitch (6 Akte, 3:23)

> **Status**: ENTWURF (2026-09-10) — aus `submission/pitch/video_script.md` v2 übernommen,
> ergänzt um Akt 1-Teamkarte (offizielle Vorgabe) und Akt 5-Reflexion (Bewertungskriterium).
> Zeiten = gemessene TTS-Dauern + Luft (ConradNeural, 2026-09-10), festgeschrieben in `video/src/lib/timing.ts`.

| Akt | Zeit | Bild (Apple-Stil: dunkle Bühne, eine Idee/Karte) | Ton (Kurzform, Volltext in `narration_de.md`) | Material-Quelle |
|---|---|---|---|---|
| S01 Hook + Team | 0:00–0:29 | Schwarz → Riesen-Weißzeile „Dasselbe Wort. Drei Karten.“ → Dreifach-Split Freiheit/自由/freedom → 3-Sek-Teamkarte (Name, Schule, BWKI 2026) | Persönlicher Hook (3 Sprachen, Erfolg-Beispiel) + „Ich bin …, das ist LinguaGraph.“ | Blender s01_nebula (Hintergrund), Remotion-Typo |
| S02 Problem | 0:29–1:01 | Riesen-Zahl: englisch-dominierte Trainingsdaten → Weltkarte mit Sprachfiltern → eine Zeile „EU AI Act: Transparenz“ | Blinder Fleck: Evaluation misst Aufgaben, nicht Wertkonsistenz (Kredit-Beispiel) | Remotion-NumberCounter, MiniMax-Karte |
| S03 Methode | 1:01–1:47 | Drei Panels: dasselbe Modell → 5 Themen × 3 Sprachen → Graph-Extraktion → LDS-Formel `1 − mean(J_node, J_edge)` | LLM-as-Subject (Within-Subject): Sprache ist die einzige Variable; LDS misst Strukturdivergenz + benennt Treiber | Portal-Screenshot, Pipeline-SVG |
| S04 Befund | 1:47–2:26 | Balken LDS-C vs. Boden (0,93–0,96 vs. 0,85–0,87) → Treiberliste DE vs. ZH → Blender s05_threecities (8s) | 51 Messungen/47 Modelle, p<0,05, kulturell gemustert (Autonomie/Regeln vs. Raum/Anspruch); institutionell konvergiert | `outputs/figures`, Blender s05 |
| S05 Reflexion | 2:26–2:51 | Ruhige Karte, drei ehrliche Punkte, kein Bounce, kein Gold | N=15 negativ (Design-Artefakt) · 8 EN-Paare n. s. · Schwelle 0,10 heuristisch · Mathe-Kontrolle indikativ | Remotion-Statikkarte |
| S06 Anwendung + Schluss | 2:51–3:23 | Divergenzbericht-Mockup (Entwickler/Regulierer/Forscher) → „LinguaGraph. Sichtbar.“ → Danke + Links | Audit-Werkzeug, kein Black-Box-Score; Dank + GitHub/Demo | Mockup (MiniMax/Remotion), Endkarte |

**Erste 30 Sekunden (offizielle Vorgabe)**: Hook-Satz ≤ 8 Sek, Teamkarte ≤ 3 Sek, Fragestellung ≤ 25 Sek.
**Demo-Pflicht (Gewinner-Formel)**: mind. 1 „lebendige“ Aufnahme (CognitiveSpace-Orbit) — kein reiner Standbild-Film.
