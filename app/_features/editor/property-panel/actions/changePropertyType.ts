import { updateInterfacePropertyType } from "@ast/interface";
import { ensureReactNodeImport } from "@ast/import/utils/ensureReactNodeImport";
import { manipulateFileAST } from "@ast/utils";
import { updateProperty } from "../services/updateProperty";
import { convertPropertyValue } from "../utils/convertPropertyType";

export async function changePropertyType(params: {
  propertyName: string;
  newType: string;
  unionOptions?: (string | number | boolean)[];
  currentValue: string | number | boolean | null | undefined;
  currentType: string;
  params: Record<string, any> | null | undefined;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const {
    propertyName,
    newType,
    unionOptions,
    currentValue,
    currentType,
    params: componentParams,
    projectId,
    fileId,
  } = params;

  // Convert "instance" to "ReactNode" for AST storage
  const astType = newType === "instance" ? "ReactNode" : newType;

  // Convert the value to the new type
  const convertedValue = convertPropertyValue(currentValue, currentType, newType as any);

  // Update the interface property type
  const result = await manipulateFileAST(
    { projectId, fileId },
    (ast) => {
      let updatedAst = updateInterfacePropertyType(ast, propertyName, astType, unionOptions);
      if (!updatedAst) {
        return null;
      }
      
      // If using ReactNode, ensure React import exists
      if (astType === "ReactNode") {
        updatedAst = ensureReactNodeImport(updatedAst);
      }
      
      return updatedAst;
    },
    {
      nullErrorMessage: `Could not find property ${propertyName} in interface`,
    }
  );

  if (!result.success) {
    return result;
  }

  // If there's a converted value and the property exists in params, update it
  if (convertedValue !== null && convertedValue !== undefined && componentParams?.[propertyName]) {
    const updateResult = await updateProperty({
      paramName: propertyName,
      newValue: convertedValue,
      paramType: newType,
      params: componentParams,
      projectId,
      fileId,
    });

    if (!updateResult?.success) {
      return { success: false, error: updateResult?.error || "Failed to update property value" };
    }
  }

  return { success: true };
}
