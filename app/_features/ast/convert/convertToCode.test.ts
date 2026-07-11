import { formatCode } from "@ast/format";
import type { Module } from "@swc/wasm-web";
import { printSync } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { convertToCode } from "./convertToCode";

vi.mock("@ast/format", () => ({
  formatCode: vi.fn(),
}));

vi.mock("@swc/wasm-web", () => ({
  printSync: vi.fn(),
}));

describe("convertToCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should convert AST to code and format it", async () => {
    const mockAST = { type: "Module", body: [] } as unknown as Module;
    const mockRawCode = "const x = 1;";
    const mockFormattedCode = "const x = 1;\n";

    vi.mocked(printSync).mockReturnValue({ code: mockRawCode, map: undefined });
    vi.mocked(formatCode).mockResolvedValue(mockFormattedCode);

    const result = await convertToCode(mockAST);

    expect(printSync).toHaveBeenCalledWith(mockAST, {
      jsc: {
        target: "es2020",
        parser: {
          syntax: "typescript",
          tsx: true,
        },
      },
    });
    expect(formatCode).toHaveBeenCalledWith(mockRawCode, undefined);
    expect(result).toBe(mockFormattedCode);
  });

  it("should pass format config to formatCode", async () => {
    const mockAST = { type: "Module", body: [] } as unknown as Module;
    const mockRawCode = "const x = 1;";
    const mockFormattedCode = "const x = 1;\n";
    const mockConfig = { lineWidth: 100 };

    vi.mocked(printSync).mockReturnValue({ code: mockRawCode, map: undefined });
    vi.mocked(formatCode).mockResolvedValue(mockFormattedCode);

    const result = await convertToCode(mockAST, mockConfig);

    expect(formatCode).toHaveBeenCalledWith(mockRawCode, mockConfig);
    expect(result).toBe(mockFormattedCode);
  });
});
