import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClassName } from "./createClassName";
import * as jsxModule from "@ast/jsx";
import * as stringLiteralModule from "@ast/string-literal/update";
import * as templateLiteralModule from "@ast/template-literal/update/value";
import * as findTemplateLiteralModule from "@ast/template-literal/find";
import * as canvasModule from "@editor/canvas";
import * as fileManagerModule from "@project/file-manager";

vi.mock("@ast/jsx", () => ({
  addClassNameAttributeToJSXElement: vi.fn(() => ({ ast: {} as Module })),
}));

vi.mock("@ast/string-literal/update", () => ({
  addValueToStringLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("@ast/template-literal/find", () => ({
  findTemplateLiteralAtPosition: vi.fn(() => false),
}));

vi.mock("@ast/template-literal/update/value", () => ({
  addValueToTemplateLiteral: vi.fn((ast: Module) => ast),
}));

vi.mock("@editor/canvas", () => ({
  getSelectedNode: vi.fn(() => "node123"),
}));

vi.mock("@project/file-manager", () => ({
  getFileLayerTree: vi.fn(() => ({
    flat: {
      node123: {
        span: { start: 10, end: 20 },
        classes: null,
      },
    },
  })),
}));

describe("createClassName", () => {
  const mockAST = {} as Module;
  const mockProjectId = "project123";
  const mockFileId = "file123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add className attribute to JSX element when no classes exist", () => {
    const result = createClassName(mockAST, "new-class", mockProjectId, mockFileId);
    expect(result).toBeDefined();
    expect(jsxModule.addClassNameAttributeToJSXElement).toHaveBeenCalled();
  });

  it("should add class to existing StringLiteral className", () => {
    vi.mocked(fileManagerModule.getFileLayerTree).mockReturnValueOnce({
      flat: {
        node123: {
          span: { start: 10, end: 20 },
          classes: {
            span: { start: 15, end: 25 },
          },
        },
      },
    });

    const result = createClassName(mockAST, "new-class", mockProjectId, mockFileId);
    expect(result).toBeDefined();
    expect(stringLiteralModule.addValueToStringLiteral).toHaveBeenCalled();
  });

  it("should add class to existing TemplateLiteral className", () => {
    vi.mocked(fileManagerModule.getFileLayerTree).mockReturnValueOnce({
      flat: {
        node123: {
          span: { start: 10, end: 20 },
          classes: {
            span: { start: 15, end: 25 },
          },
        },
      },
    });
    vi.mocked(findTemplateLiteralModule.findTemplateLiteralAtPosition).mockReturnValueOnce(true);

    const result = createClassName(mockAST, "new-class", mockProjectId, mockFileId);
    expect(result).toBeDefined();
    expect(templateLiteralModule.addValueToTemplateLiteral).toHaveBeenCalled();
  });

  it("should return AST unchanged when no selected node", () => {
    vi.mocked(canvasModule.getSelectedNode).mockReturnValueOnce(null);
    const result = createClassName(mockAST, "new-class", mockProjectId, mockFileId);
    expect(result).toBe(mockAST);
  });

  it("should return AST unchanged when node data not found", () => {
    vi.mocked(fileManagerModule.getFileLayerTree).mockReturnValueOnce({
      flat: {},
    });
    const result = createClassName(mockAST, "new-class", mockProjectId, mockFileId);
    expect(result).toBe(mockAST);
  });

  it("should return AST unchanged when node data has no span", () => {
    vi.mocked(fileManagerModule.getFileLayerTree).mockReturnValueOnce({
      flat: {
        node123: {},
      },
    });
    const result = createClassName(mockAST, "new-class", mockProjectId, mockFileId);
    expect(result).toBe(mockAST);
  });
});

