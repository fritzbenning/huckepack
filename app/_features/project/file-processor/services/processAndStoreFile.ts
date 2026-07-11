import { type PerformanceMetrics, setPerformanceMetrics, usePerformanceStore } from "@application/performance";
import { createTransformedAST } from "@ast/utils";
import { type ImportDefinition, updateProjectStore } from "@hub/projects";
import { parseAST } from "@project/ast-parser";
import { createAugmentedVersion } from "@project/ast-transformer";
import { updateFileStore } from "@project/file-manager";
import { toPascalSlug, toSlug } from "@shared/utils/format";
import type { Module } from "@swc/wasm-web";
import { convertBreakpointsToContainerQueries } from "../../ast-parser/utils/convertBreakpointsToContainerQueries";
import { getFilePath } from "../utils/getFilePath";
import { resolveFileDependencies } from "../utils/resolveFileDependencies";
import { processFile } from "./processFile";

export interface ProcessedAndStoredFileData {
  fileName?: string;
  sandpackFile?: Record<string, string>;
  path?: string;
  exportType?: string | null;
}

import type { Id } from "@convex/_generated/dataModel";

export async function processAndStoreFile(
  fileId: Id<"files">,
  fileName: string,
  code: string,
  projectId: Id<"projects">,
  lastEdit?: string | null,
  repositoryPath?: string | null,
  extension?: string,
  slug?: string,
  parsedAt?: number | null,
  viewportWidth?: number,
  providedAst?: Module | null
): Promise<ProcessedAndStoredFileData> {
  const startTime = performance.now();

  try {
    if (!code) {
      return {};
    }

    const fileSlug = slug || toSlug(fileName);
    const pascalSlug = toPascalSlug(fileName);

    let ast: Module;
    let path: string;
    let referenceCode: string;
    let codeToAST: number;

    if (providedAst) {
      path = getFilePath({ repository_path: repositoryPath, name: pascalSlug, extension: extension || "tsx" });
      referenceCode = convertBreakpointsToContainerQueries(code || "");
      ast = createTransformedAST(providedAst);
      codeToAST = 0;
    } else {
      const result = await processFile(pascalSlug, code, repositoryPath || null, extension);
      ast = result.ast;
      path = result.path;
      referenceCode = result.code;
      codeToAST = result.codeToAST;
    }

    const parseASTStart = performance.now();

    const {
      dependencies,
      fileDependencies,
      exportType,
      properties,
      params,
      layerTree,
      spanMap,
      parentSpanMap,
      componentMap,
      parseASTSteps,
    } = parseAST(ast, fileName, referenceCode, projectId, fileId, path);
    const parseASTEnd = performance.now();

    const augmentedVersion = createAugmentedVersion(ast, fileSlug, spanMap, componentMap);

    const processedCode = {
      reference: referenceCode,
      augmented: augmentedVersion.code,
      stateless: referenceCode,
      preview: referenceCode,
    };

    const finalPath = path;
    const parsedAtTimestamp = parsedAt ?? Date.now();
    const sandpackCode = processedCode.augmented ?? processedCode.reference;

    const fileOperationsStart = performance.now();

    updateFileStore(fileId, projectId, {
      name: fileName,
      slug: fileSlug,
      lastEdit: lastEdit ?? null,
      path: finalPath,
      code: processedCode,
      ast,
      layerTree,
      spanMap,
      parentSpanMap,
      extension: extension || "tsx",
      parsedAt: parsedAtTimestamp,
      viewportWidth,
      export: exportType && exportType !== "none" ? exportType : null,
      properties: properties ?? null,
      params: params ?? null,
      sandpackPath: finalPath,
      sandpackCode,
    });

    const resolvedFileIds = resolveFileDependencies(fileDependencies, { path: finalPath }, projectId);

    const importName = fileSlug;
    const route = { component: importName, path: finalPath, fileId };
    const importDef: ImportDefinition = { from: finalPath };

    switch (exportType) {
      case "default":
        importDef.default = importName;
        break;
      case "named":
        importDef.what = [importName];
        break;
      case "namespace":
        importDef.default = `* as ${importName}`;
        break;
      default:
        importDef.default = importName;
        break;
    }

    updateProjectStore(projectId, {
      fileDependencies: { fileId, dependentFileIds: resolvedFileIds },
      route,
      routerImport: importDef,
      dependencies: dependencies && dependencies.length > 0 ? dependencies : undefined,
    });

    const fileOperationsEnd = performance.now();

    const currentMetrics = usePerformanceStore.getState().metrics;

    setPerformanceMetrics({
      manipulationPhase: {
        codeToAST: codeToAST,
      },
      parsingPhase: {
        parseAST: parseASTEnd - parseASTStart,
        parseASTSteps: parseASTSteps,
      },
      savingPhase: {
        astToCode: {
          transformation: augmentedVersion.timing?.transformation ?? null,
          formatting: augmentedVersion.timing?.formatting ?? null,
        },
        indexedDBSave: fileOperationsEnd - fileOperationsStart,
        sandpackUpdate: null,
        databaseSave: currentMetrics.savingPhase.databaseSave,
      },
    } as Partial<PerformanceMetrics>);

    return { [finalPath]: sandpackCode };
  } catch (error) {
    const errorTime = performance.now() - startTime;
    console.error(`[processAndStoreFile] Error processing file ${fileId} after ${errorTime.toFixed(2)}ms:`, error);
    return {};
  }
}
