import { convertToAST } from "@ast/convert/convertToAST";
import { convertToCode } from "@ast/convert/convertToCode";
import type { Module } from "@swc/wasm-web";

type ASTManipulator = (ast: Module) => Module | null;

export interface ManipulateCodeASTResult {
  success: boolean;
  code?: string;
  error?: string;
}

export async function manipulateCodeAST(
  code: string,
  manipulator: ASTManipulator,
  options?: { nullErrorMessage?: string }
): Promise<ManipulateCodeASTResult> {
  try {
    const ast = await convertToAST(code);

    const updatedAst = manipulator(ast);

    if (!updatedAst) {
      return {
        success: false,
        error: options?.nullErrorMessage ?? "AST manipulation returned null",
      };
    }

    const updatedCode = await convertToCode(updatedAst);

    return {
      success: true,
      code: updatedCode,
    };
  } catch (error) {
    console.error("Error in code manipulation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to manipulate code",
    };
  }
}

