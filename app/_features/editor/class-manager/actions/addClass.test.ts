import * as findTemplateLiteralModule from "@ast/template-literal/find";
import * as alternateModule from "@ast/template-literal/update/alternate";
import * as consequentModule from "@ast/template-literal/update/consequent";
import * as conversionModule from "@ast/template-literal/update/conversion";
import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addClass } from "./addClass";
import * as createClassNameModule from "./createClassName";

vi.mock("@ast/utils", () => ({
  manipulateFileAST: vi.fn(async (params, manipulator) => {
    const mockAST = {} as Module;
    const result = manipulator(mockAST);
    return { success: true, updatedAst: result };
  }),
}));

vi.mock("@ast/string-literal/update", () => ({
  addValueToStringLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/find", () => ({
  findTemplateLiteralAtPosition: vi.fn(() => false),
}));

vi.mock("@ast/template-literal/update/alternate", () => ({
  addClassToConditionalAlternate: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/update/consequent", () => ({
  addClassToConditionalConsequent: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/update/conversion", () => ({
  convertLogicalToConditional: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/update/value", () => ({
  addValueToTemplateLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("./createClassName", () => ({
  createClassName: vi.fn((ast: Module) => ast),
}));

describe("addClass", () => {
  const mockParams = {
    className: "new-class",
    nodeStart: 10,
    projectId: "project123",
    fileId: "file123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add class to StringLiteral", async () => {
    const result = await addClass(mockParams);
    expect(result.success).toBe(true);
  });

  it("should add class to TemplateLiteral when found", async () => {
    vi.mocked(findTemplateLiteralModule.findTemplateLiteralAtPosition).mockReturnValueOnce(true);
    const result = await addClass(mockParams);
    expect(result.success).toBe(true);
  });

  it("should create new className attribute when nodeStart is 0", async () => {
    const result = await addClass({ ...mockParams, nodeStart: 0 });
    expect(result.success).toBe(true);
    expect(createClassNameModule.createClassName).toHaveBeenCalled();
  });

  it("should handle logical-and to conditional conversion", async () => {
    const result = await addClass({
      ...mockParams,
      isLogicalAnd: true,
      branch: "alternate",
      segmentStart: 20,
    });
    expect(result.success).toBe(true);
    expect(conversionModule.convertLogicalToConditional).toHaveBeenCalled();
  });

  it("should handle alternate branch", async () => {
    const result = await addClass({
      ...mockParams,
      branch: "alternate",
      segmentStart: 20,
    });
    expect(result.success).toBe(true);
    expect(alternateModule.addClassToConditionalAlternate).toHaveBeenCalled();
  });

  it("should handle consequent branch", async () => {
    const result = await addClass({
      ...mockParams,
      branch: "consequent",
      segmentStart: 20,
    });
    expect(result.success).toBe(true);
    expect(consequentModule.addClassToConditionalConsequent).toHaveBeenCalled();
  });

  it("should handle consequent branch with only nodeStart", async () => {
    const result = await addClass({
      ...mockParams,
      branch: "consequent",
    });
    expect(result.success).toBe(true);
  });
});
