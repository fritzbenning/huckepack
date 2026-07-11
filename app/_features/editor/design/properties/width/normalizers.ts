import { createClassNormalizer } from "@editor/design/shared/helpers/normalizer";
import { formatScreenKeyword, isScreenValue, percentToFraction } from "@editor/design/shared/utils";

export const widthNormalizer = createClassNormalizer({
  property: "w",
  normalizers: [
    {
      name: "screen",
      matches: (value, unit) => isScreenValue(value, unit, "width"),
      format: () => formatScreenKeyword("width"),
      preservesUnit: (_value, unit) => unit === "vw",
    },
    {
      name: "fraction",
      matches: (value, unit) => unit === "%" && percentToFraction(value) !== null,
      format: (value) => `w-${percentToFraction(value)}`,
      preservesUnit: (_value, unit) => unit === "%",
    },
    {
      name: "scale",
      matches: (_value, unit) => unit === "scale",
      format: (value) => `w-${value}`,
      preservesUnit: (_value, unit) => unit === "scale",
    },
    {
      name: "arbitrary",
      matches: () => true,
      format: (value, unit) => `w-[${value}${unit}]`,
      preservesUnit: () => true,
    },
  ],
});
