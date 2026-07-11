import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { executeAction } from "@shared/action";

export const toggleNodeLock = async (params: {
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  projectId: string;
  fileId: string;
}): Promise<void> => {
  const { classes, projectId, fileId } = params;

  if (!classes) {
    console.warn("Cannot toggle lock: node has no className attribute");
    return;
  }

  if (classes.type !== "StringLiteral") {
    console.warn("Cannot toggle lock: template literals not yet supported");
    return;
  }

  const nodeStart = classes.span.start;
  const hasSelectNone = classes.classTokens.includes("select-none");

  // Toggle: if select-none is present, remove it; otherwise add it
  if (hasSelectNone) {
    await executeAction("node.class.remove", {
      className: "select-none",
      nodeStart,
      projectId,
      fileId,
    });
  } else {
    await executeAction("node.class.add", {
      className: "select-none",
      nodeStart,
      projectId,
      fileId,
    });
  }
};
