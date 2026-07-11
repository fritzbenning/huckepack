import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import {
  DEFAULT_UNITS,
  getFractionClasses,
  getScaleClasses,
  getTokenClasses,
  TAILWIND_SCALES,
} from "@editor/design/values/numeric";
import { TAILWIND_MAX_WIDTH_TOKENS } from "@editor/design/values/token";
import { widthNormalizer } from "./normalizers";

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
    width: feature.numeric({
      prefix: "w",
      classes: [
        ...getScaleClasses("w", TAILWIND_SCALES),
        ...getFractionClasses("w", 10),
        ...getEnumClasses("w", ["auto", "fit", "full", "screen"]),
        ...getTokenClasses("w", TAILWIND_MAX_WIDTH_TOKENS),
      ],
      normalizer: widthNormalizer,
      extensions: {
        enum: {
          values: ["auto", "fit", "full", "screen"],
          defaultValue: "auto",
        },
        tokens: TAILWIND_MAX_WIDTH_TOKENS,
      },
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      compressedPrefix: "size",
    }),
  },
} satisfies DesignPropertyConfig;
