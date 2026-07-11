import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { executeAction } from "@shared/action";

export const toggleNodeVisibility = async (params: {
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  hidden: boolean;
  projectId: string;
  fileId: string;
}): Promise<void> => {
  const { classes, hidden, projectId, fileId } = params;

  if (!classes) {
    console.warn("Cannot toggle visibility: node has no className attribute");
    return;
  }

  if (classes.type !== "StringLiteral") {
    console.warn("Cannot toggle visibility: template literals not yet supported");
    return;
  }

  const nodeStart = classes.span.start;

  if (hidden) {
    await executeAction("node.class.remove", {
      className: "hidden",
      nodeStart,
      projectId,
      fileId,
    });
  } else {
    await executeAction("node.class.add", {
      className: "hidden",
      nodeStart,
      projectId,
      fileId,
    });
  }
};
