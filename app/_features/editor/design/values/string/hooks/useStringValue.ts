import type { DesignPropertyConfig } from "@editor/design/registry";
import { useFeatureClasses } from "@editor/design/shared";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import { useEffect, useRef, useState } from "react";
import { createStringClass } from "../classes";
import { extractStringValue } from "../value";

interface UseStringValueParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  compressedPrefix?: string;
}

interface UseStringValueResult {
  value: string;
  onValueChange: (value: string) => Promise<void>;
}

/**
 * Hook for managing string values in arbitrary Tailwind classes.
 * Handles parsing and formatting string values like URLs from classes like bg-[url('...')].
 */
export function useStringValue({
  config,
  featurePrefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
  compressedPrefix,
}: UseStringValueParams): UseStringValueResult {
  const lastSetClassRef = useRef<string>("");

  const result = useFeatureClasses({
    config,
    classTokens,
    features: [{ prefix: featurePrefix, compressedPrefix }],
  });
  const currentClass = result[featurePrefix as keyof typeof result] as string;

  const feature = config.features[featurePrefix];

  if (!feature || feature.type !== "string") {
    throw new Error(`Feature ${featurePrefix} must be of type "string" to use useStringValue`);
  }

  const prefix = feature.prefix;
  const emptyValue = feature.emptyValue;
  const formatValue = feature.formatValue;
  const parseValue = feature.parseValue;

  const parsed = extractStringValue(currentClass, prefix, emptyValue, parseValue);
  const [currentValue, setCurrentValue] = useState<string>(parsed ?? "");

  useEffect(() => {
    if (currentClass === lastSetClassRef.current) {
      const expectedParsed = extractStringValue(lastSetClassRef.current, prefix, emptyValue, parseValue);
      if (expectedParsed !== undefined) {
        setCurrentValue(expectedParsed);
      } else {
        setCurrentValue("");
      }
      lastSetClassRef.current = "";
      return;
    }

    if (lastSetClassRef.current !== "") {
      return;
    }

    if (parsed !== undefined) {
      setCurrentValue(parsed);
    } else if (!currentClass) {
      setCurrentValue("");
    }
  }, [parsed, currentClass, prefix, emptyValue, parseValue]);

  const handleValueChange = async (newValue: string) => {
    if (!astPosition || !projectId || !fileId) {
      return;
    }

    setCurrentValue(newValue);
    const formattedClass = createStringClass(newValue, prefix, emptyValue, formatValue);
    lastSetClassRef.current = formattedClass;

    await updateDesignProperty({
      config,
      featurePrefix,
      newClass: formattedClass,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });
  };

  return {
    value: currentValue,
    onValueChange: handleValueChange,
  };
}
