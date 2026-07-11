/**
 * Parses a string value from a Tailwind class.
 * Handles arbitrary values like bg-[url('...')] and standard classes like bg-none.
 *
 * @param className - The Tailwind class name (e.g., "bg-[url('https://example.com/image.jpg')]", "bg-none")
 * @param prefix - The prefix to extract (e.g., "bg")
 * @param emptyValue - The class that represents an empty value (e.g., "bg-none")
 * @param parseValue - Optional function to parse the inner value from arbitrary classes
 * @returns The extracted string value, or undefined if empty/not found
 * @example
 * // Extract value from arbitrary class
 * extractStringValue("bg-[url('https://example.com/image.jpg')]", "bg")
 * // Returns: "url('https://example.com/image.jpg')"
 *
 * @example
 * // Extract value from standard class
 * extractStringValue("bg-red-500", "bg")
 * // Returns: "red-500"
 *
 * @example
 * // Handle empty value
 * extractStringValue("bg-none", "bg", "bg-none")
 * // Returns: undefined
 */
export function extractStringValue(
  className: string | null | undefined,
  prefix: string,
  emptyValue?: string,
  parseValue?: (value: string) => string | undefined
): string | undefined {
  if (!className) return undefined;

  if (emptyValue && className === emptyValue) {
    return;
  }

  if (className.startsWith(`${prefix}-[`)) {
    const match = className.match(/\[([^\]]+)\]/);
    if (match) {
      const inner = match[1];
      if (parseValue) {
        return parseValue(inner);
      }
      return inner;
    }
  }

  if (className.startsWith(`${prefix}-`)) {
    return className.replace(`${prefix}-`, "");
  }

  return;
}
