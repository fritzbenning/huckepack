import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getCornerClasses, getTokenClasses, NUMERIC_UNITS } from "@editor/design/values/numeric";
import { TAILWIND_ROUNDED_TOKENS } from "@editor/design/values/token";
import {
  IconRadiusBottomLeft,
  IconRadiusBottomRight,
  IconRadiusTopLeft,
  IconRadiusTopRight,
} from "@tabler/icons-react";

const BASE_CLASSES = getTokenClasses("rounded", TAILWIND_ROUNDED_TOKENS);

export const config = {
  features: {
    borderRadius: feature.numeric({
      prefix: "rounded",
      classes: [
        ...BASE_CLASSES,
        ...getCornerClasses(BASE_CLASSES, "rounded-tl"),
        ...getCornerClasses(BASE_CLASSES, "rounded-tr"),
        ...getCornerClasses(BASE_CLASSES, "rounded-br"),
        ...getCornerClasses(BASE_CLASSES, "rounded-bl"),
      ],
      extensions: {
        tokens: TAILWIND_ROUNDED_TOKENS,
      },
      defaultUnit: "px",
      units: NUMERIC_UNITS,
    }),
    borderRadiusTopLeft: feature.numeric({
      prefix: "rounded-tl",
      classes: getCornerClasses(BASE_CLASSES, "rounded-tl"),
      extensions: {
        tokens: TAILWIND_ROUNDED_TOKENS,
      },
      defaultUnit: "px",
      units: NUMERIC_UNITS,
      icon: IconRadiusTopLeft,
      placeholder: "Top Left",
    }),
    borderRadiusTopRight: feature.numeric({
      prefix: "rounded-tr",
      classes: getCornerClasses(BASE_CLASSES, "rounded-tr"),
      extensions: {
        tokens: TAILWIND_ROUNDED_TOKENS,
      },
      defaultUnit: "px",
      units: NUMERIC_UNITS,
      icon: IconRadiusTopRight,
      placeholder: "Top Right",
    }),
    borderRadiusBottomRight: feature.numeric({
      prefix: "rounded-br",
      classes: getCornerClasses(BASE_CLASSES, "rounded-br"),
      extensions: {
        tokens: TAILWIND_ROUNDED_TOKENS,
      },
      defaultUnit: "px",
      units: NUMERIC_UNITS,
      icon: IconRadiusBottomRight,
      placeholder: "Bottom Right",
    }),
    borderRadiusBottomLeft: feature.numeric({
      prefix: "rounded-bl",
      classes: getCornerClasses(BASE_CLASSES, "rounded-bl"),
      extensions: {
        tokens: TAILWIND_ROUNDED_TOKENS,
      },
      defaultUnit: "px",
      units: NUMERIC_UNITS,
      icon: IconRadiusBottomLeft,
      placeholder: "Bottom Left",
    }),
  },
  individualMode: {
    unified: "borderRadius",
    individual: ["borderRadiusTopLeft", "borderRadiusTopRight", "borderRadiusBottomRight", "borderRadiusBottomLeft"],
  },
} satisfies DesignPropertyConfig;
