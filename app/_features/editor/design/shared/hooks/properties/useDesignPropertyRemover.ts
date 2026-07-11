import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { removeDesignProperty } from "@editor/design/shared/helpers/class-handler";

interface UseDesignPropertyRemovalParams {
  config: DesignPropertyConfig;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  projectId: string;
  fileId: string;
  astPosition: number | null;
}

/**
 * Hook for removing design property classes. Provides functions to remove individual features
 * or all classes for a design property, handling shorthand class resolution.
 * Example: const { removeAll, removeFeatureClass } = useDesignPropertyRemover({ config, classes, ... })
 *   → removeFeatureClass("width") removes all width-related classes, resolving shorthands if needed
 *
 * @param config - The design property configuration
 * @param classes - The classes object from the AST
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 * @param astPosition - AST position of the class attribute
 * @returns Object with removeAll and removeFeatureClass functions
 */
export function useDesignPropertyRemover({
  config,
  classes,
  projectId,
  fileId,
  astPosition,
}: UseDesignPropertyRemovalParams) {
  const removeAll = async () => {
    return removeDesignProperty({
      config,
      classes,
      astPosition,
      projectId,
      fileId,
    });
  };

  return { removeAll };
}
