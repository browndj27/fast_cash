import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

export default function PositionScreen({ onSelect, onBack }) {
  return (
    <div className="menu-screen">
      <button type="button" className="back-button" onClick={onBack}>
        &lt; Back
      </button>
      <MenuBox label="QBs" onClick={() => onSelect("QB")} />
      <MenuBox label="RBs" onClick={() => onSelect("RB")} />
      <MenuBox label="WRs" onClick={() => onSelect("WR")} />
    </div>
  );
}
