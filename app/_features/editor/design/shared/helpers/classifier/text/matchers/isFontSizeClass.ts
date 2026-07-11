import { createClassClassifier } from "../../createClassClassifier";
import { textRules } from "../rules";

const textClassifier = createClassClassifier({
  prefix: "text-",
  rules: textRules,
});

export function isFontSizeClass(className: string): boolean {
  return textClassifier.belongsTo(className, "fontSize");
}
