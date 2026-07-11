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
    margin: feature.numeric({
      prefix: "m",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, getDirectionalClasses("m")),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
    }),
    marginX: feature.numeric({
      prefix: "mx",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["mx"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: IconArrowsHorizontal,
      placeholder: "X",
    }),
    marginY: feature.numeric({
      prefix: "my",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["my"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: IconArrowsVertical,
      placeholder: "Y",
    }),
    marginLeft: feature.numeric({
      prefix: "ml",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["ml"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "L",
      placeholder: "Left",
    }),
    marginRight: feature.numeric({
      prefix: "mr",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["mr"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "R",
      placeholder: "Right",
    }),
    marginTop: feature.numeric({
      prefix: "mt",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["mt"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "T",
      placeholder: "Top",
    }),
    marginBottom: feature.numeric({
      prefix: "mb",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["mb"]),
      defaultUnit: "scale",
      units: DEFAULT_UNITS,
      icon: "B",
      placeholder: "Bottom",
    }),
  },
  individualMode: {
    unified: "margin",
    individual: ["marginLeft", "marginRight", "marginTop", "marginBottom"],
    axis: ["marginX", "marginY"],
    compressPriority: ["mx", "mt"],
  },
} satisfies DesignPropertyConfig;
