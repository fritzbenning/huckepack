import { createClassNormalizer } from "@editor/design/shared/helpers/normalizer";
import { isScreenValue, percentToFraction } from "@editor/design/shared/utils";

export const maxWidthNormalizer = createClassNormalizer({
  property: "max-w",
  normalizers: [
    {
      name: "screen",
      matches: (value, unit) => isScreenValue(value, unit, "width"),
      format: () => "max-w-screen",
      preservesUnit: (_value, unit) => unit === "vw",
    },
    {
      name: "fraction",
      matches: (value, unit) => unit === "%" && percentToFraction(value) !== null,
      format: (value) => `max-w-${percentToFraction(value)}`,
      preservesUnit: (_value, unit) => unit === "%",
    },
    {
      name: "scale",
      matches: (_value, unit) => unit === "scale",
      format: (value) => `max-w-${value}`,
      preservesUnit: (_value, unit) => unit === "scale",
    },
    {
      name: "arbitrary",
      matches: () => true,
      format: (value, unit) => `max-w-[${value}${unit}]`,
      preservesUnit: () => true,
    },
  ],
});
