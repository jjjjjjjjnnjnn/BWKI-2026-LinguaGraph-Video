#!/bin/bash
# ────────────────────────────────────────────────────────────────────
# minimax-clean.sh — MiniMax (mmx) provider with [EMPHASIS] stripping.
#
# Same as minimax.sh, but strips `[EMPHASIS]…[/EMPHASIS]` markers from
# the text before sending to mmx (mmx doesn't understand the markers
# and would speak them literally). Use this when you want mmx's more
# natural voice but don't need the rate-down emphasis that
# edge-tts-emphasis.sh provides.
#
# Activate:
#   PRESENTATION_TTS=minimax-clean npm run synthesize-audio \
#     -- --voice=German_FriendlyMan
#
# Marker syntax (in narrations.ts):
#   "Das ist ein [EMPHASIS]blinder Fleck[/EMPHASIS]."
#   → "Das ist ein blinder Fleck."  (markers removed, text passed cleanly)
# ────────────────────────────────────────────────────────────────────

tts_check() {
  if ! command -v mmx >/dev/null; then
    echo "✗ mmx CLI not found in PATH." >&2
    return 1
  fi
  if ! mmx auth status >/dev/null 2>&1; then
    echo "✗ mmx is not authenticated." >&2
    return 1
  fi
}

tts_install_help() {
  cat <<'EOF' >&2
To use the MiniMax provider:

  Install:  npm install -g mmx-cli
  Login:    mmx auth login --api-key sk-xxxxx
            (get a key at https://platform.minimaxi.com)

Or pick another provider:  PRESENTATION_TTS=<name> npm run synthesize-audio
See tts-providers/README.md for the list and how to add your own.
EOF
}

tts_synthesize() {
  local text="$1"
  local out="$2"
  local voice="${3:-}"

  # Strip [EMPHASIS]…[/EMPHASIS] markers. mmx doesn't understand SSML
  # or our marker convention; if we passed them through, mmx would
  # speak the literal text "[EMPHASIS]blinder Fleck[/EMPHASIS]" which
  # would ruin the audio. Use sed for the strip; both opening and
  # closing tags removed in one pass.
  local clean_text
  clean_text="$(printf '%s' "$text" | sed -E 's/\[EMPHASIS\]|\[\/EMPHASIS\]//g')"

  # Branch instead of using an empty array — runner uses `set -u`, and
  # macOS-default bash 3.2 fires "unbound variable" on "${arr[@]}" when
  # arr is empty. The two-branch form is portable to old bash.
  if [[ -n "$voice" ]]; then
    mmx speech synthesize --voice "$voice" --text "$clean_text" --out "$out" \
      >/dev/null 2>&1
  else
    mmx speech synthesize --text "$clean_text" --out "$out" \
      >/dev/null 2>&1
  fi
}