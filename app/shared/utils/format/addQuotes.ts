export function addQuotes(value: string): string {
  if (value === "") return '""';
  if (!value.startsWith('"') || !value.endsWith('"')) {
    return `"${value}"`;
  }
  return value;
}
