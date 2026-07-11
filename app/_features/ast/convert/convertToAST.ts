import { initSWC } from "@hooks/application/useSWC";
import { type Module, parseSync } from "@swc/wasm-web";

export async function convertToAST(code: string): Promise<Module> {
  const startTime = performance.now();

  try {
    await initSWC();

    // const parseStartTime = performance.now();
    const ast = parseSync(code, {
      syntax: "typescript",
      tsx: true,
      comments: false,
      target: "es2020",
    });
    // const parseEndTime = performance.now();

    // const totalTime = parseEndTime - startTime;
    // const parseTime = parseEndTime - parseStartTime;

    // console.info(`SWC parsing completed in ${parseTime.toFixed(2)}ms (total: ${parseTime.toFixed(2)}ms)`);

    return ast;
  } catch (error) {
    const errorTime = performance.now() - startTime;
    console.error(`SWC WASM parsing failed after ${errorTime.toFixed(2)}ms:`, error);
    throw error;
  }
}
