import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

export default function HomeScreen({ onStart, onStartSkills, onStartWheel }) {
  return (
    <div className="menu-screen">
      <MenuBox label="NFL Fast Cash" onClick={onStart} />
      <MenuBox label="NFL Skills Cash" onClick={onStartSkills} />
      <MenuBox label="Spin the NFL Wheel" onClick={onStartWheel} />
    </div>
  );
}
