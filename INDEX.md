# INDEX — Wegweiser durch `nach/`

> Für Menschen UND Reviewer: Jede Datei hat genau einen Job. SSOT-Dateien sind mit ★ markiert.

```
nach/
├── README.md            # Start hier: 30-Sek-Überblick, 3 Befehle, rote Linien
├── INDEX.md             # diese Datei: Repo-Karte
├── .gitignore           # Binaries/Render-Outputs raus, Code+Docs rein
├── assets_meta.md       # Herkunft + Lizenz JEDER externen Datei
│
├── docs/                        # Alles Lesbare (Review beginnt hier)
│   ├── INDEX.md                 # Lese-Reihenfolge für Jury/Reviewer
│   ├── storyboard.md            # ★ Bild+Ton+Sekunde pro Akt (6 Akte)
│   ├── narration_de.md          # ★ Gesprochener Text (SSOT für TTS-Skript)
│   ├── subtitles_en.srt         # Englische Untertitel (brennen wir ein)
│   ├── faktencheck.md           # ★ Upload-Sperre: alles angehakt, sonst kein Upload
│   └── handoff.md               # Setup, Befehle, Fehlerbilder, Rollback
│
├── video/                       # Remotion-Hauptfilm (React + TypeScript)
│   ├── package.json             # remotion 4.0.252 (verifiziert mit Render aus vor/)
│   ├── remotion.config.ts       # Codec H.264, JPEG-Previews
│   ├── src/
│   │   ├── Root.tsx             # Composition BWKIFinal (1920×1080, 30fps) + Still Cover
│   │   ├── index.ts             # registerRoot
│   │   ├── scenes/              # S01_Hook … S06_Outro (ein Akt = eine Datei)
│   │   ├── components/          # VirtualCamera, Parallax, ParticleField,
│   │   │                        # Vignette, NumberCounter, LDSChart
│   │   └── lib/
│   │       ├── timing.ts        # ★ einzige Stelle für Dauern (Sek ↔ Frames)
│   │       ├── theme.ts         # ★ Farben/Schriften (tiefblau + gold)
│   │       └── springs.ts       # ★ smooth/snappy Presets (einheitliche Haptik)
│   └── public/
│       ├── audio/               # s01.mp3 … s06.mp3 (tooling/tts_edge.py)
│       ├── footage/             # Screen-Recordings (CognitiveSpace, Portal)
│       ├── ai-clips/            # ComfyUI-Übergänge (480p → hochskaliert)
│       ├── figures/             # SNAPSHOT aus Forschungsrepo (mit Quellenvermerk!)
│       ├── images/              # MiniMax-Titelkarten, Cover-Hintergründe
│       └── renders3d/           # Blender-Finalclips (s01_nebula.mp4, s05_cities.mp4)
│
├── blender/                     # 2 Hero-Shots, EEVEE, echte Forschungsdaten
│   ├── shots/                   # s01_nebula.blend, s05_threecities.blend
│   ├── scripts/                 # export_graph_json.py, render_shot.py
│   └── renders/{previz,final}/  # Previz-JPGs → finale PNG-Sequenzen/MP4s
│
├── comfy/                       # max. 2 Übergangs-Clips (Budget!)
│   ├── keyframes/               # Startbilder + gleichnamige Prompt-.txt
│   └── workflows/               # Wan2.1-I2V-JSON + Parameter-Notiz
│
├── tooling/
│   ├── tts_edge.py              # narration_de.md → public/audio/*.mp3
│   └── assemble.ps1             # Concat + Untertitel + Loudnorm → final mp4
│
└── renders/
    ├── v1/ v2/                  # datierte Zwischenstände (niemals löschen vor Abgabe)
    ├── final/                   # GENAU EINE Datei: die Einreichung
    └── render.log               # jeder Render hängt eine Zeile an
```

## Konventionen (verbindlich)

1. **Dauern nur in `video/src/lib/timing.ts`.** Nirgendwo sonst Frames hardcoden.
2. **`video/public/figures/` ist ein Snapshot.** Kommentar im Ordner nennt Quelle + Commit/Datum.
3. **`renders/final/` enthält genau eine MP4.** Dateiname: `LinguaGraph_BWKI2026_Pitch.mp4`.
4. **Kein Upload ohne `docs/faktencheck.md` vollständig angehakt.**
5. Große Binaries (`.mp4` in footage/renders, `.blend` > 50 MB) → Git-LFS oder Release-Anhang, nie direkt in Git.
