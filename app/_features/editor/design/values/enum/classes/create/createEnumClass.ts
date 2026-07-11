/**
 * Creates an enum class name by combining a prefix with a value.
 * Example: createEnumClass("auto", "bg") → "bg-auto".
 * Example: createEnumClass("static", "") → "static".
 *
 * @param value - The enum value (e.g., "auto", "cover", "static")
 * @param prefix - The Tailwind prefix (e.g., "bg", "w"). Empty string for no prefix
 * @returns Formatted Tailwind class name
 */
export function createEnumClass(value: string, prefix: string): string {
  if (prefix === "") {
    return value;
  }

  return `${prefix}-${value}`;
}

