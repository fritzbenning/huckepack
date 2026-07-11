export function convertType(value: string, newType: string | null | undefined): string | number | boolean {
  if (newType === "number") {
    const numValue = Number(value);
    return !Number.isNaN(numValue) ? numValue : 10;
  }

  if (newType === "string") {
    return String(value);
  }

  if (newType === "boolean") {
    return value === "true" || value === "1";
  }

  return value;
}
