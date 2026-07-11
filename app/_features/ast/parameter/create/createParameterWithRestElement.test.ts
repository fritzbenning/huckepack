import type { Identifier } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { createParameterWithRestElement } from "./createParameterWithRestElement";

describe("createParameterWithRestElement", () => {
  it("should create parameter with default rest element name", () => {
    const parameter = createParameterWithRestElement();

    expect(parameter.type).toBe("Parameter");
    expect(parameter.span).toBeDefined();
    expect(parameter.decorators).toEqual([]);

    // Check ObjectPattern
    expect(parameter.pat.type).toBe("ObjectPattern");
    expect(parameter.pat.optional).toBe(false);
    expect(parameter.pat.typeAnnotation).toBeUndefined();
    expect(parameter.pat.properties).toHaveLength(1);

    // Check RestElement
    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    expect(restElement.type).toBe("RestElement");
    expect(restElement.rest).toBeDefined();
    expect(restElement.typeAnnotation).toBeUndefined();

    // Check Identifier
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    const identifier = argument as Identifier;
    expect(identifier.value).toBe("restProps");
    expect(identifier.ctxt).toBe(3);
  });

  it("should create parameter with custom rest element name", () => {
    const parameter = createParameterWithRestElement("customProps");

    expect(parameter.type).toBe("Parameter");

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    const identifier = argument as Identifier;
    expect(identifier.value).toBe("customProps");
    expect(identifier.ctxt).toBe(3);
  });

  it("should create parameter with empty string name", () => {
    const parameter = createParameterWithRestElement("");

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(argument.value).toBe("");
  });

  it("should create parameter with single character name", () => {
    const parameter = createParameterWithRestElement("p");

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(argument.value).toBe("p");
  });

  it("should create parameter with camelCase name", () => {
    const parameter = createParameterWithRestElement("myRestProps");

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(argument.value).toBe("myRestProps");
  });

  it("should create parameter with underscore name", () => {
    const parameter = createParameterWithRestElement("rest_props");

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(argument.value).toBe("rest_props");
  });

  it("should create parameter with numeric suffix", () => {
    const parameter = createParameterWithRestElement("props123");

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(argument.value).toBe("props123");
  });

  it("should have correct span structure", () => {
    const parameter = createParameterWithRestElement("testProps");

    expect(parameter.span).toBeDefined();
    expect(parameter.pat.span).toBeDefined();

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    expect(restElement.span).toBeDefined();
    expect(restElement.rest).toBeDefined();
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(argument.span).toBeDefined();
  });

  it("should create only one property in ObjectPattern", () => {
    const parameter = createParameterWithRestElement("singleProp");

    expect(parameter.pat.properties).toHaveLength(1);
    expect(parameter.pat.properties[0]).toBeDefined();
  });

  it("should have consistent span lengths", () => {
    const propName = "myCustomProps";
    const parameter = createParameterWithRestElement(propName);

    const property = parameter.pat.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    const argument = restElement.argument;
    if (argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }

    // The spans should be related to the prop name length plus rest operator
    expect(argument.span.end - argument.span.start).toBeGreaterThanOrEqual(0);
    expect(parameter.span.end - parameter.span.start).toBeGreaterThanOrEqual(3); // At least "..." length
  });
});
