import { updateStringLiteral } from "@ast/string-literal/update/updateStringLiteral";
import { findTemplateLiteralAtPosition } from "@ast/template-literal/find";
import { updateValue } from "@ast/template-literal/update/value/updateValue";
import { manipulateFileAST } from "@ast/utils";
import { getExistingClasses } from "../utils/getExistingClasses";
import { optimizeOutputClasses } from "../utils/optimizeOutputClasses";

export async function updateClass(params: {
  classesToAdd: string[];
  classesToRemove: string[];
  nodeStart: number;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { classesToAdd, classesToRemove, nodeStart } = params;

  return manipulateFileAST(params, (ast) => {
    if (!nodeStart) return ast;

    const existingClasses = getExistingClasses(ast, nodeStart);
    const { optimizedAdd, optimizedRemove } = optimizeOutputClasses(
      classesToAdd,
      classesToRemove,
      existingClasses
    );

    const isTemplate = findTemplateLiteralAtPosition(ast, nodeStart);

    return isTemplate
      ? updateValue(ast, nodeStart, optimizedAdd, optimizedRemove)
      : updateStringLiteral(ast, nodeStart, optimizedAdd, optimizedRemove);
  });
}

