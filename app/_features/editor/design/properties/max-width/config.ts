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
import { maxWidthNormalizer } from "./normalizers";

export const config = {
  features: {
    maxWidth: feature.numeric({
      prefix: "max-w",
      classes: [
        ...getScaleClasses("max-w", TAILWIND_SCALES),
        ...getFractionClasses("max-w", 6),
        ...getEnumClasses("max-w", ["screen"]),
        ...getTokenClasses("max-w", TAILWIND_MAX_WIDTH_TOKENS),
      ],
      extensions: {
        enum: {
          values: ["screen"],
          defaultValue: "screen",
        },
        tokens: TAILWIND_MAX_WIDTH_TOKENS,
      },
      normalizer: maxWidthNormalizer,
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
  },
} satisfies DesignPropertyConfig;
