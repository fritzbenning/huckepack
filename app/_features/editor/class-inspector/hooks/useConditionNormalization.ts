import type { Span } from "@swc/wasm-web";
import { useEffect, useRef } from "react";
import { handleTemplateLiteralTest } from "../services/handleTemplateLiteralTest";
import type { Operator, PropertyType } from "../types";
import { analyzeConditionState } from "../utils/analyzeConditionState";
import { getOperatorConfig } from "../utils/getOperatorConfig";

interface UseConditionNormalizationParams {
  propertyType: PropertyType;
  operator: Operator;
  testValue: string | number | boolean | null;
  property: string | null;
  span: Span;
  projectId: string;
  fileId: string;
}

export function useConditionNormalization({
  propertyType,
  operator,
  testValue,
  property,
  span,
  projectId,
  fileId,
}: UseConditionNormalizationParams) {
  const { isDefinedCheck } = getOperatorConfig(propertyType, operator, testValue);
  const isBooleanType = propertyType === "boolean";

  const conditionState = analyzeConditionState(propertyType, operator, testValue, property);
  const { normalizedTestValue, normalizedOperator, needsNormalization } = conditionState;

  const shouldNormalizeToBooleanTrue = needsNormalization && normalizedOperator === "&&";
  const shouldNormalizeToBooleanFalse = needsNormalization && normalizedOperator === "!&&";

  const normalizationKey = `${span.start}-${property}`;
  const lastNormalizedKey = useRef<string | null>(null);

  useEffect(() => {
    if (lastNormalizedKey.current !== null && lastNormalizedKey.current !== normalizationKey) {
      lastNormalizedKey.current = null;
    }

    if (operator !== null && operator !== "!" && lastNormalizedKey.current === normalizationKey) {
      lastNormalizedKey.current = null;
    }

    if (
      (shouldNormalizeToBooleanTrue || shouldNormalizeToBooleanFalse) &&
      property &&
      (operator === null || operator === "!") &&
      lastNormalizedKey.current !== normalizationKey
    ) {
      lastNormalizedKey.current = normalizationKey;
      if (shouldNormalizeToBooleanTrue) {
        handleTemplateLiteralTest(projectId, fileId, span, property, "&&", "");
      } else if (shouldNormalizeToBooleanFalse) {
        handleTemplateLiteralTest(projectId, fileId, span, property, "!&&", "");
      }
    }
  }, [shouldNormalizeToBooleanTrue, shouldNormalizeToBooleanFalse, property, projectId, fileId, span.start, operator]);

  return {
    isDefinedCheck,
    isBooleanType,
    conditionState,
    normalizedTestValue,
    normalizedOperator,
  };
}
