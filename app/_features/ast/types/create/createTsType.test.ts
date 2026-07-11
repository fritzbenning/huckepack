import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTsType, createTsUnionType } from "./createTsType";

// Mock dependencies
vi.mock("@ast/core/create/createSpan", () => ({
  createSpan: vi.fn(),
}));

vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: vi.fn(),
}));

vi.mock("./createTsKeywordType", () => ({
  createTsKeywordType: vi.fn(),
}));

describe("createTsType", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create keyword type for string", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 6, ctxt: 0 },
      kind: "string" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("string");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("string");
  });

  it("should create keyword type for number", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 6, ctxt: 0 },
      kind: "number" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("number");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("number");
  });

  it("should create keyword type for boolean", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 7, ctxt: 0 },
      kind: "boolean" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("boolean");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("boolean");
  });

  it("should create keyword type for any", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 3, ctxt: 0 },
      kind: "any" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("any");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("any");
  });

  it("should create keyword type for unknown", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 7, ctxt: 0 },
      kind: "unknown" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("unknown");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("unknown");
  });

  it("should create keyword type for void", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 4, ctxt: 0 },
      kind: "void" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("void");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("void");
  });

  it("should create keyword type for null", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 4, ctxt: 0 },
      kind: "null" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("null");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("null");
  });

  it("should create keyword type for undefined", async () => {
    const mockKeywordType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 9, ctxt: 0 },
      kind: "undefined" as const,
    };

    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));
    createTsKeywordType.mockReturnValue(mockKeywordType);

    const result = createTsType("undefined");

    expect(result).toBe(mockKeywordType);
    expect(createTsKeywordType).toHaveBeenCalledWith("undefined");
  });

  it("should create type reference for custom type", async () => {
    const mockSpan = { start: 0, end: 11, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "CustomType",
      span: mockSpan,
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    const result = createTsType("CustomType");

    expect(result).toEqual({
      type: "TsTypeReference",
      span: mockSpan,
      typeName: mockIdentifier,
    });
    expect(createSpan).toHaveBeenCalledWith(10);
    expect(createIdentifier).toHaveBeenCalledWith("CustomType");
  });

  it("should create type reference for React.ReactNode", async () => {
    const mockSpan = { start: 0, end: 16, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "React.ReactNode",
      span: mockSpan,
      optional: false,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    const result = createTsType("React.ReactNode");

    expect(result).toEqual({
      type: "TsTypeReference",
      span: mockSpan,
      typeName: mockIdentifier,
    });
    expect(createSpan).toHaveBeenCalledWith(15);
    expect(createIdentifier).toHaveBeenCalledWith("React.ReactNode");
  });
});

describe("createTsUnionType", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create union type with multiple string types", async () => {
    const mockSpan = { start: 0, end: 0, ctxt: 0 };
    const mockStringType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 6, ctxt: 0 },
      kind: "string" as const,
    };
    const mockNumberType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 6, ctxt: 0 },
      kind: "number" as const,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));

    createSpan.mockReturnValue(mockSpan);
    createTsKeywordType.mockReturnValueOnce(mockStringType).mockReturnValueOnce(mockNumberType);

    const result = createTsUnionType(["string", "number"]);

    expect(result).toEqual({
      type: "TsUnionType",
      span: mockSpan,
      types: [mockStringType, mockNumberType],
    });
    expect(createSpan).toHaveBeenCalledWith(0);
  });

  it("should create union type with custom types", async () => {
    const mockSpan = { start: 0, end: 0, ctxt: 0 };
    const mockCustomType1 = {
      type: "TsTypeReference",
      span: { start: 0, end: 5, ctxt: 0 },
      typeName: {
        type: "Identifier" as const,
        value: "TypeA",
        span: { start: 0, end: 5, ctxt: 0 },
        optional: false,
      },
    };
    const mockCustomType2 = {
      type: "TsTypeReference",
      span: { start: 0, end: 5, ctxt: 0 },
      typeName: {
        type: "Identifier" as const,
        value: "TypeB",
        span: { start: 0, end: 5, ctxt: 0 },
        optional: false,
      },
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValueOnce(mockCustomType1.typeName).mockReturnValueOnce(mockCustomType2.typeName);

    const result = createTsUnionType(["TypeA", "TypeB"]);

    expect(result).toEqual({
      type: "TsUnionType",
      span: mockSpan,
      types: [mockCustomType1, mockCustomType2],
    });
  });

  it("should create union type with single type", async () => {
    const mockSpan = { start: 0, end: 0, ctxt: 0 };
    const mockBooleanType = {
      type: "TsKeywordType" as const,
      span: { start: 0, end: 7, ctxt: 0 },
      kind: "boolean" as const,
    };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createTsKeywordType } = vi.mocked(await import("./createTsKeywordType"));

    createSpan.mockReturnValue(mockSpan);
    createTsKeywordType.mockReturnValue(mockBooleanType);

    const result = createTsUnionType(["boolean"]);

    expect(result).toEqual({
      type: "TsUnionType",
      span: mockSpan,
      types: [mockBooleanType],
    });
  });

  it("should create union type with empty array", async () => {
    const mockSpan = { start: 0, end: 0, ctxt: 0 };

    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    createSpan.mockReturnValue(mockSpan);

    const result = createTsUnionType([]);

    expect(result).toEqual({
      type: "TsUnionType",
      span: mockSpan,
      types: [],
    });
  });
});
