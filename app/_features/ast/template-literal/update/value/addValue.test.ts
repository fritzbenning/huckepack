import type { Module, TemplateLiteral } from "@swc/wasm-web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addValue } from "./addValue";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  addClassToken: vi.fn(),
}));

vi.mock("../../utils/quasiValue", () => ({
  findTargetQuasi: vi.fn(),
  getQuasiSpacingContext: vi.fn(),
  getQuasiValue: vi.fn(),
  updateQuasiValue: vi.fn(),
}));

vi.mock("../../utils/traverseTemplateLiteral", () => ({
  traverseTemplateLiteral: vi.fn(),
}));

describe("addValue", () => {
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

  it("should add value to template literal", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "existing-class",
      raw: "existing-class",
    };

    const mockTarget = {
      quasi: mockQuasi,
      index: 0,
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { addClassToken } = vi.mocked(await import("@ast/utils"));
    const { findTargetQuasi, getQuasiSpacingContext, getQuasiValue, updateQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    findTargetQuasi.mockReturnValue(mockTarget);
    getQuasiValue.mockReturnValue("existing-class");
    addClassToken.mockReturnValue("existing-class new-class");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = addValue(mockAST, 5, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(traverseTemplateLiteral).toHaveBeenCalledWith(mockAST, 5, expect.any(Function));
    expect(findTargetQuasi).toHaveBeenCalledWith([mockQuasi]);
    expect(getQuasiValue).toHaveBeenCalledWith(mockQuasi);
    expect(addClassToken).toHaveBeenCalledWith("existing-class", "new-class");
    expect(getQuasiSpacingContext).toHaveBeenCalledWith(0, 0);
    expect(updateQuasiValue).toHaveBeenCalledWith(mockQuasi, "existing-class new-class", mockSpacingContext);
  });

  it("should handle empty existing value", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "",
      raw: "",
    };

    const mockTarget = {
      quasi: mockQuasi,
      index: 0,
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { addClassToken } = vi.mocked(await import("@ast/utils"));
    const { findTargetQuasi, getQuasiSpacingContext, getQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    findTargetQuasi.mockReturnValue(mockTarget);
    getQuasiValue.mockReturnValue("   "); // Whitespace only
    addClassToken.mockReturnValue("new-class");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = addValue(mockAST, 5, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(addClassToken).toHaveBeenCalledWith("", "new-class");
  });

  it("should handle template literal with expressions", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "class1",
      raw: "class1",
    };

    const mockTarget = {
      quasi: mockQuasi,
      index: 0,
    };

    const mockExpression = {
      type: "Identifier" as const,
      span: { start: 20, end: 30, ctxt: 0 },
      value: "dynamicClass",
      optional: false,
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [mockExpression],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: true };

    const { addClassToken } = vi.mocked(await import("@ast/utils"));
    const { findTargetQuasi, getQuasiSpacingContext, getQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    findTargetQuasi.mockReturnValue(mockTarget);
    getQuasiValue.mockReturnValue("class1");
    addClassToken.mockReturnValue("class1 new-class");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = addValue(mockAST, 5, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(getQuasiSpacingContext).toHaveBeenCalledWith(0, 1);
  });

  it("should return original AST and log error when no target quasi found", async () => {
    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };

    const { findTargetQuasi } = vi.mocked(await import("../../utils/quasiValue"));
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    findTargetQuasi.mockReturnValue(null);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = addValue(mockAST, 5, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(findTargetQuasi).toHaveBeenCalledWith([]);
  });

  it("should log error when template literal not found", async () => {
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    traverseTemplateLiteral.mockReturnValue({ ast: mockAST, found: false });

    const result = addValue(mockAST, 999, "new-class");

    expect(result).toBe(mockAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Template literal not found at nodeStart", 999);
  });

  it("should handle multiple quasis and find correct target", async () => {
    const mockQuasi1 = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "first",
      raw: "first",
    };

    const mockQuasi2 = {
      type: "TemplateElement" as const,
      span: { start: 30, end: 40, ctxt: 0 },
      tail: true,
      cooked: "second",
      raw: "second",
    };

    const mockTarget = {
      quasi: mockQuasi2,
      index: 1,
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

    const { addClassToken } = vi.mocked(await import("@ast/utils"));
    const { findTargetQuasi, getQuasiSpacingContext, getQuasiValue, updateQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    findTargetQuasi.mockReturnValue(mockTarget);
    getQuasiValue.mockReturnValue("second");
    addClassToken.mockReturnValue("second new-class");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = addValue(mockAST, 5, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(getQuasiSpacingContext).toHaveBeenCalledWith(1, 1);
    expect(updateQuasiValue).toHaveBeenCalledWith(mockQuasi2, "second new-class", mockSpacingContext);
  });

  it("should handle whitespace-only quasi value", async () => {
    const mockQuasi = {
      type: "TemplateElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      tail: false,
      cooked: "  \n\t  ",
      raw: "  \n\t  ",
    };

    const mockTarget = {
      quasi: mockQuasi,
      index: 0,
    };

    const mockTemplateLiteral = {
      type: "TemplateLiteral" as const,
      span: { start: 5, end: 50, ctxt: 0 },
      quasis: [mockQuasi],
      expressions: [],
    };

    const mockTransformedAST = { ...mockAST };
    const mockSpacingContext = { hasPrecedingExpression: false, hasFollowingExpression: false };

    const { addClassToken } = vi.mocked(await import("@ast/utils"));
    const { findTargetQuasi, getQuasiSpacingContext, getQuasiValue } = vi.mocked(
      await import("../../utils/quasiValue")
    );
    const { traverseTemplateLiteral } = vi.mocked(await import("../../utils/traverseTemplateLiteral"));

    findTargetQuasi.mockReturnValue(mockTarget);
    getQuasiValue.mockReturnValue("  \n\t  ");
    addClassToken.mockReturnValue("new-class");
    getQuasiSpacingContext.mockReturnValue(mockSpacingContext);
    traverseTemplateLiteral.mockImplementation((_ast, _nodeStart, callback) => {
      const result = callback(mockTemplateLiteral as unknown as TemplateLiteral);
      return { ast: mockTransformedAST, found: !!result };
    });

    const result = addValue(mockAST, 5, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(addClassToken).toHaveBeenCalledWith("", "new-class");
  });
});
