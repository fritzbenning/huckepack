import type { DesignPropertyConfig } from "@editor/design/registry";
import { expandCompressedPrefix } from "../prefix/expandCompressedPrefix";
import { findClassByPrefix } from ".";

/**
 * Finds a class from a compressed feature by expanding it to the target feature prefix.
 *
 * @param classTokens - Array of Tailwind class tokens to search in
 * @param compressedFeature - The compressed feature configuration
 * @param feature - The target feature configuration
 * @returns The matching class name, or null if not found
 * @example
 * // Find width class from size shorthand
 * findClassFromCompressedFeature(["size-10"], compressedFeature, feature)
 * // Returns: "w-10"
 */
export function findClassFromCompressedFeature<T extends string>(
  classTokens: string[],
  compressedFeature: DesignPropertyConfig["features"][string],
  feature: DesignPropertyConfig["features"][string]
): T | null {
  const compressedClass = findClassByPrefix(classTokens, compressedFeature.prefix);

  if (!compressedClass) {
    return null;
  }

  const featureClass = expandCompressedPrefix(compressedClass, compressedFeature.prefix, feature.prefix);

  if (featureClass) {
    return featureClass as T;
  }

  return null;
}
