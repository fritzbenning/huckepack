import { isBackgroundColorClass } from "@editor/design/shared/helpers/classifier/background";
import { isTextColorClass } from "@editor/design/shared/helpers/classifier/text";
import { executeAction } from "@shared/action";

interface UpdateColorValueParams {
  classTokens: string[] | null;
  prefix: string;
  newClass: string;
  astPosition: number | null;
  projectId: string;
  fileId: string;
}

/**
 * Updates a color class by removing all existing color classes with the same prefix
 * and adding the new color class.
 *
 * @param classTokens - Current class tokens
 * @param prefix - Color prefix (e.g., "bg", "text")
 * @param newClass - The new color class to set
 * @param astPosition - AST position of the class attribute
 * @param projectId - Project ID for updates
 * @param fileId - File ID for updates
 */
export async function updateColorValue({
  classTokens,
  prefix,
  newClass,
  astPosition,
  projectId,
  fileId,
}: UpdateColorValueParams): Promise<void> {
  if (!astPosition) return;

  const tokens = classTokens ?? [];
  const classesToRemove: string[] = [];

  for (const cls of tokens) {
    if (cls === newClass) continue;

    if (prefix === "bg" && isBackgroundColorClass(cls)) {
      classesToRemove.push(cls);
    } else if (prefix === "text" && isTextColorClass(cls)) {
      classesToRemove.push(cls);
    }
  }

  const classesToAdd: string[] = [];
  if (!tokens.includes(newClass)) {
    classesToAdd.push(newClass);
  }

  if (classesToRemove.length > 0 || classesToAdd.length > 0) {
    await executeAction("node.class.update", {
      classesToAdd,
      classesToRemove,
      nodeStart: astPosition,
      projectId,
      fileId,
    });
  }
}
