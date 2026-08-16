// Shared by Skills Cash (mode 2) and Spin the NFL Wheel (mode 3) — both
// fill the same seven slots: QB, RB1, RB2, WR1, WR2, TE, FLEX.

// Required picks per side. QB/TE/FLEX are singular slots, RB/WR are
// numbered (RB1, RB2, ...) as each side fills them.
export const REQUIRED = { QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1 };
export const CATEGORIES = Object.keys(REQUIRED);
export const ROSTER_SLOTS = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLEX"];

// A FLEX pick's real position can match a plain category (e.g. a WR
// drafted into FLEX) — that must only count toward FLEX, not toward the
// WR1/WR2 slots, so it's excluded from every non-FLEX category count.
export function countInCategory(roster, category) {
  return category === "FLEX"
    ? roster.filter((entry) => entry.slot === "FLEX").length
    : roster.filter((entry) => entry.slot !== "FLEX" && entry.position === category).length;
}

export function isCategoryFull(roster, category) {
  return countInCategory(roster, category) >= REQUIRED[category];
}

// Categories still needed by at least one side.
export function openCategories(rosters) {
  return CATEGORIES.filter(
    (category) => !(isCategoryFull(rosters[0], category) && isCategoryFull(rosters[1], category))
  );
}

export function slotLabelFor(roster, category) {
  if (REQUIRED[category] === 1) return category;
  return `${category}${countInCategory(roster, category) + 1}`;
}
