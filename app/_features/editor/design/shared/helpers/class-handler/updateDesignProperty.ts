import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  expandShorthandClass,
  findAxisClassForIndividual,
  getCompressionPrefixFromFeature,
  getCurrentFeatureClass,
  normalizePrefix,
} from "@editor/design/shared/utils";
import { executeAction } from "@shared/action";
import { waitForNextRender } from "@shared/utils/function";

interface UpdateDesignPropertyParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  newClass: string | null;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
}

/**
 * Updates a design property by replacing or adding a class for a specific feature.
 * Handles compressed/shorthand class expansion to preserve unrelated classes.
 * When a compressed class exists (e.g., "size-10" = "w-10" + "h-10"), it expands
 * the shorthand and preserves classes that don't match the feature being updated.
 *
 * Example: updateDesignProperty({ config: widthConfig, featurePrefix: "width", newClass: "w-20", classTokens: ["w-10"], ... })
 *   → Removes "w-10", adds "w-20"
 *
 * Example: updateDesignProperty({ config: widthConfig, featurePrefix: "width", newClass: "w-20", classTokens: ["size-10"], ... })
 *   → Removes "size-10", adds "w-20" and "h-10" (preserves height from expanded shorthand)
 *
 * Example: updateDesignProperty({ config: paddingConfig, featurePrefix: "paddingLeft", newClass: "pl-8", classTokens: ["p-4"], ... })
 *   → Removes "p-4", adds "pl-8", "pr-4", "pt-4", "pb-4" (preserves other padding sides)
 *
 * Example: updateDesignProperty({ config: widthConfig, featurePrefix: "width", newClass: undefined, classTokens: ["w-10"], ... })
 *   → Removes "w-10" (removes the class when newClass is undefined)
 *
 * @param config - The design property configuration
 * @param featurePrefix - The feature prefix to update (e.g., "width", "paddingLeft")
 * @param newClass - The new class to add (e.g., "w-20", "pl-8"), or undefined to remove the existing class
 * @param classTokens - Current class tokens from the AST
 * @param astPosition - AST position of the class attribute
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 */

// TODO: Remove it safely. It's legacy.
export async function updateDesignProperty({
  config,
  featurePrefix,
  newClass,
  classTokens,
  astPosition,
  projectId,
  fileId,
}: UpdateDesignPropertyParams): Promise<void> {
  if (!astPosition || !classTokens) return;

  const feature = config.features[featurePrefix];
  if (!feature) return;

  const classesToRemove: string[] = [];
  const classesToAdd: string[] = [];

  let compressedClass: string | null = null;

  const compressedPrefix = getCompressionPrefixFromFeature(feature);

  if (compressedPrefix) {
    const currentClass = getCurrentFeatureClass(config, classTokens, compressedPrefix);
    if (currentClass) {
      compressedClass = currentClass;
    }
  }

  if (!compressedClass && config.individualMode) {
    const axisClass = findAxisClassForIndividual(config, classTokens, featurePrefix);

    if (axisClass) {
      compressedClass = axisClass;
    }
  }

  if (compressedClass) {
    const normalizedPrefix = normalizePrefix(feature.prefix);
    const expandedClasses = expandShorthandClass(compressedClass);

    if (expandedClasses.length > 1 && expandedClasses[0] !== compressedClass) {
      classesToRemove.push(compressedClass);

      for (const expandedClass of expandedClasses) {
        if (!expandedClass.startsWith(normalizedPrefix)) {
          classesToAdd.push(expandedClass);
        }
      }
    }
  }

  const existingClass = getCurrentFeatureClass(config, classTokens, featurePrefix);

  if (newClass === null) {
    if (existingClass && !classesToRemove.includes(existingClass)) {
      classesToRemove.push(existingClass);
    }
  } else {
    if (existingClass && existingClass !== newClass) {
      if (!classesToRemove.includes(existingClass)) {
        classesToRemove.push(existingClass);
      }
    }

    if (!existingClass || existingClass !== newClass) {
      classesToAdd.push(newClass);
    }
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
