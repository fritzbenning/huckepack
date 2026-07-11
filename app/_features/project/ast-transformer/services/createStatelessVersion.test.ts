import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { createStatelessVersion } from "./createStatelessVersion";

describe("createStatelessVersion", () => {
  it("should throw error indicating not yet implemented", () => {
    const mockAST = {
      type: "Module",
      body: [],
      span: { start: 0, end: 0, ctxt: 0 },
    } as unknown as Module;

    expect(() => createStatelessVersion(mockAST)).toThrow("createStatelessVersion not yet implemented");
  });
});

