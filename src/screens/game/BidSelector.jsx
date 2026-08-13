import "./BidSelector.css";

export default function BidSelector({ value, min, max, disabled, onChange }) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="bid-selector">
      <button
        type="button"
        className="bid-arrow"
        disabled={disabled || atMin}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        {"<"}
      </button>
      <span className="bid-value">{value}</span>
      <button
        type="button"
        className="bid-arrow"
        disabled={disabled || atMax}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        {">"}
      </button>
    </div>
  );
}
