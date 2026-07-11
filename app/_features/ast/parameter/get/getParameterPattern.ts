import type { ObjectPattern, Param } from "@swc/wasm-web";

export function getParameterPattern(param: Param | undefined): ObjectPattern | undefined {
  if (!param) {
    return undefined;
  }

  if ("pat" in param && param.pat?.type === "ObjectPattern") {
    return param.pat as ObjectPattern;
  }

  if (typeof param === "object" && "type" in param && (param as { type?: string }).type === "ObjectPattern") {
    return param as unknown as ObjectPattern;
  }

  return undefined;
}
