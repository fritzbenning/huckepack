import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import {
  DEFAULT_UNITS,
  getDirectionalClasses,
  getScaleClassesFromArray,
  TAILWIND_SCALES,
} from "@editor/design/values/numeric";
import { IconArrowsHorizontal, IconArrowsVertical } from "@tabler/icons-react";

export const config = {
  features: {
    padding: feature.numeric({
      prefix: "p",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, getDirectionalClasses("p")),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
    paddingX: feature.numeric({
      prefix: "px",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["px"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: IconArrowsHorizontal,
      placeholder: "X",
    }),
    paddingY: feature.numeric({
      prefix: "py",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["py"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: IconArrowsVertical,
      placeholder: "Y",
    }),
    paddingLeft: feature.numeric({
      prefix: "pl",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["pl"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "L",
      placeholder: "Left",
    }),
    paddingRight: feature.numeric({
      prefix: "pr",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["pr"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "R",
      placeholder: "Right",
    }),
    paddingTop: feature.numeric({
      prefix: "pt",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["pt"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "T",
      placeholder: "Top",
    }),
    paddingBottom: feature.numeric({
      prefix: "pb",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["pb"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "B",
      placeholder: "Bottom",
    }),
  },
  individualMode: {
    unified: "padding",
    individual: ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"],
    axis: ["paddingX", "paddingY"],
    compressPriority: ["px", "pt"],
  },
} satisfies DesignPropertyConfig;
