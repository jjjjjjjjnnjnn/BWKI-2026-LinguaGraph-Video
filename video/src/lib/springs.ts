// ★ SSOT für Bewegungshaptik. Genau zwei Presets — kein Wildwuchs pro Szene.
export const SPRINGS = {
  // Ruhige Auftritte (Karten, Texte, Diagramme)
  smooth: { damping: 200 },
  // Energetische Momente (Hook-Zeile, Zahlen-Snap) — minimaler Bounce
  snappy: { damping: 20, stiffness: 200 },
} as const;
