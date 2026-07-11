import type { StringLiteral } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { processStringLiteral } from "./processStringLiteral";

vi.mock("@ast/string-literal/format", () => ({
  splitStringLiteral: vi.fn((value: string) => value.split(" ").filter(Boolean)),
}));

describe("processStringLiteral", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process StringLiteral and return StringLiteralClasses", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 10, end: 30, ctxt: 0 },
      value: "class1 class2 class3",
      raw: '"class1 class2 class3"',
    };

    const result = processStringLiteral(node);

    expect(result).toEqual({
      type: "StringLiteral",
      classTokens: ["class1", "class2", "class3"],
      value: "class1 class2 class3",
      span: { start: 10, end: 30, ctxt: 0 },
    });
  });

  it("should preserve span information", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 100, end: 200, ctxt: 0 },
      value: "test",
      raw: '"test"',
    };

    const result = processStringLiteral(node);

    expect(result.span).toEqual({ start: 100, end: 200, ctxt: 0 });
  });
});
