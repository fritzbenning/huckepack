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
import { minWidthNormalizer } from "./normalizers";

export const config = {
  features: {
    minWidth: feature.numeric({
      prefix: "min-w",
      classes: [
        ...getScaleClasses("min-w", TAILWIND_SCALES),
        ...getFractionClasses("min-w", 6),
        ...getEnumClasses("min-w", ["screen"]),
        ...getTokenClasses("min-w", TAILWIND_MAX_WIDTH_TOKENS),
      ],
      extensions: {
        enum: {
          values: ["screen"],
          defaultValue: "screen",
        },
        tokens: TAILWIND_MAX_WIDTH_TOKENS,
      },
      normalizer: minWidthNormalizer,
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
  },
} satisfies DesignPropertyConfig;
