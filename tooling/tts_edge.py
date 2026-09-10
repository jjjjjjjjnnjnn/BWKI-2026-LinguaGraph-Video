#!/usr/bin/env python3
"""Narration -> TTS-MP3s. Liest docs/narration_de.md (Marker '## S01' ... '## S06')
und schreibt video/public/audio/s01.mp3 ... s06.mp3 (Stimme: de-DE-ConradNeural).

Verbrauch:  python tooling/tts_edge.py [--voice de-DE-KatjaNeural] [--dry-run]
Voraussetzung: pip install edge-tts  (braucht Internet)
"""
import argparse
import asyncio
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NARRATION = ROOT / "docs" / "narration_de.md"
OUTDIR = ROOT / "video" / "public" / "audio"

ACTS = ["S01", "S02", "S03", "S04", "S05", "S06"]


def parse_acts(text: str) -> dict[str, str]:
    parts = re.split(r"^##\s+(S0[1-6])\b.*$", text, flags=re.M)
    # parts[0] = Kopf, dann abwechselnd ID / Body
    out: dict[str, str] = {}
    for i in range(1, len(parts) - 1, 2):
        act_id, body = parts[i], parts[i + 1]
        # Klammerzusätze wie [NAME]/[ROHFASSUNG] laut lesen lassen? Nein: eckige Tags streichen.
        body = re.sub(r"\[[A-ZÄÖÜ /-]+\]", "", body)
        body = re.sub(r"\s+", " ", body).strip()
        out[act_id] = body
    return out


async def synth(text: str, voice: str, outfile: Path) -> None:
    import edge_tts  # noqa: WPS433 (import erst hier: --dry-run läuft ohne Paket)

    comm = edge_tts.Communicate(text, voice)
    await comm.save(str(outfile))


async def main_async(voice: str, dry_run: bool) -> int:
    text = NARRATION.read_text(encoding="utf-8")
    acts = parse_acts(text)
    missing = [a for a in ACTS if a not in acts or not acts[a]]
    if missing:
        print(f"FEHLER: Akte fehlen/leer in narration_de.md: {missing}", file=sys.stderr)
        return 1
    OUTDIR.mkdir(parents=True, exist_ok=True)
    for act in ACTS:
        out = OUTDIR / f"{act.lower()}.mp3"
        preview = acts[act][:80]
        if dry_run:
            print(f"[dry-run] {act} ({len(acts[act])} Zeichen) -> {out}\n  „{preview}…“")
            continue
        print(f"{act} -> {out} …")
        await synth(acts[act], voice, out)
    print("Fertig. Dauer prüfen: ffprobe video/public/audio/s0*.mp3  → timing.ts abgleichen.")
    return 0


def main() -> int:
    # Windows-Konsole spricht oft GBK: Ausgabe robust auf UTF-8 umstellen.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="de-DE-ConradNeural")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    return asyncio.run(main_async(args.voice, args.dry_run))


if __name__ == "__main__":
    raise SystemExit(main())
