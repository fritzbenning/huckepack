import type { DesignPropertyConfig } from "@editor/design/registry";
import { useFeatureClasses } from "@editor/design/shared";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import { useEffect, useRef, useState } from "react";
import { createPercentClass } from "../classes/create/createPercentClass";
import { toDisplay, toInternal } from "../value/convertPercentValue";
import { extractPercentValue } from "../value/extractPercentValue";

interface UsePercentValueParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  astPosition?: number | null;
  projectId?: string;
  fileId?: string;
  compressedPrefix?: string;
}

/**
 * Hook for managing percent value features (slider-based percentage values).
 * Handles conversion between internal values and display values, and formatting to Tailwind classes.
 * Optionally supports compressed prefixes (e.g., "size" for width/height) by expanding shorthand classes
 * and preserving non-matching expanded classes when updating.
 *
 * @param config - The design property configuration
 * @param featurePrefix - The percent value feature prefix to manage
 * @param classTokens - Array of current Tailwind class tokens
 * @param astPosition - AST position of the class attribute (optional, required for updates)
 * @param projectId - Project ID for updates (optional, required for updates)
 * @param fileId - File ID for updates (optional, required for updates)
 * @param compressedPrefix - Optional compressed prefix for shorthand class handling
 * @returns Object with display value and change handler
 */
export function usePercentValue({
  config,
  featurePrefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
  compressedPrefix,
}: UsePercentValueParams) {
  const feature = config.features[featurePrefix];

  if (!feature || feature.type !== "percentValue") {
    throw new Error(`Feature ${featurePrefix} is not a percentValue type`);
  }

  const lastSetClassRef = useRef("");

  const result = useFeatureClasses({
    config,
    classTokens,
    features: [{ prefix: featurePrefix, compressedPrefix }],
  });

  const currentClass = result[featurePrefix as keyof typeof result] as string;
  const parsedInternal = extractPercentValue(currentClass, feature);

  const [displayValue, setDisplayValue] = useState(() =>
    parsedInternal !== null ? toDisplay(parsedInternal, feature) : feature.defaultValue
  );

  useEffect(() => {
    if (currentClass === lastSetClassRef.current) {
      lastSetClassRef.current = "";
      return;
    }

    if (parsedInternal !== null) {
      const expected = toDisplay(parsedInternal, feature);
      setDisplayValue(expected);
    } else if (!currentClass) {
      setDisplayValue(feature.defaultValue);
    }
  }, [parsedInternal, currentClass, feature]);

  const handleValueChange = async (newValueString: string) => {
    if (!astPosition || !projectId || !fileId) {
      return;
    }

    const numericDisplay = parseFloat(newValueString);
    if (Number.isNaN(numericDisplay)) return;

    const clampedDisplay = Math.max(feature.range.min, Math.min(feature.range.max, numericDisplay));
    setDisplayValue(clampedDisplay);

    const newClass = createPercentClass(toInternal(clampedDisplay, feature), feature);
    lastSetClassRef.current = newClass;

    await updateDesignProperty({
      config,
      featurePrefix,
      newClass,
      classTokens,
      astPosition,
      projectId,
      fileId,
      compressedPrefix,
    });
  };

  return {
    value: displayValue.toString(),
    onValueChange: handleValueChange,
  };
}
