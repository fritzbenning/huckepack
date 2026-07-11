import type { JSXAttribute, JSXAttributeOrSpread, JSXOpeningElement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addPropsSpread } from "./addPropsSpread";

// Mock dependencies
vi.mock("@ast/core/create/createSpan", () => ({
  createSpan: vi.fn(),
}));

vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: vi.fn(),
}));

describe("addPropsSpread", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should add props spread when none exists", async () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 10, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "props",
      span: { start: 0, end: 5, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening);

    expect(mockOpening.attributes).toHaveLength(1);
    expect(mockOpening.attributes[0]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
    expect(createSpan).toHaveBeenCalledWith(3);
    expect(createIdentifier).toHaveBeenCalledWith("props", 3);
  });

  it("should add custom prop name spread", async () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 10, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "customProps",
      span: { start: 0, end: 11, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening, "customProps");

    expect(mockOpening.attributes).toHaveLength(1);
    expect(mockOpening.attributes[0]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
    expect(createIdentifier).toHaveBeenCalledWith("customProps", 3);
  });

  it("should not add spread when identical spread already exists", async () => {
    const existingSpread = {
      type: "SpreadElement" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      spread: { start: 0, end: 0, ctxt: 0 },
      arguments: {
        type: "Identifier" as const,
        value: "props",
        span: { start: 0, end: 5, ctxt: 1 },
        optional: false,
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingSpread as unknown as JSXAttributeOrSpread],
      selfClosing: false,
    };

    addPropsSpread(mockOpening, "props");

    expect(mockOpening.attributes).toHaveLength(1);
    expect(mockOpening.attributes[0]).toBe(existingSpread);
  });

  it("should not add spread when similar spread exists (case insensitive)", async () => {
    const existingSpread = {
      type: "SpreadElement" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      spread: { start: 0, end: 0, ctxt: 0 },
      arguments: {
        type: "Identifier" as const,
        value: "Props",
        span: { start: 0, end: 5, ctxt: 1 },
        optional: false,
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingSpread as unknown as JSXAttributeOrSpread],
      selfClosing: false,
    };

    addPropsSpread(mockOpening, "props");

    expect(mockOpening.attributes).toHaveLength(1);
    expect(mockOpening.attributes[0]).toBe(existingSpread);
  });

  it("should not add spread when props-containing spread exists", async () => {
    const existingSpread = {
      type: "SpreadElement" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      spread: { start: 0, end: 0, ctxt: 0 },
      arguments: {
        type: "Identifier" as const,
        value: "restProps",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingSpread as unknown as JSXAttributeOrSpread],
      selfClosing: false,
    };

    addPropsSpread(mockOpening, "props");

    expect(mockOpening.attributes).toHaveLength(1);
    expect(mockOpening.attributes[0]).toBe(existingSpread);
  });

  it("should add spread when existing attributes are not spreads", async () => {
    const existingAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 5, end: 25, ctxt: 0 },
      name: { type: "Identifier" as const, value: "className", span: { start: 5, end: 14, ctxt: 1 }, optional: false },
      value: {
        type: "StringLiteral" as const,
        span: { start: 15, end: 25, ctxt: 0 },
        value: "container",
        raw: '"container"',
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingAttribute],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "props",
      span: { start: 0, end: 5, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening);

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[0]).toBe(existingAttribute);
    expect(mockOpening.attributes[1]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
  });

  it("should handle spread element without arguments property", async () => {
    const existingSpread = {
      type: "SpreadElement" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      spread: { start: 0, end: 0, ctxt: 0 },
      arguments: {
        type: "Identifier" as const,
        value: "placeholder",
        span: { start: 0, end: 10, ctxt: 1 },
        optional: false,
      },
    } as unknown as {
      type: "SpreadElement";
      span: { start: number; end: number; ctxt: number };
      spread: { start: number; end: number; ctxt: number };
      arguments: undefined;
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingSpread as unknown as JSXAttributeOrSpread],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "props",
      span: { start: 0, end: 5, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening);

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[1]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
  });

  it("should handle spread element with non-Identifier arguments", async () => {
    const existingSpread = {
      type: "SpreadElement" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      spread: { start: 0, end: 0, ctxt: 0 },
      arguments: {
        type: "CallExpression" as const,
        span: { start: 0, end: 0, ctxt: 0 },
        callee: {
          type: "Identifier" as const,
          value: "getProps",
          span: { start: 0, end: 8, ctxt: 1 },
          optional: false,
        },
        arguments: [],
      },
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingSpread as unknown as JSXAttributeOrSpread],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "props",
      span: { start: 0, end: 5, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening);

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[1]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
  });

  it("should handle spread element with null arguments", async () => {
    const existingSpread = {
      type: "SpreadElement" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      spread: { start: 0, end: 0, ctxt: 0 },
      arguments: {
        type: "Identifier" as const,
        value: "placeholder",
        span: { start: 0, end: 10, ctxt: 1 },
        optional: false,
      },
    } as unknown as {
      type: "SpreadElement";
      span: { start: number; end: number; ctxt: number };
      spread: { start: number; end: number; ctxt: number };
      arguments: null;
    };

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [existingSpread as unknown as JSXAttributeOrSpread],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "props",
      span: { start: 0, end: 5, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening);

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[1]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
  });

  it("should handle mixed attribute types", async () => {
    const jsxAttribute = {
      type: "JSXAttribute" as const,
      span: { start: 5, end: 15, ctxt: 0 },
      name: { type: "Identifier" as const, value: "id", span: { start: 5, end: 7, ctxt: 1 }, optional: false },
      value: {
        type: "StringLiteral" as const,
        span: { start: 8, end: 15, ctxt: 0 },
        value: "test",
        raw: '"test"',
      },
    };

    const jsxSpreadAttribute = {
      type: "JSXSpreadAttribute" as const,
      span: { start: 16, end: 25, ctxt: 0 },
      argument: {
        type: "Identifier" as const,
        value: "otherProps",
        span: { start: 19, end: 29, ctxt: 1 },
        optional: false,
      },
    } as unknown as JSXAttribute;

    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [jsxAttribute, jsxSpreadAttribute],
      selfClosing: false,
    };

    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "props",
      span: { start: 0, end: 5, ctxt: 1 },
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    addPropsSpread(mockOpening);

    expect(mockOpening.attributes).toHaveLength(3);
    expect(mockOpening.attributes[2]).toEqual({
      type: "SpreadElement",
      spread: mockSpan,
      arguments: mockIdentifier,
    });
  });
});
