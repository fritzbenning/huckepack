/**
 * Converts a file/component name to proper PascalCase slug.
 * 
 * - Preserves existing PascalCase names (e.g., "EventCard" → "EventCard")
 * - Converts spaced names to PascalCase (e.g., "CTA Section" → "CTASection")
 * - Converts kebab-case to PascalCase (e.g., "event-card" → "EventCard")
 * - Handles acronyms correctly (e.g., "CTA" stays as "CTA")
 * 
 * @param fileName - The file or component name to convert
 * @returns The PascalCase slug
 */
export function toPascalSlug(fileName: string): string {
  if (!fileName || !fileName.trim()) {
    return "";
  }

  // Remove file extension if present
  const nameWithoutExt = fileName.replace(/\.(tsx?|jsx?)$/, "").trim();

  // Check if it's already PascalCase (starts with uppercase, has no spaces/dashes/underscores)
  const isAlreadyPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(nameWithoutExt) || 
                               /^[A-Z][a-zA-Z0-9]*([A-Z][a-zA-Z0-9]*)+$/.test(nameWithoutExt);

  if (isAlreadyPascalCase) {
    // Already PascalCase, preserve as-is
    return nameWithoutExt;
  }

  // Split by whitespace, dash, underscore, or any non-alphanumeric character
  const words = nameWithoutExt.split(/[\s\-_]+|[^a-zA-Z0-9]+/).filter((word) => word.length > 0);

  // Convert to PascalCase: capitalize first letter of each word, preserve rest
  const pascalCase = words
    .map((word) => {
      // If word is all uppercase (like "CTA"), preserve it
      if (word === word.toUpperCase() && word.length > 1) {
        return word;
      }
      // Otherwise capitalize first letter, preserve rest
      const firstChar = word.charAt(0).toUpperCase();
      const rest = word.slice(1);
      return firstChar + rest;
    })
    .join("");

  return pascalCase;
}

