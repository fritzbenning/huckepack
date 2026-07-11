import { addClassToken } from "@ast/utils";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";

/**
 * Updates a string literal's value by adding a class.
 * Returns the updated string literal value.
 */
export function addClassToStringLiteral(existingValue: string, className: string): string {
  const existingClasses = existingValue.trim();
  return addClassToken(existingClasses, className);
}

/**
 * Creates a new string literal with updated classes.
 */
export function createStringLiteralWithClass(existingValue: string, className: string) {
  const updatedValue = addClassToStringLiteral(existingValue, className);
  return createStringLiteral(updatedValue);
}

