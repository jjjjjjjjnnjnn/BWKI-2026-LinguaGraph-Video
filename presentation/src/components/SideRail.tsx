import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  SECTIONS,
  STEP_TITLES,
} from "../chapters/01-linguagraph-pitch/sections";
import "./SideRail.css";

interface Props {
  step: number;
  stepCount: number;
  totalLabel?: string;
}

/**
 * SideRail — right-edge flow indicator (v5.4).
 *
 * v5.4: render via React Portal to document.body. This bypasses any
 * ancestor stacking/transform contexts created by .app-shell or
 * .stage-frame. Debug confirmed: page.screenshot() always showed the
 * rail, but recordVideo screencast missed it when nested inside
 * transformed ancestors. Portal-direct-to-body is the workaround.
 *
 * Three layers of information, top → bottom:
 *   1. AKTUELL · {nn}/{total} · {STEP_TITLES[step]}    ← "在讲什么"
 *   2. divider
 *   3. INHALT list — sections (cover + M1..M6) with current highlighted
 *                                                          ← "分哪些部分"
 *   4. (optional) footer eyebrow with team identity
 *
 * pointer-events: none on the container so the .stage-frame underneath
 * still receives clicks for manual advance.
 */
export function SideRail({ step, stepCount, totalLabel }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const title = STEP_TITLES[step] ?? "";
  const counter = `${String(step + 1).padStart(2, "0")} / ${stepCount}`;

  const rail = (
    <aside className="sr" aria-hidden="true" data-no-advance>
      <div className="sr-current">
        <div className="sr-eyebrow label-mono">AKTUELL</div>
        <div className="sr-counter label-mono">{counter}</div>
        <div key={step} className="sr-title">{title}</div>
      </div>

      <div className="sr-rule" />

      <div className="sr-section-list">
        <div className="sr-eyebrow label-mono">INHALT</div>
        {SECTIONS.map((s) => {
          const isActive = step >= s.startStep && step <= s.endStep;
          const isPast = step > s.endStep;
          const cls = [
            "sr-section",
            isActive ? "sr-active" : "",
            isPast ? "sr-past" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div key={s.id} className={cls}>
              <span className="sr-marker">
                {isActive ? "▶" : isPast ? "✓" : "·"}
              </span>
              <span className="sr-section-label">{s.label}</span>
            </div>
          );
        })}
      </div>

      {totalLabel && (
        <>
          <div className="sr-rule" />
          <div className="sr-foot label-mono">{totalLabel}</div>
        </>
      )}
    </aside>
  );

  if (!mounted) return null;
  return createPortal(rail, document.body);
}
