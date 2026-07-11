import type { DesignPropertyConfig } from "@editor/design/registry";
import { getNumericClassName, isNumericFeature } from "@editor/design/values/numeric";
import { executeAction } from "@shared/action";

interface ToggleDesignPropertyClassesParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
}

/**
 * Toggles a feature class between two states (e.g., on/off).
 * If active, removes it; if inactive, adds the first alternative class.
 * Handles special cases like justifyBetween conflicting classes.
 * Example: toggleDesignPropertyClasses({ config, featurePrefix: "hidden", classTokens: ["block"], ... })
 *   → Removes "block", adds "hidden"
 * Example: toggleDesignPropertyClasses({ config, featurePrefix: "justifyBetween", classTokens: ["justify-center"], ... })
 *   → Removes "justify-center", adds "justify-between"
 *
 * @param config - The design property configuration
 * @param featurePrefix - The feature prefix to toggle
 * @param classTokens - Current class tokens
 * @param astPosition - AST position of the class attribute
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 */
export async function toggleDesignPropertyClasses({
  config,
  featurePrefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
}: ToggleDesignPropertyClassesParams): Promise<void> {
  if (!astPosition) return;

  const feature = config.features[featurePrefix];
  if (!feature) return;

  const classesToRemove: string[] = [];
  const classesToAdd: string[] = [];

  const classes = feature.classes;
  let isActive = false;

  for (const cls of classes) {
    if (classTokens?.includes(cls)) {
      isActive = true;
      break;
    }
  }

  const targetClass = isActive ? classes[0] : classes[1];
  let newClass = targetClass;

  if (isNumericFeature(feature)) {
    newClass = getNumericClassName(feature, featurePrefix, targetClass);
  }

  for (const cls of classes) {
    if (classTokens?.includes(cls)) {
      classesToRemove.push(cls);
    }
  }

  if (featurePrefix === "justifyBetween") {
    const conflictingJustifyClasses = ["justify-center", "justify-end"];
    conflictingJustifyClasses.forEach((cls) => {
      if (classTokens?.includes(cls)) {
        classesToRemove.push(cls);
      }
    });
  }

  if (!classTokens?.includes(newClass)) {
    if (newClass !== "justify-start" && newClass !== "flex-nowrap") {
      classesToAdd.push(newClass);
    }
  }

  await executeAction("node.class.update", {
    classesToAdd,
    classesToRemove,
    nodeStart: astPosition,
    projectId,
    fileId,
  });
}
