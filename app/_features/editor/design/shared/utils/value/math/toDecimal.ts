/**
 * Converts a percent value (0-100) to a decimal value (0-1).
 * Clamps the result between 0 and 1.
 *
 * @param percentValue - The percent value to convert (0-100)
 * @returns The decimal value (0-1), clamped between 0 and 1
 * @example
 * // Simple: Convert percent to decimal
 * toDecimal(50); // 0.5
 *
 * @example
 * // Comprehensive: Conversions with clamping
 * toDecimal(75); // 0.75
 * toDecimal(100); // 1.0
 * toDecimal(0); // 0.0
 * toDecimal(150); // 1.0 - clamped to max
 * toDecimal(-10); // 0.0 - clamped to min
 * toDecimal(33); // 0.33
 */
export function toDecimal(percentValue: number): number {
  return Math.max(0, Math.min(1, percentValue / 100));
}
