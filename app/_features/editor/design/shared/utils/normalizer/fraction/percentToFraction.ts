export const PERCENT_TO_FRACTION: Record<number, string> = {
  50: "1/2",
  33.333: "1/3",
  33: "1/3",
  66.667: "2/3",
  67: "2/3",
  25: "1/4",
  75: "3/4",
  20: "1/5",
  40: "2/5",
  60: "3/5",
  80: "4/5",
  16.667: "1/6",
  17: "1/6",
  83.333: "5/6",
  83: "5/6",
  12.5: "1/8",
  37.5: "3/8",
  62.5: "5/8",
  87.5: "7/8",
  11.111: "1/9",
  22.222: "2/9",
  44.444: "4/9",
  55.556: "5/9",
  77.778: "7/9",
  88.889: "8/9",
  10: "1/10",
  30: "3/10",
  70: "7/10",
  90: "9/10",
};

/**
 * Converts a percent value to a fraction string.
 * Rounds the percent value to the nearest integer before conversion.
 *
 * @param percent - The percent value (0-100)
 * @returns The fraction string, or null if no matching fraction
 * @example
 * // Convert percent to fraction
 * percentToFraction(50)
 * // Returns: "1/2"
 *
 * @example
 * percentToFraction(75)
 * // Returns: "3/4"
 */
export function percentToFraction(percent: number): string | null {
  if (PERCENT_TO_FRACTION[percent]) {
    return PERCENT_TO_FRACTION[percent];
  }

  const rounded = Math.round(percent);
  return PERCENT_TO_FRACTION[rounded] || null;
}
