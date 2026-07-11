import type { TestValueSegmentsWithHandlers } from "@editor/class-inspector/types";
import { useFileManagerStore } from "@project/file-manager";
import { convertType } from "@shared/utils/type-handling";
import type { ConditionalExpressionSegment } from "../../class-manager/types";
import { DEFINED_CHECK_OPERATORS } from "../constants";
import { handleTemplateLiteralTest } from "../services/handleTemplateLiteralTest";
import type { Operator, PropertyType } from "../types";
import { getPropertyTypeConversion } from "../utils/getPropertyTypeConversion";
import { getTestValueForOperator } from "../utils/getTestValueForOperator";
import { useConditionNormalization } from "./useConditionNormalization";
import { usePropertyType } from "./usePropertyType";

export function useTemplateLiteralTest(
  segment: ConditionalExpressionSegment,
  projectId: string,
  fileId: string
): TestValueSegmentsWithHandlers {
  const { property, operator, testValue, span } = segment.test;

  const properties = useFileManagerStore((state) => state.files[fileId]?.properties, projectId);
  const propertyType = usePropertyType(properties, property);

  const { isDefinedCheck, isBooleanType, conditionState, normalizedTestValue, normalizedOperator } =
    useConditionNormalization({
      propertyType: propertyType as PropertyType,
      operator: operator as Operator,
      testValue,
      property,
      span,
      projectId,
      fileId,
    });

  const updateProperty = (newProperty: string) => {
    if (newProperty && properties) {
      const newPropertyType = properties[newProperty]?.type?.kind as PropertyType;

      const conversion = getPropertyTypeConversion(
        propertyType as PropertyType,
        newPropertyType,
        operator as Operator,
        testValue,
        conditionState
      );
      if (newProperty && conversion.operator) {
        handleTemplateLiteralTest(projectId, fileId, span, newProperty, conversion.operator, conversion.testValue);
      }
    }
  };

  const updateOperator = (newOperator: string) => {
    if (property && newOperator) {
      if (DEFINED_CHECK_OPERATORS.includes(newOperator)) {
        handleTemplateLiteralTest(projectId, fileId, span, property, newOperator, "");
      } else {
        const newTestValue = getTestValueForOperator(operator, newOperator, propertyType, normalizedTestValue);
        handleTemplateLiteralTest(projectId, fileId, span, property, newOperator, newTestValue);
      }
    }
  };

  const updateTestValue = (newTestValue: string) => {
    if (property && newTestValue) {
      if (isBooleanType) {
        // For boolean types, convert true/false to &&/!&& operators
        const booleanValue = convertType(newTestValue, propertyType) as boolean;
        const booleanOperator = booleanValue ? "&&" : "!&&";
        handleTemplateLiteralTest(projectId, fileId, span, property, booleanOperator, "");
      } else if (operator && !isDefinedCheck) {
        const rightValue = convertType(newTestValue, propertyType);
        handleTemplateLiteralTest(projectId, fileId, span, property, operator, rightValue);
      }
    }
  };

  return {
    property,
    propertyType,
    operator: normalizedOperator,
    testValue: normalizedTestValue,
    updateProperty,
    updateOperator,
    updateTestValue,
  };
}
