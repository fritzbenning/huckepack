export function toSlug(fileName: string): string {
  if (!fileName || !fileName.trim()) {
    return "";
  }

  // Remove file extension if present
  const nameWithoutExt = fileName.replace(/\.(tsx?|jsx?)$/, "").trim();

  // Split by whitespace, dash, underscore, or any non-alphanumeric character
  // Then filter out empty strings
  const words = nameWithoutExt.split(/[\s\-_]+|[^a-zA-Z0-9]+/).filter((word) => word.length > 0);

  // Convert to PascalCase: capitalize first letter of each word, lowercase the rest
  const pascalCase = words
    .map((word) => {
      const firstChar = word.charAt(0).toUpperCase();
      const rest = word.slice(1).toLowerCase();
      return firstChar + rest;
    })
    .join("");

  return pascalCase;
}
