import type { DesignPropertyConfig } from "@editor/design/registry";
import { useMemo } from "react";
import { toggleIndividualMode } from "../services/toggleIndividualMode";

interface UseIndividualModeParams {
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  detect: (classTokens: string[] | null) => boolean;
}

export function useIndividualMode({
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  detect,
}: UseIndividualModeParams) {
  const isIndividualMode = useMemo(() => {
    if (!classTokens) {
      return false;
    }

    return detect(classTokens);
  }, [classTokens, detect]);

  const toggle = async () => {
    const unifiedFeatureKey = config.individualMode?.unified;
    const individualFeatureKeys = config.individualMode?.individual;

    if (!unifiedFeatureKey || !individualFeatureKeys) {
      console.warn("Unified or individual feature keys not provided for individual mode toggle.");
      return;
    }

    await toggleIndividualMode({
      toIndividualMode: !isIndividualMode,
      unifiedFeatureKey,
      individualFeatureKeys,
      config,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });
  };

  return { isIndividualMode, toggle };
}
