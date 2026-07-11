/**
 * Checks if a class matches a background image pattern.
 * Matches bg-none, gradient classes, and URL-based background images.
 *
 * @param cls - The class name to check
 * @returns True if the class matches a background image pattern
 * @example
 * // Match bg-none
 * matchesBackgroundImage("bg-none")
 * // Returns: true
 *
 * @example
 * // Match gradient class
 * matchesBackgroundImage("bg-gradient-to-r")
 * // Returns: true
 *
 * @example
 * // Match URL-based background
 * matchesBackgroundImage("bg-[url('https://example.com/image.jpg')]")
 * // Returns: true
 */
export function matchesBackgroundImage(cls: string): boolean {
  if (cls === "bg-none") return true;
  if (cls.startsWith("bg-linear-")) return true;
  if (cls.startsWith("bg-radial")) return true;
  if (cls.startsWith("bg-conic")) return true;
  if (cls.startsWith("bg-gradient-")) return true;
  if (cls.startsWith("bg-[url(")) return true;
  if (cls.startsWith("bg-[image:")) return true;
  if (/^bg-\[url\(['"]?/.test(cls)) return true;
  return false;
}

