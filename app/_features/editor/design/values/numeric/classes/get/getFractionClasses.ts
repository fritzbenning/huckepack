/**
 * Generates fraction class names by combining a class key with fraction values.
 * Example: getFractionClasses("h", 10) → ["h-1/2", "h-1/3", "h-2/3", ..., "h-9/10"].
 * Generates all proper fractions (numerator < denominator) for denominators from 2 up to maxDenominator.
 *
 * @param classKey - The class key/prefix (e.g., "h", "w")
 * @param maxDenominator - Maximum denominator to generate fractions for (e.g., 10 generates fractions up to 9/10)
 * @returns Array of class names
 */
export function getFractionClasses(classKey: string, maxDenominator: number): string[] {
  const classes: string[] = [];
  for (let denominator = 2; denominator <= maxDenominator; denominator++) {
    for (let numerator = 1; numerator < denominator; numerator++) {
      classes.push(`${classKey}-${numerator}/${denominator}`);
    }
  }
  return classes;
}

