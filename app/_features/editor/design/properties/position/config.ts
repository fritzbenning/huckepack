import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { DEFAULT_UNITS, getScaleClassesFromArray, TAILWIND_SCALES } from "@editor/design/values/numeric";

export const POSITION_VALUES = ["fixed", "absolute", "relative", "sticky"] as const;

export const config = {
  features: {
    position: feature.enum({
      prefix: "",
      classes: getEnumClasses("", POSITION_VALUES),
      disregardedClasses: getEnumClasses("", ["static"]),
    }),
    inset: feature.numeric({
      prefix: "inset",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["inset"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      placeholder: "Enter inset value",
    }),
    insetX: feature.numeric({
      prefix: "inset-x",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["inset-x"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      placeholder: "Enter X value",
    }),
    insetY: feature.numeric({
      prefix: "inset-y",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["inset-y"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      placeholder: "Enter Y value",
    }),
    top: feature.numeric({
      prefix: "top",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["top"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      icon: "T",
      placeholder: "Unset",
    }),
    right: feature.numeric({
      prefix: "right",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["right"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      icon: "R",
      placeholder: "Unset",
    }),
    bottom: feature.numeric({
      prefix: "bottom",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["bottom"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      icon: "B",
      placeholder: "Unset",
    }),
    left: feature.numeric({
      prefix: "left",
      classes: getScaleClassesFromArray(TAILWIND_SCALES, ["left"]),
      defaultUnit: "scale" as const,
      units: DEFAULT_UNITS,
      icon: "L",
      placeholder: "Unset",
    }),
  },
  individualMode: {
    unified: "inset",
    individual: ["top", "right", "bottom", "left"],
    axis: ["insetX", "insetY"],
    compressPriority: ["inset-x", "top"],
  },
} satisfies DesignPropertyConfig;
