import type { JSXAttribute, JSXAttributeOrSpread, JSXElementName, JSXOpeningElement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addDataInstanceNameAttribute, getComponentNameFromOpening } from "./addDataInstanceNameAttribute";

// Mock dependencies
vi.mock("../create/createJSXAttribute", () => ({
  createJSXAttribute: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isIdentifier: vi.fn(),
}));

describe("addDataInstanceNameAttribute", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should add new data-instance-name attribute when it doesn't exist", async () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 10, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const mockAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 5, end: 35, ctxt: 0 },
      name: {
        type: "Identifier" as const,
        value: "data-instance-name",
        span: { start: 5, end: 23, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 24, end: 35, ctxt: 0 },
        value: "TestComponent",
        raw: '"TestComponent"',
      },
    };

    const { createJSXAttribute } = vi.mocked(await import("../create/createJSXAttribute"));
    createJSXAttribute.mockReturnValue(mockAttribute);

    addDataInstanceNameAttribute(mockOpening, "TestComponent");

    expect(createJSXAttribute).toHaveBeenCalledWith("data-instance-name", "TestComponent");
    expect(mockOpening.attributes).toHaveLength(1);
    expect(mockOpening.attributes[0]).toBe(mockAttribute);
  });

  it("should update existing data-instance-name attribute", async () => {
    const existingAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 5, end: 35, ctxt: 0 },
      name: {
        type: "Identifier" as const,
        value: "data-instance-name",
        span: { start: 5, end: 23, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 24, end: 35, ctxt: 0 },
        value: "OldComponent",
        raw: '"OldComponent"',
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 40, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingAttribute],
      selfClosing: false,
    };

    const mockNewAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 5, end: 39, ctxt: 0 },
      name: {
        type: "Identifier" as const,
        value: "data-instance-name",
        span: { start: 5, end: 23, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 24, end: 39, ctxt: 0 },
        value: "NewComponent",
        raw: '"NewComponent"',
      },
    };

    const { createJSXAttribute } = vi.mocked(await import("../create/createJSXAttribute"));
    createJSXAttribute.mockReturnValue(mockNewAttribute);

    addDataInstanceNameAttribute(mockOpening, "NewComponent");

    expect(createJSXAttribute).toHaveBeenCalledWith("data-instance-name", "NewComponent");
    expect(mockOpening.attributes).toHaveLength(1);
    expect((mockOpening.attributes[0] as JSXAttribute).value).toBe(mockNewAttribute.value);
  });

  it("should not affect other attributes when adding data-instance-name", async () => {
    const existingAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 5, end: 25, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 5, end: 14, ctxt: 1 }, optional: false },
      value: {
        type: "StringLiteral" as const,
        span: { start: 15, end: 25, ctxt: 0 },
        value: "container",
        raw: '"container"',
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingAttribute],
      selfClosing: false,
    };

    const mockNewAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 26, end: 60, ctxt: 0 },
      name: {
        type: "Identifier" as const,
        value: "data-instance-name",
        span: { start: 26, end: 44, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 45, end: 60, ctxt: 0 },
        value: "TestComponent",
        raw: '"TestComponent"',
      },
    };

    const { createJSXAttribute } = vi.mocked(await import("../create/createJSXAttribute"));
    createJSXAttribute.mockReturnValue(mockNewAttribute);

    addDataInstanceNameAttribute(mockOpening, "TestComponent");

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[0]).toBe(existingAttribute);
    expect(mockOpening.attributes[1]).toBe(mockNewAttribute);
  });

  it("should handle non-JSXAttribute in attributes array", async () => {
    const spreadAttribute = {
      type: "JSXSpreadAttribute" as const,
      span: { start: 5, end: 15, ctxt: 0 },
      argument: { type: "Identifier" as const, value: "props", span: { start: 8, end: 13, ctxt: 1 }, optional: false },
    } as unknown as JSXAttributeOrSpread;

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [spreadAttribute],
      selfClosing: false,
    };

    const mockNewAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 16, end: 50, ctxt: 0 },
      name: {
        type: "Identifier" as const,
        value: "data-instance-name",
        span: { start: 16, end: 34, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 35, end: 50, ctxt: 0 },
        value: "TestComponent",
        raw: '"TestComponent"',
      },
    };

    const { createJSXAttribute } = vi.mocked(await import("../create/createJSXAttribute"));
    createJSXAttribute.mockReturnValue(mockNewAttribute);

    addDataInstanceNameAttribute(mockOpening, "TestComponent");

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[0]).toBe(spreadAttribute);
    expect(mockOpening.attributes[1]).toBe(mockNewAttribute);
  });
});

describe("getComponentNameFromOpening", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return component name for Identifier element name", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 15, ctxt: 0 },
      name: { type: "Identifier", value: "MyComponent", span: { start: 1, end: 12, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const result = getComponentNameFromOpening(mockOpening);

    expect(result).toBe("MyComponent");
  });

  it("should return component name for JSXMemberExpression with Identifier object", async () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 25, ctxt: 0 },
      name: {
        type: "JSXMemberExpression" as const,
        object: {
          type: "Identifier" as const,
          value: "MyComponent",
          span: { start: 1, end: 12, ctxt: 1 },
          optional: false,
        },
        property: {
          type: "Identifier" as const,
          value: "SubComponent",
          span: { start: 13, end: 25, ctxt: 1 },
          optional: false,
        },
      },
      attributes: [],
      selfClosing: false,
    };

    const { isIdentifier } = vi.mocked(await import("@ast/type-check"));
    isIdentifier.mockReturnValue(true);

    const result = getComponentNameFromOpening(mockOpening);

    expect(result).toBe("MyComponent");
    expect(isIdentifier).toHaveBeenCalledWith((mockOpening.name as { object: unknown }).object);
  });

  it("should return null for JSXMemberExpression with non-Identifier object", async () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: {
        type: "JSXMemberExpression" as const,
        object: {
          type: "JSXMemberExpression" as const,
          object: {
            type: "Identifier" as const,
            value: "Nested",
            span: { start: 1, end: 7, ctxt: 1 },
            optional: false,
          },
          property: {
            type: "Identifier" as const,
            value: "Component",
            span: { start: 8, end: 17, ctxt: 1 },
            optional: false,
          },
        },
        property: {
          type: "Identifier" as const,
          value: "SubComponent",
          span: { start: 18, end: 30, ctxt: 1 },
          optional: false,
        },
      },
      attributes: [],
      selfClosing: false,
    };

    const { isIdentifier } = vi.mocked(await import("@ast/type-check"));
    isIdentifier.mockReturnValue(false);

    const result = getComponentNameFromOpening(mockOpening);

    expect(result).toBeNull();
  });

  it("should return null for unsupported element name types", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: {
        type: "JSXNamespacedName" as const,
        namespace: { type: "Identifier" as const, value: "svg", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        name: { type: "Identifier" as const, value: "circle", span: { start: 5, end: 11, ctxt: 1 }, optional: false },
      } as unknown as JSXElementName,
      attributes: [],
      selfClosing: false,
    };

    const result = getComponentNameFromOpening(mockOpening);

    expect(result).toBeNull();
  });
});
