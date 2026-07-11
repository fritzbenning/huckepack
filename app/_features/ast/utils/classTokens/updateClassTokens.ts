import { joinClassTokens } from "./joinClassTokens";
import { splitClassTokens } from "./splitClassTokens";

/**
 * Updates class tokens by adding and removing specified classes.
 */
export function updateClassTokens(
  existingClasses: string,
  classesToAdd: string[],
  classesToRemove: string[]
): string {
  let tokens = splitClassTokens(existingClasses);

  // Remove classes first
  tokens = tokens.filter((token) => !classesToRemove.includes(token));

  // Add new classes (avoiding duplicates)
  const existingSet = new Set(tokens);
  classesToAdd.forEach((cls) => {
    if (!existingSet.has(cls)) {
      tokens.push(cls);
      existingSet.add(cls);
    }
  });

  return joinClassTokens(tokens);
}

