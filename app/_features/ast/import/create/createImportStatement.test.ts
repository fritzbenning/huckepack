import type { NamedImportSpecifier } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { createImportStatement } from "./createImportStatement";

describe("createImportStatement", () => {
  it("should create simple import statement with single specifier", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "React" }],
      source: "react",
    });

    expect(importStmt.type).toBe("ImportDeclaration");
    expect(importStmt.span).toBeDefined();
    expect(importStmt.typeOnly).toBe(false);

    // Check source
    expect(importStmt.source.type).toBe("StringLiteral");
    expect(importStmt.source.value).toBe("react");
    expect(importStmt.source.raw).toBe('"react"');

    // Check specifiers
    expect(importStmt.specifiers).toHaveLength(1);
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    expect(spec0.type).toBe("ImportSpecifier");
    expect(spec0.local.value).toBe("React");
    expect(spec0.imported).toBeUndefined();
    expect(spec0.isTypeOnly).toBe(false);
  });

  it("should create import statement with multiple specifiers", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "useState" }, { name: "useEffect" }, { name: "useCallback" }],
      source: "react",
    });

    expect(importStmt.specifiers).toHaveLength(3);
    expect(importStmt.specifiers[0].local.value).toBe("useState");
    expect(importStmt.specifiers[1].local.value).toBe("useEffect");
    expect(importStmt.specifiers[2].local.value).toBe("useCallback");
  });

  it("should create import statement with aliased specifier", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "Component", alias: "ReactComponent" }],
      source: "react",
    });

    expect(importStmt.specifiers).toHaveLength(1);
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    expect(spec0.local.value).toBe("ReactComponent");
    expect(spec0.imported?.value).toBe("Component");
  });

  it("should create import statement with mixed regular and aliased specifiers", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "useState" }, { name: "Component", alias: "ReactComponent" }, { name: "useEffect" }],
      source: "react",
    });

    expect(importStmt.specifiers).toHaveLength(3);

    // Regular import
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    expect(spec0.local.value).toBe("useState");
    expect(spec0.imported).toBeUndefined();

    // Aliased import
    const spec1 = importStmt.specifiers[1] as NamedImportSpecifier;
    expect(spec1.local.value).toBe("ReactComponent");
    expect(spec1.imported?.value).toBe("Component");

    // Regular import
    const spec2 = importStmt.specifiers[2] as NamedImportSpecifier;
    expect(spec2.local.value).toBe("useEffect");
    expect(spec2.imported).toBeUndefined();
  });

  it("should create type-only import statement", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "ComponentProps" }],
      source: "react",
      typeOnly: true,
    });

    expect(importStmt.typeOnly).toBe(true);
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    expect(spec0.isTypeOnly).toBe(false); // Individual specifier is not type-only when whole import is
  });

  it("should create import statement with type-only specifier", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "useState" }, { name: "ComponentProps", isTypeOnly: true }],
      source: "react",
    });

    expect(importStmt.typeOnly).toBe(false);
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    const spec1 = importStmt.specifiers[1] as NamedImportSpecifier;
    expect(spec0.isTypeOnly).toBe(false);
    expect(spec1.isTypeOnly).toBe(true);
  });

  it("should create import statement with relative path", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "MyComponent" }],
      source: "./components/MyComponent",
    });

    expect(importStmt.source.value).toBe("./components/MyComponent");
    expect(importStmt.source.raw).toBe('"./components/MyComponent"');
  });

  it("should create import statement with scoped package", () => {
    const importStmt = createImportStatement({
      specifiers: [{ name: "Button" }],
      source: "@ui/components",
    });

    expect(importStmt.source.value).toBe("@ui/components");
    expect(importStmt.source.raw).toBe('"@ui/components"');
  });

  it("should create import statement with empty specifiers array", () => {
    const importStmt = createImportStatement({
      specifiers: [],
      source: "side-effect-module",
    });

    expect(importStmt.specifiers).toHaveLength(0);
    expect(importStmt.source.value).toBe("side-effect-module");
  });

  it("should handle complex alias names", () => {
    const importStmt = createImportStatement({
      specifiers: [
        { name: "default", alias: "MyDefaultExport" },
        { name: "namedExport", alias: "MyNamedExport" },
      ],
      source: "./my-module",
    });

    expect(importStmt.specifiers).toHaveLength(2);
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    const spec1 = importStmt.specifiers[1] as NamedImportSpecifier;
    expect(spec0.local.value).toBe("MyDefaultExport");
    expect(spec0.imported?.value).toBe("default");
    expect(spec1.local.value).toBe("MyNamedExport");
    expect(spec1.imported?.value).toBe("namedExport");
  });

  it("should create import statement with all options", () => {
    const importStmt = createImportStatement({
      specifiers: [
        { name: "RegularImport" },
        { name: "AliasedImport", alias: "MyAlias" },
        { name: "TypeImport", isTypeOnly: true },
        { name: "AliasedTypeImport", alias: "MyTypeAlias", isTypeOnly: true },
      ],
      source: "@my/package",
      typeOnly: false,
    });

    expect(importStmt.specifiers).toHaveLength(4);
    expect(importStmt.typeOnly).toBe(false);

    // Regular import
    const spec0 = importStmt.specifiers[0] as NamedImportSpecifier;
    expect(spec0.local.value).toBe("RegularImport");
    expect(spec0.imported).toBeUndefined();
    expect(spec0.isTypeOnly).toBe(false);

    // Aliased import
    const spec1 = importStmt.specifiers[1] as NamedImportSpecifier;
    expect(spec1.local.value).toBe("MyAlias");
    expect(spec1.imported?.value).toBe("AliasedImport");
    expect(spec1.isTypeOnly).toBe(false);

    // Type-only import
    const spec2 = importStmt.specifiers[2] as NamedImportSpecifier;
    expect(spec2.local.value).toBe("TypeImport");
    expect(spec2.imported).toBeUndefined();
    expect(spec2.isTypeOnly).toBe(true);

    // Aliased type-only import
    const spec3 = importStmt.specifiers[3] as NamedImportSpecifier;
    expect(spec3.local.value).toBe("MyTypeAlias");
    expect(spec3.imported?.value).toBe("AliasedTypeImport");
    expect(spec3.isTypeOnly).toBe(true);
  });
});
