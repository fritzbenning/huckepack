import { toggleTokenMode } from "@editor/design/modes/token-mode";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { hasTokenClass } from "@editor/design/values/token/check/hasTokenClass";
import type { TokenMap } from "@editor/design/values/token/types";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { useMemo } from "react";

interface UseTokenModeParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  tokens: TokenMap | null;
  classTokens: string[] | null;
  prefix: string;
  astPosition?: number | null;
  projectId?: string;
  fileId?: string;
  numericTargetUnit?: Unit;
}

interface UseTokenModeResult {
  isTokenMode: boolean;
  toggle?: () => Promise<void>;
}

/**
 * Detects if the current feature is in token mode (using design tokens like "sm", "md").
 * Optionally provides a toggle function if toggle parameters are provided.
 *
 * @param config - The design property configuration
 * @param featurePrefix - The feature prefix (e.g., "width", "height")
 * @param classTokens - Array of current Tailwind class tokens
 * @param prefix - The property prefix (e.g., "w", "h", "rounded")
 * @param tokens - Optional token map for validation
 * @param astPosition - Optional AST position for toggle functionality
 * @param projectId - Optional project ID for toggle functionality
 * @param fileId - Optional file ID for toggle functionality
 * @param numericTargetUnit - Optional target unit when converting from token to numeric mode
 * @returns Object with isTokenMode boolean and optional toggle function
 */
export function useTokenMode({
  config,
  featurePrefix,
  tokens,
  classTokens,
  prefix,
  astPosition,
  projectId,
  fileId,
  numericTargetUnit,
}: UseTokenModeParams): UseTokenModeResult {
  const isTokenMode = useMemo(() => {
    if (!tokens) {
      return false;
    }

    return hasTokenClass(classTokens, prefix, tokens);
  }, [tokens, classTokens, prefix]);

  const toggle = async () => {
    if (!tokens || astPosition === null || astPosition === undefined || !projectId || !fileId) {
      return;
    }

    await toggleTokenMode({
      toTokenMode: !isTokenMode,
      config,
      featurePrefix,
      prefix,
      tokenMap: tokens,
      classTokens,
      astPosition,
      projectId,
      fileId,
      numericTargetUnit,
    });
  };

  return {
    isTokenMode,
    toggle: astPosition !== null && astPosition !== undefined && projectId && fileId ? toggle : undefined,
  };
}
