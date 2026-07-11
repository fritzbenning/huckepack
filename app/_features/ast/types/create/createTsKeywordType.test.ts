import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTsKeywordType } from "./createTsKeywordType";

// Mock dependencies
vi.mock("@ast/core/create/createSpan", () => ({
  createSpan: vi.fn(),
}));

describe("createTsKeywordType", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create string keyword type", async () => {
    const mockSpan = { start: 0, end: 6, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("string");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "string",
    });
    expect(createSpan).toHaveBeenCalledWith(6);
  });

  it("should create number keyword type", async () => {
    const mockSpan = { start: 0, end: 6, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("number");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "number",
    });
    expect(createSpan).toHaveBeenCalledWith(6);
  });

  it("should create boolean keyword type", async () => {
    const mockSpan = { start: 0, end: 7, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("boolean");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "boolean",
    });
    expect(createSpan).toHaveBeenCalledWith(7);
  });

  it("should create any keyword type", async () => {
    const mockSpan = { start: 0, end: 3, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("any");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "any",
    });
    expect(createSpan).toHaveBeenCalledWith(3);
  });

  it("should create unknown keyword type", async () => {
    const mockSpan = { start: 0, end: 7, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("unknown");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "unknown",
    });
    expect(createSpan).toHaveBeenCalledWith(7);
  });

  it("should create void keyword type", async () => {
    const mockSpan = { start: 0, end: 4, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("void");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "void",
    });
    expect(createSpan).toHaveBeenCalledWith(4);
  });

  it("should create null keyword type", async () => {
    const mockSpan = { start: 0, end: 4, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("null");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "null",
    });
    expect(createSpan).toHaveBeenCalledWith(4);
  });

  it("should create undefined keyword type", async () => {
    const mockSpan = { start: 0, end: 9, ctxt: 0 };
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsKeywordType("undefined");

    expect(result).toEqual({
      type: "TsKeywordType",
      span: mockSpan,
      kind: "undefined",
    });
    expect(createSpan).toHaveBeenCalledWith(9);
  });
});