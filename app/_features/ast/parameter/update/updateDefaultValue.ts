import { createLiteral } from "@ast/literal/create/createLiteral";
import type { LiteralType } from "@ast/types/literal";
import { traverseExports } from "@ast/utils";
import type {
  BooleanLiteral,
  FunctionDeclaration,
  FunctionExpression,
  Module,
  NumericLiteral,
  StringLiteral,
} from "@swc/wasm-web";
import { findParameterByName, getObjectPatternFromDeclaration } from "../utils";

// Updates the default value of a parameter in component props
export function updateDefaultValue(
  ast: Module,
  paramName: string,
  value: string | number | boolean,
  literalType: LiteralType
): Module | null {
  const updateParameterValue = (pattern: ReturnType<typeof getObjectPatternFromDeclaration>): boolean => {
    const param = findParameterByName(pattern, paramName);

    if (param && param.value !== null && param.value !== undefined) {
      const currentValue = param.value as StringLiteral | NumericLiteral | BooleanLiteral;
      const currentSpan = currentValue.span;

      const newLiteral = createLiteral(value, literalType) as StringLiteral | NumericLiteral | BooleanLiteral;

      const rawValue = "raw" in newLiteral && newLiteral.raw ? newLiteral.raw : String(value);
      const rawLength = rawValue.length;

      newLiteral.span = {
        start: currentSpan.start,
        end: currentSpan.start + rawLength,
        ctxt: currentSpan.ctxt,
      };

      param.value = newLiteral;

      param.span = {
        start: param.span.start,
        end: newLiteral.span.end,
        ctxt: param.span.ctxt,
      };

      return true;
    }

    return false;
  };

  const { ast: transformedAst, found } = traverseExports(
    ast,
    (declaration: FunctionDeclaration | FunctionExpression) => {
      const pattern = getObjectPatternFromDeclaration(declaration);
      return updateParameterValue(pattern);
    }
  );

  return found ? transformedAst : null;
}
