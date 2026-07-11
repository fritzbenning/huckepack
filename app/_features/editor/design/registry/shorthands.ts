import type { ShorthandRegistryEntry } from "./types";

/**
 * Registry of Tailwind CSS shorthand class prefixes and their expanded forms.
 * Used to compress/expand directional and dimensional properties.
 *
 * @example
 * // Find what "px" expands to
 * const pxEntry = SHORTHAND_REGISTRY.find(e => e.shorthand === "px");
 * console.log(pxEntry?.expandsTo); // ["pl", "pr"]
 *
 * @example
 * // Expand "size-4" to ["w-4", "h-4"]
 * const sizeEntry = SHORTHAND_REGISTRY.find(e => e.shorthand === "size");
 * const expanded = sizeEntry?.expandsTo.map(prefix => `${prefix}-4`); // ["w-4", "h-4"]
 *
 * @example
 * // Check if a prefix is a shorthand
 * const isShorthand = SHORTHAND_REGISTRY.some(e => e.shorthand === "py"); // true
 */
export const SHORTHAND_REGISTRY: ShorthandRegistryEntry[] = [
  { shorthand: "size", expandsTo: ["w", "h"] },
  { shorthand: "inset-x", expandsTo: ["left", "right"] },
  { shorthand: "inset-y", expandsTo: ["top", "bottom"] },
  { shorthand: "inset", expandsTo: ["top", "right", "bottom", "left"] },
  { shorthand: "px", expandsTo: ["pl", "pr"] },
  { shorthand: "py", expandsTo: ["pt", "pb"] },
  { shorthand: "mx", expandsTo: ["ml", "mr"] },
  { shorthand: "my", expandsTo: ["mt", "mb"] },
];
