import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { DEFAULT_UNITS, getFractionClasses, getScaleClasses, TAILWIND_SCALES } from "@editor/design/values/numeric";
import { minHeightNormalizer } from "./normalizers";

export const config = {
  features: {
    minHeight: feature.numeric({
      prefix: "min-h",
      classes: [
        ...getScaleClasses("min-h", TAILWIND_SCALES),
        ...getFractionClasses("min-h", 6),
        ...getEnumClasses("min-h", ["auto", "full", "fit", "screen", "min", "max"]),
      ],
      extensions: {
        enum: {
          values: ["auto", "full", "fit", "screen", "min", "max"],
          defaultValue: "auto",
        },
      },
      normalizer: minHeightNormalizer,
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
  },
} satisfies DesignPropertyConfig;
