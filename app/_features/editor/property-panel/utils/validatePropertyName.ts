export function isValidPropertyName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }

  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

  return identifierRegex.test(name.trim());
}

export function getPropertyNameError(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Property name cannot be empty";
  }

  const trimmed = name.trim();

  if (trimmed.includes(" ")) {
    return "Property name cannot contain spaces";
  }

  if (/^\d/.test(trimmed)) {
    return "Property name cannot start with a number";
  }

  if (!/^[a-zA-Z_$]/.test(trimmed)) {
    return "Property name must start with a letter, underscore, or dollar sign";
  }

  if (!/^[a-zA-Z0-9_$]+$/.test(trimmed)) {
    return "Property name can only contain letters, numbers, underscores, and dollar signs";
  }

  return null;
}
