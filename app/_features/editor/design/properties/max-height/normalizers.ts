import { createClassNormalizer } from "@editor/design/shared/helpers/normalizer";
import { isScreenValue, percentToFraction } from "@editor/design/shared/utils";

export const maxHeightNormalizer = createClassNormalizer({
  property: "max-h",
  normalizers: [
    {
      name: "screen",
      matches: (value, unit) => isScreenValue(value, unit, "height"),
      format: () => "max-h-screen",
      preservesUnit: (_value, unit) => unit === "vh",
    },
    {
      name: "fraction",
      matches: (value, unit) => unit === "%" && percentToFraction(value) !== null,
      format: (value) => `max-h-${percentToFraction(value)}`,
      preservesUnit: (_value, unit) => unit === "%",
    },
    {
      name: "scale",
      matches: (_value, unit) => unit === "scale",
      format: (value) => `max-h-${value}`,
      preservesUnit: (_value, unit) => unit === "scale",
    },
    {
      name: "arbitrary",
      matches: () => true,
      format: (value, unit) => `max-h-[${value}${unit}]`,
      preservesUnit: () => true,
    },
  ],
});
