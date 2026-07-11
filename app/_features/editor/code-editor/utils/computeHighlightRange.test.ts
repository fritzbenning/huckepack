import type { FlatTreeNode } from "@editor/layer-tree";
import { describe, expect, it } from "vitest";
import { computeHighlightRange } from "./computeHighlightRange";

describe("computeHighlightRange", () => {
  const mockCode = "const Component = () => {\n  return <div>Hello</div>;\n};";
  const mockNodeData: FlatTreeNode = {
    title: "div",
    titlePrefix: "",
    attribute: "div",
    span: { start: 30, end: 45, ctxt: 0 },
    code: "<div>Hello</div>",
    classes: null,
    hidden: false,
    locked: false,
    isComponent: false,
    depth: 0,
  };

  it("should return null when selectedNodeData is null", () => {
    const result = computeHighlightRange(null, mockCode);
    expect(result).toBeNull();
  });

  it("should return null when code snippet is missing", () => {
    const nodeDataWithoutCode = { ...mockNodeData, code: undefined } as unknown as FlatTreeNode;
    const result = computeHighlightRange(nodeDataWithoutCode, mockCode);
    expect(result).toBeNull();
  });

  it("should return null when code snippet is empty", () => {
    const nodeDataWithEmptyCode = { ...mockNodeData, code: "" } as FlatTreeNode;
    const result = computeHighlightRange(nodeDataWithEmptyCode, mockCode);
    expect(result).toBeNull();
  });

  it("should find and return range when code snippet exists in code", () => {
    const result = computeHighlightRange(mockNodeData, mockCode);
    expect(result).not.toBeNull();
    expect(result?.from).toBeGreaterThanOrEqual(0);
    expect(result?.to).toBeGreaterThan(result?.from || 0);
    // Verify the range points to the correct code
    if (result && mockNodeData.code) {
      const highlightedCode = mockCode.slice(result.from, result.to);
      expect(highlightedCode.trim()).toBe(mockNodeData.code.trim());
    }
  });

  it("should return null when code snippet is not found", () => {
    const differentCode = "const Component = () => {\n  return <span>World</span>;\n};";
    const result = computeHighlightRange(mockNodeData, differentCode);
    expect(result).toBeNull();
  });

  it("should handle trimmed code snippets", () => {
    const code = "const Component = () => {\n  return <div>Hello</div>;\n};";
    const nodeDataWithSpaces: FlatTreeNode = {
      ...mockNodeData,
      code: "  <div>Hello</div>   ",
    };
    const result = computeHighlightRange(nodeDataWithSpaces, code);
    expect(result).not.toBeNull();
    if (result) {
      const highlightedCode = code.slice(result.from, result.to);
      expect(highlightedCode.trim()).toBe("<div>Hello</div>");
    }
  });

  it("should handle code snippet at the start of file", () => {
    const code = "<div>Start</div>\nconst x = 1;";
    const nodeData: FlatTreeNode = {
      ...mockNodeData,
      code: "<div>Start</div>",
    };
    const result = computeHighlightRange(nodeData, code);
    expect(result).toEqual({ from: 0, to: "<div>Start</div>".length });
  });

  it("should handle code snippet at the end of file", () => {
    const code = "const x = 1;\n<div>End</div>";
    const nodeData: FlatTreeNode = {
      ...mockNodeData,
      code: "<div>End</div>",
    };
    const result = computeHighlightRange(nodeData, code);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.to).toBe(code.length);
    }
  });
});
