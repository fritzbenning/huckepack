export const FRACTION_TO_PERCENT: Record<string, number> = {
  "1/2": 50,
  "1/3": 33.333,
  "2/3": 66.667,
  "1/4": 25,
  "3/4": 75,
  "1/5": 20,
  "2/5": 40,
  "3/5": 60,
  "4/5": 80,
  "1/6": 16.667,
  "5/6": 83.333,
  "1/8": 12.5,
  "3/8": 37.5,
  "5/8": 62.5,
  "7/8": 87.5,
  "1/9": 11.111,
  "2/9": 22.222,
  "4/9": 44.444,
  "5/9": 55.556,
  "7/9": 77.778,
  "8/9": 88.889,
  "1/10": 10,
  "3/10": 30,
  "7/10": 70,
  "9/10": 90,
};

/**
 * Converts a fraction string to a percent value.
 *
 * @param fraction - The fraction string (e.g., "1/2", "3/4")
 * @returns The percent value, or null if fraction is not recognized
 * @example
 * // Convert fraction to percent
 * fractionToPercent("1/2")
 * // Returns: 50
 *
 * @example
 * fractionToPercent("3/4")
 * // Returns: 75
 */
export function fractionToPercent(fraction: string): number | null {
  return FRACTION_TO_PERCENT[fraction] || null;
}
