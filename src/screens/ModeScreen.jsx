import MenuBox from "../components/MenuBox";
import FieldEmblem from "../components/FieldEmblem";
import "./MenuScreen.css";

const VersusIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M2 20c0-3 2.5-5 6-5s6 2 6 5" />
    <path d="M10 20c0-3 2.5-5 6-5s6 2 6 5" />
  </svg>
);

const CpuIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.5 4.5l3 3M16.5 16.5l3 3M19.5 4.5l-3 3M7.5 16.5l-3 3" />
    <circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none" />
  </svg>
);

export default function ModeScreen({ onSelect, onBack }) {
  return (
    <div className="menu-screen">
      <FieldEmblem />
      <button type="button" className="back-button" onClick={onBack}>
        &lt; Back
      </button>
      <MenuBox
        variant="accent-gold"
        eyebrow="MODE"
        title="PLAYER V.S PLAYER"
        icon={VersusIcon}
        onClick={() => onSelect(false)}
      />
      <MenuBox
        variant="accent-cyan"
        eyebrow="MODE"
        title="PLAYER V.S AI"
        icon={CpuIcon}
        onClick={() => onSelect(true)}
      />
    </div>
  );
}
