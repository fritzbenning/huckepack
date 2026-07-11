/**
 * Normalizes a property name to camelCase format.
 * - Preserves existing camelCase names
 * - Converts PascalCase to camelCase
 * - Converts spaced strings to camelCase
 *
 * @param name - The property name to normalize
 * @returns The normalized camelCase property name, or null if the input is empty
 */
export function normalizePropertyName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  // If the input has no spaces and is already a valid identifier
  if (!trimmed.includes(" ")) {
    // If it starts with uppercase (PascalCase), convert to camelCase
    if (/^[A-Z]/.test(trimmed)) {
      return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
    }
    // Already camelCase or lowercase, preserve as-is
    return trimmed;
  }

  // Convert display name with spaces to camelCase
  const words = trimmed.split(/\s+/);
  const firstWord = words[0].toLowerCase();
  const restWords = words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return firstWord + restWords.join("");
}

