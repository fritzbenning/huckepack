import { extractNumericValue } from "@editor/design/modes/enum-mode/transformers";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { useFeatureClasses } from "@editor/design/shared";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import { useNumericConfig } from "@editor/design/values/numeric";
import { createNumericClass } from "@editor/design/values/numeric/classes/create/createNumericClass";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { waitForNextRender } from "@shared/utils/function";
import { useMemo } from "react";
import { DEFAULT_UNITS } from "../constants";
import { convertNumericValueToUnit } from "../value/convertNumericValueToUnit";

interface UseNumericValueParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  unifiedPrefix?: string;
  allowNegative?: boolean;
}

/**
 * Hook for managing numeric values (px, rem, %, vw, vh) and custom arbitrary values
 * Optionally supports "scale" unit for numeric scale values like gap-4, gap-8
 */
export function useNumericValue({
  config,
  featurePrefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
  unifiedPrefix,
  allowNegative = false,
}: UseNumericValueParams) {
  const { prefix, units, normalizer, compressedPrefix, defaultUnit } = useNumericConfig({ config, featurePrefix });

  const { [featurePrefix]: currentClass } = useFeatureClasses({
    config,
    classTokens,
    features: [{ prefix: featurePrefix, compressedPrefix, unifiedPrefix }],
  });

  const { currentValue, currentUnit } = useMemo(() => {
    console.log("[useNumericValue] currentClass", currentClass);
    console.log("[useNumericValue] prefix", prefix);

    let extractedNumeric = null;

    if (currentClass && prefix) {
      extractedNumeric = extractNumericValue(currentClass, prefix);
    }

    return {
      currentValue: extractedNumeric?.value ?? null,
      currentUnit: extractedNumeric?.unit ?? defaultUnit ?? null,
    };
  }, [currentClass, prefix, defaultUnit]);

  const handleValueChange = async (newValue: string) => {
    const trimmedValue = newValue.trim();

    let newClass: string | null = null;

    if (trimmedValue === "") {
      newClass = null;
    } else {
      const numericValue = parseFloat(trimmedValue);

      if (Number.isNaN(numericValue)) return;
      if (!allowNegative && numericValue < 0) return;

      const unitClass = createNumericClass(prefix, numericValue, currentUnit ?? defaultUnit ?? "px", normalizer);

      if (!unitClass) return;

      newClass = unitClass;
    }

    await updateDesignProperty({
      config,
      featurePrefix,
      newClass,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });

    await waitForNextRender();
  };

  const handleUnitChange = async (newUnit: Unit) => {
    if (newUnit === currentUnit) return;

    const convertedValue = convertNumericValueToUnit(currentValue, currentUnit, newUnit);
    const unitClass = createNumericClass(prefix, convertedValue, newUnit, normalizer);

    if (!unitClass) return;

    await updateDesignProperty({
      config,
      featurePrefix,
      newClass: unitClass,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });

    await waitForNextRender();
  };

  return {
    value: currentValue ?? undefined,
    unit: currentUnit ?? undefined,
    availableUnits: units ?? DEFAULT_UNITS,
    onValueChange: handleValueChange,
    onUnitChange: handleUnitChange,
  };
}
