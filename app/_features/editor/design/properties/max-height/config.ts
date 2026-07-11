import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { DEFAULT_UNITS, getFractionClasses, getScaleClasses, TAILWIND_SCALES } from "@editor/design/values/numeric";
import { maxHeightNormalizer } from "./normalizers";

export const config = {
  features: {
    maxHeight: feature.numeric({
      prefix: "max-h",
      classes: [
        ...getScaleClasses("max-h", TAILWIND_SCALES),
        ...getFractionClasses("max-h", 6),
        ...getEnumClasses("max-h", ["screen"]),
      ],
      extensions: {
        enum: {
          values: ["screen"],
          defaultValue: "screen",
        },
      },
      normalizer: maxHeightNormalizer,
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
  },
} satisfies DesignPropertyConfig;
