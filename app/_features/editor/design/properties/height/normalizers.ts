import { createClassNormalizer } from "@editor/design/shared/helpers/normalizer";
import { formatScreenKeyword, isScreenValue, percentToFraction } from "@editor/design/shared/utils";

export const heightNormalizer = createClassNormalizer({
  property: "h",
  normalizers: [
    {
      name: "screen",
      matches: (value, unit) => isScreenValue(value, unit, "height"),
      format: () => formatScreenKeyword("height"),
      preservesUnit: (_value, unit) => unit === "vh",
    },
    {
      name: "fraction",
      matches: (value, unit) => unit === "%" && percentToFraction(value) !== null,
      format: (value) => `h-${percentToFraction(value)}`,
      preservesUnit: (_value, unit) => unit === "%",
    },
    {
      name: "scale",
      matches: (_value, unit) => unit === "scale",
      format: (value) => `h-${value}`,
      preservesUnit: (_value, unit) => unit === "scale",
    },
    {
      name: "arbitrary",
      matches: () => true,
      format: (value, unit) => `h-[${value}${unit}]`,
      preservesUnit: () => true,
    },
  ],
});
