import { createClassNormalizer } from "@editor/design/shared/helpers/normalizer";
import { isScreenValue, percentToFraction } from "@editor/design/shared/utils";

export const minHeightNormalizer = createClassNormalizer({
  property: "min-h",
  normalizers: [
    {
      name: "screen",
      matches: (value, unit) => isScreenValue(value, unit, "height"),
      format: () => "min-h-screen",
      preservesUnit: (_value, unit) => unit === "vh",
    },
    {
      name: "fraction",
      matches: (value, unit) => unit === "%" && percentToFraction(value) !== null,
      format: (value) => `min-h-${percentToFraction(value)}`,
      preservesUnit: (_value, unit) => unit === "%",
    },
    {
      name: "scale",
      matches: (_value, unit) => unit === "scale",
      format: (value) => `min-h-${value}`,
      preservesUnit: (_value, unit) => unit === "scale",
    },
    {
      name: "arbitrary",
      matches: () => true,
      format: (value, unit) => `min-h-[${value}${unit}]`,
      preservesUnit: () => true,
    },
  ],
});
