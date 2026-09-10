import React from "react";
import { AbsoluteFill } from "remotion";
import { THEME } from "../lib/theme";
import { FadeIn } from "../components/Camera";

// Platzhalter-Schiefer: rendert sofort, wird Akt für Akt ersetzt.
// Jede Szene bekommt: Titel, Zeitfenster, Audio-Datei, Material-Checkliste.
const Slate: React.FC<{
  act: string;
  title: string;
  time: string;
  audio: string;
  todos: string[];
}> = ({ act, title, time, audio, todos }) => (
  <AbsoluteFill
    style={{
      background: THEME.bg,
      color: THEME.text,
      fontFamily: THEME.font,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <FadeIn>
      <div style={{ textAlign: "center", padding: 80 }}>
        <div style={{ color: THEME.gold, letterSpacing: 6, fontSize: 28 }}>{act}</div>
        <h1 style={{ fontSize: 72, margin: "16px 0" }}>{title}</h1>
        <div style={{ color: THEME.muted, fontSize: 30 }}>
          {time} · Ton: public/audio/{audio}
        </div>
        <ul style={{ color: THEME.muted, fontSize: 24, textAlign: "left", maxWidth: 900, margin: "32px auto" }}>
          {todos.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </FadeIn>
  </AbsoluteFill>
);

export const S01_Hook: React.FC = () => (
  <Slate
    act="S01 · HOOK + TEAM"
    title="Dasselbe Wort. Drei Karten."
    time="0:00–0:29"
    audio="s01.mp3"
    todos={[
      "Blender s01_nebula.mp4 als Hintergrund (public/renders3d/)",
      "Riesen-Typo + Dreifach-Split Freiheit/自由/freedom",
      "Teamkarte 3 Sek: Name, Schule, BWKI 2026",
    ]}
  />
);

export const S02_Problem: React.FC = () => (
  <Slate
    act="S02 · PROBLEM"
    title="Der blinde Fleck"
    time="0:29–1:01"
    audio="s02.mp3"
    todos={["NumberCounter: Englisch-Anteil Trainingsdaten", "Weltkarte + EU-AI-Act-Zeile (MiniMax-Karte)"]}
  />
);

export const S03_Methode: React.FC = () => (
  <Slate
    act="S03 · METHODE"
    title="Das Modell als Proband"
    time="1:01–1:47"
    audio="s03.mp3"
    todos={["Drei Panels (DE/ZH/EN) → Graph-Extraktion → LDS-Formel", "Portal-Screenshot + Pipeline-SVG"]}
  />
);

export const S04_Befund: React.FC = () => (
  <Slate
    act="S04 · BEFUND"
    title="Das Signal ist real"
    time="1:47–2:26"
    audio="s04.mp3"
    todos={[
      "Balken LDS-C vs. Boden (figures-Snapshot)",
      "Treiberliste DE vs. ZH",
      "Blender s05_threecities.mp4 (8s) einbetten",
      "CognitiveSpace-Orbit (footage/) — die lebendige Demo",
    ]}
  />
);

export const S05_Reflexion: React.FC = () => (
  <Slate
    act="S05 · REFLEXION"
    title="Ehrlich dazu"
    time="2:26–2:51"
    audio="s05.mp3"
    todos={["Ruhige Statikkarte, 3 Punkte, kein Bounce, kein Gold"]}
  />
);

export const S06_Schluss: React.FC = () => (
  <Slate
    act="S06 · ANWENDUNG + SCHLUSS"
    title="LinguaGraph. Sichtbar."
    time="2:51–3:23"
    audio="s06.mp3"
    todos={["Divergenzbericht-Mockup", "Endkarte: Danke + GitHub/Demo-Links"]}
  />
);
