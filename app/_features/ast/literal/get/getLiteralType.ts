import type { LiteralType } from "@ast/types/literal";
import { isLiteralType } from "./isLiteralType";
import { mapTypeToLiteralType } from "./mapTypeToLiteralType";

export function getLiteralType(type: string, fallbackType?: string): LiteralType {
  if (isLiteralType(type)) {
    return type as LiteralType;
  }

  return mapTypeToLiteralType(fallbackType ?? type);
}
