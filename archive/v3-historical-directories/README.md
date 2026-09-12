# v3 Historical Directories (Archived 2026-09-12)

This archive preserves the **v3 MiniMax-based development artifacts** that were used
before the project pivoted to Vite + React + TypeScript (v4+).

## Contents

| Path | Original Purpose |
|---|---|
| `blender/` | Blender 3D scene files (v3 MiniMax paper-craft visual style) |
| `comfy/` | ComfyUI image generation configs (v3 paper illustrations) |
| `handoff-minimax/` | MiniMax briefing pack (v3-v4 narration/figures/CSV data) |
| `tooling/` | PowerShell (`assemble.ps1`) + Python (`tts_edge.py`) helpers (v3) |
| `video/` | Remotion + TypeScript source code (v3 dynamic video) |
| `minimax-linguagraph-pack.zip` | v3 audio pack (miniMax TTS archive) |
| `minimax-wissen-pack.zip` | v3 docs pack (knowledge base) |
| `render.log` | v3 build log |
| `video/public/.audio-v3-backup/` | v3 s01-s06 mp3 backups |

## Why Archived (Not Deleted)

These directories contain the **historical design record** of the v3 MiniMax-based
approach. They are kept for reference:

- Future iterations may need to reference the original 3D paper-craft visual style
- The v3 MiniMax narration data underlies some claims still in the v4+ version
- Compliance: the v3 audio pack documents the synthetic TTS voice lineage

## Active Tech Stack (v4+)

- **Frontend**: Vite + React 18 + TypeScript 5
- **Visual style**: `indigo-porcelain` theme, 32 per-step CSS/SVG/JS animations
- **Audio**: minimax `German_FriendlyMan` TTS (32 segments)
- **Recording**: Playwright headless Chromium (60fps, 4K)
- **Subtitles**: faster-whisper ASR + ffmpeg + libass burn
- **Output**: H.264 + AAC LC · loudnorm EBU R128 (-16 / -1.5 / 11)

See [`docs/PIPELINE-v10.md`](../../docs/PIPELINE-v10.md) for the full pipeline history
(v3 → v10 evolution).
