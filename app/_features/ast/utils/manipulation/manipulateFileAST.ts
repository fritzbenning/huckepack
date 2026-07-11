import { setPerformanceMetrics } from "@application/performance";
import { convertToCode } from "@ast/convert/convertToCode";
import type { Id } from "@convex/_generated/dataModel";
import { saveFileCode } from "@project/file/actions/saveFileCode";
import { getFileAST, updateFileAST } from "@project/file-manager/stores/fileManagerStore";
import type { Module } from "@swc/wasm-web";

type ASTManipulator = (ast: Module) => Module | null;

export async function manipulateFileAST<T extends { fileId: string; projectId: string }>(
  params: T,
  manipulator: ASTManipulator,
  options?: { nullErrorMessage?: string }
): Promise<{ success: boolean; error?: string; updatedAst?: Module | null }> {
  try {
    const { fileId, projectId } = params;
    const codeToASTStart = performance.now();
    const ast = await getFileAST(fileId as Id<"files">, projectId as Id<"projects">);
    const codeToASTEnd = performance.now();
    const codeToASTDuration = ast ? codeToASTEnd - codeToASTStart : null;

    if (!ast) {
      return {
        success: false,
        error: `No AST found for file ${fileId} in project ${projectId}`,
      };
    }

    const startTime = performance.now();
    const updatedAst = manipulator(ast);
    const endTime = performance.now();
    const manipulationDuration = endTime - startTime;

    if (!updatedAst) {
      return {
        success: false,
        error: options?.nullErrorMessage ?? "AST manipulation returned null",
      };
    }

    updateFileAST(fileId as Id<"files">, updatedAst, projectId as Id<"projects">);

    const codeConversionStart = performance.now();
    const updatedCode = await convertToCode(updatedAst);
    const codeConversionEnd = performance.now();
    const codeConversionDuration = codeConversionEnd - codeConversionStart;

    setPerformanceMetrics({
      manipulationPhase: {
        codeToAST: codeToASTDuration,
        manipulation: manipulationDuration,
        astToCode: codeConversionDuration,
      },
    });

    await saveFileCode({
      projectId: projectId as Id<"projects">,
      fileId: fileId as Id<"files">,
      code: updatedCode,
      ast: updatedAst,
    });

    return { success: true, updatedAst };
  } catch (error) {
    console.error("Error in AST manipulation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to manipulate AST",
    };
  }
}
