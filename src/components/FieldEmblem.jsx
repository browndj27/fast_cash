// Original football-emblem watermark (shield + laced ball + star) — not the
// NFL's trademarked shield, just a generic league motif for screen backdrops.
export default function FieldEmblem() {
  return (
    <svg className="menu-watermark" viewBox="0 0 200 240" aria-hidden="true">
      <path
        d="M100 6 L188 42 L188 108 C188 168 148 208 100 232 C52 208 12 168 12 108 L12 42 Z"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
      />
      <ellipse
        cx="100"
        cy="122"
        rx="60"
        ry="34"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        transform="rotate(-16 100 122)"
      />
      <g stroke="#fff" strokeWidth="3.5" strokeLinecap="round" transform="rotate(-16 100 122)">
        <line x1="68" y1="122" x2="132" y2="122" />
        <line x1="80" y1="115" x2="80" y2="129" />
        <line x1="92" y1="115" x2="92" y2="129" />
        <line x1="104" y1="115" x2="104" y2="129" />
        <line x1="116" y1="115" x2="116" y2="129" />
      </g>
      <path
        d="M100 26 l5.5 11.5 12.6 1.3-9.3 8.6 2.6 12.5-11.4-6.3-11.4 6.3 2.6-12.5-9.3-8.6 12.6-1.3z"
        fill="#fff"
      />
    </svg>
  );
}
