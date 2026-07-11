export function toTitleCase(name: string): string {
  if (!name || !name.trim()) {
    return "";
  }

  const withSpaces = name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1 $2");

  const words = withSpaces.trim().split(/\s+/).filter(Boolean);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}


