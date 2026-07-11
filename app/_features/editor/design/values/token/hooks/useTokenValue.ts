import type { DesignPropertyConfig } from "@editor/design/registry";
import { useFeatureClasses } from "@editor/design/shared";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import { useMemo } from "react";
import type { NumericFeature } from "../../numeric/types";
import { createTokenClass } from "../classes/create/createTokenClass";
import { extractTokenValue } from "../value/extractTokenValue";

interface UseTokenValueParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
}

/**
 * Hook for managing token-based values (e.g., width tokens: sm, md, lg).
 * Parses current class to extract token, provides token options, and handles token changes.
 *
 * @returns Object with current token, token options, and onChange handler
 */
export function useTokenValue({
  config,
  featurePrefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
}: UseTokenValueParams) {
  const { [featurePrefix]: currentClass } = useFeatureClasses({
    config,
    classTokens,
    features: [{ prefix: featurePrefix }],
  });

  const currentToken = useMemo(() => {
    const feature = config.features[featurePrefix] as NumericFeature;
    const tokens = feature?.extensions?.tokens;

    if (!tokens || !currentClass) {
      return null;
    }

    return extractTokenValue(currentClass, feature.prefix, tokens);
  }, [config, featurePrefix, currentClass]);

  const handleTokenChange = async (token: string) => {
    const feature = config.features[featurePrefix] as NumericFeature;
    const tokens = feature?.extensions?.tokens;

    if (!tokens) {
      return;
    }

    let newTokenClass: string | null = null;

    // TODO: class "rounded" doesn't trigger border-radius present in design-panel

    if (token === "normal") {
      newTokenClass = createTokenClass("", feature.prefix, tokens);
    } else {
      newTokenClass = createTokenClass(token, feature.prefix, tokens);
    }

    if (!newTokenClass) {
      return;
    }

    await updateDesignProperty({
      config,
      featurePrefix,
      newClass: newTokenClass,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });
  };

  return {
    token: currentToken ?? undefined,
    onChange: handleTokenChange,
  };
}
