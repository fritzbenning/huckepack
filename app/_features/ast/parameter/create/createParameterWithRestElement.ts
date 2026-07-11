import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { ObjectPattern, RestElement } from "@swc/wasm-web";

// Creates a new Parameter with an ObjectPattern containing only a RestElement
export function createParameterWithRestElement(propName: string = "restProps") {
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

  const pattern: ObjectPattern = {
    type: "ObjectPattern",
    span: fullSpan,
    properties: [restElement as unknown as (typeof pattern.properties)[0]],
    optional: false,
    typeAnnotation: undefined,
  };

  const newParameter = {
    type: "Parameter" as const,
    span: fullSpan,
    decorators: [],
    pat: pattern,
  };

  return newParameter;
}

