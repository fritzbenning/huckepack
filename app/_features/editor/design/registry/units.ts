import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { roundToQuarterStep } from "../shared/utils";
import type { UnitConfig } from "./types";

/**
 * Registry of unit conversion configurations for all supported CSS units.
 * Each unit has a `toPx` function (convert to pixels) and a `fromPx` function (convert from pixels).
 *
 * @example
 * // Convert rem to pixels
 * const remInPx = UNIT_REGISTRY.rem.toPx(2); // 32px (2rem * 16)
 *
 * @example
 * // Convert pixels to scale units
 * const scaleValue = UNIT_REGISTRY.scale.fromPx(16); // 4 (16px / 4)
 *
 * @example
 * // Round-trip conversion
 * const original = 2.5;
 * const pixels = UNIT_REGISTRY.rem.toPx(original); // 40
 * const converted = UNIT_REGISTRY.rem.fromPx(pixels); // 2.5
 */
export const UNIT_REGISTRY: Record<Unit, UnitConfig> = {
  scale: {
    toPx: (value) => value * 4, // Scale unit: 1 scale = 4px
    fromPx: (valueInPx) => roundToQuarterStep(valueInPx / 4),
  },
  px: {
    toPx: (value) => value,
    fromPx: (valueInPx) => Math.round(valueInPx * 10) / 10,
  },
  "%": {
    toPx: (value) => value,
    fromPx: (valueInPx) => Math.round(valueInPx),
  },
  rem: {
    toPx: (value) => value * 16,
    fromPx: (valueInPx) => Math.round((valueInPx / 16) * 100) / 100,
  },
  em: {
    toPx: (value) => value * 16,
    fromPx: (valueInPx) => Math.round((valueInPx / 16) * 100) / 100,
  },
  vw: {
    toPx: (value) => value,
    fromPx: (valueInPx) => Math.round(valueInPx),
  },
  vh: {
    toPx: (value) => value,
    fromPx: (valueInPx) => Math.round(valueInPx),
  },
};
