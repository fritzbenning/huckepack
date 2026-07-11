import type { TsType } from "@swc/wasm-web";

export function getTypeString(typeAnnotation: TsType): string {
  switch (typeAnnotation.type) {
    case "TsKeywordType":
      return typeAnnotation.kind;

    case "TsTypeReference":
      return typeAnnotation.typeName?.type === "Identifier" ? typeAnnotation.typeName.value : "unknown";

    case "TsArrayType":
      return `${getTypeString(typeAnnotation.elemType)}[]`;

    case "TsLiteralType": {
      const literal = typeAnnotation.literal;
      if (literal.type === "StringLiteral") return literal.value;
      if (literal.type === "NumericLiteral") return String(literal.value);
      if (literal.type === "BooleanLiteral") return String(literal.value);
      return "unknown";
    }

    default:
      return "unknown";
  }
}
