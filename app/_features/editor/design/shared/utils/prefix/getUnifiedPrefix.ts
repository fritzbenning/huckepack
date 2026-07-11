import type { DesignPropertyConfig } from "@editor/design/registry";

/**
 * Gets the unified prefix for an individual feature prefix if it exists.
 * Returns the unified prefix if the featurePrefix is in individualMode.individual and unified exists.
 *
 * @param config - The design property configuration
 * @param featurePrefix - The individual feature prefix to check
 * @returns The unified prefix if applicable, otherwise undefined
 * @example
 * // Get unified prefix for individual feature
 * getUnifiedPrefix(config, "paddingTop")
 * // Returns: "padding" (if paddingTop is in individualMode.individual)
 *
 * @example
 * // Return undefined when not applicable
 * getUnifiedPrefix(config, "width")
 * // Returns: undefined
 */
export function getUnifiedPrefix(config: DesignPropertyConfig, featurePrefix: string): string | undefined {
  return config.individualMode?.individual?.includes(featurePrefix) && config.individualMode?.unified
    ? config.individualMode.unified
    : undefined;
}
