import type {
  ArrayExpression,
  BinaryExpression,
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  ConditionalExpression,
  ExportDeclaration,
  Identifier,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXText,
  MemberExpression,
  NumericLiteral,
  ParenthesisExpression,
  StringLiteral,
  TemplateLiteral,
  TsPropertySignature,
  TsUnionType,
  UnaryExpression,
} from "@swc/wasm-web";

function createTypeGuard<T>(type: string): (node: unknown) => node is T {
  return (node: unknown): node is T => {
    return (node as { type?: string })?.type === type;
  };
}

// Type-check functions
export const isArrayExpression = createTypeGuard<ArrayExpression>("ArrayExpression");
export const isBinaryExpression = createTypeGuard<BinaryExpression>("BinaryExpression");
export const isBlockStatement = createTypeGuard<BlockStatement>("BlockStatement");
export const isBooleanLiteral = createTypeGuard<BooleanLiteral>("BooleanLiteral");
export const isCallExpression = createTypeGuard<CallExpression>("CallExpression");
export const isConditionalExpression = createTypeGuard<ConditionalExpression>("ConditionalExpression");
export const isExportDeclaration = createTypeGuard<ExportDeclaration>("ExportDeclaration");
export const isIdentifier = createTypeGuard<Identifier>("Identifier");
export const isJSXElement = createTypeGuard<JSXElement>("JSXElement");
export const isJSXExpressionContainer = createTypeGuard<JSXExpressionContainer>("JSXExpressionContainer");
export const isJSXFragment = createTypeGuard<JSXFragment>("JSXFragment");
export const isJSXText = createTypeGuard<JSXText>("JSXText");
export const isMemberExpression = createTypeGuard<MemberExpression>("MemberExpression");
export const isNumericLiteral = createTypeGuard<NumericLiteral>("NumericLiteral");
export const isParenthesisExpression = createTypeGuard<ParenthesisExpression>("ParenthesisExpression");
export const isStringLiteral = createTypeGuard<StringLiteral>("StringLiteral");
export const isTemplateLiteral = createTypeGuard<TemplateLiteral>("TemplateLiteral");
export const isTsPropertySignature = createTypeGuard<TsPropertySignature>("TsPropertySignature");
export const isTsUnionType = createTypeGuard<TsUnionType>("TsUnionType");
export const isUnaryExpression = createTypeGuard<UnaryExpression>("UnaryExpression");
