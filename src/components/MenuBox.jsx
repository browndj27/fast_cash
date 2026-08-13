import "./MenuBox.css";

export default function MenuBox({ label, onClick, disabled = false }) {
  return (
    <div
      className={`menu-box${disabled ? " disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </div>
  );
}
