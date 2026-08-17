import "./MenuBox.css";

export default function MenuBox({ label, eyebrow, title, icon, variant, onClick, disabled = false }) {
  const isTile = Boolean(variant);
  const className = [
    "menu-box",
    isTile && "menu-box--tile",
    isTile && `menu-box--${variant}`,
    disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} onClick={disabled ? undefined : onClick}>
      {isTile ? (
        <>
          <span className="menu-box-icon">{icon}</span>
          <span className="menu-box-eyebrow">{eyebrow}</span>
          <span className="menu-box-title">{title}</span>
        </>
      ) : (
        label
      )}
    </div>
  );
}
