import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeClass } from "./removeClass";
import * as findTemplateLiteralModule from "@ast/template-literal/find";
import * as stringLiteralModule from "@ast/string-literal/update";
import * as templateLiteralModule from "@ast/template-literal/update/value";
import * as alternateModule from "@ast/template-literal/update/alternate";

vi.mock("@ast/utils", () => ({
  manipulateFileAST: vi.fn(async (params, manipulator) => {
    const mockAST = {} as Module;
    const result = manipulator(mockAST);
    return { success: true, updatedAst: result };
  }),
}));

vi.mock("@ast/string-literal/update", () => ({
  removeValueFromStringLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/find", () => ({
  findTemplateLiteralAtPosition: vi.fn(() => false),
}));

vi.mock("@ast/template-literal/update/alternate", () => ({
  removeClassFromConditionalAlternate: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/update/value", () => ({
  removeValueFromTemplateLiteral: vi.fn((ast: Module) => ast),
}));

describe("removeClass", () => {
  const mockParams = {
    className: "old-class",
    nodeStart: 10,
    projectId: "project123",
    fileId: "file123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should remove class from StringLiteral", async () => {
    const result = await removeClass(mockParams);
    expect(result.success).toBe(true);
    expect(stringLiteralModule.removeValueFromStringLiteral).toHaveBeenCalled();
  });

  it("should remove class from TemplateLiteral when found", async () => {
    vi.mocked(findTemplateLiteralModule.findTemplateLiteralAtPosition).mockReturnValueOnce(true);
    const result = await removeClass(mockParams);
    expect(result.success).toBe(true);
    expect(templateLiteralModule.removeValueFromTemplateLiteral).toHaveBeenCalled();
  });

  it("should remove class from alternate branch", async () => {
    const result = await removeClass({
      ...mockParams,
      branch: "alternate",
    });
    expect(result.success).toBe(true);
    expect(alternateModule.removeClassFromConditionalAlternate).toHaveBeenCalled();
  });
});

