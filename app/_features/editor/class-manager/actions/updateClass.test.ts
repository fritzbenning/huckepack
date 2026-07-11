import * as stringLiteralModule from "@ast/string-literal/update/updateStringLiteral";
import * as findTemplateLiteralModule from "@ast/template-literal/find";
import * as templateLiteralModule from "@ast/template-literal/update/value/updateValue";
import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as getExistingClassesModule from "../utils/getExistingClasses";
import * as optimizeOutputClassesModule from "../utils/optimizeOutputClasses";
import { updateClass } from "./updateClass";

vi.mock("@ast/utils", () => ({
  manipulateFileAST: vi.fn(async (params, manipulator) => {
    const mockAST = {} as Module;
    const result = manipulator(mockAST);
    return { success: true, updatedAst: result };
  }),
}));

vi.mock("@ast/string-literal/update/updateStringLiteral", () => ({
  updateStringLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/find", () => ({
  findTemplateLiteralAtPosition: vi.fn(() => false),
}));

vi.mock("@ast/template-literal/update/value/updateValue", () => ({
  updateValue: vi.fn((ast: Module) => ast),
}));

vi.mock("../utils/getExistingClasses", () => ({
  getExistingClasses: vi.fn(() => ["existing-class"]),
}));

vi.mock("../utils/optimizeOutputClasses", () => ({
  optimizeOutputClasses: vi.fn(() => ({
    optimizedAdd: ["new-class"],
    optimizedRemove: ["old-class"],
  })),
}));

describe("updateClass", () => {
  const mockParams = {
    classesToAdd: ["new-class"],
    classesToRemove: ["old-class"],
    nodeStart: 10,
    projectId: "project123",
    fileId: "file123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update classes in StringLiteral", async () => {
    const result = await updateClass(mockParams);
    expect(result.success).toBe(true);
    expect(getExistingClassesModule.getExistingClasses).toHaveBeenCalled();
    expect(optimizeOutputClassesModule.optimizeOutputClasses).toHaveBeenCalled();
    expect(stringLiteralModule.updateStringLiteral).toHaveBeenCalled();
  });

  it("should update classes in TemplateLiteral when found", async () => {
    vi.mocked(findTemplateLiteralModule.findTemplateLiteralAtPosition).mockReturnValueOnce(true);
    const result = await updateClass(mockParams);
    expect(result.success).toBe(true);
    expect(templateLiteralModule.updateValue).toHaveBeenCalled();
  });

  it("should return AST unchanged when nodeStart is 0", async () => {
    const result = await updateClass({ ...mockParams, nodeStart: 0 });
    expect(result.success).toBe(true);
  });
});
