import type { FormattedParam, Properties } from "@project/ast-parser";
import { useMemo } from "react";
import { addProperty } from "../actions/addProperty";
import { changePropertyOptionality } from "../actions/changePropertyOptionality";
import { changePropertyType } from "../actions/changePropertyType";
import { removeProperty } from "../actions/removeProperty";
import { renameProperty } from "../actions/renameProperty";
import { updateProperty } from "../services/updateProperty";
import { PROPERTY_TYPES } from "../utils/convertPropertyType";

interface UsePropertiesParams {
  projectId: string;
  fileId: string;
  properties: Properties | null | undefined;
  params: Record<string, FormattedParam> | null | undefined;
}

export function useProperties({ projectId, fileId, properties, params }: UsePropertiesParams) {
  const safeProperties = useMemo(
    () => Object.entries(properties || {}).filter(([name]) => !["onClick", "className"].includes(name)),
    [properties]
  );

  // Normalize type kind to match PROPERTY_TYPES values
  const normalizeTypeKind = (kind: string): string => {
    // If it's already a valid property type, return as-is
    if (PROPERTY_TYPES.some((pt) => pt.value === kind)) {
      return kind;
    }
    // Try to map common type patterns to our property types
    if (kind.toLowerCase() === "string" || kind.includes("String")) {
      return "string";
    }
    if (kind.toLowerCase() === "number" || kind.includes("Number")) {
      return "number";
    }
    if (kind.toLowerCase() === "boolean" || kind.includes("Boolean")) {
      return "boolean";
    }
    if (kind === "ReactNode" || kind === "React.ReactNode") {
      return "instance";
    }
    // Default to "string" for unknown types
    return "string";
  };

  const handleValueChange = async (paramName: string, newValue: string | number | boolean, paramType: string) => {
    await updateProperty({
      paramName,
      newValue,
      paramType,
      params,
      projectId,
      fileId,
    });
  };

  const handleTypeChange = async (propertyName: string, newType: string, currentType: string) => {
    const property = properties?.[propertyName];
    const param = params?.[propertyName];
    const currentValue = param?.defaultValue ?? null;

    // Convert unionOptions to the expected format (string | number | boolean)[]
    const unionOptions =
      newType === "union" && property?.type?.unionOptions
        ? property.type.unionOptions.filter((opt): opt is string | number => opt !== null)
        : undefined;

    await changePropertyType({
      propertyName,
      newType,
      unionOptions,
      currentValue,
      currentType,
      params,
      projectId,
      fileId,
    });
  };

  const handleRemoveProperty = async (propertyName: string) => {
    await removeProperty({
      propertyName,
      projectId,
      fileId,
    });
  };

  const handleRenameProperty = async (oldPropertyName: string, newPropertyName: string) => {
    if (oldPropertyName === newPropertyName || !newPropertyName.trim()) {
      return;
    }

    const result = await renameProperty({
      oldPropertyName,
      newPropertyName: newPropertyName.trim(),
      projectId,
      fileId,
    });

    if (!result.success) {
      console.error("Failed to rename property:", result.error);
    }
  };

  const handleOptionalityChange = async (propertyName: string, optional: boolean) => {
    const result = await changePropertyOptionality({
      propertyName,
      optional,
      projectId,
      fileId,
    });

    if (!result.success) {
      console.error("Failed to change property optionality:", result.error);
    }
  };

  const generateDefaultPropertyName = (): string => {
    const baseName = "property";
    const existingNames = new Set(Object.keys(properties || {}));

    if (!existingNames.has(baseName)) {
      return baseName;
    }

    let counter = 1;
    let candidateName = `${baseName}_${counter}`;
    while (existingNames.has(candidateName)) {
      counter++;
      candidateName = `${baseName}_${counter}`;
    }

    return candidateName;
  };

  const handleAddProperty = async () => {
    const propertyName = generateDefaultPropertyName();

    const result = await addProperty({
      propertyName,
      propertyType: "string",
      projectId,
      fileId,
    });

    if (!result.success) {
      console.error("Failed to add property:", result.error);
    }
  };

  return {
    // State
    safeProperties,
    // Handlers
    handleValueChange,
    handleTypeChange,
    handleRemoveProperty,
    handleRenameProperty,
    handleAddProperty,
    handleOptionalityChange,
    // Utilities
    normalizeTypeKind,
  };
}
