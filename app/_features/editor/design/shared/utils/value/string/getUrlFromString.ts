/**
 * Extracts URL from a string that may contain url() wrapper.
 * Handles formats like: url('...'), url("..."), url(...), or plain URL string.
 *
 * @param value - The string value (e.g., "url('https://example.com/image.jpg')", "https://example.com/image.jpg")
 * @returns The extracted URL, or the original value if no url() wrapper is found
 * @example
 * // Extract URL from url() wrapper
 * getUrlFromString("url('https://example.com/image.jpg')")
 * // Returns: "https://example.com/image.jpg"
 *
 * @example
 * // Return plain URL as-is
 * getUrlFromString("https://example.com/image.jpg")
 * // Returns: "https://example.com/image.jpg"
 */
export function getUrlFromString(value: string): string | undefined {
  if (value.startsWith("url(")) {
    const urlMatch = value.match(/url\(['"]?([^'"]+)['"]?\)/);
    return urlMatch?.[1];
  }
  return value;
}
