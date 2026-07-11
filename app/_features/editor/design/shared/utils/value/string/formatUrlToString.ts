/**
 * Formats a URL string to include url() wrapper if not already present.
 * Handles plain URLs and URLs already wrapped in url().
 *
 * @param value - The URL string (e.g., "https://example.com/image.jpg", "url('https://example.com/image.jpg')")
 * @returns The formatted URL with url() wrapper
 * @example
 * // Simple: Format plain URL
 * formatUrlToString("https://example.com/image.jpg"); // "url('https://example.com/image.jpg')"
 *
 * @example
 * // Comprehensive: Various URL formats
 * formatUrlToString("url('https://example.com/image.jpg')"); // "url('https://example.com/image.jpg')" - already wrapped
 * formatUrlToString("/path/to/image.png"); // "url('/path/to/image.png')" - relative path
 * formatUrlToString("data:image/svg+xml,..."); // "url('data:image/svg+xml,...')" - data URL
 * formatUrlToString("url(https://example.com)"); // "url(https://example.com)" - already wrapped without quotes
 */
export function formatUrlToString(value: string): string {
  return value.startsWith("url(") ? value : `url('${value}')`;
}
