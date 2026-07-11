import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";

export const LETTER_SPACING_VALUES = ["tighter", "tight", "normal", "wide", "wider", "widest"] as const;

export const config = {
  features: {
    letterSpacing: feature.numeric({
      prefix: "tracking",
      classes: [],
      placeholder: "Letter Spacing",
      units: ["px", "rem", "em", "%"],
      defaultUnit: "em",
      extensions: {
        enum: {
          values: [
            { name: "tighter", linkedValue: -0.05 },
            { name: "tight", linkedValue: -0.025 },
            { name: "normal", linkedValue: 0 },
            { name: "wide", linkedValue: 0.025 },
            { name: "wider", linkedValue: 0.05 },
            { name: "widest", linkedValue: 0.1 },
          ],
          defaultValue: "normal",
        },
      },
    }),
  },
} satisfies DesignPropertyConfig;
