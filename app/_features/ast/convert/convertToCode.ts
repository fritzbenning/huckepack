import { type DprintFormatConfig, formatCode } from "@ast/format";
import { type Module, printSync } from "@swc/wasm-web";

export type { DprintFormatConfig } from "@ast/format";

export async function convertToCode(ast: Module, formatConfig?: DprintFormatConfig): Promise<string> {
  const code = printSync(ast, {
    jsc: {
      target: "es2020",
      parser: {
        syntax: "typescript",
        tsx: true,
      },
    },
  }).code;

  return formatCode(code, formatConfig);
}
