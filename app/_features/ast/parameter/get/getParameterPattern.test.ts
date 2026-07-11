import type { ObjectPattern, Param } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { getParameterPattern } from "./getParameterPattern";

describe("getParameterPattern", () => {
  it("should return ObjectPattern when param has pat property with ObjectPattern", () => {
    const mockParam: Param = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
      pat: {
        type: "ObjectPattern",
        span: { start: 0, end: 50, ctxt: 0 },
        properties: [],
        optional: false,
      },
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeDefined();
    expect(result?.type).toBe("ObjectPattern");
    expect(result).toBe(mockParam.pat);
  });

  it("should return undefined when param is undefined", () => {
    const result = getParameterPattern(undefined);

    expect(result).toBeUndefined();
  });

  it("should return undefined when param has no pat property", () => {
    const mockParam = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeUndefined();
  });

  it("should return undefined when pat is not ObjectPattern", () => {
    const mockParam: Param = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
      pat: {
        type: "Identifier",
        span: { start: 0, end: 10, ctxt: 0 },
        value: "props",
        optional: false,
      },
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeUndefined();
  });

  it("should return ObjectPattern when param itself is ObjectPattern", () => {
    const mockParam = {
      type: "ObjectPattern",
      span: { start: 0, end: 50, ctxt: 0 },
      properties: [],
      optional: false,
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeDefined();
    expect(result?.type).toBe("ObjectPattern");
    expect(result).toBe(mockParam);
  });

  it("should return undefined when param has pat but pat type is not ObjectPattern", () => {
    const mockParam: Param = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
      pat: {
        type: "ArrayPattern",
        span: { start: 0, end: 10, ctxt: 0 },
        elements: [],
        optional: false,
      },
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeUndefined();
  });

  it("should handle param with null pat", () => {
    const mockParam: Param = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
      pat: null as unknown as ObjectPattern,
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeUndefined();
  });

  it("should handle param with pat property that is undefined", () => {
    const mockParam = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
      pat: undefined,
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeUndefined();
  });

  it("should return ObjectPattern with properties", () => {
    const mockObjectPattern: ObjectPattern = {
      type: "ObjectPattern",
      span: { start: 0, end: 50, ctxt: 0 },
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: { start: 1, end: 5, ctxt: 0 },
          key: {
            type: "Identifier",
            span: { start: 1, end: 5, ctxt: 0 },
            ctxt: 0,
            value: "prop1",
            optional: false,
          },
          value: undefined,
        },
      ],
      optional: false,
    };

    const mockParam: Param = {
      type: "Parameter",
      span: { start: 0, end: 50, ctxt: 0 },
      decorators: [],
      pat: mockObjectPattern,
    } as unknown as Param;

    const result = getParameterPattern(mockParam);

    expect(result).toBeDefined();
    expect(result?.type).toBe("ObjectPattern");
    expect(result?.properties).toHaveLength(1);
    expect(result).toBe(mockObjectPattern);
  });
});
