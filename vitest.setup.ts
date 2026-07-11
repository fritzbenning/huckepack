import { vi } from "vitest";

// Mock WASM modules if needed
vi.mock("@swc/wasm-web", async () => {
  const actual = await vi.importActual("@swc/wasm-web");
  return {
    ...actual,
  };
});

