import { ensureReactNodeImport } from "@ast/import/utils/ensureReactNodeImport";
import { addInterfaceProperty } from "@ast/interface";
import { addParameter } from "@ast/parameter";
import { manipulateFileAST } from "@ast/utils";
import type { Id } from "@convex/_generated/dataModel";
import { getFile } from "@project/file-manager/stores/fileManagerStore";

export async function addProperty(params: {
  propertyName: string;
  propertyType: string;
  unionOptions?: (string | number | boolean)[];
  defaultValue?: string | number | boolean;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { propertyName, propertyType, unionOptions, defaultValue, projectId, fileId } = params;

  const file = getFile(fileId as Id<"files">, projectId);
  if (!file) {
    console.error("[addProperty] File not found", { fileId, projectId });
    return { success: false, error: `File ${fileId} not found` };
  }

  const fileName = file.name;

  // Convert "instance" to "ReactNode" for AST storage
  const astType = propertyType === "instance" ? "ReactNode" : propertyType;

  // Combine both operations into a single manipulateFileAST call
  // This ensures only one reprocessing step, avoiding double operations
  const result = await manipulateFileAST(
    { projectId, fileId },
    (ast) => {
      // First, add the interface property
      const interfaceResult = addInterfaceProperty(ast, propertyName, astType, unionOptions, false, fileName);
      if (!interfaceResult) {
        console.error("[addProperty] Failed to add interface property");
        return null;
      }

      // If using ReactNode, ensure React import exists
      let astWithImports = interfaceResult;
      if (astType === "ReactNode") {
        astWithImports = ensureReactNodeImport(interfaceResult);
      }

      // Then, add the parameter (this will also ensure restProps exists)
      const parameterResult = addParameter(astWithImports, fileName, propertyName, propertyType, defaultValue);
      if (!parameterResult) {
        console.error("[addProperty] Failed to add parameter");
        return null;
      }
      return parameterResult;
    },
    {
      nullErrorMessage: `Could not add property ${propertyName} to interface or function ${fileName}`,
    }
  );

  return result;
}
