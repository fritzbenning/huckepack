import { createClassClassifier } from "../../createClassClassifier";
import { textRules } from "../rules";

const textClassifier = createClassClassifier({
  prefix: "text-",
  rules: textRules,
});

export function classifyTextClass(className: string): string | null {
  return textClassifier.classify(className);
}
