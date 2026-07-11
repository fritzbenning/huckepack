import { useEffect, useState } from "react";

type ExpressionType = "conditional" | "logical-and" | "logical-or" | "unknown";

export function useExpressionType(expressionType: ExpressionType): {
  isConditional: boolean;
  isLogicalAnd: boolean;
} {
  const [isConditional, setIsConditional] = useState(false);
  const [isLogicalAnd, setIsLogicalAnd] = useState(false);

  useEffect(() => {
    setIsConditional(expressionType === "conditional");
    setIsLogicalAnd(expressionType === "logical-and");
  }, [expressionType]);

  return { isConditional, isLogicalAnd };
}
