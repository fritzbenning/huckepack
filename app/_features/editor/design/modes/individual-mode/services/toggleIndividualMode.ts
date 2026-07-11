import type { DesignPropertyConfig } from "@editor/design/registry";
import { executeAction } from "@shared/action";
import { waitForNextRender } from "@shared/utils/function";
import { transformClassesToIndividual, transformClassesToUnified } from "../transformers";

interface ToggleIndividualModeParams {
  toIndividualMode: boolean;
  unifiedFeatureKey: string;
  individualFeatureKeys: string[];
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  extractSuffixFn?: (className: string, prefix: string) => string | null;
  applySuffixFn?: (prefix: string, suffix: string | null) => string;
}

/**
 * Toggles between unified and individual mode for a design property.
 * When enabled: expands unified class to individual classes (e.g., "p-4" → "pt-4 pr-4 pb-4 pl-4").
 * When disabled: compresses individual classes to unified if all values match.
 * Example: toggleIndividualMode({ toIndividualMode: true, unifiedFeatureKey: "padding", classTokens: ["p-4"], ... })
 *   → Expands "p-4" to ["pt-4", "pr-4", "pb-4", "pl-4"]
 *
 * @param toIndividualMode - True to enable individual mode, false to compress to unified
 * @param unifiedFeatureKey - The unified feature key (e.g., "padding")
 * @param individualFeatureKeys - Array of individual feature keys
 * @param config - The design property configuration
 * @param classTokens - Current class tokens
 * @param astPosition - AST position of the class attribute
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 * @param extractSuffixFn - Optional custom function to extract suffix from class
 * @param applySuffixFn - Optional custom function to apply suffix to prefix
 */
export async function toggleIndividualMode({
  toIndividualMode,
  unifiedFeatureKey,
  individualFeatureKeys,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  extractSuffixFn,
  applySuffixFn,
}: ToggleIndividualModeParams): Promise<void> {
  if (!astPosition) return;

  const tokens = classTokens ?? [];

  let classesToRemove: string[] = [];
  let classesToAdd: string[] = [];

  if (toIndividualMode) {
    const result = transformClassesToIndividual({
      config,
      classTokens,
      unifiedFeatureKey,
      individualFeatureKeys,
      extractSuffixFn,
      applySuffixFn,
    });

    classesToRemove = result.classesToRemove;
    classesToAdd = result.classesToAdd;
  } else {
    const result = transformClassesToUnified({
      config,
      classTokens: tokens,
      unifiedFeatureKey,
      individualFeatureKeys,
      extractSuffixFn,
      applySuffixFn,
    });
    classesToRemove = result.classesToRemove;
    classesToAdd = result.classesToAdd;
  }

  if (classesToRemove.length > 0 || classesToAdd.length > 0) {
    await executeAction("node.class.update", {
      classesToAdd,
      classesToRemove,
      nodeStart: astPosition,
      projectId,
      fileId,
    });

    await waitForNextRender();
  }
}
