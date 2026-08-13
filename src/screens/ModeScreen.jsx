import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

export default function ModeScreen({ onSelect }) {
  return (
    <div className="menu-screen">
      <MenuBox label="Player V.S Player" onClick={() => onSelect(false)} />
      <MenuBox label="Player V.S AI" onClick={() => onSelect(true)} />
    </div>
  );
}
