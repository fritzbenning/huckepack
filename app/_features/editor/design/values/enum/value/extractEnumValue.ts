/**
 * Extracts the enum value from a class name by removing the prefix.
 * Handles both standard classes (e.g., "bg-fixed" → "fixed") and arbitrary values (e.g., "bg-[url(...)]" → "url(...)").
 * Also handles empty prefix (e.g., "static" → "static").
 */
export function extractEnumValue(className: string | null | undefined, prefix: string): string | undefined {
  if (!className) return undefined;

  if (prefix === "") {
    return className;
  }

  if (className.startsWith(`${prefix}-[`)) {
    const match = className.match(/\[([^\]]+)\]/);
    return match?.[1];
  }

  return className.replace(`${prefix}-`, "");
}
