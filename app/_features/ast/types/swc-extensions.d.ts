import "@swc/wasm-web";

declare module "@swc/wasm-web" {
  interface Identifier {
    ctxt: number;
  }
}
