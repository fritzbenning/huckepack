import type { JSXElement, JSXElementChild } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { moveJSXElementInParent } from "./moveJSXElementInParent";

// Mock dependencies
vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn(),
}));

vi.mock("@ast/jsx", () => ({
  findSiblingIndexBySpan: vi.fn(),
}));

vi.mock("./findNextJSXSibling", () => ({
  findNextJSXSibling: vi.fn(),
}));

describe("moveJSXElementInParent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should move element up successfully", async () => {
    const mockChild1 = {
      type: "JSXElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild2 = {
      type: "JSXElement" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 26, end: 29, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild3 = {
      type: "JSXElement" as const,
      span: { start: 40, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 40, end: 45, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 41, end: 44, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [mockChild1, mockChild2, mockChild3],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));
    const { findNextJSXSibling } = vi.mocked(await import("./findNextJSXSibling"));

    getSpan.mockReturnValue({ start: 0, end: 60, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(2); // Moving child3 (index 2)
    findNextJSXSibling.mockReturnValue(1); // Target position is index 1

    const result = moveJSXElementInParent(mockParent, 40, 0, 2, "up");

    expect(result).toEqual({ moved: true, newSiblingIndex: 1 });
    expect(mockParent.children).toEqual([mockChild1, mockChild3, mockChild2]);
    expect(getSpan).toHaveBeenCalledWith(mockParent);
    expect(findSiblingIndexBySpan).toHaveBeenCalledWith(mockParent, 40);
    expect(findNextJSXSibling).toHaveBeenCalledWith(mockParent.children, 2, "up");
  });

  it("should move element down successfully", async () => {
    const mockChild1 = {
      type: "JSXElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild2 = {
      type: "JSXElement" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 26, end: 29, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild3 = {
      type: "JSXElement" as const,
      span: { start: 40, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 40, end: 45, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 41, end: 44, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [mockChild1, mockChild2, mockChild3],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));
    const { findNextJSXSibling } = vi.mocked(await import("./findNextJSXSibling"));

    getSpan.mockReturnValue({ start: 0, end: 60, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(0); // Moving child1 (index 0)
    findNextJSXSibling.mockReturnValue(2); // Target position is index 2

    const result = moveJSXElementInParent(mockParent, 10, 0, 0, "down");

    expect(result).toEqual({ moved: true, newSiblingIndex: 1 });
    expect(mockParent.children).toEqual([mockChild2, mockChild3, mockChild1]);
    expect(findNextJSXSibling).toHaveBeenCalledWith(mockParent.children, 0, "down");
  });

  it("should return false when parent span doesn't match", async () => {
    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 999, end: 1060, ctxt: 0 }, // Different span
      opening: {
        type: "JSXOpeningElement",
        span: { start: 999, end: 1005, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1000, end: 1003, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 1055, end: 1060, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1057, end: 1060, ctxt: 1 }, optional: false },
      },
      children: [],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));

    getSpan.mockReturnValue({ start: 999, end: 1060, ctxt: 0 });

    const result = moveJSXElementInParent(mockParent, 40, 0, 2, "up");

    expect(result).toEqual({ moved: false, newSiblingIndex: null });
  });

  it("should return false when element is not found in parent", async () => {
    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));

    getSpan.mockReturnValue({ start: 0, end: 60, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(-1); // Element not found

    const result = moveJSXElementInParent(mockParent, 999, 0, 2, "up");

    expect(result).toEqual({ moved: false, newSiblingIndex: null });
    expect(findSiblingIndexBySpan).toHaveBeenCalledWith(mockParent, 999);
  });

  it("should return false when no target sibling found", async () => {
    const mockChild1 = {
      type: "JSXElement",
      span: { start: 10, end: 20, ctxt: 0 },
    };

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [mockChild1 as unknown as JSXElementChild],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));
    const { findNextJSXSibling } = vi.mocked(await import("./findNextJSXSibling"));

    getSpan.mockReturnValue({ start: 0, end: 60, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(0);
    findNextJSXSibling.mockReturnValue(-1); // No sibling found

    const result = moveJSXElementInParent(mockParent, 10, 0, 0, "up");

    expect(result).toEqual({ moved: false, newSiblingIndex: null });
    expect(findNextJSXSibling).toHaveBeenCalledWith(mockParent.children, 0, "up");
  });

  it("should handle moving first element down", async () => {
    const mockChild1 = {
      type: "JSXElement",
      span: { start: 10, end: 20, ctxt: 0 },
    };
    const mockChild2 = {
      type: "JSXElement",
      span: { start: 25, end: 35, ctxt: 0 },
    };

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [mockChild1, mockChild2] as unknown as JSXElementChild[],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));
    const { findNextJSXSibling } = vi.mocked(await import("./findNextJSXSibling"));

    getSpan.mockReturnValue({ start: 0, end: 60, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(0);
    findNextJSXSibling.mockReturnValue(1);

    const result = moveJSXElementInParent(mockParent, 10, 0, 0, "down");

    expect(result).toEqual({ moved: true, newSiblingIndex: 1 });
    expect(mockParent.children).toEqual([mockChild2, mockChild1]);
  });

  it("should handle moving last element up", async () => {
    const mockChild1 = {
      type: "JSXElement",
      span: { start: 10, end: 20, ctxt: 0 },
    };
    const mockChild2 = {
      type: "JSXElement",
      span: { start: 25, end: 35, ctxt: 0 },
    };

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [mockChild1, mockChild2] as unknown as JSXElementChild[],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));
    const { findNextJSXSibling } = vi.mocked(await import("./findNextJSXSibling"));

    getSpan.mockReturnValue({ start: 0, end: 60, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(1);
    findNextJSXSibling.mockReturnValue(0);

    const result = moveJSXElementInParent(mockParent, 25, 0, 1, "up");

    expect(result).toEqual({ moved: true, newSiblingIndex: 0 });
    expect(mockParent.children).toEqual([mockChild2, mockChild1]);
  });

  it("should handle complex move with multiple elements", async () => {
    const mockChild1 = {
      type: "JSXElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild2 = {
      type: "JSXElement" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 26, end: 29, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild3 = {
      type: "JSXElement" as const,
      span: { start: 40, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 40, end: 45, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 41, end: 44, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild4 = {
      type: "JSXElement" as const,
      span: { start: 55, end: 65, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 56, end: 59, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild5 = {
      type: "JSXElement" as const,
      span: { start: 70, end: 80, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 70, end: 75, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 71, end: 74, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 90, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 85, end: 90, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 87, end: 90, ctxt: 1 }, optional: false },
      },
      children: [mockChild1, mockChild2, mockChild3, mockChild4, mockChild5] as unknown as JSXElementChild[],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { findSiblingIndexBySpan } = vi.mocked(await import("@ast/jsx"));
    const { findNextJSXSibling } = vi.mocked(await import("./findNextJSXSibling"));

    getSpan.mockReturnValue({ start: 0, end: 90, ctxt: 0 });
    findSiblingIndexBySpan.mockReturnValue(2); // Moving child3 (index 2)
    findNextJSXSibling.mockReturnValue(4); // Target position is index 4

    const result = moveJSXElementInParent(mockParent, 40, 0, 2, "down");

    expect(result).toEqual({ moved: true, newSiblingIndex: 3 });
    expect(mockParent.children).toEqual([mockChild1, mockChild2, mockChild4, mockChild5, mockChild3]);
  });

  it("should preserve original array when move fails", async () => {
    const mockChild1 = {
      type: "JSXElement" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const mockChild2 = {
      type: "JSXElement" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 26, end: 29, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: undefined,
      children: [],
    };
    const originalChildren = [mockChild1, mockChild2];

    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 60, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 55, end: 60, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 57, end: 60, ctxt: 1 }, optional: false },
      },
      children: [...originalChildren] as unknown as JSXElementChild[],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));

    getSpan.mockReturnValue({ start: 999, end: 1060, ctxt: 0 }); // Wrong span

    const result = moveJSXElementInParent(mockParent, 10, 0, 0, "down");

    expect(result).toEqual({ moved: false, newSiblingIndex: null });
    expect(mockParent.children).toEqual(originalChildren); // Should remain unchanged
  });
});
