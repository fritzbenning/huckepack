import { updateTemplateLiteralTest } from "@ast/template-literal/update/test";
import { manipulateFileAST } from "@ast/utils";
import type { Span } from "@swc/wasm-web";

export const handleTemplateLiteralTest = async (
  projectId: string,
  fileId: string,
  span: Span,
  left: string,
  op: string,
  right: string | number | boolean
): Promise<void> => {
  await manipulateFileAST({ fileId, projectId }, (ast) => {
    return updateTemplateLiteralTest(ast, span.start, left, op, right);
  });
};
