import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { ObjectPattern, RestElement } from "@swc/wasm-web";

export function addRestParamter(pattern: ObjectPattern, propName: string): void {
  if (!pattern.properties) {
    pattern.properties = [];
  }

  const hasRestElement = pattern.properties.some((prop) => prop.type === "RestElement");

  if (!hasRestElement) {
    const restSpan = createSpan(3);
    const fullSpan = createSpan(3 + propName.length);

    const identifier = createIdentifier(propName, 3);

    const restElement: RestElement = {
      type: "RestElement",
      span: fullSpan,
      rest: restSpan,
      argument: identifier,
      typeAnnotation: undefined,
    };

    pattern.properties.push(restElement as unknown as (typeof pattern.properties)[0]);
  }
}

