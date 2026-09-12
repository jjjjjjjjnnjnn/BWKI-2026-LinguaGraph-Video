import "./TeamMonogram.css";

interface Props {
  size?: "lg" | "md";
  /** Show the small team-ID caption beside the monograms. */
  showCaption?: boolean;
}

/**
 * TeamMonogram — v6: visual presence for the two authors.
 *
 * Two circular monogram badges in the brand palette:
 *   - JR (Jiajun Rong)  — accent fill, white serif initials
 *   - ZL (Zhenxi Lan)   — surface fill, dark serif initials
 *
 * `pointer-events: none` keeps it from blocking stage clicks during
 * recording. No external assets — initials only, so we never fabricate
 * a photo. A small caption with the team-ID is optional.
 */
export function TeamMonogram({ size = "lg", showCaption = false }: Props) {
  return (
    <div className={`tm tm-${size}`} aria-hidden="true" data-no-advance>
      <div className="tm-row">
        <span className="tm-circle tm-circle-accent">
          <span className="tm-initials">JR</span>
        </span>
        <span className="tm-dot">·</span>
        <span className="tm-circle tm-circle-soft">
          <span className="tm-initials tm-initials-dark">ZL</span>
        </span>
      </div>
      {showCaption && (
        <div className="tm-caption label-mono">
          knusprige_oktopus-seepocken · BWKI 2026
        </div>
      )}
    </div>
  );
}