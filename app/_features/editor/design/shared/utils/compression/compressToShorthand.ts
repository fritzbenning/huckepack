import { SHORTHAND_REGISTRY } from "@editor/design/registry/shorthands";
import { extractSuffix } from "../suffix/extractSuffix";

/**
 * Extracts variant prefix and base class name from a Tailwind class.
 * Example: "md:w-4" → { variant: "md:", base: "w-4" }
 */
function extractVariant(className: string): { variant: string; base: string } {
  const variantMatch = className.match(/^([a-z@-]+:)?(.+)$/);
  if (!variantMatch) {
    return { variant: "", base: className };
  }
  return {
    variant: variantMatch[1] || "",
    base: variantMatch[2] || className,
  };
}

/**
 * Compresses multiple classes to a shorthand class if they match a shorthand mapping.
 *
 * @param classes - Array of class names to compress
 * @returns Compression result with shorthand name, compressed class, and expanded classes, or null if no match
 * @example
 * // Simple: Compress width and height to size
 * compressToShorthand(["w-10", "h-10"])
 * // Returns: { shorthand: "size", compressed: "size-10", expanded: ["w-10", "h-10"] }
 *
 * @example
 * // Comprehensive: Compress with variants and padding
 * compressToShorthand(["md:pl-4", "md:pr-4"]);
 * // Returns: { shorthand: "px", compressed: "md:px-4", expanded: ["md:pl-4", "md:pr-4"] }
 *
 * const result = compressToShorthand(["inset-y-0", "inset-x-0"]); // null - different values
 */
export function compressToShorthand(
  classes: string[]
): { shorthand: string; compressed: string; expanded: string[] } | null {
  if (classes.length === 0) {
    return null;
  }

  const firstVariant = extractVariant(classes[0]);
  const variant = firstVariant.variant;

  for (const mapping of SHORTHAND_REGISTRY) {
    if (classes.length !== mapping.expandsTo.length) {
      continue;
    }

    let suffix: string | null = null;
    const expandedClasses: string[] = [];

    for (const prefix of mapping.expandsTo) {
      const expectedBase = `${prefix}-`;
      const matchingClass = classes.find((cls) => {
        const clsVariant = extractVariant(cls);
        return clsVariant.variant === variant && clsVariant.base.startsWith(expectedBase);
      });

      if (!matchingClass) {
        break;
      }

      const clsVariant = extractVariant(matchingClass);
      const classSuffix = extractSuffix(clsVariant.base, prefix);
      if (!classSuffix) {
        break;
      }

      if (suffix === null) {
        suffix = classSuffix;
      } else if (suffix !== classSuffix) {
        break;
      }

      expandedClasses.push(matchingClass);
    }

    if (expandedClasses.length === mapping.expandsTo.length && suffix) {
      return {
        shorthand: mapping.shorthand,
        compressed: `${variant}${mapping.shorthand}-${suffix}`,
        expanded: expandedClasses,
      };
    }
  }

  return null;
}
