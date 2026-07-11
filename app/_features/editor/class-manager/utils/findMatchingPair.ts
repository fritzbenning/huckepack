import { extractSuffix } from "@editor/design/shared/utils";
import { extractVariant } from "./extractVariant";

export function findMatchingPair(classes: string[], targetClass: string, otherPrefix: "w" | "h"): string | null {
  const { variant, base } = extractVariant(targetClass);
  const suffix = extractSuffix(base, targetClass.startsWith("w-") ? "w" : "h");

  if (!suffix) {
    return null;
  }

  const otherClass = `${variant}${otherPrefix}-${suffix}`;
  return classes.includes(otherClass) ? otherClass : null;
}
