import type { DesignPropertyConfig } from "@editor/design/registry";
import { useEffect, useState } from "react";

interface UseFeatureDisplayParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
}

/**
 * Hook that checks if a feature should be displayed based on its displayWhen function.
 * Example: useFeatureDisplay({ config, featurePrefix: "backgroundOrigin", classTokens })
 *   → true if displayWhen returns true, false otherwise
 *
 * @param config - The design property configuration
 * @param featurePrefix - The feature prefix to check
 * @param classTokens - Array of Tailwind class tokens
 * @returns True if the feature should be displayed, false otherwise
 */
export function useFeatureDisplay({ config, featurePrefix, classTokens }: UseFeatureDisplayParams): boolean {
  const [shouldDisplay, setShouldDisplay] = useState(false);

  useEffect(() => {
    const feature = config.features[featurePrefix];

    if (!feature || feature.type !== "enum") {
      setShouldDisplay(false);
      return;
    }

    setShouldDisplay(feature.displayWhen ? feature.displayWhen(classTokens) : false);
  }, [config, featurePrefix, classTokens]);

  return shouldDisplay;
}
