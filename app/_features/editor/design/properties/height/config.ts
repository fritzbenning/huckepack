import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { DEFAULT_UNITS, getFractionClasses, getScaleClasses, TAILWIND_SCALES } from "@editor/design/values/numeric";
import { TAILWIND_MAX_WIDTH_TOKENS } from "@editor/design/values/token";
import { heightNormalizer } from "./normalizers";

export const config = {
  features: {
    size: feature.numeric({
      prefix: "size",
      classes: [
        ...getScaleClasses("size", TAILWIND_SCALES),
        ...getEnumClasses("size", ["auto", "fit", "full", "screen"]),
      ],
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
    height: feature.numeric({
      prefix: "h",
      classes: [
        ...getScaleClasses("h", TAILWIND_SCALES),
        ...getFractionClasses("h", 10),
        ...getEnumClasses("h", ["auto", "fit", "full", "screen"]),
      ],
      normalizer: heightNormalizer,
      extensions: {
        enum: {
          values: ["auto", "fit", "full", "screen"],
          defaultValue: "auto",
        },
        tokens: TAILWIND_MAX_WIDTH_TOKENS,
      },
      units: DEFAULT_UNITS,
      defaultUnit: "scale",
      compressedPrefix: "size",
    }),
  },
} satisfies DesignPropertyConfig;
