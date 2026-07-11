import type { ClassClassifier, ClassificationRule } from "./types";

interface CreateClassClassifierParams {
  prefix: string;
  rules: ClassificationRule[];
}

export function createClassClassifier({ prefix, rules }: CreateClassClassifierParams): ClassClassifier {
  return {
    prefix,
    rules,
    classify(className: string): string | null {
      if (!className.startsWith(prefix)) return null;

      for (const rule of rules) {
        if (rule.matches(className)) {
          return rule.property;
        }
      }
      return null;
    },
    belongsTo(className: string, property: string): boolean {
      return this.classify(className) === property;
    },
  };
}
