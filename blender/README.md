# blender/ — 2 Hero-Shots, EEVEE, echte Forschungsdaten

> Budget: **genau 2 Shots** (s01_nebula 6s, s05_threecities 8s). Mehr nur nach Freigabe.

## Shots

| Datei in `shots/` | Inhalt | Länge | Status |
|---|---|---|---|
| `s01_nebula.blend` | Graph-Nebel + Kamera-Vorbeiflug, Bloom, Volumetrik | 6s (180f @30) | TODO |
| `s05_threecities.blend` | 3 Sprachgraphen, parallele Rotation | 8s (240f @30) | TODO |

## Skripte (`scripts/`)

- `export_graph_json.py` — liest Forschungsrepo `manifest.json` + Graph-JSONs →
  schreibt `shots/graph_data.json` (Knoten XYZ aus Layout, Community-Label, Grad).
  In Blender/SciGraphs importieren. (TODO implementieren)
- `render_shot.py` — Hintergrund-Render: `blender.exe --background shots/<x>.blend
  --python scripts/render_shot.py` → PNG-Sequenz nach `renders/final/`. (TODO)

## Konventionen

- Engine EEVEE (Next), 1920×1080, 30fps, Sampling so niedrig wie möglich, Bloom an.
- `renders/previz/`: Standbilder/JPG-Sequenzen zur Abnahme (dürfen ins Git).
- `renders/final/`: finale Clips → werden nach `video/public/renders3d/` kopiert.
- Blender-MCP (optional, nur für interaktives Feintuning):
  `uvx blender-mcp install-addon`, Addon in Blender aktivieren, N-Panel → Start MCP Server.
