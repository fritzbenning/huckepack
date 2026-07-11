import type { Module, TemplateLiteral } from "@swc/wasm-web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { removeValue } from "./removeValue";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  removeClassToken: vi.fn(),
}));

vi.mock("../../utils/quasiValue", () => ({
  getQuasiClassTokens: vi.fn(),
  getQuasiSpacingContext: vi.fn(),
  updateQuasiValue: vi.fn(),
}));

vi.mock("../../utils/traverseTemplateLiteral", () => ({
  traverseTemplateLiteral: vi.fn(),
}));

describe("removeValue", () => {
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

  it("should remove value from template literal", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "class1 target-class class2",
      raw: "class1 target-class class2",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { removeClassToken } = vi.mocked(await import("@ast/utils"));
    const { getQuasiClassTokens, getQuasiSpacingContext, updateQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens.mockReturnValue(["class1", "target-class", "class2"]);
    removeClassToken.mockReturnValue("class1 class2");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(traverseTemplateLiteral).toHaveBeenCalledWith(mockAST, 5, expect.any(Function));
    expect(getQuasiClassTokens).toHaveBeenCalledWith(mockQuasi);
    expect(removeClassToken).toHaveBeenCalledWith("class1 target-class class2", "target-class");
    expect(getQuasiSpacingContext).toHaveBeenCalledWith(0, 0);
    expect(updateQuasiValue).toHaveBeenCalledWith(mockQuasi, "class1 class2", mockSpacingContext);
  });

  it("should handle quasi with cooked value", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "class1 target-class",
      raw: "class1 target-class",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { removeClassToken } = vi.mocked(await import("@ast/utils"));
    const { getQuasiClassTokens, getQuasiSpacingContext } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens.mockReturnValue(["class1", "target-class"]);
    removeClassToken.mockReturnValue("class1");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(removeClassToken).toHaveBeenCalledWith("class1 target-class", "target-class");
  });

  it("should handle quasi with only raw value", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: undefined,
      raw: "class1 target-class",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { removeClassToken } = vi.mocked(await import("@ast/utils"));
    const { getQuasiClassTokens, getQuasiSpacingContext } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens.mockReturnValue(["class1", "target-class"]);
    removeClassToken.mockReturnValue("class1");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(removeClassToken).toHaveBeenCalledWith("class1 target-class", "target-class");
  });

  it("should handle quasi with neither cooked nor raw value", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: undefined,
      raw: undefined,
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { removeClassToken } = vi.mocked(await import("@ast/utils"));
    const { getQuasiClassTokens, getQuasiSpacingContext } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens.mockReturnValue(["target-class"]);
    removeClassToken.mockReturnValue("");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(removeClassToken).toHaveBeenCalledWith("", "target-class");
  });

  it("should search through multiple quasis to find target class", async () => {
    const mockQuasi1 = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "class1 class2",
      raw: "class1 class2",
    };

    const mockQuasi2 = {
      type: "TemplateElement" as const,
      span: { start: 30, end: 40, ctxt: 0 },
      tail: true,
      cooked: "class3 target-class",
      raw: "class3 target-class",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi1, mockQuasi2],
      expressions: [
        {
          type: "Identifier" as const,
          span: { start: 20, end: 30, ctxt: 0 },
          value: "variable",
          optional: false,
        },
      ],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: true, hasFollowingExpression: false };

    const { removeClassToken } = vi.mocked(await import("@ast/utils"));
    const { getQuasiClassTokens, getQuasiSpacingContext, updateQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens
      .mockReturnValueOnce(["class1", "class2"]) // First quasi doesn't have target
      .mockReturnValueOnce(["class3", "target-class"]); // Second quasi has target
    removeClassToken.mockReturnValue("class3");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(getQuasiClassTokens).toHaveBeenCalledTimes(2);
    expect(getQuasiClassTokens).toHaveBeenNthCalledWith(1, mockQuasi1);
    expect(getQuasiClassTokens).toHaveBeenNthCalledWith(2, mockQuasi2);
    expect(removeClassToken).toHaveBeenCalledWith("class3 target-class", "target-class");
    expect(getQuasiSpacingContext).toHaveBeenCalledWith(1, 1);
    expect(updateQuasiValue).toHaveBeenCalledWith(mockQuasi2, "class3", mockSpacingContext);
  });

  it("should log error when class not found in any quasi", async () => {
    const mockQuasi1 = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "class1 class2",
      raw: "class1 class2",
    };

    const mockQuasi2 = {
      type: "TemplateElement" as const,
      span: { start: 30, end: 40, ctxt: 0 },
      tail: true,
      cooked: "class3 class4",
      raw: "class3 class4",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi1, mockQuasi2],
      expressions: [
        {
          type: "Identifier" as const,
          span: { start: 20, end: 30, ctxt: 0 },
          value: "variable",
          optional: false,
        },
      ],
    };

    const { getQuasiClassTokens } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens.mockReturnValueOnce(["class1", "class2"]).mockReturnValueOnce(["class3", "class4"]);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "nonexistent-class");

    expect(result).toBe(mockAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Class "nonexistent-class" not found in template literal at nodeStart 5'
    );
  });

  it("should log error when template literal not found", async () => {
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    traverseTemplateLiteral.mockReturnValue({ ast: mockAST, found: false });

    const result = removeValue(mockAST, 999, "target-class");

    expect(result).toBe(mockAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Class "target-class" not found in template literal at nodeStart 999');
  });

  it("should handle empty quasis array", async () => {
    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [],
      expressions: [],
    };

    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Class "target-class" not found in template literal at nodeStart 5');
  });

  it("should handle quasi with empty class tokens", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "   ",
      raw: "   ",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const { getQuasiClassTokens } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens.mockReturnValue([]);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Class "target-class" not found in template literal at nodeStart 5');
  });

  it("should handle template literal with expressions and correct spacing context", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 30, end: 40, ctxt: 0 },
      tail: false,
      cooked: "class1 target-class",
      raw: "class1 target-class",
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [
        {
          type: "TemplateElement" as const,
          span: { start: 5, end: 15, ctxt: 0 },
          tail: false,
          cooked: "prefix",
          raw: "prefix",
        },
        mockQuasi,
        {
          type: "TemplateElement" as const,
          span: { start: 45, end: 50, ctxt: 0 },
          tail: true,
          cooked: "suffix",
          raw: "suffix",
        },
      ],
      expressions: [
        {
          type: "Identifier" as const,
          span: { start: 15, end: 25, ctxt: 0 },
          value: "var1",
          optional: false,
        },
        {
          type: "Identifier" as const,
          span: { start: 40, end: 45, ctxt: 0 },
          value: "var2",
          optional: false,
        },
      ],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: true, hasFollowingExpression: true };

    const { removeClassToken } = vi.mocked(await import("@ast/utils"));
    const { getQuasiClassTokens, getQuasiSpacingContext } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    getQuasiClassTokens
      .mockReturnValueOnce([]) // First quasi doesn't have target
      .mockReturnValueOnce(["class1", "target-class"]); // Second quasi has target
    removeClassToken.mockReturnValue("class1");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = removeValue(mockAST, 5, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(getQuasiSpacingContext).toHaveBeenCalledWith(1, 2); // Index 1, 2 expressions total
  });
});
