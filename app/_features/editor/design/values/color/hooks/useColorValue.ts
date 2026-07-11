import type { DesignPropertyConfig } from "@editor/design/registry";
import { useFeatureClasses } from "@editor/design/shared";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createColorClass } from "../classes/create/createColorClass";
import { convertToHex } from "../utils/convertToHex";
import { updateColorValue } from "../utils/updateColorValue";
import { extractColorValue } from "../value";

interface UseColorValueParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  projectId: string;
  fileId: string;
  astPosition: number | null;
}

/**
 * Hook for managing color feature values (e.g., backgroundColor, textColor).
 * Handles both Tailwind color classes and arbitrary hex values.
 *
 * @param config - The design property configuration
 * @param featurePrefix - The color feature prefix to manage
 * @param classTokens - Array of current Tailwind class tokens
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 * @param astPosition - AST position of the class attribute
 * @returns Object with hex value, arbitrary mode flag, and change handlers
 */

// TODO: Refactor it safely. It's AI generated.
export function useColorValue({
  config,
  featurePrefix,
  classTokens,
  projectId,
  fileId,
  astPosition,
}: UseColorValueParams) {
  const feature = config.features[featurePrefix];

  if (!feature || feature.type !== "color") {
    throw new Error(`Feature ${featurePrefix} is not a color type`);
  }

  const lastSetClassRef = useRef("");
  const prefix = feature.prefix;
  const result = useFeatureClasses({
    config,
    classTokens,
    features: [{ prefix: featurePrefix }],
  });
  const currentClass = result[featurePrefix as keyof typeof result] as string | null | undefined;
  const parsed = useMemo(() => {
    if (!currentClass || typeof currentClass !== "string") {
      return null;
    }
    return extractColorValue(currentClass, prefix);
  }, [currentClass, prefix]);

  const [hexValue, setHexValue] = useState<string>(() => {
    if (parsed && currentClass && typeof currentClass === "string") {
      const hex = convertToHex(currentClass, prefix);
      return hex ?? "#3b82f6";
    }
    return "#3b82f6";
  });

  const [isArbitraryMode, setIsArbitraryMode] = useState(() => {
    return parsed?.isArbitrary ?? false;
  });

  useEffect(() => {
    if (currentClass === lastSetClassRef.current) {
      lastSetClassRef.current = "";
      return;
    }

    if (parsed && currentClass && typeof currentClass === "string") {
      const hex = convertToHex(currentClass, prefix);
      if (hex) {
        setHexValue(hex);
        setIsArbitraryMode(parsed.isArbitrary);
      }
    } else if (!currentClass) {
      setHexValue("#3b82f6");
      setIsArbitraryMode(false);
    }
  }, [parsed, currentClass, prefix]);

  const handleColorChange = useCallback(
    async (hex: string) => {
      setHexValue(hex);
      setIsArbitraryMode(true);

      const newClass = createColorClass(hex, prefix);
      lastSetClassRef.current = newClass;

      await updateColorValue({
        classTokens,
        prefix,
        newClass,
        astPosition,
        projectId,
        fileId,
      });
    },
    [classTokens, prefix, astPosition, projectId, fileId]
  );

  const handleTailwindColorChange = useCallback(
    async (color: string, shade: number) => {
      setIsArbitraryMode(false);
      const newClass = `${prefix}-${color}-${shade}`;
      lastSetClassRef.current = newClass;

      await updateColorValue({
        classTokens,
        prefix,
        newClass,
        astPosition,
        projectId,
        fileId,
      });
    },
    [classTokens, prefix, astPosition, projectId, fileId]
  );

  return {
    hexValue,
    isArbitraryMode,
    onColorChange: handleColorChange,
    onTailwindColorChange: handleTailwindColorChange,
    toggleArbitraryMode: () => setIsArbitraryMode((prev) => !prev),
    currentClass,
  };
}
