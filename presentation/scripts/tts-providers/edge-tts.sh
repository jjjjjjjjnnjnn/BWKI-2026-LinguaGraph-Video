#!/bin/bash
# ────────────────────────────────────────────────────────────────────
# edge-tts.sh — Microsoft Edge TTS (free, no API key).
#
# Activate:
#   PRESENTATION_TTS=edge-tts npm run synthesize-audio \
#     -- --voice=de-DE-ConradNeural
#
# Default voice: de-DE-ConradNeural (matches the existing LinguaGraph
# v3 narration voice — see nach/docs/narration_de.md).
#
# For BWKI 2026 we keep the same voice across all 32 DE segments so the
# delivery is consistent. Override per-segment by passing --voice.
# ────────────────────────────────────────────────────────────────────

tts_check() {
  command -v edge-tts >/dev/null || {
    echo "✗ edge-tts not found on PATH" >&2
    return 1
  }
}

tts_install_help() {
  cat <<'EOF' >&2
edge-tts is a free Python wrapper around Microsoft Edge's read-aloud API
(no API key needed).

Install:
  pip install edge-tts

List voices:
  edge-tts --list-voices
EOF
}

# Default voice for LinguaGraph DE pitch — preserved from v3 TTS tooling.
DEFAULT_VOICE="de-DE-ConradNeural"

tts_synthesize() {
  local text="$1"
  local out="$2"
  local voice="${3:-$DEFAULT_VOICE}"

  # edge-tts is a one-shot CLI: write mp3 (or wav) to --write-media.
  # Redirect stdout to silence (it prints progress); let stderr through
  # only on failure.
  local tmp
  tmp="$(mktemp -t edge-tts-XXXXXX.mp3)"
  if edge-tts \
      --text "$text" \
      --voice "$voice" \
      --write-media "$tmp" \
      >/dev/null 2>&1; then
    mv "$tmp" "$out"
    return 0
  else
    rm -f "$tmp"
    return 1
  fi
}