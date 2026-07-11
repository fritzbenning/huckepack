import type { EnumFeature, NumericFeature } from "@editor/design/property-types";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { isNumericFeature } from "@editor/design/values/numeric";
import { isEnumFeature } from "../check";
import { extractEnumValue } from "./extractEnumValue";

export const getEnumValues = (
  config: DesignPropertyConfig,
  classTokens: string[] | null | undefined,
  featurePrefix: string
): readonly string[] => {
  const feature = config.features[featurePrefix];

  if (!classTokens) {
    return [];
  }

  if (isEnumFeature(feature)) {
    const enumFeature = config.features[featurePrefix] as EnumFeature;

    const enumValues = classTokens
      .map((className) => extractEnumValue(className, enumFeature.prefix || ""))
      .filter((value): value is string => value !== undefined);

    return enumValues;
  }

  if (isNumericFeature(feature)) {
    const numericFeature = config.features[featurePrefix] as NumericFeature;

    const enumValues = numericFeature.extensions?.enum?.values ?? [];

    if (typeof enumValues[0] === "string") {
      return enumValues as readonly string[];
    }

    const enumValuesWithLinkedValues = enumValues as { name: string }[];

    return enumValuesWithLinkedValues.map((value) => value.name);
  }

  return [];
};
