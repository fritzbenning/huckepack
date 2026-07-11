import { splitClassTokens } from "@ast/utils";

/**
 * Splits a string literal value into tokens (whitespace-separated).
 * This is semantically the same as splitClassTokens but kept for API clarity.
 */
export const splitStringLiteral = (value: string): string[] => {
  return splitClassTokens(value);
};
