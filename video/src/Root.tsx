import React from "react";
import { AbsoluteFill, Audio, Composition, Folder, Sequence, Still, staticFile } from "remotion";
import { ACTS, FPS, TOTAL_FRAMES, actFrames } from "./lib/timing";
import { S01_Hook } from "./scenes/S01";
import { S02_Problem } from "./scenes/S02";
import { S03_Methode } from "./scenes/S03";
import { S04_Befund } from "./scenes/S04";
import { S05_Reflexion, S06_Schluss } from "./scenes/Acts";

const SCENES = [S01_Hook, S02_Problem, S03_Methode, S04_Befund, S05_Reflexion, S06_Schluss];

const BWKIFinal: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#060a14" }}>
      {ACTS.map((act, i) => {
        const dur = actFrames(act.seconds);
        const el = (
          <React.Fragment key={act.id}>
            <Sequence from={from} durationInFrames={dur} premountFor={60}>
              {React.createElement(SCENES[i])}
            </Sequence>
            <Sequence from={from} durationInFrames={dur}>
              <Audio src={staticFile(`audio/${act.audio}`)} />
            </Sequence>
          </React.Fragment>
        );
        from += dur;
        return el;
      })}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="BWKI2026">
      <Composition
        id="BWKIFinal"
        component={BWKIFinal}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Still id="Cover" component={S06_Schluss} width={1920} height={1080} />
    </Folder>
  </>
);
