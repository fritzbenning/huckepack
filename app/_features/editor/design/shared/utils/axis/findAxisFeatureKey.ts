import type { DesignPropertyConfig } from "@editor/design/registry";
import { getAxisForPrefix } from "./getAxisForPrefix";

/**
 * Finds the axis feature key (e.g., "insetX" or "paddingX") for a given prefix.
 * Supports both directional features (top, bottom, left, right) and axis suffix patterns (pt, pb, pl, pr, px, py).
 *
 * @param config - The design property configuration
 * @param prefix - The feature prefix (e.g., "top", "pl", "px")
 * @returns The axis feature key or null if not found
 * @example
 * findAxisFeatureKey(config, "top"); // "insetY" or "paddingY"
 * findAxisFeatureKey(config, "pl"); // "insetX" or "paddingX"
 * findAxisFeatureKey(config, "px"); // "insetX" or "paddingX"
 */
export function findAxisFeatureKey(config: DesignPropertyConfig, prefix: string): string | null {
  const axisKeys = config.individualMode?.axis;

  if (!axisKeys) return null;

  const axis = getAxisForPrefix(prefix);

  if (!axis) return null;

  return (
    axisKeys.find((axisKey) => {
      const feature = config.features[axisKey];
      const axisPrefix = feature?.prefix ?? axisKey;
      return axisPrefix.endsWith(axis);
    }) ?? null
  );
}
