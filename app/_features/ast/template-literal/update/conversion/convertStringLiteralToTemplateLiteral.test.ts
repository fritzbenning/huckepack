import type { JSXOpeningElement, Module } from "@swc/wasm-web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convertStringLiteralToTemplateLiteral } from "./convertStringLiteralToTemplateLiteral";

// Mock dependencies
vi.mock("@ast/expression/create/createBinaryExpression", () => ({
  createBinaryExpression: vi.fn(),
}));

vi.mock("@ast/expression/create/createExpressionFromValue", () => ({
  createExpressionFromValue: vi.fn(),
}));

vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: vi.fn(),
}));

vi.mock("@ast/jsx/create/createJSXExpressionContainer", () => ({
  createJSXExpressionContainer: vi.fn(),
}));

vi.mock("@ast/string-literal/create/createStringLiteral", () => ({
  createStringLiteral: vi.fn(),
}));

vi.mock("@ast/jsx/get/getClassAttribute", () => ({
  getClassAttribute: vi.fn(),
}));

vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isStringLiteral: vi.fn(),
}));

vi.mock("@ast/utils", () => ({
  createTransformedAST: vi.fn(),
}));

vi.mock("swc-walk", () => ({
  simple: vi.fn(),
}));

describe("convertStringLiteralToTemplateLiteral", () => {
  let mockAST: Module;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should convert string literal to template literal with conditional expression", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 20, end: 35, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockClassAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 10, end: 19, ctxt: 1 }, optional: false },
      value: mockStringLiteral,
    };

    const mockJSXOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 40, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "isActive",
      span: { start: 0, end: 8, ctxt: 1 },
      optional: false,
    };
    const mockRightExpr = {
      type: "BooleanLiteral" as const,
      span: { start: 0, end: 4, ctxt: 0 },
      value: true,
    };
    const mockBinaryExpr = {
      type: "BinaryExpression" as const,
      span: { start: 20, end: 35, ctxt: 0 },
      operator: "===" as const,
      left: mockIdentifier,
      right: mockRightExpr,
    };
    const mockConsequent = {
      type: "StringLiteral" as const,
      span: { start: 0, end: 2, ctxt: 0 },
      value: "",
      raw: '""',
    };
    const mockAlternate = {
      type: "StringLiteral" as const,
      span: { start: 0, end: 2, ctxt: 0 },
      value: "",
      raw: '""',
    };
    const mockExpressionContainer = {
      type: "JSXExpressionContainer" as const,
      span: { start: 20, end: 86, ctxt: 0 },
      expression: {
        type: "TemplateLiteral" as const,
        span: { start: 20, end: 86, ctxt: 0 },
        quasis: [],
        expressions: [],
      },
    };

    const { createBinaryExpression } = vi.mocked(await import("@ast/expression/create/createBinaryExpression"));
    const { createExpressionFromValue } = vi.mocked(await import("@ast/expression/create/createExpressionFromValue"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));
    const { createJSXExpressionContainer } = vi.mocked(await import("@ast/jsx/create/createJSXExpressionContainer"));
    const { createStringLiteral } = vi.mocked(await import("@ast/string-literal/create/createStringLiteral"));
    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValue(mockClassAttribute);
    isStringLiteral.mockReturnValue(true);
    getSpan.mockReturnValue({ start: 20, end: 35, ctxt: 0 });
    createIdentifier.mockReturnValue(mockIdentifier);
    createExpressionFromValue.mockReturnValue(mockRightExpr);
    createBinaryExpression.mockReturnValue(mockBinaryExpr);
    createStringLiteral.mockReturnValue(mockConsequent).mockReturnValue(mockAlternate);
    createJSXExpressionContainer.mockReturnValue(mockExpressionContainer);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "isActive", "===", true);

    expect(result).toBe(mockTransformedAST);
    expect(createTransformedAST).toHaveBeenCalledWith(mockAST);
    expect(simple).toHaveBeenCalledWith(mockTransformedAST, expect.any(Object));
    expect(getClassAttribute).toHaveBeenCalledWith(mockJSXOpening);
    expect(isStringLiteral).toHaveBeenCalledWith(mockStringLiteral);
    expect(getSpan).toHaveBeenCalledWith(mockStringLiteral);
    expect(createIdentifier).toHaveBeenCalledWith("isActive");
    expect(createExpressionFromValue).toHaveBeenCalledWith(true);
    expect(createBinaryExpression).toHaveBeenCalledWith(mockIdentifier, "===", mockRightExpr, 20, 35);
    expect(createStringLiteral).toHaveBeenCalledTimes(2);
    expect(createJSXExpressionContainer).toHaveBeenCalled();
    expect(mockClassAttribute.value).toBe(mockExpressionContainer);
  });

  it("should handle empty string literal value", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 20, end: 22, ctxt: 0 },
      value: "",
      raw: '""',
    };

    const mockClassAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 10, end: 19, ctxt: 1 }, optional: false },
      value: mockStringLiteral,
    };

    const mockJSXOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 25, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "condition",
      span: { start: 0, end: 9, ctxt: 1 },
      optional: false,
    };
    const mockRightExpr = {
      type: "NumericLiteral" as const,
      span: { start: 0, end: 1, ctxt: 0 },
      value: 1,
      raw: "1",
    };
    const mockBinaryExpr = {
      type: "BinaryExpression" as const,
      span: { start: 20, end: 22, ctxt: 0 },
      operator: ">" as const,
      left: mockIdentifier,
      right: mockRightExpr,
    };
    const mockConsequent = {
      type: "StringLiteral" as const,
      span: { start: 0, end: 2, ctxt: 0 },
      value: "",
      raw: '""',
    };
    const mockAlternate = {
      type: "StringLiteral" as const,
      span: { start: 0, end: 2, ctxt: 0 },
      value: "",
      raw: '""',
    };
    const mockExpressionContainer = {
      type: "JSXExpressionContainer" as const,
      span: { start: 20, end: 73, ctxt: 0 },
      expression: {
        type: "TemplateLiteral" as const,
        span: { start: 20, end: 73, ctxt: 0 },
        quasis: [],
        expressions: [],
      },
    };

    const { createBinaryExpression } = vi.mocked(await import("@ast/expression/create/createBinaryExpression"));
    const { createExpressionFromValue } = vi.mocked(await import("@ast/expression/create/createExpressionFromValue"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));
    const { createJSXExpressionContainer } = vi.mocked(await import("@ast/jsx/create/createJSXExpressionContainer"));
    const { createStringLiteral } = vi.mocked(await import("@ast/string-literal/create/createStringLiteral"));
    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValue(mockClassAttribute);
    isStringLiteral.mockReturnValue(true);
    getSpan.mockReturnValue({ start: 20, end: 22, ctxt: 0 });
    createIdentifier.mockReturnValue(mockIdentifier);
    createExpressionFromValue.mockReturnValue(mockRightExpr);
    createBinaryExpression.mockReturnValue(mockBinaryExpr);
    createStringLiteral.mockReturnValue(mockConsequent).mockReturnValue(mockAlternate);
    createJSXExpressionContainer.mockReturnValue(mockExpressionContainer);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "condition", ">", 1);

    expect(result).toBe(mockTransformedAST);
    expect(createExpressionFromValue).toHaveBeenCalledWith(1);
    expect(createBinaryExpression).toHaveBeenCalledWith(mockIdentifier, ">", mockRightExpr, 20, 22);
  });

  it("should not convert when no class attribute found", async () => {
    const mockJSXOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 10, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValue(undefined);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "condition", "===", true);

    expect(result).toBe(mockTransformedAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal class attribute not found at nodeStart 20");
  });

  it("should not convert when class attribute value is not string literal", async () => {
    const mockExpressionValue = {
      type: "JSXExpressionContainer" as const,
      span: { start: 20, end: 35, ctxt: 0 },
      expression: {
        type: "Identifier" as const,
        value: "className",
        span: { start: 21, end: 30, ctxt: 1 },
        optional: false,
      },
    };

    const mockClassAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 10, end: 19, ctxt: 1 }, optional: false },
      value: mockExpressionValue,
    };

    const mockJSXOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 40, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValue(mockClassAttribute);
    isStringLiteral.mockReturnValue(false);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "condition", "===", true);

    expect(result).toBe(mockTransformedAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal class attribute not found at nodeStart 20");
  });

  it("should not convert when span doesn't match", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 999, end: 1010, ctxt: 0 }, // Different span
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockClassAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 10, end: 19, ctxt: 1 }, optional: false },
      value: mockStringLiteral,
    };

    const mockJSXOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 1015, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValue(mockClassAttribute);
    isStringLiteral.mockReturnValue(true);
    getSpan.mockReturnValue({ start: 999, end: 1010, ctxt: 0 });
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "condition", "===", true);

    expect(result).toBe(mockTransformedAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal class attribute not found at nodeStart 20");
  });

  it("should handle string test value", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 20, end: 35, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockClassAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 10, end: 19, ctxt: 1 }, optional: false },
      value: mockStringLiteral,
    };

    const mockJSXOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 40, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "status",
      span: { start: 0, end: 6, ctxt: 1 },
      optional: false,
    };
    const mockRightExpr = {
      type: "StringLiteral" as const,
      span: { start: 0, end: 8, ctxt: 0 },
      value: "active",
      raw: '"active"',
    };
    const mockExpressionContainer = {
      type: "JSXExpressionContainer" as const,
      span: { start: 20, end: 86, ctxt: 0 },
      expression: {
        type: "TemplateLiteral" as const,
        span: { start: 20, end: 86, ctxt: 0 },
        quasis: [],
        expressions: [],
      },
    };

    const { createExpressionFromValue } = vi.mocked(await import("@ast/expression/create/createExpressionFromValue"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));
    const { createJSXExpressionContainer } = vi.mocked(await import("@ast/jsx/create/createJSXExpressionContainer"));
    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValue(mockClassAttribute);
    isStringLiteral.mockReturnValue(true);
    getSpan.mockReturnValue({ start: 20, end: 35, ctxt: 0 });
    createIdentifier.mockReturnValue(mockIdentifier);
    createExpressionFromValue.mockReturnValue(mockRightExpr);
    createJSXExpressionContainer.mockReturnValue(mockExpressionContainer);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "status", "===", "active");

    expect(result).toBe(mockTransformedAST);
    expect(createExpressionFromValue).toHaveBeenCalledWith("active");
  });

  it("should stop processing after first match", async () => {
    const mockStringLiteral1 = {
      type: "StringLiteral" as const,
      span: { start: 20, end: 35, ctxt: 0 },
      value: "class1",
      raw: '"class1"',
    };

    const mockStringLiteral2 = {
      type: "StringLiteral" as const,
      span: { start: 20, end: 35, ctxt: 0 }, // Same span
      value: "class2",
      raw: '"class2"',
    };

    const mockClassAttribute1 = {
      type: "JSXAttribute" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 10, end: 19, ctxt: 1 }, optional: false },
      value: mockStringLiteral1,
    };

    const mockClassAttribute2 = {
      type: "JSXAttribute" as const,
      span: { start: 50, end: 35, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 50, end: 59, ctxt: 1 }, optional: false },
      value: mockStringLiteral2,
    };

    const mockJSXOpening1: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 40, ctxt: 0 },
      name: { type: "Identifier" as const, value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute1],
      selfClosing: false,
    };

    const mockJSXOpening2: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 45, end: 80, ctxt: 0 },
      name: { type: "Identifier" as const, value: "span", span: { start: 46, end: 50, ctxt: 1 }, optional: false },
      attributes: [mockClassAttribute2],
      selfClosing: false,
    };

    const mockTransformedAST = { ...mockAST };
    const mockExpressionContainer = {
      type: "JSXExpressionContainer" as const,
      span: { start: 20, end: 86, ctxt: 0 },
      expression: {
        type: "TemplateLiteral" as const,
        span: { start: 20, end: 86, ctxt: 0 },
        quasis: [],
        expressions: [],
      },
    };

    const { createJSXExpressionContainer } = vi.mocked(await import("@ast/jsx/create/createJSXExpressionContainer"));
    const { getClassAttribute } = vi.mocked(await import("@ast/jsx/get/getClassAttribute"));
    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getClassAttribute.mockReturnValueOnce(mockClassAttribute1).mockReturnValueOnce(mockClassAttribute2);
    isStringLiteral.mockReturnValue(true);
    getSpan.mockReturnValue({ start: 20, end: 35, ctxt: 0 });
    createJSXExpressionContainer.mockReturnValue(mockExpressionContainer);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.JSXOpeningElement) {
        visitors.JSXOpeningElement(mockJSXOpening1, {});
        visitors.JSXOpeningElement(mockJSXOpening2, {});
      }
    });

    const result = convertStringLiteralToTemplateLiteral(mockAST, 20, "condition", "===", true);

    expect(result).toBe(mockTransformedAST);
    expect(getClassAttribute).toHaveBeenCalledTimes(1); // Should stop after first match
    expect(mockClassAttribute1.value).toBe(mockExpressionContainer);
    expect(mockClassAttribute2.value).toBe(mockStringLiteral2); // Should remain unchanged
  });
});
