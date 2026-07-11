import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { replaceClass } from "./replaceClass";
import * as findTemplateLiteralModule from "@ast/template-literal/find";
import * as stringLiteralModule from "@ast/string-literal/update";
import * as templateLiteralModule from "@ast/template-literal/update/value";

vi.mock("@ast/utils", () => ({
  manipulateFileAST: vi.fn(async (params, manipulator) => {
    const mockAST = {} as Module;
    const result = manipulator(mockAST);
    return { success: true, updatedAst: result };
  }),
}));

vi.mock("@ast/string-literal/update", () => ({
  replaceValueInStringLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/find", () => ({
  findTemplateLiteralAtPosition: vi.fn(() => false),
}));

vi.mock("@ast/template-literal/update/value", () => ({
  replaceValueInTemplateLiteral: vi.fn((ast: Module) => ast),
}));

describe("replaceClass", () => {
  const mockParams = {
    oldClassName: "old-class",
    newClassName: "new-class",
    nodeStart: 10,
    projectId: "project123",
    fileId: "file123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should replace class in StringLiteral", async () => {
    const result = await replaceClass(mockParams);
    expect(result.success).toBe(true);
    expect(stringLiteralModule.replaceValueInStringLiteral).toHaveBeenCalledWith(
      expect.anything(),
      10,
      "old-class",
      "new-class"
    );
  });

  it("should replace class in TemplateLiteral when found", async () => {
    vi.mocked(findTemplateLiteralModule.findTemplateLiteralAtPosition).mockReturnValueOnce(true);
    const result = await replaceClass(mockParams);
    expect(result.success).toBe(true);
    expect(templateLiteralModule.replaceValueInTemplateLiteral).toHaveBeenCalledWith(
      expect.anything(),
      10,
      "old-class",
      "new-class"
    );
  });
});

