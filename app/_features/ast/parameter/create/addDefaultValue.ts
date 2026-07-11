import { createLiteral } from "@ast/literal/create/createLiteral";
import type { LiteralType } from "@ast/types/literal";
import { traverseExports } from "@ast/utils";
import type {
  BooleanLiteral,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Module,
  NumericLiteral,
  StringLiteral,
} from "@swc/wasm-web";
import { findParameterByName, getObjectPatternFromDeclaration } from "../utils";

// Adds a default value to a parameter in component props if it doesn't have one
export function addDefaultValue(
  ast: Module,
  paramName: string,
  value: string | number | boolean,
  literalType: LiteralType
): Module | null {
  const addDefaultValueToPattern = (pattern: ReturnType<typeof getObjectPatternFromDeclaration>): boolean => {
    const param = findParameterByName(pattern, paramName);

    if (!param) {
      return false;
    }

    const hasNoValue = param.value === null || typeof param.value === "undefined";
    if (!hasNoValue) {
      return false;
    }

    const keySpan = (param.key as Identifier).span;
    const equalsAndSpaceLength = 3; // " = "
    const literalValue = createLiteral(value, literalType) as StringLiteral | NumericLiteral | BooleanLiteral;
    const rawValue = "raw" in literalValue && literalValue.raw ? literalValue.raw : String(value);
    const literalLength = rawValue.length;

    literalValue.span = {
      start: keySpan.end,
      end: keySpan.end + equalsAndSpaceLength + literalLength,
      ctxt: keySpan.ctxt,
    };

    param.value = literalValue;
    param.span = {
      start: param.span.start,
      end: keySpan.end + equalsAndSpaceLength + literalLength,
      ctxt: param.span.ctxt,
    };

    return true;
  };

  const { ast: transformedAst, found } = traverseExports(
    ast,
    (declaration: FunctionDeclaration | FunctionExpression) => {
      const pattern = getObjectPatternFromDeclaration(declaration);
      return addDefaultValueToPattern(pattern);
    }
  );

  return found ? transformedAst : null;
}
