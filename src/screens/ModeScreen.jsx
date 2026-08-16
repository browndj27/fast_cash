import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

export default function ModeScreen({ onSelect, onBack }) {
  return (
    <div className="menu-screen">
      <button type="button" className="back-button" onClick={onBack}>
        &lt; Back
      </button>
      <MenuBox label="Player V.S Player" onClick={() => onSelect(false)} />
      <MenuBox label="Player V.S AI" onClick={() => onSelect(true)} />
    </div>
  );
}
