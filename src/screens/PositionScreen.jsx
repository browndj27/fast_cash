import MenuBox from "../components/MenuBox";
import FieldEmblem from "../components/FieldEmblem";
import "./MenuScreen.css";

const FootballIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(-20 12 12)" />
    <g transform="rotate(-20 12 12)">
      <line x1="7.5" y1="12" x2="16.5" y2="12" />
      <line x1="9.5" y1="10.3" x2="9.5" y2="13.7" />
      <line x1="12" y1="10.3" x2="12" y2="13.7" />
      <line x1="14.5" y1="10.3" x2="14.5" y2="13.7" />
    </g>
  </svg>
);

export default function PositionScreen({ onSelect, onBack }) {
  return (
    <div className="menu-screen">
      <FieldEmblem />
      <button type="button" className="back-button" onClick={onBack}>
        &lt; Back
      </button>
      <MenuBox
        variant="accent-gold"
        eyebrow="POSITION"
        title="QBs"
        icon={FootballIcon}
        onClick={() => onSelect("QB")}
      />
      <MenuBox
        variant="accent-cyan"
        eyebrow="POSITION"
        title="RBs"
        icon={FootballIcon}
        onClick={() => onSelect("RB")}
      />
      <MenuBox
        variant="accent-purple"
        eyebrow="POSITION"
        title="WRs"
        icon={FootballIcon}
        onClick={() => onSelect("WR")}
      />
    </div>
  );
}
