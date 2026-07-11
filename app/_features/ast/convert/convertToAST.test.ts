import { initSWC } from "@hooks/application/useSWC";
import type { Module } from "@swc/wasm-web";
import { parseSync } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { convertToAST } from "./convertToAST";

vi.mock("@hooks/application/useSWC", () => ({
  initSWC: vi.fn(),
}));

vi.mock("@swc/wasm-web", () => ({
  parseSync: vi.fn(),
}));

describe("convertToAST", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize SWC and parse code into AST", async () => {
    const mockCode = "const x = 1;";
    const mockAST = { type: "Module", body: [] } as unknown as Module;

    vi.mocked(parseSync).mockReturnValue(mockAST);

    const result = await convertToAST(mockCode);

    expect(initSWC).toHaveBeenCalled();
    expect(parseSync).toHaveBeenCalledWith(mockCode, {
      syntax: "typescript",
      tsx: true,
      comments: false,
      target: "es2020",
    });
    expect(result).toBe(mockAST);
  });

  it("should handle errors from initSWC", async () => {
    vi.mocked(initSWC).mockRejectedValue(new Error("Init failed"));

    await expect(convertToAST("code")).rejects.toThrow("Init failed");
  });

  it("should handle errors from parseSync", async () => {
    vi.mocked(parseSync).mockImplementation(() => {
      throw new Error("Parse failed");
    });

    await expect(convertToAST("code")).rejects.toThrow("Parse failed");
  });
});
