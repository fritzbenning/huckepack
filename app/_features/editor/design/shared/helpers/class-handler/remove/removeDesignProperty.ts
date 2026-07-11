import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  deduplicateClasses,
  findDisregardedClasses,
  getCurrentFeatureClass,
  resolveShorthandClasses,
} from "@editor/design/shared/utils";
import { executeAction } from "@shared/action";

interface RemoveDesignPropertyParams {
  config: DesignPropertyConfig;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
}

/**
 * Removes all classes associated with a design property.
 * Uses getCurrentFeatureClass to accurately identify classes for each feature,
 * handles shorthand class resolution to preserve non-removed classes.
 *
 * Example: removeDesignProperty({ config: textConfig, classes: { classTokens: ["text-red-500", "text-sm"] }, ... })
 *   → Only removes "text-red-500" (textColor), preserves "text-sm" (fontSize)
 *
 * Example: removeDesignProperty({ config: paddingConfig, classes: { classTokens: ["p-4", "pt-4", "pr-4"] }, ... })
 *   → Removes all padding classes, expands "p-4" if needed to preserve other classes
 *
 * Example: removeDesignProperty({ config: sizeConfig, classes: { classTokens: ["size-10"] }, ... })
 *   → Removes "size-10" (compressed shorthand) by identifying its expanded classes (w-10, h-10)
 *
 * @param config - The design property configuration
 * @param classes - The classes object from the AST
 * @param astPosition - AST position of the class attribute
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 */
export async function removeDesignProperty({
  config,
  classes,
  astPosition,
  projectId,
  fileId,
}: RemoveDesignPropertyParams): Promise<void> {
  if (!astPosition || !classes) return;

  const classTokens = classes.classTokens;

  const classesToDelete: string[] = [];
  for (const featureKey of Object.keys(config.features)) {
    const currentClass = getCurrentFeatureClass(config, classTokens, featureKey);
    if (currentClass) {
      classesToDelete.push(currentClass);
    }
  }

  // Also remove disregardedClasses for enum features
  const disregardedClasses = findDisregardedClasses(config);
  for (const disregardedClass of disregardedClasses) {
    if (classTokens.includes(disregardedClass)) {
      classesToDelete.push(disregardedClass);
    }
  }

  if (classesToDelete.length === 0) return;

  const { shorthandsToDelete, shorthandsToReplace } = resolveShorthandClasses(classesToDelete, classTokens);

  const classesToRemove = deduplicateClasses(classesToDelete, shorthandsToDelete);
  const shorthandToRemove = shorthandsToReplace.map((r) => r.shorthand);
  const classesToAdd = shorthandsToReplace.flatMap((r) => r.remainingClasses);

  if (classesToRemove.length > 0 || shorthandToRemove.length > 0 || classesToAdd.length > 0) {
    const allClassesToRemove = deduplicateClasses(classesToRemove, shorthandToRemove);

    await executeAction("node.class.update", {
      classesToAdd,
      classesToRemove: allClassesToRemove,
      nodeStart: astPosition,
      projectId,
      fileId,
    });
  }
}
