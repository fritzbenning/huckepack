import { splitClassTokens } from "@ast/utils";
import type { Module, TemplateLiteral } from "@swc/wasm-web";
import { simple } from "swc-walk";

interface StringLiteralNode {
  span: { start: number };
  value: string;
}

export function getExistingClasses(ast: Module, nodeStart: number): string[] {
  let classes: string[] = [];

  simple(ast, {
    StringLiteral(node: unknown) {
      const stringNode = node as StringLiteralNode;
      if (stringNode.span.start === nodeStart) {
        classes = splitClassTokens(stringNode.value);
      }
    },
    TemplateLiteral(node: unknown) {
      const templateNode = node as TemplateLiteral;
      if (templateNode.span.start === nodeStart) {
        const allTokens: string[] = [];
        for (const quasi of templateNode.quasis) {
          const quasiValue = quasi.cooked || quasi.raw || "";
          if (quasiValue.trim()) {
            allTokens.push(...splitClassTokens(quasiValue));
          }
        }
        classes = allTokens;
      }
    },
  });

  return classes;
}
