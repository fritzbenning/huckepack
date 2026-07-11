/**
 * Checks if a class is an enum class (matches any enum value in the enumMap with the given prefix).
 */
export function isEnumClass(enumValues: readonly string[], prefix: string, currentClass: string | null): boolean {
  if (!currentClass || !enumValues.length) return false;

  return enumValues.some((enumValue) => currentClass === `${prefix}-${enumValue}`);
}
