import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { findDisregardedClasses } from "@editor/design/shared/utils";
import type { DropdownValue } from "@editor/design/ui/design-category/types";
import { executeAction } from "@shared/action";

interface HandleNewDesignRuleParams {
  value: DropdownValue;
  config: DesignPropertyConfig;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
}

export async function addDesignRule({
  value,
  config,
  classes,
  astPosition,
  projectId,
  fileId,
}: HandleNewDesignRuleParams): Promise<void> {
  if (!astPosition) return;

  const classTokens = classes?.classTokens ?? null;
  const classesToRemove = value.siblingClasses.filter((cls) => classTokens?.includes(cls));

  // Also remove disregardedClasses for enum features
  const disregardedClasses = findDisregardedClasses(config);

  for (const disregardedClass of disregardedClasses) {
    if (classTokens?.includes(disregardedClass) && !classesToRemove.includes(disregardedClass)) {
      classesToRemove.push(disregardedClass);
    }
  }

  const classesToAdd: string[] = [];

  if (!classTokens?.includes(value.classToAdd)) {
    classesToAdd.push(value.classToAdd);
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
