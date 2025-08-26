export function computeOverallRating(r) {
  // Prefer explicit rating.
  if (typeof r?.rating === "number") return r.rating;

  // Map to numbers.
  // Drop NaN values.
  const nums = (r?.reviewCategory ?? [])
    .map(c => Number(c?.rating))
    .filter(n => !Number.isNaN(n));

  // No ratings? Return null.
  if (!nums.length) return null;

  // Compute average.
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;

  // Round to one decimal.
  return Math.round(avg * 10) / 10;
}
