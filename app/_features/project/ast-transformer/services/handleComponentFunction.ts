import { ensureRestParameter } from "@ast/parameter";
import type { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression } from "@swc/wasm-web";

export type ComponentFunction = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;

export function handleComponentFunction(
  func: ComponentFunction,
  componentFunctionSpans: Set<number>,
  componentFunctionsMap: Map<number, ComponentFunction>
): void {
  if (componentFunctionSpans.has(func.span.start)) {
    ensureRestParameter(func, "restProps");
    componentFunctionsMap.set(func.span.start, func);
  }
}
