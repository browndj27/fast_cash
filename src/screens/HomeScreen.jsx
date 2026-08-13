import MenuBox from "../components/MenuBox";
import "./MenuScreen.css";

export default function HomeScreen({ onStart }) {
  return (
    <div className="menu-screen">
      <MenuBox label="NFL Fast Cash" onClick={onStart} />
      <MenuBox label="Coming Soon!" disabled />
      <MenuBox label="Coming Soon!" disabled />
    </div>
  );
}
