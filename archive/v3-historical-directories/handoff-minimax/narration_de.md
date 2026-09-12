# Narration (DE) — Sprechtext, SSOT für TTS

> **Status**: ENTWURF = v2-Skript wörtlich übernommen (Quelle:
> `BWKI-2026-备战/submission/pitch/video_script.md`, Stand 2026-08-09).
> **Offen**: S05-Reflexion kürzen (unten als Rohfassung, 23,8s Audio ok).
> Zeiten = gemessene TTS-Dauern (ConradNeural, 2026-09-10), siehe `timing.ts`.
> `tooling/tts_edge.py` liest genau diese Datei (Marker `## S01` … `## S06`).

## S01 — Hook + Team (0:00–0:29)

Fragen wir ein deutsches KI-Modell: Was gehört zur Freiheit? Es antwortet: Autonomie, Regeln, eigene Ziele. Fragen wir dasselbe Modell auf Chinesisch nach Zi You: Es antwortet mit Raum, Grenzen, dem, was einem zusteht. Dasselbe Wort — aber eine andere kognitive Landkarte. Ich bin Jiajun Rong von der Privatschule Schloss Heessen. Genau solche Unterschiede macht LinguaGraph messbar.

## S02 — Problem (0:29–1:01)

KI-Systeme werden heute für Milliarden von Menschen in Dutzenden Sprachen bereitgestellt. Aber sie sind überwiegend mit englischen Daten trainiert. Versteht ein Modell Gerechtigkeit in einem Kreditentscheidungs-System auf Deutsch und Chinesisch gleich? Wenn nicht, erhalten Nutzer je nach Sprache unterschiedliche Behandlung. Gängige KI-Evaluation misst aber nur die Aufgabenerfüllung — nicht, ob die Wertkonzepte des Modells sprachübergreifend konsistent sind. Das ist ein blinder Fleck.

## S03 — Methode (1:01–1:47)

Wie misst man etwas Unsichtbares wie die Konzeptstruktur eines Modells? Kernidee: Man fragt die KI selbst. Wir machen das LLM zum kontrollierten Versuchsprobanden: Dasselbe Modell, dieselben fünf Themen — Gerechtigkeit, Freiheit, Verantwortung, Heimat, Erfolg — nur die Sprache ändert sich. Weil es dasselbe Modell ist, ist Sprache die einzige Variable. Aus den Antworten extrahieren wir pro Sprache einen Konzeptgraphen. Unsere neue Metrik, der Linguistic Divergence Score, misst die strukturelle Divergenz — über gemeinsame Konzepte und Relationen. Und wir können nicht nur eine Zahl ausgeben, sondern benennen, welche Konzept-Bestandteile genau divergieren.

## S04 — Befund (1:47–2:26)

Wir haben das Experiment auf mehr als 50 Modelle verschiedener Anbieter ausgeweitet — auch auf ein US-amerikanisches Modell. In allen 51 Messungen ist das chinesisch-deutsche Signal statistisch signifikant. Und es ist nicht zufällig, sondern kulturell gemustert: Deutsche Konzepte betonen Autonomie und Regeln, chinesische Raum und Anspruch. Der entscheidende Kontrollbefund: Institutionelles Wissen — etwa Mathematik — konvergiert sprachübergreifend. Kulturelle Konzepte divergieren dagegen deutlich. Selbst die Beziehungen zwischen Konzepten organisieren sich sprachspezifisch.

## S05 — Kritische Reflexion (2:26–2:51) [ROHFASSUNG, muss gekürzt werden]

Ehrlich dazu: Unser Human-Experiment mit 15 Personen zeigt unter Between-Subject-Bedingungen kein Sprachsignal — ein Design-Artefakt, kein Gegenbeweis. Acht englisch-haltige Paare sind nicht signifikant — konsistent mit der Englisch-Zentriertheit heutiger Modelle. Und unsere operative Schwelle von 0,10 ist eine heuristische Faustregel, keine validierte Grenze.

## S06 — Anwendung + Schluss (2:51–3:23)

Damit ist LinguaGraph eine neue Art von KI-Prüfung. Ein Entwickler kann vor dem Einsatz eines mehrsprachigen Modells prüfen: Driftet mein Modell bei wertbeladenen Begriffen zwischen Sprachen — und wo genau? Für Regulierer liefert es Transparenz, wie der EU AI Act sie verlangt. Der Output ist interpretierbar — kein Black-Box-Score, sondern eine Liste der konkreten Konzept-Bestandteile, die divergieren. LinguaGraph. Sichtbar. Danke.
