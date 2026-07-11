import { describe, expect, it } from "vitest";
import { createClassClassifier } from "./createClassClassifier";
import type { ClassificationRule } from "./types";

describe("createClassClassifier", () => {
  const mockRules: ClassificationRule[] = [
    {
      name: "rule1",
      property: "property1",
      matches: (cls) => cls === "test-rule1",
    },
    {
      name: "rule2",
      property: "property2",
      matches: (cls) => cls === "test-rule2",
    },
  ];

  it("should create a classifier with the correct prefix", () => {
    const classifier = createClassClassifier({
      prefix: "test-",
      rules: mockRules,
    });

    expect(classifier.prefix).toBe("test-");
    expect(classifier.rules).toBe(mockRules);
  });

  it("should classify classes that match rules", () => {
    const classifier = createClassClassifier({
      prefix: "test-",
      rules: mockRules,
    });

    expect(classifier.classify("test-rule1")).toBe("property1");
    expect(classifier.classify("test-rule2")).toBe("property2");
  });

  it("should return null for classes that don't match prefix", () => {
    const classifier = createClassClassifier({
      prefix: "test-",
      rules: mockRules,
    });

    expect(classifier.classify("other-class")).toBeNull();
  });

  it("should return null for classes that match prefix but no rules", () => {
    const classifier = createClassClassifier({
      prefix: "test-",
      rules: mockRules,
    });

    expect(classifier.classify("test-unknown")).toBeNull();
  });

  it("should return first matching rule when multiple rules match", () => {
    const rules: ClassificationRule[] = [
      {
        name: "first",
        property: "first",
        matches: () => true,
      },
      {
        name: "second",
        property: "second",
        matches: () => true,
      },
    ];

    const classifier = createClassClassifier({
      prefix: "test-",
      rules,
    });

    expect(classifier.classify("test-match")).toBe("first");
  });

  it("should correctly implement belongsTo method", () => {
    const classifier = createClassClassifier({
      prefix: "test-",
      rules: mockRules,
    });

    expect(classifier.belongsTo("test-rule1", "property1")).toBe(true);
    expect(classifier.belongsTo("test-rule1", "property2")).toBe(false);
    expect(classifier.belongsTo("test-unknown", "property1")).toBe(false);
  });
});
