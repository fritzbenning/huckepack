import type { DesignPropertyConfig } from "@editor/design/registry";

interface GetExpandedPrefixesParams {
  config: DesignPropertyConfig;
  individualFeatureKeys: string[];
}

/**
 * Extracts all prefixes from individual and axis features for a design property.
 * Used to identify which classes are "expanded" (individual/axis) vs unified.
 *
 * @param params - Parameters object
 * @param params.config - The design property configuration with individualMode config
 * @param params.individualFeatureKeys - Array of individual feature keys
 * @returns Object with axis prefixes, individual prefixes, and combined all prefixes
 * @example
 * // Get expanded prefixes for keys
 * getExpandedPrefixesForKeys({ config, individualFeatureKeys: ["paddingTop", "paddingRight"] })
 * // Returns: { axisPrefixes: ["px", "py"], individualPrefixes: ["pt", "pr"], allPrefixes: ["px", "py", "pt", "pr"] }
 */
export function getExpandedPrefixesForKeys({ config, individualFeatureKeys }: GetExpandedPrefixesParams): {
  axisPrefixes: string[];
  individualPrefixes: string[];
  allPrefixes: string[];
} {
  const axisPrefixes: string[] = [];
  if (config.individualMode?.axis && config.individualMode.axis.length > 0) {
    for (const axisKey of config.individualMode.axis) {
      const axisFeature = config.features[axisKey];
      axisPrefixes.push(axisFeature.prefix);
    }
  }

  const individualPrefixes = individualFeatureKeys.map((key) => {
    const feature = config.features[key];
    return feature.prefix;
  });

  const allPrefixes = [...axisPrefixes, ...individualPrefixes];

  return {
    axisPrefixes,
    individualPrefixes,
    allPrefixes,
  };
}
