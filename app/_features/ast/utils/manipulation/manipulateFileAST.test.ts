import { convertToCode } from "@ast/convert/convertToCode";
import { saveFileCode } from "@project/file/actions/saveFileCode";
import { getFileAST, updateFileAST } from "@project/file-manager/stores/fileManagerStore";
import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { manipulateFileAST } from "./manipulateFileAST";

vi.mock("@project/file-manager/stores/fileManagerStore");
vi.mock("@ast/convert/convertToCode");
vi.mock("@project/file/actions/saveFileCode");

describe("manipulateFileAST", () => {
  const mockFileId = "file123";
  const mockProjectId = "project123";
  const mockAST = { type: "Module", body: [] } as unknown as Module;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when AST is not found", async () => {
    vi.mocked(getFileAST).mockReturnValue(null);

    const result = await manipulateFileAST({ fileId: mockFileId, projectId: mockProjectId }, (ast) => ast);

    expect(result.success).toBe(false);
    expect(result.error).toContain("No AST found");
  });

  it("should successfully manipulate AST and save code", async () => {
    const mockUpdatedAST = { type: "Module", body: [] } as unknown as Module;
    const mockCode = "const updated = true;";

    vi.mocked(getFileAST).mockReturnValue(mockAST);
    vi.mocked(convertToCode).mockResolvedValue(mockCode);
    vi.mocked(saveFileCode).mockResolvedValue(undefined);

    const manipulator = vi.fn((ast: Module) => {
      expect(ast).toBe(mockAST);
      return mockUpdatedAST;
    });

    const result = await manipulateFileAST({ fileId: mockFileId, projectId: mockProjectId }, manipulator);

    expect(result.success).toBe(true);
    expect(result.updatedAst).toBe(mockUpdatedAST);
    expect(manipulator).toHaveBeenCalledWith(mockAST);
    expect(updateFileAST).toHaveBeenCalledWith(mockFileId, mockUpdatedAST, mockProjectId);
    expect(convertToCode).toHaveBeenCalledWith(mockUpdatedAST);
    expect(saveFileCode).toHaveBeenCalledWith({
      projectId: mockProjectId,
      fileId: mockFileId,
      code: mockCode,
    });
  });

  it("should return error when manipulator returns null", async () => {
    vi.mocked(getFileAST).mockReturnValue(mockAST);

    const result = await manipulateFileAST({ fileId: mockFileId, projectId: mockProjectId }, () => null);

    expect(result.success).toBe(false);
    expect(result.error).toBe("AST manipulation returned null");
  });

  it("should use custom error message when manipulator returns null", async () => {
    vi.mocked(getFileAST).mockReturnValue(mockAST);

    const result = await manipulateFileAST({ fileId: mockFileId, projectId: mockProjectId }, () => null, {
      nullErrorMessage: "Custom error message",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Custom error message");
  });

  it("should handle errors during manipulation", async () => {
    vi.mocked(getFileAST).mockReturnValue(mockAST);
    vi.mocked(convertToCode).mockRejectedValue(new Error("Conversion failed"));

    const result = await manipulateFileAST({ fileId: mockFileId, projectId: mockProjectId }, (ast) => ast);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Conversion failed");
  });
});
