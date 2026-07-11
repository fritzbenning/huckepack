/**
 * Generates corner-specific class names by replacing a base prefix with a corner prefix.
 * Example: getCornerClasses(["rounded-sm", "rounded-md", "rounded"], "rounded-tl") → ["rounded-tl-sm", "rounded-tl-md", "rounded-tl"].
 *
 * @param baseClasses - Array of base class names (e.g., ["rounded-sm", "rounded-md", "rounded"])
 * @param cornerPrefix - The corner prefix to use (e.g., "rounded-tl", "rounded-tr")
 * @returns Array of corner-specific class names
 */
export function getCornerClasses(baseClasses: string[], cornerPrefix: string): string[] {
  return baseClasses.map((cls) => {
    if (cls === "rounded") {
      return cornerPrefix;
    }
    return cls.replace("rounded-", `${cornerPrefix}-`);
  });
}
