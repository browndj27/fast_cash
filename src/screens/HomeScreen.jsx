import MenuBox from "../components/MenuBox";
import FieldEmblem from "../components/FieldEmblem";
import "./MenuScreen.css";

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

const ClockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
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
      <MenuBox
        variant="accent-gray"
        eyebrow="NFL"
        title="COMING SOON..."
        icon={ClockIcon}
        disabled
      />
    </div>
  );
}
