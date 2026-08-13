import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

export default function PositionScreen({ onSelect }) {
  return (
    <div className="menu-screen">
      <MenuBox label="QBs" onClick={() => onSelect("QB")} />
      <MenuBox label="RBs" onClick={() => onSelect("RB")} />
      <MenuBox label="WRs" onClick={() => onSelect("WR")} />
    </div>
  );
}
