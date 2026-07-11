import { createClassClassifier } from "../../createClassClassifier";
import { textRules } from "../rules";

const textClassifier = createClassClassifier({
  prefix: "text-",
  rules: textRules,
});

export function isTextColorClass(className: string): boolean {
  return textClassifier.belongsTo(className, "textColor");
}
