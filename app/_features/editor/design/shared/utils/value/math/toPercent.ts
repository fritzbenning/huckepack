/**
 * Converts a decimal value (0-1) to a percent value (0-100).
 *
 * @param decimalValue - The decimal value to convert (0-1)
 * @returns The percent value (0-100)
 * @example
 * // Simple: Convert decimal to percent
 * toPercent(0.5); // 50
 *
 * @example
 * // Comprehensive: Various conversions
 * toPercent(0.75); // 75
 * toPercent(1.0); // 100
 * toPercent(0.0); // 0
 * toPercent(0.333); // 33 - rounds to nearest integer
 * toPercent(0.666); // 67
 * toPercent(0.125); // 13 - rounds 12.5 to 13
 */
export function toPercent(decimalValue: number): number {
  return Math.round(decimalValue * 100);
}
