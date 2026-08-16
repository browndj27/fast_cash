export function legalRange(budget, currentBid) {
  if (budget === 0) {
    return currentBid === 0 ? { min: 0, max: 0 } : { min: 1, max: 0 };
  }
  return { min: currentBid + 1, max: budget };
}
