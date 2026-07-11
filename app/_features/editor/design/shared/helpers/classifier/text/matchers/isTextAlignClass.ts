import { createClassClassifier } from "../../createClassClassifier";
import { textRules } from "../rules";

const textClassifier = createClassClassifier({
  prefix: "text-",
  rules: textRules,
});

export function isTextAlignClass(className: string): boolean {
  return textClassifier.belongsTo(className, "textAlign");
}
