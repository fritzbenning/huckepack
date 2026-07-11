import { convertToAST } from "@ast/convert";
import type { Module } from "@swc/wasm-web";
import { convertBreakpointsToContainerQueries } from "../../ast-parser/utils/convertBreakpointsToContainerQueries";
import { getFilePath } from "../utils/getFilePath";

export interface ProcessedFileData {
  code: string;
  ast: Module;
  path: string;
  codeToAST: number;
}

export async function processFile(
  name: string,
  code: string,
  repositoryPath?: string | null,
  extension?: string
): Promise<ProcessedFileData> {
  const path = getFilePath({ repository_path: repositoryPath, name, extension: extension || "tsx" });
  const processedCode = convertBreakpointsToContainerQueries(code || "");

  let ast: Module;

  try {
    const codeToASTStart = performance.now();
    ast = await convertToAST(processedCode);

    const codeToASTEnd = performance.now();
    const codeToASTDuration = codeToASTEnd - codeToASTStart;

    return {
      code: processedCode,
      ast,
      path,
      codeToAST: codeToASTDuration,
    };
  } catch (astError) {
    throw new Error(`Failed to parse AST for file ${name}: ${astError}`);
  }
}
