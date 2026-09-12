<#nodoc
Endmontage: Remotion-Render + Untertitel einbrennen + Loudnorm -> renders/final/.
Verbrauch:  .\tooling\assemble.ps1 [-InFile renders/v2/linguagraph-pitch.mp4] [-Srt docs/subtitles_en.srt]
Voraussetzung: ffmpeg im PATH.
#>
param(
  [string]$InFile = "renders/v2/linguagraph-pitch.mp4",
  [string]$Srt = "docs/subtitles_en.srt",
  [string]$OutFile = "renders/final/LinguaGraph_BWKI2026_Pitch.mp4"
)

$ErrorActionPreference = "Stop"
if (-not (Test-Path -LiteralPath $InFile)) { throw "Eingang fehlt: $InFile (erst Remotion rendern)" }
New-Item -ItemType Directory -Path (Split-Path $OutFile) -Force | Out-Null

# Pfad für subtitles-Filter escapen (ffmpeg mag keine Backslashes/Doppelpunkte)
$srtEsc = ((Resolve-Path -LiteralPath $Srt).Path -replace "\\", "/") -replace ":", "\:"
$vf = "subtitles='${srtEsc}':force_style='FontName=Inter,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H80000000,BorderStyle=1,Outline=1,MarginV=40'"

if (Test-Path -LiteralPath $Srt) {
  $srtContent = Get-Content -LiteralPath $Srt -Raw
  if ($srtContent -match "TODO") { Write-Warning "Untertitel enthalten noch TODO — Platzhalter werden eingebrannt!" }
  ffmpeg -y -i $InFile -vf $vf -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -af loudnorm "TEMP_assemble.mp4"
} else {
  Write-Warning "Keine SRT gefunden — ohne Untertitel."
  ffmpeg -y -i $InFile -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -af loudnorm "TEMP_assemble.mp4"
}
Move-Item -Force -LiteralPath "TEMP_assemble.mp4" -Destination $OutFile
$dur = ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 $OutFile
Write-Output "Fertig: $OutFile ($dur)"
Add-Content -LiteralPath "renders/render.log" -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm') assemble -> $OutFile ($dur)"
