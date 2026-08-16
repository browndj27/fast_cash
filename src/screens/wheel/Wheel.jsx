import { useEffect, useRef, useState } from "react";
import { NFL_TEAMS } from "../../data/nflTeams";
import "./Wheel.css";

const SEGMENT_ANGLE = 360 / NFL_TEAMS.length;
const SPIN_DURATION_MS = 3200;
const EXTRA_SPINS = 5;

// angleDeg is measured clockwise from the top (12 o'clock = 0deg).
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function describeSlice(cx, cy, r, startAngle, endAngle) {
  const p1 = polarToCartesian(cx, cy, r, startAngle);
  const p2 = polarToCartesian(cx, cy, r, endAngle);
  return `M ${cx},${cy} L ${p1.x},${p1.y} A ${r},${r} 0 0,1 ${p2.x},${p2.y} Z`;
}

export default function Wheel({ landedIndex, spinning, onSpinComplete, onSpinClick, canSpin }) {
  const [rotation, setRotation] = useState(0);
  const wasSpinning = useRef(false);

  useEffect(() => {
    if (spinning && !wasSpinning.current && landedIndex !== null) {
      wasSpinning.current = true;
      const targetCenter = landedIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      setRotation((prev) => {
        const currentMod = ((prev % 360) + 360) % 360;
        const deltaToTarget = (((360 - targetCenter - currentMod) % 360) + 360) % 360;
        return prev + deltaToTarget + EXTRA_SPINS * 360;
      });
      const timer = setTimeout(() => onSpinComplete?.(), SPIN_DURATION_MS);
      return () => clearTimeout(timer);
    }
    if (!spinning) wasSpinning.current = false;
    return undefined;
  }, [spinning, landedIndex, onSpinComplete]);

  const cx = 150;
  const cy = 150;
  const r = 148;

  return (
    <div className="wheel-wrap">
      <div className="wheel-pointer" />
      <svg
        className="wheel-svg"
        viewBox="0 0 300 300"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${SPIN_DURATION_MS}ms` }}
      >
        {NFL_TEAMS.map((team, i) => {
          const start = i * SEGMENT_ANGLE;
          const end = start + SEGMENT_ANGLE;
          const mid = start + SEGMENT_ANGLE / 2;
          const labelPos = polarToCartesian(cx, cy, r * 0.68, mid);
          return (
            <g key={team.abbr}>
              <path
                d={describeSlice(cx, cy, r, start, end)}
                fill={team.primary}
                stroke={team.secondary}
                strokeWidth="0.5"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="#fff"
                fontSize="9"
                fontFamily="'Courier New', Courier, monospace"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid} ${labelPos.x} ${labelPos.y})`}
              >
                {team.abbr}
              </text>
            </g>
          );
        })}
      </svg>
      <button type="button" className="wheel-spin-button" onClick={onSpinClick} disabled={!canSpin}>
        SPIN
      </button>
    </div>
  );
}
