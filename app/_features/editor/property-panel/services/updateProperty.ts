import { mapTypeToLiteralType } from "@ast/literal/get/mapTypeToLiteralType";
import type { Id } from "@convex/_generated/dataModel";
import type { FormattedParam } from "@project/ast-parser";
import { getFile } from "@project/file-manager/stores/fileManagerStore";
import { isEmptyValue } from "@shared/utils/validation";
import { addDefaultValueToProperty } from "../actions/addDefaultValueToProperty";
import { removeDefaultValueFromProperty } from "../actions/removeDefaultValueFromProperty";
import { updateDefaultValueToProperty } from "../actions/updateDefaultValueToProperty";
import { convertValueToType } from "../utils/convertValueToType";
import { getParamsWithFallback } from "../utils/extractParamsFromAST";

export async function updateProperty(options: {
  paramName: string;
  newValue: string | number | boolean;
  paramType: string;
  params: Record<string, FormattedParam> | null | undefined;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string } | null> {
  const { paramName, newValue, paramType, params: paramsParam, projectId, fileId } = options;

  // Re-fetch file to get updated params (paramsParam might be stale after property changes)
  const file = getFile(fileId as Id<"files">, projectId as Id<"projects">);
  if (!file) {
    console.error(`File ${fileId} not found`);
    return null;
  }

  // Get params from file store, with fallback to extracting from AST if not found
  const params = await getParamsWithFallback(fileId, projectId, file.name, file.params || paramsParam);

  const param = params?.[paramName];

  if (!param) {
    console.error(`[updateProperty] Param ${paramName} not found in params:`, Object.keys(params || {}));
    return null;
  }

  const isEmpty = isEmptyValue(newValue);

  if (isEmpty && param.defaultValue !== null) {
    const fileName = file.name;

    const result = await removeDefaultValueFromProperty({
      paramName,
      fileName,
      projectId,
      fileId,
    });

    if (!result.success) {
      console.error(`Failed to remove default value from param ${paramName}:`, result.error);
    }

    return result;
  }

  if (isEmpty) {
    return { success: true };
  }

  const literalType = mapTypeToLiteralType(paramType);
  const convertedValue = convertValueToType(newValue, literalType);

  if (convertedValue === null) {
    return null;
  }

  if (param.defaultValue === null || !param.span || param.span.start === undefined) {
    const result = await addDefaultValueToProperty({
      paramName,
      newValue: convertedValue,
      type: literalType,
      projectId,
      fileId,
    });

    if (!result.success) {
      console.error(`Failed to add default value to param ${paramName}:`, result.error);
    }

    return result;
  }

  const result = await updateDefaultValueToProperty({
    paramName,
    newValue: convertedValue,
    type: literalType,
    projectId,
    fileId,
  });

  if (!result.success) {
    console.error(`Failed to update param ${paramName}:`, result.error);
  }

  return result;
}
