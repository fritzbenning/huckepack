/**
 * Splits a string into class tokens (whitespace-separated).
 */
export function splitClassTokens(value: string): string[] {
  return value.split(/\s+/).filter(Boolean);
}

