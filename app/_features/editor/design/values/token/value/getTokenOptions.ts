import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import type { TokenMap } from "../types";

/**
 * Converts a token map to an array of select options, sorted by standard order.
 * Filters out empty tokens and sorts by: none, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, full.
 *
 * @param tokenMap - Token map to convert
 * @returns Array of select options with value and label
 */
export function getTokenOptions(tokenMap: TokenMap): SelectOption[] {
  return Object.keys(tokenMap)
    .filter((token) => token !== "")
    .map((token) => ({
      value: token,
      label: token === "full" ? "full" : token === "none" ? "none" : token.toLowerCase(),
    }))
    .sort((a, b) => {
      const order = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "full"];
      const aIndex = order.indexOf(a.value);
      const bIndex = order.indexOf(b.value);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}
