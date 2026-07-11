import { normalizePrefix } from "../normalize/normalizePrefix";

/**
 * Transforms a class name by extracting suffix from one prefix and applying it to another.
 *
 * @param className - The source class name
 * @param fromPrefix - The prefix to extract suffix from
 * @param toPrefix - The prefix to apply suffix to
 * @returns Transformed class name, or empty string if transformation fails
 * @example
 * // Simple: Expand compressed prefix
 * expandCompressedPrefix("size-10", "size", "w"); // "w-10"
 *
 * @example
 * // Comprehensive: Transform between different prefixes
 * expandCompressedPrefix("size-10", "size", "h"); // "h-10"
 * expandCompressedPrefix("px-4", "px", "pl"); // "pl-4"
 * expandCompressedPrefix("w-10", "h", "w"); // "" - prefix mismatch
 * expandCompressedPrefix("size-[100px]", "size", "w"); // "w-[100px]" - arbitrary values work
 */
export function expandCompressedPrefix(className: string, fromPrefix: string, toPrefix: string): string {
  const normalizedFromPrefix = normalizePrefix(fromPrefix);
  const normalizedToPrefix = normalizePrefix(toPrefix);

  if (!className.startsWith(normalizedFromPrefix)) {
    return "";
  }

  const suffix = className.slice(normalizedFromPrefix.length);

  return `${normalizedToPrefix}${suffix}`;
}
