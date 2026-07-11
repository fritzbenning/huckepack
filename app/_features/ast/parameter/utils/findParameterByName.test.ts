import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { AssignmentPatternProperty, ObjectPattern, RestElement } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { findParameterByName } from "./findParameterByName";

describe("findParameterByName", () => {
  it("should find parameter by name", () => {
    const targetParam: AssignmentPatternProperty = {
      type: "AssignmentPatternProperty",
      span: createSpan(0),
      key: createIdentifier("targetParam", 0),
      value: undefined,
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("otherParam", 0),
          value: undefined,
        },
        targetParam,
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("anotherParam", 0),
          value: undefined,
        },
      ],
      optional: false,
    };

    const result = findParameterByName(pattern, "targetParam");

    expect(result).toBe(targetParam);
  });

  it("should return undefined when parameter not found", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("otherParam", 0),
          value: undefined,
        },
      ],
      optional: false,
    };

    const result = findParameterByName(pattern, "nonExistent");

    expect(result).toBeUndefined();
  });

  it("should return undefined when pattern is undefined", () => {
    const result = findParameterByName(undefined, "anyParam");

    expect(result).toBeUndefined();
  });

  it("should return undefined when pattern has no properties", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    const result = findParameterByName(pattern, "anyParam");

    expect(result).toBeUndefined();
  });

  it("should return undefined when properties is null", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: null as unknown as (typeof pattern.properties)[],
      optional: false,
    };

    const result = findParameterByName(pattern, "anyParam");

    expect(result).toBeUndefined();
  });

  it("should return undefined when properties is undefined", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: undefined as unknown as (typeof pattern.properties)[],
      optional: false,
    };

    const result = findParameterByName(pattern, "anyParam");

    expect(result).toBeUndefined();
  });

  it("should skip RestElement when searching", () => {
    const targetParam: AssignmentPatternProperty = {
      type: "AssignmentPatternProperty",
      span: createSpan(0),
      key: createIdentifier("targetParam", 0),
      value: undefined,
    };

    const restElement: RestElement = {
      type: "RestElement",
      span: createSpan(0),
      rest: createSpan(0),
      argument: createIdentifier("restProps", 0),
      typeAnnotation: undefined,
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        restElement as unknown as (typeof pattern.properties)[0],
        targetParam,
      ],
      optional: false,
    };

    const result = findParameterByName(pattern, "targetParam");

    expect(result).toBe(targetParam);
  });

  it("should find parameter with default value", () => {
    const targetParam: AssignmentPatternProperty = {
      type: "AssignmentPatternProperty",
      span: createSpan(0),
      key: createIdentifier("targetParam", 0),
      value: {
        type: "StringLiteral",
        span: createSpan(0),
        value: "default",
        raw: '"default"',
      },
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [targetParam],
      optional: false,
    };

    const result = findParameterByName(pattern, "targetParam");

    expect(result).toBe(targetParam);
  });

  it("should find parameter even when key is not an Identifier but has value property", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: {
            type: "StringLiteral",
            span: createSpan(0),
            value: "paramName",
            raw: '"paramName"',
          },
          value: undefined,
        },
      ],
      optional: false,
    };

    const result = findParameterByName(pattern, "paramName");

    expect(result).toBeDefined();
    expect(result?.key.value).toBe("paramName");
  });

  it("should find parameter when key is Identifier with value property", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("paramName", 0),
          value: undefined,
        },
      ],
      optional: false,
    };

    const result = findParameterByName(pattern, "paramName");

    expect(result).toBeDefined();
    expect(result?.key.value).toBe("paramName");
  });

  it("should find first matching parameter when multiple exist", () => {
    const firstParam: AssignmentPatternProperty = {
      type: "AssignmentPatternProperty",
      span: createSpan(0),
      key: createIdentifier("duplicate", 0),
      value: undefined,
    };

    const secondParam: AssignmentPatternProperty = {
      type: "AssignmentPatternProperty",
      span: createSpan(0),
      key: createIdentifier("duplicate", 0),
      value: undefined,
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [firstParam, secondParam],
      optional: false,
    };

    const result = findParameterByName(pattern, "duplicate");

    expect(result).toBe(firstParam);
  });
});

