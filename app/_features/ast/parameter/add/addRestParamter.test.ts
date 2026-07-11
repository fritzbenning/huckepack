import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { ObjectPattern, RestElement } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { addRestParamter } from "./addRestParamter";

describe("addRestParamter", () => {
  it("should add rest parameter when pattern has no properties", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    addRestParamter(pattern, "restProps");

    expect(pattern.properties).toHaveLength(1);
    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    expect(restElement.type).toBe("RestElement");
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("restProps");
  });

  it("should add rest parameter when pattern has properties but no RestElement", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("prop1", 0),
          value: undefined,
        },
      ],
      optional: false,
    };

    addRestParamter(pattern, "restProps");

    expect(pattern.properties).toHaveLength(2);
    const lastProperty = pattern.properties[1];
    if (lastProperty.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = lastProperty;
    expect(restElement.type).toBe("RestElement");
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("restProps");
  });

  it("should not add rest parameter when RestElement already exists", () => {
    const existingRestElement: RestElement = {
      type: "RestElement",
      span: createSpan(0),
      rest: createSpan(0),
      argument: createIdentifier("existingRest", 0),
      typeAnnotation: undefined,
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("prop1", 0),
          value: undefined,
        },
        existingRestElement as unknown as (typeof pattern.properties)[0],
      ],
      optional: false,
    };

    const initialLength = pattern.properties.length;

    addRestParamter(pattern, "restProps");

    expect(pattern.properties).toHaveLength(initialLength);
    expect(pattern.properties[pattern.properties.length - 1]).toBe(existingRestElement);
  });

  it("should initialize properties array if it is null", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: null as unknown as ObjectPattern["properties"],
      optional: false,
    };

    addRestParamter(pattern, "restProps");

    expect(pattern.properties).toBeDefined();
    expect(pattern.properties).toHaveLength(1);
    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    expect(restElement.type).toBe("RestElement");
  });

  it("should initialize properties array if it is undefined", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: undefined as unknown as ObjectPattern["properties"],
      optional: false,
    };

    addRestParamter(pattern, "restProps");

    expect(pattern.properties).toBeDefined();
    expect(pattern.properties).toHaveLength(1);
  });

  it("should add rest parameter with custom name", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    addRestParamter(pattern, "customRest");

    expect(pattern.properties).toHaveLength(1);
    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("customRest");
  });

  it("should add rest parameter after existing properties", () => {
    const prop1 = {
      type: "AssignmentPatternProperty" as const,
      span: createSpan(0),
      key: createIdentifier("prop1", 0),
      value: undefined,
    };
    const prop2 = {
      type: "AssignmentPatternProperty" as const,
      span: createSpan(0),
      key: createIdentifier("prop2", 0),
      value: undefined,
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [prop1, prop2],
      optional: false,
    };

    addRestParamter(pattern, "restProps");

    expect(pattern.properties).toHaveLength(3);
    expect(pattern.properties[0]).toBe(prop1);
    expect(pattern.properties[1]).toBe(prop2);
    const lastProperty = pattern.properties[2];
    if (lastProperty.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = lastProperty;
    expect(restElement.type).toBe("RestElement");
  });

  it("should create RestElement with correct structure", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    addRestParamter(pattern, "testProps");

    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    expect(restElement.type).toBe("RestElement");
    expect(restElement.rest).toBeDefined();
    expect(restElement.argument).toBeDefined();
    expect(restElement.typeAnnotation).toBeUndefined();
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("testProps");
  });
});
