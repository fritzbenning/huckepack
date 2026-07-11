import type { ImportDeclaration, Module } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { ensureReactNodeImport } from "./ensureReactNodeImport";

// Minimal mock since we test integration logic
vi.mock("@ast/core/create/createSpan", () => ({ createSpan: () => ({}) }));
vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: (v: string) => ({ value: v, type: "Identifier" }),
}));
vi.mock("../create/createImportStatement", () => ({
  createImportStatement: (opts: {
    source: string;
    specifiers: Array<{ name: string; isTypeOnly?: boolean }>;
    typeOnly?: boolean;
  }) => ({
    type: "ImportDeclaration",
    source: { value: opts.source },
    specifiers: opts.specifiers.map((s) => ({
      type: "ImportSpecifier",
      local: { value: s.name },
      isTypeOnly: s.isTypeOnly,
    })),
    typeOnly: opts.typeOnly,
  }),
}));

describe("ensureReactNodeImport", () => {
  it("should add ReactNode to existing react import if missing", () => {
    const ast = {
      body: [
        {
          type: "ImportDeclaration",
          source: { value: "react" },
          specifiers: [{ type: "ImportDefaultSpecifier", local: { value: "React" } }],
        },
      ],
    } as unknown as Module;

    const result = ensureReactNodeImport(ast);
    const reactImport = result.body.find(
      (n): n is ImportDeclaration =>
        n.type === "ImportDeclaration" && (n.source as { value?: string }).value === "react"
    );

    expect(reactImport?.specifiers).toHaveLength(2);
    expect((reactImport?.specifiers[1] as { local?: { value?: string } }).local?.value).toBe("ReactNode");
  });

  it("should not add ReactNode if already present", () => {
    const ast = {
      body: [
        {
          type: "ImportDeclaration",
          source: { value: "react" },
          specifiers: [{ type: "ImportSpecifier", local: { value: "ReactNode" } }],
        },
      ],
    } as unknown as Module;

    const result = ensureReactNodeImport(ast);
    const reactImport = result.body[0] as ImportDeclaration;
    expect(reactImport.specifiers).toHaveLength(1);
  });

  it("should create new react import if none exists", () => {
    const ast = {
      body: [
        {
          type: "ImportDeclaration",
          source: { value: "other" },
          specifiers: [],
        },
      ],
    } as unknown as Module;

    const result = ensureReactNodeImport(ast);
    const reactImport = result.body.find(
      (n): n is ImportDeclaration =>
        n.type === "ImportDeclaration" && (n.source as { value?: string }).value === "react"
    );
    expect(reactImport).toBeDefined();
    expect((reactImport?.specifiers[0] as { local?: { value?: string } }).local?.value).toBe("ReactNode");
    // Should be inserted after existing import
    expect(result.body[1]).toBe(reactImport);
  });
});
