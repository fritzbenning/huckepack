import { SHORTHAND_REGISTRY } from "@editor/design/registry";

/**
 * Expands a shorthand class to its individual classes.
 *
 * @param className - The shorthand class to expand
 * @returns Array of expanded class names, or the original class if no shorthand match
 * @example
 * // Simple: Expand size shorthand
 * expandShorthandClass("size-10")
 * // Returns: ["w-10", "h-10"]
 *
 * @example
 * // Comprehensive: Expand with variants and multiple shorthands
 * expandShorthandClass("px-4"); // ["pl-4", "pr-4"]
 * expandShorthandClass("md:py-8"); // ["md:pt-8", "md:pb-8"]
 * expandShorthandClass("inset-0"); // ["top-0", "right-0", "bottom-0", "left-0"]
 * expandShorthandClass("w-full"); // ["w-full"] - not a shorthand
 */
export function expandShorthandClass(className: string): string[] {
  for (const mapping of SHORTHAND_REGISTRY) {
    const variantMatch = className.match(
      new RegExp(`^([a-z@-]+:)?${mapping.shorthand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(.+)$`)
    );

    if (variantMatch) {
      const variant = variantMatch[1] || "";
      const suffix = variantMatch[2];

      if (suffix === "") {
        return [className];
      }

      return mapping.expandsTo.map((prefix) => `${variant}${prefix}-${suffix}`);
    }
  }

  return [className];
}
