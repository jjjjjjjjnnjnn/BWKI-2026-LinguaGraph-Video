# Handoff — Inbetriebnahme & Wartung

## Umgebung (verifiziert 2026-09-10)

| Werkzeug | Version/Pfad | Wofür |
|---|---|---|
| Node | v24.15.0 | Remotion |
| Python | 3.11.15 + `edge-tts` 7.2.7 | Narration-TTS |
| ffmpeg | 8.1.1 full (Gyan) | Montage, Untertitel, Loudnorm |
| Blender | 5.1.0 (`C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`) | 2 Hero-Shots, EEVEE |
| ComfyUI | portable + Wan2.1-I2V-14B-480P-Q4_K_S + WanVideoWrapper | max. 2 Übergangs-Clips |
| GPU | RTX 5060 Laptop 8 GB | EEVEE + Wan-I2V (480p, offload) |

## Setup auf neuem Rechner

```powershell
cd video; npm install            # remotion 4.0.252
pip install edge-tts             # TTS
# Blender: Datei öffnen, SciGraphs-Addon laut blender/README.md installieren
# ComfyUI: workflows aus comfy/workflows per Drag&Drop laden
```

## Standard-Ablauf

```powershell
python tooling/tts_edge.py       # narration → video/public/audio/s0X.mp3
cd video; npx remotion studio    # Vorschau
npx remotion render BWKIFinal ../renders/v2/bwki-final-<datum>.mp4
.\tooling\assemble.ps1           # → renders/final/LinguaGraph_BWKI2026_Pitch.mp4
```

## Fehlerbilder

| Symptom | Ursache → Fix |
|---|---|
| Remotion: schwarzer Blitz an Schnitten | `premountFor={60}` an Clip-Sequenzen fehlt |
| Spring sieht nach Render anders aus | `fps` aus `useVideoConfig()` nehmen, nie hardcoden |
| Wan-I2V: CLIP-Vision-Fehler | `clip_vision_h.safetensors` nach `models/clip_vision/` laden (XLMR-Variante ggf. inkompatibel) |
| Wan OOM auf 8 GB | 480p, ≤49 Frames, Euler 12–20 Steps, Browser + LM Studio schließen |
| Blender-MCP verbindet nicht | Blender-Addon-Server läuft? (N-Panel → Start MCP Server), `uvx`-Absolutpfad in MCP-Config |

## Rollback

- Jeder Render liegt datiert in `renders/v{1,2}/` + Zeile in `renders/render.log`.
- `renders/final/` wird nur bei bestandenem Faktencheck überschrieben (alte Datei vorher nach `renders/v2/` kopieren).
- `video/public/figures/` ist Snapshot: Quelle + Datum stehen in `video/public/figures/QUELLE.md`.
