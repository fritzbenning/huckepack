/**
 * Formats a string value into a Tailwind class.
 * Handles URL formatting and empty values.
 *
 * @param value - The string value to format
 * @param prefix - The prefix to use (e.g., "bg")
 * @param emptyValue - The class to use when value is empty (e.g., "bg-none")
 * @param formatValue - Optional function to format the value before wrapping in brackets
 * @returns The formatted Tailwind class
 * @example
 * // Format a URL string
 * createStringClass("https://example.com/image.jpg", "bg")
 * // Returns: "bg-[url('https://example.com/image.jpg')]"
 *
 * @example
 * // Format a value that already starts with url()
 * createStringClass("url('https://example.com/image.jpg')", "bg")
 * // Returns: "bg-[url('https://example.com/image.jpg')]"
 *
 * @example
 * // Handle empty value with custom empty class
 * createStringClass("", "bg", "bg-none")
 * // Returns: "bg-none"
 *
 * @example
 * // Handle empty value without custom empty class (uses default)
 * createStringClass(null, "bg")
 * // Returns: "bg-none"
 *
 * @example
 * // Use formatValue function to transform the value
 * createStringClass("image.jpg", "bg", undefined, (val) => `https://example.com/${val}`)
 * // Returns: "bg-[url('https://example.com/image.jpg')]"
 */
export function createStringClass(
  value: string | undefined | null,
  prefix: string,
  emptyValue?: string,
  formatValue?: (value: string) => string
): string {
  if (!value || value.trim() === "") {
    return emptyValue ?? `${prefix}-none`;
  }

  const formatted = formatValue ? formatValue(value) : value;
  const urlValue = formatted.startsWith("url(") ? formatted : `url('${formatted}')`;

  return `${prefix}-[${urlValue}]`;
}
