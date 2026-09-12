# comfy/ — max. 2 Übergangs-Clips (Budget!)

## Rezept (RTX 5060 8 GB, verifiziert recherchiert)

- Modell: `wan2.1-i2v-14b-480p-Q4_K_S.gguf` (Diffusion) + UMT5-Encoder + `Wan2_1_VAE` + CLIP-Vision
  (⚠ erst prüfen: XLMR-`clip_vision` wird evtl. nicht akzeptiert → dann `clip_vision_h.safetensors` laden)
- Sampler Euler, 12–20 Steps, cfg 5, shift 3, 33–49 Frames @16fps → 2–3s
- Danach per ffmpeg auf 1080p hochskalieren (nur als Hintergrund/Übergang, nie Vollbild-Text!)

## Ablage

- `keyframes/`: Startbild + gleichnamige Prompt-`.txt` (z. B. `t01_stars.png` + `t01_stars.txt`)
- `workflows/`: Wan2.1-I2V-Workflow-`.json` (Drag&Drop in ComfyUI) + `PARAMS.md`-Notiz
- Output: nach `../video/public/ai-clips/` kopieren
