# capture.webm (15MB) — Local Only

This file is the v8 Playwright recording intermediate (172.97s · 4K · 60fps webm).
**Not committed** to Git due to size (15MB exceeds GitHub's recommended per-file
limit for repos without LFS).

## Purpose

`capture.webm` was the **first draft** of the v8 video recording (4K · 60fps · 172.97s).
The final v8 video (`renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4`) was post-processed
from this file + minimax `all.mp3`.

## To Regenerate

Run the recording pipeline (requires Node.js + Playwright + dev server):

```bash
cd presentation
npm install
npx playwright install chromium
npm run extract-narrations
node scripts/record-video.mjs
```

This will produce `renders/raw/capture.webm` (15MB) — same as before.

## Final Output

The user-approved final version is `renders/user-edit/202609112316.mp4` (117.5MB,
archived in `archive/v9-user-edit/`). This was lossless-compressed by the user to
`renders/final/LinguaGraph_BWKI2026_Pitch_4K.mp4` (15MB) for v10 ship.
