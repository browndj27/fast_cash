export function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[.']/g, "")
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function indexKey(position, name) {
  return `${position}:${normalizeName(name)}`;
}
