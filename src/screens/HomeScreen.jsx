import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

// Original football-emblem watermark (shield + laced ball + star) — not the
// NFL's trademarked shield, just a generic league motif for the backdrop.
function FieldEmblem() {
  return (
    <svg className="menu-watermark" viewBox="0 0 200 240" aria-hidden="true">
      <path
        d="M100 6 L188 42 L188 108 C188 168 148 208 100 232 C52 208 12 168 12 108 L12 42 Z"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
      />
      <ellipse
        cx="100"
        cy="122"
        rx="60"
        ry="34"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        transform="rotate(-16 100 122)"
      />
      <g stroke="#fff" strokeWidth="3.5" strokeLinecap="round" transform="rotate(-16 100 122)">
        <line x1="68" y1="122" x2="132" y2="122" />
        <line x1="80" y1="115" x2="80" y2="129" />
        <line x1="92" y1="115" x2="92" y2="129" />
        <line x1="104" y1="115" x2="104" y2="129" />
        <line x1="116" y1="115" x2="116" y2="129" />
      </g>
      <path
        d="M100 26 l5.5 11.5 12.6 1.3-9.3 8.6 2.6 12.5-11.4-6.3-11.4 6.3 2.6-12.5-9.3-8.6 12.6-1.3z"
        fill="#fff"
      />
    </svg>
  );
}

const LightningIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2 3 14h7l-1 8 11-14h-7z" />
  </svg>
);

const TargetIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.2" />
    <line x1="12" y1="1" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="1" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="23" y2="12" />
  </svg>
);

const WheelIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
    <line x1="19.1" y1="4.9" x2="4.9" y2="19.1" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
  </svg>
);

export default function HomeScreen({ onStart, onStartSkills, onStartWheel }) {
  return (
    <div className="menu-screen">
      <FieldEmblem />
      <MenuBox
        variant="fastcash"
        eyebrow="NFL"
        title="FAST CASH"
        icon={LightningIcon}
        onClick={onStart}
      />
      <MenuBox
        variant="skills"
        eyebrow="NFL"
        title="SKILLS CASH"
        icon={TargetIcon}
        onClick={onStartSkills}
      />
      <MenuBox
        variant="wheel"
        eyebrow="NFL"
        title="SPIN THE WHEEL"
        icon={WheelIcon}
        onClick={onStartWheel}
      />
    </div>
  );
}
