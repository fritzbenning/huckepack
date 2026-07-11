import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  removeDesignProperty,
  toggleDesignPropertyClasses,
  updateDesignProperty,
} from "@editor/design/shared/helpers/class-handler";
import { getClassValue as getClassValueUtil, hasClass as hasClassUtil } from "@editor/design/shared/utils";

interface UseDesignPropertyParams {
  config: DesignPropertyConfig;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  projectId: string;
  fileId: string;
  astPosition: number | null;
}

/**
 * Main hook for design property components. Provides class tokens and utility functions
 * for updating, toggling, and removing classes.
 * Example: const { classTokens, update, toggle, removeAll, hasClass, getClassValue } = useDesignProperty({ config, classes, ... })
 *   → Provides access to class tokens and methods to manipulate them
 *
 * @param config - The design property configuration
 * @param classes - The classes object from the AST
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 * @param astPosition - AST position of the class attribute
 * @returns Object with classTokens and utility functions (update, toggle, removeAll, hasClass, getClassValue)
 */
export function useDesignProperty({ config, classes, projectId, fileId, astPosition }: UseDesignPropertyParams) {
  const classTokens = classes?.classTokens ?? null;

  const update = async (featurePrefix: string, newClass: string | undefined) => {
    return updateDesignProperty({
      config,
      featurePrefix,
      newClass,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });
  };

  const toggle = async (featurePrefix: string) => {
    return toggleDesignPropertyClasses({
      config,
      featurePrefix,
      classTokens,
      astPosition,
      projectId,
      fileId,
    });
  };

  const removeAll = async () => {
    return removeDesignProperty({
      config,
      classes,
      astPosition,
      projectId,
      fileId,
    });
  };

  const hasClass = (className: string): boolean => {
    return hasClassUtil(classTokens, className);
  };

  const getClassValue = (featurePrefix: string) => getClassValueUtil(config, classTokens, featurePrefix);

  return {
    classTokens,
    update,
    toggle,
    removeAll,
    hasClass,
    getClassValue,
  };
}
