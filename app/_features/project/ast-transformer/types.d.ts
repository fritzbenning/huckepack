export interface PreviewVersionResult {
  code: string;
  ast: import("@swc/wasm-web").Module;
}

export interface StatelessVersionResult {
  code: string;
  ast: import("@swc/wasm-web").Module;
}

export interface AugmentedVersionResult {
  code: string;
  ast: import("@swc/wasm-web").Module;
  timing?: {
    transformation: number;
    formatting: number;
  };
}
