#!/bin/bash
# ────────────────────────────────────────────────────────────────────
# edge-tts-emphasis.sh — Microsoft Edge TTS with [EMPHASIS] support.
#
# Extension of edge-tts.sh. Drop-in replacement: same function signature,
# same default voice. The ONLY difference: recognises [EMPHASIS]…[/EMPHASIS]
# markers in text and synthesises emphasis segments with --rate=-15% for
# slower, weightier delivery. Plain text falls through to vanilla edge-tts.
#
# Activate (same env vars as edge-tts.sh):
#   PRESENTATION_TTS=edge-tts-emphasis npm run synthesize-audio \
#     -- --voice=de-DE-ConradNeural
#
# Marker syntax (in narrations.ts strings):
#   "Das ist ein [EMPHASIS]blinder Fleck[/EMPHASIS]."
#   → "Das ist ein" (default rate) + "blinder Fleck" (--rate=-15%) + "." (default)
#
# Why not SSML? edge-tts CLI does not expose <break>/<emphasis>; --rate is
# the only prosody knob. Combined with --volume=+5%, the effect is
# audible-vs-default without breaking the TTS contract.
# ────────────────────────────────────────────────────────────────────

tts_check() {
  command -v edge-tts >/dev/null || {
    echo "✗ edge-tts not found on PATH" >&2
    return 1
  }
  command -v ffmpeg >/dev/null || {
    echo "✗ ffmpeg not found (needed for emphasis concat)" >&2
    return 1
  }
}

tts_install_help() {
  cat <<'EOF' >&2
edge-tts + ffmpeg required.
  pip install edge-tts
  ffmpeg: https://ffmpeg.org/download.html
EOF
}

DEFAULT_VOICE="de-DE-ConradNeural"
EMPHASIS_RATE="-15%"   # slower for weight
EMPHASIS_VOLUME="+5%"  # slightly louder for presence
NORMAL_RATE="+0%"
NORMAL_VOLUME="+0%"

# Internal: synthesize one chunk via edge-tts.
# Args: $1=text  $2=out_path  $3=rate  $4=volume  $5=voice
_tts_one() {
  local text="$1"
  local out="$2"
  local rate="$3"
  local volume="$4"
  local voice="$5"
  # Use cygpath so mktemp returns a Windows-style path that ffmpeg can
  # open directly on Windows. Without this, Git Bash maps /tmp/X to
  # C:/Users/.../Temp/X inconsistently across tools, and ffmpeg's
  # concat demuxer sometimes fails to find the file.
  local tmp
  tmp="$(cygpath -w "$(mktemp -t edge-tts-XXXXXX.mp3)")"
  # NOTE: --rate and --volume values look like flags to bash ("-15%" parses
  # as "-1" + "5%"). Use --key=value form so bash keeps the value intact.
  if edge-tts \
      --text "$text" \
      --voice "$voice" \
      --rate="$rate" \
      --volume="$volume" \
      --write-media "$tmp" \
      >/dev/null 2>&1; then
    # edge-tts pads each chunk with ~1s of trailing silence; if we concat
    # 3 chunks the silence stacks. Strip the trailing silence here.
    local trimmed
    trimmed="$(cygpath -w "$(mktemp -t edge-tts-trim-XXXXXX.mp3)")"
    if ffmpeg -y -i "$tmp" \
        -af "silenceremove=stop_periods=-1:stop_duration=0.4:stop_threshold=-30dB" \
        "$trimmed" >/dev/null 2>&1; then
      mv "$trimmed" "$out"
      rm -f "$tmp"
      return 0
    else
      # If trim fails, keep the original (still better than nothing).
      mv "$tmp" "$out"
      rm -f "$trimmed"
      return 0
    fi
  else
    rm -f "$tmp"
    return 1
  fi
}

# Internal: concat 1..N mp3 files losslessly into $1.
# Args: $1=out_path  $2..$N=input mp3 files (already lossless mp3).
# ffmpeg concat accepts forward-slash paths on Windows, so no path massage
# needed (and bash parameter-expansion escaping makes backslash→slash
# conversion very fragile — keep paths as-is).
_tts_concat() {
  local out="$1"
  shift
  local concat_file
  concat_file="$(cygpath -w "$(mktemp -t tts-concat-XXXXXX.txt)")"
  : > "$concat_file"
  for f in "$@"; do
    # cygpath -w converts /tmp/X to C:/Users/.../Temp/X so ffmpeg sees
    # a real Windows path that its file API can open.
    printf "file '%s'\n" "$(cygpath -w "$f")" >> "$concat_file"
  done
  if ffmpeg -y -f concat -safe 0 -i "$concat_file" -c copy "$(cygpath -w "$out")" >/dev/null 2>&1; then
    rm -f "$concat_file"
    return 0
  else
    local rc=$?
    echo "✗ _tts_concat failed (rc=$rc). Concat list:" >&2
    cat "$concat_file" >&2
    rm -f "$concat_file"
    return 1
  fi
}

tts_synthesize() {
  local text="$1"
  local out="$2"
  local voice="${3:-$DEFAULT_VOICE}"

  # Fast path: no [EMPHASIS] marker — use plain edge-tts.
  if [[ "$text" != *"[EMPHASIS]"* ]]; then
    _tts_one "$text" "$out" "$NORMAL_RATE" "$NORMAL_VOLUME" "$voice"
    return $?
  fi

  # Split on [EMPHASIS]…[/EMPHASIS]. Use bash regex — clean & portable.
  # Pattern: pre  [EMPHASIS]  emph  [/EMPHASIS]  post
  local pre emph post
  if [[ "$text" =~ ^(.*)\[EMPHASIS\](.*)\[/EMPHASIS\](.*)$ ]]; then
    pre="${BASH_REMATCH[1]}"
    emph="${BASH_REMATCH[2]}"
    post="${BASH_REMATCH[3]}"
  else
    # Malformed marker — fall through to plain synthesis (safer than failing).
    _tts_one "$text" "$out" "$NORMAL_RATE" "$NORMAL_VOLUME" "$voice"
    return $?
  fi

  # Build per-chunk temp mp3s.
  local tmpdir
  tmpdir="$(cygpath -w "$(mktemp -d -t tts-emph-XXXXXX)")"
  local p_pre="$tmpdir/1-pre.mp3"
  local p_emph="$tmpdir/2-emph.mp3"
  local p_post="$tmpdir/3-post.mp3"
  local p_out="$tmpdir/merged.mp3"

  # Synth each chunk. Skip chunks that are empty or punctuation-only
  # — edge-tts rejects "." alone with NoAudioReceived, and joining two
  # chunks with `ffmpeg -c copy` still leaves a silence gap in between.
  local chunks=()
  local chunk_text
  chunk_text="$pre"
  if [[ -n "$chunk_text" && "$chunk_text" =~ [[:alpha:]] ]]; then
    _tts_one "$chunk_text" "$p_pre" "$NORMAL_RATE" "$NORMAL_VOLUME" "$voice" || { rm -rf "$tmpdir"; return 1; }
    chunks+=("$p_pre")
  fi
  chunk_text="$emph"
  if [[ -n "$chunk_text" && "$chunk_text" =~ [[:alpha:]] ]]; then
    _tts_one "$chunk_text" "$p_emph" "$EMPHASIS_RATE" "$EMPHASIS_VOLUME" "$voice" || { rm -rf "$tmpdir"; return 1; }
    chunks+=("$p_emph")
  fi
  chunk_text="$post"
  if [[ -n "$chunk_text" && "$chunk_text" =~ [[:alpha:]] ]]; then
    _tts_one "$chunk_text" "$p_post" "$NORMAL_RATE" "$NORMAL_VOLUME" "$voice" || { rm -rf "$tmpdir"; return 1; }
    chunks+=("$p_post")
  fi

  # If the marker produced only one playable chunk (e.g. pre="." skipped),
  # fall back to plain synthesis — safer than failing silently.
  if [[ ${#chunks[@]} -eq 0 ]]; then
    rm -rf "$tmpdir"
    _tts_one "$text" "$out" "$NORMAL_RATE" "$NORMAL_VOLUME" "$voice"
    return $?
  fi

  # Concat all chunks (in original order).
  if [[ ${#chunks[@]} -eq 1 ]]; then
    mv "${chunks[0]}" "$p_out"
  else
    _tts_concat "$p_out" "${chunks[@]}" || { rm -rf "$tmpdir"; return 1; }
  fi

  mv "$p_out" "$out"
  rm -rf "$tmpdir"
  return 0
}