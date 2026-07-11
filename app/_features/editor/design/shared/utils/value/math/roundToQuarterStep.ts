/**
 * Rounds a number to the nearest quarter step (0.25 increments).
 * Used for Tailwind scale values to ensure valid scale numbers.
 *
 * @param value - The value to round
 * @returns Value rounded to nearest 0.25
 * @example
 * // Simple: Round to quarter step
 * roundToQuarterStep(3.7); // 3.75
 *
 * @example
 * // Comprehensive: Various rounding scenarios
 * roundToQuarterStep(4.1); // 4.0
 * roundToQuarterStep(2.33); // 2.25 - rounds down
 * roundToQuarterStep(2.38); // 2.5 - rounds up to nearest quarter
 * roundToQuarterStep(5.0); // 5.0 - already on quarter step
 * roundToQuarterStep(0.1); // 0.0
 * roundToQuarterStep(0.13); // 0.25
 */
export function roundToQuarterStep(value: number): number {
  return Math.round(value * 4) / 4;
}
